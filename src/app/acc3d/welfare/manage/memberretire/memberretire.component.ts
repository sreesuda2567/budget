import { Component, OnInit, ElementRef, HostListener, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-memberretire',
  templateUrl: './memberretire.component.html',
  styleUrls: ['./memberretire.component.scss']
})
export class MemberretireComponent implements OnInit {
  title = 'angular-app';
  fileName = 'report.xlsx';
  userList = [{}]

  dataYear: any;
  dataCam: any;
  dataFac: any;
  datalist: any;
  datalistdetail: any;
  loading: any;
  loadingdetail: any;
  dataAdd: any = { };
  clickshow: any;
  searchTerm: any;
  show: any;
  dataPro: any;
  datarstatus: any;
  dataStafftype: any;
  numrow: any;
  locale = 'th-be';
  locales = listLocales();
  rownum: any;
  rowpbi: any;
  rowpbu: any;
  dataFer: any;
  dataStatus: any;
  dataOcc: any;
 
  url = "/acc3d/welfare/manage/memberretire.php";
  url1 = "/acc3d/welfare/userpermission.php";
  keyword = 'name';
  datacomplete = [];
  number: any = [1, 2, 3];
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
    this.localeService.use(this.locale);
    this.dataAdd.citizen = this.tokenStorage.getUser().citizen;
    this.fetchdata();
  }
  fetchdata() {
    var varP = {
      "opt": "viewp",
      "citizen": this.tokenStorage.getUser().citizen
    }
    //ดึงรายการคณะตามสิทธิ์
    this.apiService.getdata(varP, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.datarstatus = data;
        this.dataAdd.PRIVILEGE_RSTATUS = data[0].PRIVILEGE_RSTATUS;
        var varN = {
          "opt": "viewcam",
          "citizen": this.tokenStorage.getUser().citizen,
          "PRIVILEGERSTATUS": data[0].PRIVILEGE_RSTATUS
        }
        this.apiService
          .getdata(varN, this.url1)
          .pipe(first())
          .subscribe((datacam: any) => {
            this.dataCam = datacam;
            this.dataAdd.CAMPUS_CODE = datacam[0].CAMPUS_CODE;
            this.fetchdataCam();
          });
      });
      var varN = {
        "opt": "viewFERELE"
      }
      this.apiService
        .getdata(varN, this.url1)
        .pipe(first())
        .subscribe((data: any) => {
          this.dataFer = data;
          this.dataAdd.FERELE_CODE = data[0].FERELE_CODE;
        });
      var varN = {
        "opt": "viewSTAFF"
      }
      this.apiService
        .getdata(varN, this.url1)
        .pipe(first())
        .subscribe((data: any) => {
          this.dataStatus = data;
          this.dataAdd.FEPIO_MSTATUS = '';
        });
      var varN = {
        "opt": "viewOCCUP"
      }
      this.apiService
        .getdata(varN, this.url1)
        .pipe(first())
        .subscribe((data: any) => {
          this.dataOcc = data;
          this.dataAdd.OCCUP_ID = '';
        });
      var varN = {
        "opt": "viewprovince"
      }
      this.apiService
        .getdata(varN, this.url1)
        .pipe(first())
        .subscribe((data: any) => {
          this.dataPro = data;
          this.dataAdd.PROVINCE_ID = '';
        });
  }
  CheckNum(num: any){
    //console.log(num.keyCode); 
          if (num.keyCode < 46 || num.keyCode > 57){
        alert('กรุณากรอกข้อมูล ที่เป็นตัวเลข');
            num.returnValue = false;
            }
       }
  fetchdataCam() {
    this.dataFac = null;
    this.dataAdd.opt = "viewfac";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataFac = data;
        this.dataAdd.FACULTY_CODE = '';
        this.fetchdataretire();
      });
  }
  fetchdataretire() {
    this.dataStafftype = null;
    this.dataAdd.opt = "viewpersonretire";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataStafftype = data;
      });
  }
  applyLocale(pop: any) {
    this.localeService.use(this.locale);
  }
  datenow(datenow: any) {
    const yyyy = datenow.getFullYear();
    let mm = datenow.getMonth() + 1; // Months start at 0!
    let dd = datenow.getDate();
    return yyyy + '-' + mm + '-' + dd;
  }
  fetchdatalist() {
    this.loading = true;
    this.datalist = null;
    this.dataAdd.opt = "readAll";
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == '1') {
          this.datalist = data.data;
          this.loading = null;
          this.rownum = 1;

        } else {
          this.rownum = null;
          this.loading = null;
          this.datalist = data.data;
          this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
        }
      });
  }
  // ฟังก์ชันสำหรับการลบข้อมูล
  deleteData(id: any) {
    this.dataAdd.opt = "delete";
    // this.dataAdd.id = id;
    Swal.fire({
      title: 'ต้องการลบข้อมูล?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.value) {
        this.apiService
          .delete(id, this.url)
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
   // ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
   editdata(id: any) {
    this.setshowbti();
    this.apiService
      .getById(id, this.url)
      .pipe(first())
      .subscribe((data: any) => {
       // this.datalist = data;
       this.dataAdd.FEPIO_CODE = data.data[0].FEPIO_CODE;
       this.dataAdd.FERELE_CODE = data.data[0].FERELE_CODE;
       this.dataAdd.FEPIO_NAME = data.data[0].FEPIO_NAME;
       this.dataAdd.FEPIO_CITIZEN = data.data[0].FEPIO_CITIZEN;
       this.dataAdd.FEPIO_MSTATUS = data.data[0].FEPIO_MSTATUS;
       this.dataAdd.OCCUP_ID = data.data[0].OCCUP_ID;
       this.dataAdd.FEPIO_POSITION = data.data[0].FEPIO_POSITION;
       this.dataAdd.FEPIO_WORKPLACE = data.data[0].FEPIO_WORKPLACE;
       this.dataAdd.FEPIO_TEL = data.data[0].FEPIO_TEL;
       this.dataAdd.FEPIO_HOMENO = data.data[0].FEPIO_HOMENO;
       this.dataAdd.FEPIO_MOO = data.data[0].FEPIO_MOO;
       this.dataAdd.FEPIO_STREET = data.data[0].FEPIO_STREET;
       this.dataAdd.FEPIO_DISTRICT = data.data[0].FEPIO_DISTRICT;
       this.dataAdd.FEPIO_CITY = data.data[0].FEPIO_CITY;
       this.dataAdd.PROVINCE_ID = data.data[0].PROVINCE_ID;
       this.dataAdd.FEPIO_ZIPCODE = data.data[0].FEPIO_ZIPCODE;
       this.dataAdd.FEPIO_BDCHL = data.data[0].FEPIO_BDCHL;
       this.dataAdd.FEPIO_NCHL = data.data[0].FEPIO_NCHL;
       this.dataAdd.FEPIO_NCHL2 = data.data[0].FEPIO_NCHL2;
       this.dataAdd.FEPIO_RCNO = data.data[0].FEPIO_RCNO;
       this.dataAdd.FEPIO_RCNAME = data.data[0].FEPIO_RCNAME;
       this.showtype();
       if(data.data[0].FEPIO_BDCHL !=null){
       this.dataAdd.FEPIO_BDCHL = new Date(data.data[0].FEPIO_BDCHL);
       }else{
        this.dataAdd.FEPIO_BDCHL='';
       }
       if(data.data[0].FEPIO_RCBD !=null){
        console.log(1);
       this.dataAdd.FEPIO_RCBD = new Date(data.data[0].FEPIO_RCBD);
       this.dataAdd.FEPIO_RCDD = new Date(data.data[0].FEPIO_RCDD);
       }else{
        this.dataAdd.FEPIO_RCBD = '';
        this.dataAdd.FEPIO_RCDD = '';   
       }
      });
      this.rowpbi=null;
      this.rowpbu=true;   
  }
  showtype() {
    if (this.dataAdd.FERELE_CODE == '5') {
      this.dataAdd.row1 = '';
      this.dataAdd.row2 = 1;
    } else {
      this.dataAdd.row1 = 1;
      this.dataAdd.row2 = '';
    }
  }
  setshowbti() {
    this.dataAdd.FEPIO_CODE = '';
    this.dataAdd.FEPIO_NAME = '';
    this.dataAdd.FEPIO_CITIZEN = '';
    this.dataAdd.FEPIO_MSTATUS = '';
    this.dataAdd.FEPIO_POSITION = '';
    this.dataAdd.FEPIO_WORKPLACE = '';
    this.dataAdd.FEPIO_TEL = '';
    this.dataAdd.FEPIO_HOMENO = '';
    this.dataAdd.FEPIO_MOO = '';
    this.dataAdd.FEPIO_STREET = '';
    this.dataAdd.FEPIO_DISTRICT = '';
    this.dataAdd.FEPIO_CITY = '';
    this.dataAdd.FEPIO_ASTATUS = '1';
    this.dataAdd.VMREQUEST_SDATE = '';
    this.dataAdd.FEPIO_NCHL = '';
    this.dataAdd.FEPIO_NCHL2 = '';
    this.dataAdd.FEPIO_RCNAME = '';
    this.dataAdd.FEPIO_RCBD = '';
    this.dataAdd.FEPIO_RCDD = '';
    this.dataAdd.FEPIO_BDCHL= '';
    this.dataAdd.FEPIO_MSTATUS = '';
    this.dataAdd.OCCUP_ID = '';
    this.dataAdd.PROVINCE_ID = '';
    this.dataAdd.FEPIO_RCNO = '';
    this.dataAdd.FEPIO_SCHL = '';
    this.dataAdd.FEPIO_ZIPCODE = '';

  }
  // ฟังก์ขันสำหรับการเพิ่มข้อมูล
  insertdata() {
    this.loading = true;
    if ((this.dataAdd.FEPIO_NAME == '' || this.dataAdd.FEPIO_CITIZEN == '')) {
      if (this.dataAdd.FEPIO_NAME == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกชื่อ-สกุล");
      }
      if (this.dataAdd.FEPIO_CITIZEN == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกเลขที่บัตรประชาชน");
      }

    }else {
       
      if(this.dataAdd.FEPIO_RCDD !=''){
      this.dataAdd.FEPIO_RCBD1=this.datenow(this.dataAdd.FEPIO_RCBD);
      this.dataAdd.FEPIO_RCDD1=this.datenow(this.dataAdd.FEPIO_RCDD);
      }else{
        this.dataAdd.FEPIO_RCBD1='';  
        this.dataAdd.FEPIO_RCDD1=''; 
      }
      if(this.dataAdd.FEPIO_BDCHL !=''){
      this.dataAdd.FEPIO_BDCHL1=this.datenow(this.dataAdd.FEPIO_BDCHL);
      }else{
        this.dataAdd.FEPIO_BDCHL1='';  
      }
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
    this.toastr.warning("แจ้งเตือน:ไม่สามารถเพิ่มข้อมูลได้");
   } 
   });
    }
  }
  //แก้ไขข้อมูล
  updatedata() {
    if ((this.dataAdd.FEPIO_NAME == '' || this.dataAdd.FEPIO_CITIZEN == '')) {
      if (this.dataAdd.FEPIO_NAME == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกชื่อ-สกุล");
      }
      if (this.dataAdd.FEPIO_CITIZEN == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกเลขที่บัตรประชาชน");
      }

    } else {
      if(this.dataAdd.FEPIO_RCBD !=''){
       // console.log(1);
      this.dataAdd.FEPIO_RCBD1=this.datenow(this.dataAdd.FEPIO_RCBD);
      this.dataAdd.FEPIO_RCDD1=this.datenow(this.dataAdd.FEPIO_RCDD);
      }else{
        this.dataAdd.FEPIO_RCBD1='';  
        this.dataAdd.FEPIO_RCDD1=''; 
      }
      if(this.dataAdd.FEPIO_BDCHL !=''){
        console.log(2);
      this.dataAdd.FEPIO_BDCHL1=this.datenow(this.dataAdd.FEPIO_BDCHL);
      }else{
        this.dataAdd.FEPIO_BDCHL1='';  
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
this.rowpbi=null;
this.rowpbu=true;
  }
  showinput() {
    this.rowpbi = 1;
    this.rowpbu = '';
    this.showtype();
  }
  exportexcel(): void {
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }
}
