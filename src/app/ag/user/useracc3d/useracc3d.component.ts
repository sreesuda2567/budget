import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { ApiPdoService } from '../../../_services/api-pui.service';
import { TokenStorageService } from '../../../_services/token-storage.service';
import { first, map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
//import Swal from 'sweetalert2/dist/sweetalert2.js';
@Component({
  selector: 'app-useracc3d',
  templateUrl: './useracc3d.component.html',
  styleUrls: ['./useracc3d.component.scss']
})
export class Useracc3dComponent implements OnInit {
  datalist: any;
  loading: any;
  rownum: any;
  searchTerm: any;
  dataYear: any;
  datastatus: any
  url = "/ag/user/useracc3d.php";
  url1 = "/ag/userpermission.php";
  dataAdd: any = {};
  rowpbi: any;
  rowpbu: any;
  page = 1;
  count = 0;
  number = 0;
  tableSize = 20;
  tableSizes = [20, 30, 40];
  keyword = 'name';
  datacomplete = [];
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
    this.fetchdatalist();
  }

  // ฟังก์ชัน การแสดงข้อมูลตามต้องการ
  fetchdatalist() {
    this.dataAdd.opt = "readAll";
    //ดึงรายการคณะตามสิทธิ์
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
    this.dataAdd.USERSYSLOG_CODE = id;
    this.dataAdd.htmlStringd = name;
  this.apiService
  .getById(id,this.url)
  .pipe(first())
  .subscribe((data: any) => {
    this.dataAdd.USERSYSLOG_NAME= atob(data[0].USERSYSLOG_NAME);
    this.dataAdd.USERSYSLOG_PASSWORD= atob(data[0].USERSYSLOG_PASSWORD);
    this.dataAdd.CITIZEN_ID1=data[0].STF_FNAME;
    this.dataAdd.CITIZEN_ID=data[0].CITIZEN_ID;
  }); 
  this.rowpbi=null;
  this.rowpbu=true;
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
  // ฟังก์ชันสำหรับการลบข้อมูล
  deleteData(id: any) {
    this.dataAdd.opt = "delete";
    this.dataAdd.id = id;
    this.dataAdd.CITIZEN_ID = this.tokenStorage.getUser().citizen;
    /*if(window.confirm('คุณแน่ใจว่าต้องการลบข้อมูล ?')){
      this.apiService
      .delete(id, this.url)
      .subscribe((data: any) => {       
        this.fetchdata();
      });
   }*/
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
  if(this.dataAdd.CITIZEN_ID1 =='' || this.dataAdd.USERSYSLOG_NAME =='' || this.dataAdd.USERSYSLOG_PASSWORD =='' ){
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
    this.dataAdd.htmlStringd = 'เพิ่มผู้ใช้งาน';
    this.dataAdd.USERSYSLOG_CODE = '';
    this.dataAdd.CITIZEN_ID = '';
    this.dataAdd.CITIZEN_ID1 = '';
    this.dataAdd.USERSYSLOG_NAME = '';
    this.dataAdd.USERSYSLOG_PASSWORD = '';
  }  
  showinput() {
    this.rowpbi = 1;
    this.rowpbu = '';
  }
  selectEvent(item: any) {
    this.dataAdd.CITIZEN_ID = item.id; 
  }
  onChangeSearch(val: string) {
    var varP = {
      "opt": "viewperson",
      "search":val
    }
    this.apiService
    .getdata(varP,this.url1)
    .pipe(first())
    .subscribe((data: any) => {
      this.datacomplete = data;  
      this.dataAdd.USERSYSLOG_NAME = data[0].USERNAME_CISCO; 
      this.dataAdd.FACULTY_CODE = data[0].FACULTY_CODE; 
      // console.log(data);
    }); 
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
