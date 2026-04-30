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
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
defineLocale('th', thBeLocale);

@Component({
  selector: 'app-middle',
  templateUrl: './middle.component.html',
  styleUrls: ['./middle.component.scss']
})
export class MiddleComponent implements OnInit {
  url = "/acc3d/budget/expenses/middle.php";
  url1 = "/acc3d/budget/userpermission.php";
  dataAdd:any = {};
  datarstatus:any ;
  dataFac :any;
  dataYear :any;
  dataMiddle:any;
  loading:any;
  page = 1;
  count = 0;
  tableSize = 10;
  tableSizes = [10,20,30];
  searchTerm: any;
  rownum:any;
  rowpbi:any;
  rowpbu:any;
  datalist:any ;
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
    this.fetchdata();
    this.dataAdd.citizen =this.tokenStorage.getUser().citizen; 
  }
  fetchdata(){

var varP = {
  "opt": "viewp",
  "citizen":this.tokenStorage.getUser().citizen
}
   //ดึงรายการคณะตามสิทธิ์
this.apiService.getdata(varP,this.url1)
.pipe(first())
.subscribe((data: any) => {
  //console.log(this.datarstatus);
  this.datarstatus = data;
  this.dataAdd.PRIVILEGE_RSTATUS = data[0].PRIVILEGE_RSTATUS;
   var varN = {
    "opt": "viewfac",
    "citizen":this.tokenStorage.getUser().citizen,
     "PRIVILEGERSTATUS":data[0].PRIVILEGE_RSTATUS
  }
  this.apiService
.getdata(varN,this.url1)
.pipe(first())
.subscribe((data: any) => {
  this.dataFac = data;
 // console.log(data[0].FACULTY_CODE);
  this.dataAdd.FACULTY_CODE = data[0].FACULTY_CODE;
  //รายการปี
var Table = {
  "opt": "viewyear"
}
this.apiService
.getdata(Table,this.url1)
.pipe(first())
.subscribe((datay: any) => {
  this.dataYear = datay;
  this.dataAdd.PLYEARBUDGET_CODE = datay[0].PLYEARBUDGET_CODE;  
  this.fetchdatalist() 
    //รายการงบกลาง
var Tablem = {
  "opt": "viewmiddle",
  "PLYEARBUDGET_CODE":datay[0].PLYEARBUDGET_CODE,
  "FACULTY_CODE":data[0].FACULTY_CODE
}
this.apiService
.getdata(Tablem,this.url1)
.pipe(first())
.subscribe((datam: any) => {
  if(datam.length>0){
  this.dataMiddle = datam;
  this.dataAdd.PLMIDDLEBUDGET_CODE = datam[0].PLMIDDLEBUDGET_CODE;  
  }
  });

  });

});
});

 
  
  } 
  // ฟังก์ขันสำหรับการดึงข้อมูลครุภัณฑ์
  fetchdatalist(){  
    // console.log(this.dataAdd); 
     this.dataAdd.opt = "viewmiddle"; 
    this.apiService
    .getdata(this.dataAdd,this.url1)
    .pipe(first())
    .subscribe((datam: any) => {
      this.dataMiddle = datam;
      this.dataAdd.PLMIDDLEBUDGET_CODE = datam[0].PLMIDDLEBUDGET_CODE;  
    
      });
   //console.log(this.dataAdd); 
    this.dataAdd.opt = "readAll"; 
    this.loading=true;
   this.apiService
     .getdata(this.dataAdd,this.url)
     .pipe(first())
     .subscribe((data: any) => {
       if(data.status==1){
       // console.log(data); 
       this.datalist = data.data;
       this.rownum='true';
       this.loading=null;
       }else{
        this.datalist=data.data; 
         this.rownum=null;
         this.loading=null;
         this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
       }
       //this.rownum=this.datalist.length;
 
     });
     }
 // ฟังก์ชันสำหรับการลบข้อมูล
 deleteData(id: any){
  Swal.fire({
    title: 'ต้องการลบข้อมูล?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'ตกลง',
    cancelButtonText: 'ยกเลิก',
  }).then((result) => {
    if (result.value) {
  
      this.apiService
      .delete(id,this.url)
      .pipe(first())
      .subscribe((data: any) => {
      if(data.status==1){
        Swal.fire('ลบข้อมูล!', 'ลบข้อมูลเรียบร้อยแล้ว', 'success');   
        this.fetchdatalist();
      }else{
       // console.log(data.status);
        Swal.fire('ยกเลิก', 'ไม่สามารถลบข้อมูลได้ เนื่องจากมีการใช้งาน', 'error');
      }
       }); 
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire('ยกเลิก', 'ยกเลิกการลบข้อมูล', 'error');
    }
  });
} 
numberWithCommas(x:any) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
} 
  // ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
  editdata(id: any){  
    this.apiService
    .getById(id,this.url)
    .pipe(first())
    .subscribe((data: any) => {
      this.dataAdd.PLMIDDLEBUDGET_CODE=data[0].PLMIDDLEBUDGET_CODE;
      this.dataAdd.PLTRBUDGET_CODE=data[0].PLTRBUDGET_CODE;
      this.dataAdd.PLMIDDLEBUDGET_BOOK=data[0].PLMIDDLEBUDGET_BOOK;
      this.dataAdd.PLMIDDLEBUDGET_NAME=data[0].PLMIDDLEBUDGET_NAME;
      this.dataAdd.PLMIDDLEBUDGET_NOTE=data[0].PLMIDDLEBUDGET_NOTE;
      this.dataAdd.PLMIDDLEBUDGET_MONEY= this.numberWithCommas(parseFloat(data[0].PLMIDDLEBUDGET_MONEY).toFixed(2)); 
      this.rowpbi='';
      this.rowpbu=1;
      //console.log(data[0].PLTRBUDGET_CODE);
    });
   }
   setshowbti(){
    this.dataAdd.PLMIDDLEBUDGET_CODE = '';
    this.dataAdd.PLTRBUDGET_CODE = '';
    this.dataAdd.PLMIDDLEBUDGET_BOOK = '';
    this.dataAdd.PLMIDDLEBUDGET_NAME = '';
    this.dataAdd.PLMIDDLEBUDGET_NOTE = '';
    this.dataAdd.PLMIDDLEBUDGET_MONEY = '';
  } 
    // ฟังก์ชัน โชว์ปุ่ม
