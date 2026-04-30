import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { ApiPdoService } from '../../../_services/api-pui.service';
import { TokenStorageService } from '../../../_services/token-storage.service';
import { first, map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-license',
  templateUrl: './license.component.html',
  styleUrls: ['./license.component.scss']
})
export class LicenseComponent implements OnInit {
  datalist: any;
  loading: any;
  rownum: any;
  searchTerm: any;
  dataFac: any;
  datastatus: any
  datamainprogram: any;
  datastatusprogram: any;
  url = "/ag/user/license.php";
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
    this.fetchdata();
    
  }
  fetchdata(){
    //ระบบ
    var varP = {
      "opt": "viewmainprogram"
    }
    this.apiService
    .getdata(varP,this.url1)
    .pipe(first())
    .subscribe((data: any) => {
      this.datamainprogram = data; 
      this.dataAdd.MAINPROGRAM_CODE=data[0].MAINPROGRAM_CODE;   
      this.fetchdatalist(); 
      this.onChangstatus();  
    });
    var varP = {
      "opt": "viewfaculty"
    }
    this.apiService
    .getdata(varP,this.url1)
    .pipe(first())
    .subscribe((data: any) => {
      this.dataFac = data;  
      this.dataAdd.FACULTY_CODE=data[0].FACULTY_CODE;   
    });
  }
  onChangstatus() {
     this.dataAdd.opt = "viewstatusprogram"; 
     this.apiService
     .getdata(this.dataAdd,this.url1)
     .pipe(first())
     .subscribe((data: any) => {
       this.datastatusprogram  = data;
       this.dataAdd.MAINPROGRAMSTATUS_CODE='';
     });         
   }
   onChangname(id: any) {
    let mcode=id.target.value;
    for(let i=0; i<this.datastatusprogram.length;i++){
      if(mcode==this.datastatusprogram[i].MAINPROGRAMSTATUS_CODE){
        this.dataAdd.PRIVILEGE_RSTATUS= this.datastatusprogram[i].MAINPROGRAMSTATUS_RSTATUS;
      }
      //this.dataAdd.PRREGISBUILDING_CODE[i]=this.datalistregister[i].PRREGISBUILDING_CODE;
    }
   }
  // ฟังก์ชัน การแสดงข้อมูลตามต้องการ
  fetchdatalist() {
    this.datalist = null;
    this.onChangstatus(); 
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
    this.dataAdd.PRIVILEGE_CODE = id;
    this.dataAdd.htmlStringd = name;
  this.apiService
  .getById(id,this.url)
  .pipe(first())
  .subscribe((data: any) => {
   // this.dataAdd.MAINPROGRAM_CODE= data[0].MAINPROGRAM_CODE;
   // this.onChangstatus();
    this.dataAdd.MAINPROGRAMSTATUS_CODE= data[0].MAINPROGRAMSTATUS_CODE;
    this.dataAdd.PRIVILEGE_RSTATUS= data[0].PRIVILEGE_RSTATUS;
    this.dataAdd.CITIZEN_ID1=data[0].STF_FNAME;
    this.dataAdd.USERSYSLOG_CODE=data[0].USERSYSLOG_CODE;
    this.dataAdd.FACULTY_CODE=data[0].FACULTY_CODE;
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
  if(this.dataAdd.MAINPROGRAMSTATUS_CODE =='' || this.dataAdd.MAINPROGRAM_CODE =='' || this.dataAdd.FACULTY_CODE ==''|| this.dataAdd.CITIZEN_ID1 =='' ){
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
    this.dataAdd.htmlStringd = 'เพิ่มสิทธิผู้ใช้งานระบบ';
    this.dataAdd.PRIVILEGE_CODE = '';
    this.dataAdd.PRIVILEGE_RSTATUS = '';
    this.dataAdd.USERSYSLOG_CODE = '';
    this.dataAdd.CITIZEN_ID1 = '';
    this.dataAdd.USERSYSLOG_PASSWORD = '';
    this.dataAdd.MAINPROGRAMSTATUS_CODE = '';
    //this.dataAdd.MAINPROGRAM_CODE = '';
  }  
  showinput() {
    this.rowpbi = 1;
    this.rowpbu = '';
  }
  selectEvent(item: any) {
    this.dataAdd.USERSYSLOG_CODE = item.id; 
  }

  onChangeSearch(val: string) {
    var varP = {
      "opt": "viewpersonusersyslog",
      "search":val
    }
    this.apiService
    .getdata(varP,this.url1)
    .pipe(first())
    .subscribe((data: any) => {
      this.datacomplete = data;  
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
