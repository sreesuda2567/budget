import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { ApiPdoService } from '../../../_services/api-pui.service';
import { TokenStorageService } from '../../../_services/token-storage.service';
import { first, map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { listLocales } from 'ngx-bootstrap/chronos';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { thBeLocale } from 'ngx-bootstrap/locale';

@Component({
  selector: 'app-foreman',
  templateUrl: './foreman.component.html',
  styleUrls: ['./foreman.component.scss']
})
export class ForemanComponent implements OnInit {
  datalist: any;
  loading: any;
  rownum: any;
  searchTerm: any;
  dataFac: any;
  datastatus: any
  dataForeman: any;
  dataChief: any;
  dataDepart: any;
  url = "/ag/manage/foreman.php";
  url1 = "/ag/userpermission.php";
  dataAdd: any = {};
  rowpbi: any;
  rowpbu: any;
  htmlStringd: any;
  keyword = 'name';
  datacomplete = [];
  locale = 'th-be';
  locales = listLocales();
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
    this.localeService.use(this.locale);
  }
  fetchdata() {
    var varP = {
      "opt": "viewFOREMANTYPE"
    }
    this.apiService
      .getdata(varP, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataForeman = data;
      });
      var varP = {
        "opt": "viewCHIEF"
      }
      this.apiService
        .getdata(varP, this.url1)
        .pipe(first())
        .subscribe((data: any) => {
          this.dataChief = data;
        });
    //คณะหน่วยงาน
    var varP = {
      "opt": "viewfac"
    }
    this.apiService
      .getdata(varP, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataFac = data;
        this.dataAdd.FACULTY_CODE = data[0].FACULTY_CODE;
        this.fetchdatalist();
        
      });

  }

  // ฟังก์ชัน การแสดงข้อมูลตามต้องการ
  fetchdatalist() {
    this.datalist = null;
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

  selectEvent(item: any) {
    this.dataAdd.CITIZEN_ID = item.id;
    this.dataAdd.FACULTY_CODE1 = item.FACULTY_CODE;
    this.onChangeDepart();
    this.dataAdd.DEPARTMENT_CODE = item.DEPARTMENT_CODE;
  }

  onChangeSearch(val: string) {
    var varP = {
      "opt": "viewpersonf",
      "search":val
    }
    this.apiService
      .getdata(varP, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.datacomplete = data;
        // console.log(data);
      });
  }
  onChangeDepart() {
    this.dataAdd.opt = "viewDEPARTMENT";
    this.dataDepart=null;
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataDepart = data;
        // console.log(data);
      });
  }
  // ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
  editdata(id: any, name: any) {
    this.setshowbti();
    //this.dataAdd.CAMPUS_CODE = id;
    this.htmlStringd = name;
    this.apiService
      .getById(id, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataAdd.FOREMAN_CODE = data[0].FOREMAN_CODE;
        this.dataAdd.FOREMAN_AT = data[0].FOREMAN_AT;
        this.dataAdd.FACULTY_CODE1 = data[0].FACULTY_CODE1;
        this.onChangeDepart();
        this.dataAdd.CITIZEN_ID = data[0].CITIZEN_ID;
        this.dataAdd.CITIZEN_ID1 = data[0].CITIZEN_ID1;
        this.dataAdd.CHIEF_CODE = data[0].CHIEF_CODE;
        this.dataAdd.DEPARTMENT_CODE = data[0].DEPARTMENT_CODE;
        if(data[0].FOREMAN_DETAIL !=null){
        this.dataAdd.FOREMAN_DETAIL = data[0].FOREMAN_DETAIL;
        }
        if(data[0].CHIEF_CODE2 !=null){
        this.dataAdd.CHIEF_CODE2 = data[0].CHIEF_CODE2;
        }
        this.dataAdd.FOREMAN_RSTATUS = data[0].FOREMAN_RSTATUS;
        if(data[0].FOREMAN_SDATE !=null){
        this.dataAdd.FOREMAN_SDATE = new Date(data[0].FOREMAN_SDATE);
        }else{
          this.dataAdd.FOREMAN_SDATE ='';  
        }
        if(data[0].FOREMAN_EDATE !=null){
        this.dataAdd.FOREMAN_EDATE = new Date(data[0].FOREMAN_EDATE);
      }else{
        this.dataAdd.FOREMAN_EDATE ='';  
      }
      });
    this.rowpbi = null;
    this.rowpbu = true;
  }
  setshowbti() {
    this.htmlStringd = 'ผู้บริหารประจำหน่วยงาน';
    this.dataAdd.FOREMAN_CODE = '';
    this.dataAdd.FOREMAN_AT = '';
    this.dataAdd.CITIZEN_ID1 = '';
    this.dataAdd.CITIZEN_ID = '';
    this.dataAdd.CHIEF_CODE = '';
    this.dataAdd.CHIEF_CODE2 = '';
    this.dataAdd.DEPARTMENT_CODE = '';
    this.dataAdd.FOREMAN_DETAIL = '';
    this.dataAdd.FOREMAN_RSTATUS = '';
    this.dataAdd.FOREMAN_SDATE = '';
    this.dataAdd.FOREMAN_EDATE = '';
  }
  
  datenow(datenow: any) {
    const yyyy = datenow.getFullYear();
    let mm = datenow.getMonth() + 1; // Months start at 0!
    let dd = datenow.getDate();
    return yyyy + '-' + mm + '-' + dd;
  }
  // ฟังก์ขันสำหรับการเพิ่มข้อมู
  insertdata() {
    if (this.dataAdd.FOREMAN_AT == '' || this.dataAdd.CITIZEN_ID == '' || this.dataAdd.CHIEF_CODE == '' 
      || this.dataAdd.DEPARTMENT_CODE == ''|| this.dataAdd.FOREMAN_RSTATUS == '') {
      this.toastr.warning("แจ้งเตือน:กรุณากรอกข้อมูลให้ครบถ้วน");
    } else {
      if (this.dataAdd.FOREMAN_SDATE != '') {
        this.dataAdd.FOREMAN_SDATE1 = this.datenow(this.dataAdd.FOREMAN_SDATE);
      } else {
        this.dataAdd.FOREMAN_SDATE1 = '';
      }
      if (this.dataAdd.FOREMAN_EDATE != '') {
        this.dataAdd.FOREMAN_EDATE1 = this.datenow(this.dataAdd.FOREMAN_EDATE);
      } else {
        this.dataAdd.FOREMAN_EDATE1 = '';
      }
      this.dataAdd.opt = "insert";
      this.apiService
        .getupdate(this.dataAdd, this.url)
        .pipe(first())
        .subscribe((data: any) => {
          //console.log(data.status);       
          if (data.status == 1) {
            this.toastr.success("แจ้งเตือน:เพิ่มข้อมูลเรียบร้อยแล้ว");
            this.fetchdatalist();
            document.getElementById("ModalClose")?.click();
          } else {
            this.toastr.warning("แจ้งเตือน:ไม่สามารถเพิ่มข้อมูลได้ บุคคลนี้มีตำแหน่งบริหารอยู่แล้ว");

          }
        });
    }
  }
  //แก้ไขข้อมูล
  updatedata() {
    if (this.dataAdd.FOREMAN_SDATE != '') {
      this.dataAdd.FOREMAN_SDATE1 = this.datenow(this.dataAdd.FOREMAN_SDATE);
    } else {
      this.dataAdd.FOREMAN_SDATE1 = '';
    }
    if (this.dataAdd.FOREMAN_EDATE != '') {
      this.dataAdd.FOREMAN_EDATE1 = this.datenow(this.dataAdd.FOREMAN_EDATE);
    } else {
      this.dataAdd.FOREMAN_EDATE1 = '';
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
  showinput() {
    this.rowpbi = 1;
    this.rowpbu = '';
  }
}