showinput(){
  this.rowpbi=1;
  this.rowpbu='';
} 
  CheckNum(num: any){
    //console.log(num.keyCode); 
          if (num.keyCode < 46 || num.keyCode > 57){
        alert('กรุณากรอกข้อมูล ที่เป็นตัวเลข');
            num.returnValue = false;
            }
       }  
// ฟังก์ขันสำหรับการเพิ่มข้อมูล/และแก้ไขข้อมูล
insertdata(){  
  if(this.dataAdd.PLTRBUDGET_CODE =='' || this.dataAdd.PLMIDDLEBUDGET_BOOK =='' || this.dataAdd.PLMIDDLEBUDGET_NAME ==''  
  || this.dataAdd.PLMIDDLEBUDGET_MONEY < 0 ){
     if(this.dataAdd.PLTRBUDGET_CODE ==''){
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกหมวดรายจ่ายย่อย");
     }
     if(this.dataAdd.PLMIDDLEBUDGET_BOOK ==''){
      this.toastr.warning("แจ้งเตือน:กรุณากรอกเลขที่หนังสือ");
     }
     if(this.dataAdd.PLMIDDLEBUDGET_NAME ==''){
      this.toastr.warning("แจ้งเตือน:กรุณากรอกชื่อเรื่อง");
     }
     if(this.dataAdd.PLMIDDLEBUDGET_MONEY < 0){
      this.toastr.warning("แจ้งเตือน:กรุณากรอกจำนวนเงิน");
     }
     
  }else{
    this.dataAdd.opt = "insert";
  //  this.searchTerm=this.dataAdd.FNCREDITOR_NAME;
    this.apiService
     .getupdate(this.dataAdd,this.url)
     .pipe(first())
     .subscribe((data: any) => {
       //console.log(data);       
     if (data.status == 1) {
       this.toastr.success("แจ้งเตือน::เพิ่มข้อมูลเรียบร้อยแล้ว ");
       this.fetchdatalist();
       document.getElementById("ModalClose")?.click();

     } else {
      this.toastr.warning("แจ้งเตือน:ไม่สามารถเพิ่มข้อมูลได้");

     }
     });
   }  
 }
 //แก้ไขข้อมูล
 updatedata(){ 
 // console.log(this.dataAdd);  
  if(this.dataAdd.PLTRBUDGET_CODE =='' || this.dataAdd.PLMIDDLEBUDGET_BOOK =='' || this.dataAdd.PLMIDDLEBUDGET_NAME ==''  
  || this.dataAdd.PLMIDDLEBUDGET_MONEY <0 ){
     if(this.dataAdd.PLTRBUDGET_CODE ==''){
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกหมวดรายจ่ายย่อย");
     }
     if(this.dataAdd.PLMIDDLEBUDGET_BOOK ==''){
      this.toastr.warning("แจ้งเตือน:กรุณากรอกเลขที่หนังสือ");
     }
     if(this.dataAdd.PLMIDDLEBUDGET_NAME ==''){
      this.toastr.warning("แจ้งเตือน:กรุณากรอกชื่อเรื่อง");
     }
     if(this.dataAdd.PLMIDDLEBUDGET_MONEY <0){
      this.toastr.warning("แจ้งเตือน:กรุณากรอกจำนวนเงิน");
     }
    // console.log(this.dataAdd);   
  }else{
     this.dataAdd.opt = "update"; 
    this.apiService
     .getupdate(this.dataAdd,this.url)
     .pipe(first())
     .subscribe((data: any) => {      
     if (data.status == 1) {
       this.toastr.success("แจ้งเตือน:แก้ไขข้อมูลเรียบร้อยแล้ว");
       this.fetchdatalist();
      document.getElementById("ModalClose")?.click();
     } 
     });
   }
}
  // ฟังก์ชัน การแสดงข้อมูลตามต้องการ
onTableDataChange(event: any){
  this.page = event;
  this.fetchdata();
  } 
   
  
  onTableSizeChange(event: any): void {
  this.tableSize = event.target.value;
  this.page = 1;
  this.fetchdata();
  } 
}
