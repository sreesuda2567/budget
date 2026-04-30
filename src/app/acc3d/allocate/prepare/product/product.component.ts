import { Component, OnInit,ElementRef, HostListener } from '@angular/core';
import { ApiPdoService } from '../../../../_services/api-pui.service';
import { TokenStorageService } from '../../../../_services/token-storage.service';
import { first, map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
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
  url = "/acc3d/allocate/prepare/product.php";
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
var varP1 = {
  "opt": "viewyear"
}
this.apiService
.getdata(varP1,this.url1)
.pipe(first())
.subscribe((data: any) => {
  this.dataYear = data; 
  this.dataAdd.PLYEARBUDGET_CODE =data[0].PLYEARBUDGET_CODE; 
  this.fetchdatalist();
});
  }
  onChangecode(){
    this.datalcode=null;
    this.dataAdd.opt = "viewlcode";
    this.apiService
    .getdata(this.dataAdd,this.url1)
    .pipe(first())
    .subscribe((data: any) => {
      this.datalcode = data;    
    });
  } 
  onChanglcode(){
    
    this.dataAdd.PLSUBMONEYPAY_LCODE =this.dataAdd.PLSUBMONEYPAY_LCODE1;
    this.dataAdd.opt = "viewcode";
    this.apiService
    .getdata(this.dataAdd,this.url1)
    .pipe(first())
    .subscribe((data: any) => {
     // this.datalcode = data;  
      this.dataAdd.PLSUBMONEYPAY_CODE =data;  
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
  this.dataAdd.PLGPRODUCT_CODE = id;
  Swal.fire({
    title: 'ต้องการเพิ่ม:ผลผลิต'+name,
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
// ฟังก์ชันสำหรับการลบข้อมูล
deleteData(id: any) {
  this.dataAdd.opt = "delete";
  this.dataAdd.id = id;
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




}
