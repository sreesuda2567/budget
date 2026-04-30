import { Component, OnInit,ElementRef, HostListener } from '@angular/core';
import { ApiPdoService } from '../../../../_services/api-pui.service';
import { TokenStorageService } from '../../../../_services/token-storage.service';
import { first, map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pltrly',
  templateUrl: './pltrly.component.html',
  styleUrls: ['./pltrly.component.scss']
})
export class PltrlyComponent implements OnInit {
  datalist: any;
  datalist2: any;
  loading: any;
  rownum: any;
  searchTerm: any;
  datamainprogram: any;
  datastatus: any;
  dataYear: any;
  PRIVILEGE_RSTATUS: any;
  datalcode: any;
  dataplmoney: any;
  url = "/acc3d/allocate/plan/pltrly.php";
  url1 = "/acc3d/allocate/userpermission.php";
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
  ) { }

  ngOnInit(): void {
    this.dataAdd.CITIZEN_ID = this.tokenStorage.getUser().citizen;
    this.fetchdata();
    
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
var varP = {
  "opt": "viewyear"
}
this.apiService
.getdata(varP,this.url1)
.pipe(first())
.subscribe((data: any) => {
  this.dataYear = data; 
  this.dataAdd.PLYEARBUDGET_CODE =data[0].PLYEARBUDGET_CODE;
  var varP = {
    "opt": "viewplmoney"
  }
  this.apiService
  .getdata(varP,this.url1)
  .pipe(first())
  .subscribe((data: any) => {
    this.dataplmoney = data; 
    this.dataAdd.PLMONEYPAY_CODE =data[0].PLMONEYPAY_CODE;
    this.fetchdatalist(); 
  });
});

  }

// ฟังก์ชัน การแสดงข้อมูลตามต้องการ
fetchdatalist() {
  this.dataAdd.opt = "readAll";
  this.datalist=null;
  this.datalist2=null;
  this.apiService.getdata(this.dataAdd, this.url)
    .pipe(first())
    .subscribe((data: any) => {
      if (data.status == 1) {
        this.datalist = data.data;
        this.datalist2 = data.data1;
        this.loading = null;
        this.rownum = 'true';
      } else {
        this.datalist = data.data;
        this.datalist2 = data.data1;
        this.loading = null;
        this.rownum = null;
        this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
      }
    });
}
insertdata(id: any, name: any) {
  this.dataAdd.opt = "insert";
  this.dataAdd.PLSUBMONEYPAY_CODE = id;
  Swal.fire({
    title: 'ต้องการเพิ่ม:'+name,
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
            Swal.fire('เพิ่มข้อมูล!', 'เพิ่มข้อมูลเรียบร้อยแล้ว', 'success');
            this.fetchdatalist();
          }
        });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire('ยกเลิก', 'ยกเลิกการเพิ่มผลผลิต', 'error');
    }
  });
}
// ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
editdata(id: any, name: any) {
  //this.setshowbti();
  this.htmlStringd = name;
this.apiService
.getById(id,this.url)
.pipe(first())
.subscribe((data: any) => {
  this.dataAdd.PLSUBMONEYPAY_NAME= data[0].PLSUBMONEYPAY_NAME;
  this.dataAdd.PLTRLY_ORDER= data[0].PLTRLY_ORDER;
  this.dataAdd.PLTRLY_CODE= data[0].PLTRLY_CODE;
}); 
this.rowpbi=null;
this.rowpbu=true;
}
//แก้ไขข้อมูล
deleteData() {
  this.dataAdd.opt = "delete";
  this.apiService
    .getupdate(this.dataAdd, this.url)
    .pipe(first())
    .subscribe((data: any) => {
      //console.log(data.status);       
      if (data.status == 1) {
        this.fetchdatalist();
        //this.fetchdatalist();
        this.toastr.success("แจ้งเตือน:ลบข้อมูลเรียบร้อยแล้ว");
        document.getElementById("ModalClose")?.click();
      }
    });
}
//แก้ไขข้อมูล
updatedata() {
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
}
