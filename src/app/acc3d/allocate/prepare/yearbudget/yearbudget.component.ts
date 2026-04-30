import { Component, OnInit,ElementRef, HostListener } from '@angular/core';
import { ApiPdoService } from '../../../../_services/api-pui.service';
import { TokenStorageService } from '../../../../_services/token-storage.service';
import { first, map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { listLocales } from 'ngx-bootstrap/chronos';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { thBeLocale } from 'ngx-bootstrap/locale';
defineLocale('th', thBeLocale);
import Swal from 'sweetalert2';

@Component({
  selector: 'app-yearbudget',
  templateUrl: './yearbudget.component.html',
  styleUrls: ['./yearbudget.component.scss']
})
export class YearbudgetComponent implements OnInit {
  datalist: any;
  loading: any;
  rownum: any;
  searchTerm: any;
  datamainprogram: any;
  datastatus: any
  PRIVILEGE_RSTATUS: any
  dataplmoneytype: any
  url = "/acc3d/allocate/prepare/yearbudget.php";
  url1 = "/acc3d/allocate/userpermission.php";
  locale = 'th-be';
  locales = listLocales();
  dataAdd: any = {};
  rowpbi: any;
  rowpbu: any;
  page = 1;
  count = 0;
  number = 0;
  tableSize = 20;
  tableSizes = [20, 30, 40];
  htmlStringd: any;
  constructor(
    private tokenStorage: TokenStorageService,
    private apiService: ApiPdoService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private eRef: ElementRef,
    private formBuilder: FormBuilder,
    private localeService: BsLocaleService,
  ) { }

  ngOnInit(): void {
    this.dataAdd.CITIZEN_ID = this.tokenStorage.getUser().citizen;
    this.fetchdata();
    this.fetchdatalist();
    this.localeService.use(this.locale);
    this.applyLocale('thBeLocale');
  }
  applyLocale(pop: any) {
    this.localeService.use(this.locale);
  }
  fetchdata(){
    var varPT = {
      "opt": "viewp",
      "citizen":this.tokenStorage.getUser().citizen
    }
       //ดึงรายการคณะตามสิทธิ์
    this.apiService.getdata(varPT,this.url1)
    .pipe(first())
    .subscribe((data: any) => {
      this.PRIVILEGE_RSTATUS =data[0].PRIVILEGE_RSTATUS;
    });
var varP = {
  "opt": "viewstatus"
}
this.apiService
.getdata(varP,this.url1)
.pipe(first())
.subscribe((data: any) => {
  this.datastatus = data;     
});
var varP1 = {
  "opt": "viewplmoneytype"
}
this.apiService
.getdata(varP1,this.url1)
.pipe(first())
.subscribe((data: any) => {
  this.dataplmoneytype = data;     
});
  }
  onChanglcode(){
    this.dataAdd.opt = "viewmcode";
    this.apiService
    .getdata(this.dataAdd,this.url1)
    .pipe(first())
    .subscribe((data: any) => {
     // this.datalcode = data;  
      this.dataAdd.PLMONEYPAY_CODE =data;  
    });
  } 
// ฟังก์ชัน การแสดงข้อมูลตามต้องการ
fetchdatalist() {
  this.dataAdd.opt = "readAll";
  this.datalist=null;
  this.apiService.getdata(this.dataAdd, this.url)
    .pipe(first())
    .subscribe((data: any) => {
      if (data.status == 1) {
        this.datalist = data.data;
        this.loading = null;
        this.rownum = 'true';
      } else {
        this.datalist = data.data;
        this.loading = null;
        this.rownum = null;
        this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
      }
    });
}
// ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
editdata(id: any, name: any) {
  this.setshowbti();
  //this.dataAdd.TYPEFACULTY_CODE = id;
  this.htmlStringd = name;
this.apiService
.getById(id,this.url)
.pipe(first())
.subscribe((data: any) => {
  //this.dataAdd= data[0];
  this.dataAdd.PLYEARBUDGET_CODE=data[0].PLYEARBUDGET_CODE;
  this.dataAdd.PLYEARBUDGET_NAME=data[0].PLYEARBUDGET_NAME;
  this.dataAdd.PLYEARBUDGET_RSTATUS=data[0].PLYEARBUDGET_RSTATUS;
  if(data[0].PLYEARBUDGET_SDATE !=null){
    this.dataAdd.PLYEARBUDGET_SDATE = new Date(data[0].PLYEARBUDGET_SDATE);
    this.dataAdd.PLYEARBUDGET_EDATE = new Date(data[0].PLYEARBUDGET_EDATE);
    }
}); 
this.rowpbi=null;
this.rowpbu=true;
}
datenow(datenow:any){
  const yyyy = datenow.getFullYear();
  let mm = datenow.getMonth() + 1; // Months start at 0!
  let dd = datenow.getDate();
  return  yyyy+'-'+mm+'-'+dd;
  } 
//แก้ไขข้อมูล
updatedata() {
  if(this.dataAdd.PLYEARBUDGET_SDATE !=''){
    this.dataAdd.PLYEARBUDGET_SDATE1=this.datenow(this.dataAdd.PLYEARBUDGET_SDATE);
    this.dataAdd.PLYEARBUDGET_EDATE1=this.datenow(this.dataAdd.PLYEARBUDGET_EDATE);
    }else{
      this.dataAdd.PLYEARBUDGET_SDATE1=''; 
      this.dataAdd.PLYEARBUDGET_EDATE1=''; 
    }
  this.dataAdd.opt = "update";
  this.apiService
    .getupdate(this.dataAdd, this.url)
    .pipe(first())
    .subscribe((data: any) => {
      //console.log(data.status);       
      if (data.status == 1) {
        this.fetchdatalist();
        //this.fetchdatalist();
        this.toastr.success("แจ้งเตือน:แก้ไขข้อมูลเรียบร้อยแล้ว");
        document.getElementById("ModalClose")?.click();
      }
    });
}
// ฟังก์ชันสำหรับการลบข้อมูล
deleteData(id: any) {
  this.dataAdd.opt = "delete";
  this.dataAdd.id = id;
  this.dataAdd.CITIZEN_ID = this.tokenStorage.getUser().citizen;
  Swal.fire({
    title: 'ต้องการลบข้อมูล?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'ตกลง',
    cancelButtonText: 'ยกเลิก',
  }).then((result) => {
    if (result.value) {
      this.apiService
        .getdata(this.dataAdd, this.url)
        .pipe(first())
        .subscribe((data: any) => {
          if (data.status == 1) {
            Swal.fire('ลบข้อมูล!', 'ลบข้อมูลเรียบร้อยแล้ว', 'success');
            this.fetchdatalist();
          }
        });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire('ยกเลิก', 'ยกเลิกการลบข้อมูล', 'error');
    }
  });
}
// ฟังก์ขันสำหรับการเพิ่มข้อมู
insertdata(){ 
if(this.dataAdd.PLMONEYPAY_CODE =='' || this.dataAdd.PLMONEYPAY_NAME ==''  ){
    this.toastr.warning("แจ้งเตือน:กรุณากรอกข้อมูลให้ครบถ้วน");
 }else{
  this.dataAdd.opt = "insert"; 
  this.apiService
   .getupdate(this.dataAdd,this.url)
   .pipe(first())
   .subscribe((data: any) => {
     //console.log(data.status);       
   if (data.status == 1) {
     this.toastr.success("แจ้งเตือน:เพิ่มข้อมูลเรียบร้อยแล้ว");
     this.fetchdatalist();
     document.getElementById("ModalClose")?.click();
   }else {
    this.toastr.warning("แจ้งเตือน:ไม่สามารถเพิ่มข้อมูลได้ มีรายการนี้อยู่แล้ว");

   } 
   });
 }
}
setshowbti(){
  this.htmlStringd = 'เพิ่มปีงบประมาณ';
  this.dataAdd.PLYEARBUDGET_CODE = '';
  this.dataAdd.PLYEARBUDGET_NAME = '';
  this.dataAdd.PLYEARBUDGET_SDATE = '';
  this.dataAdd.PLYEARBUDGET_EDATE = '';
}  
showinput() {
  this.rowpbi = 1;
  this.rowpbu = '';
  this.onChanglcode();
}

onTableDataChange(event: any) {
  this.page = event;
  this.fetchdatalist();
}
onTableSizeChange(event: any): void {
  this.tableSize = event.target.value;
  this.page = 1;
  this.fetchdatalist();
}
}
