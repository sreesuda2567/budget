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
import Swal from 'sweetalert2';

@Component({
  selector: 'app-approvep',
  templateUrl: './approvep.component.html',
  styleUrls: ['./approvep.component.scss']
})
export class ApprovepComponent implements OnInit {
  title = 'angular-app';
  fileName = 'report.xlsx';
  userList = [{}]

  dataYear: any;
  dataCam: any;
  dataFac: any;
  dataBuild: any
  datalist: any;
  loading: any;
  loadingdetail: any;
  dataAdd: any = { check: [], BDOPERATION_CODEC: [],BDOPERATIONTD_SDATE: [],BDOPERATIONTD_EDATE: [],sdateshow: [], edateshow: [], tdateshow: [],ndateshow: [], BDTYPEDATE_CODE: [], BDOPERATIONTD_TDATE: []};
  clickshow: any;
  searchTerm: any;
  show: any;
  dataPro: any;
  datarstatus: any;
  numrow: any;
  rowpbi: any;
  rowpbu: any;
  dataAaset: any;
  locale = 'th-be';
  locales = listLocales();
  rownum: any;
  dataMyear: any;
  datalistshow: any;
  dataSta: any;
  url = "/acc3d/buildingdesign/design/approvep.php";
  url1 = "/acc3d/buildingdesign/userpermission.php";
  keyword = 'name';
  datacomplete = [];
  page = 1;
  count = 0;
  number=0;
  tableSize = 20;
  tableSizes = [20,30,40];
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
      });
    //ปีงบประมาณ
    var Tabletar = {
      "opt": "viewmyear"
    }
    this.apiService
      .getdata(Tabletar, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataMyear = data;
        this.dataAdd.PLYEARBUDGET_CODE = data[0].PLYEARBUDGET_CODE;
        this.dataAdd.PLYEARBUDGET_CODEM = data[0].PLYEARBUDGET_CODE;
        this.onChangeyear();
        this.fetchdatalist();
      });
//สถานะ
var Tabletar = {
  "opt": "viewBDSTATUS"
}
this.apiService
  .getdata(Tabletar, this.url1)
  .pipe(first())
  .subscribe((data: any) => {
    this.dataSta = data;
    this.dataAdd.BDSTATUS_CODE = data[0].BDSTATUS_CODE;
  });
  }
  // ฟังก์ขันสำหรับการดึงปีตามแผน
  onChangeyear() {
    //รายการปี
    this.dataAdd.opt = "viewyearduring";
    this.dataYear = null;
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataYear = data;
        // this.fetchdatalist();
        //this.dataAdd.PRYEARASSET_CODE = data[0].PRYEARASSET_CODE;
      });
  }


  onChangtype() {
    if (this.dataAdd.BDTYPE_CODE == '2') {
      this.dataAdd.type = 1;
    } else {
      this.dataAdd.type = '';
    }
  }
 

  numberWithCommas(x: any) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
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
          for (let i = 0; i < this.datalist.length; i++) {
            this.dataAdd.BDOPERATION_CODEC[i] = this.datalist[i].BDOPERATION_CODE;
            this.dataAdd.check[i] = false;
          }

        } else {
          this.rownum = null;
          this.loading = null;
          this.datalist = data.data;
          this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
        }
      });
  }
 
  // ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
  editdata(id: any) {
    this.apiService
      .getById(id, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataAdd.BDOPERATION_CODE = data[0].BDOPERATION_CODE;
        this.dataAdd.BDOPERATION_ADATE = data[0].BDOPERATION_ADATE;
        this.dataAdd.BDTYPE_NAME = data[0].BDTYPE_NAME;
        this.dataAdd.BDTYPE_CODE = data[0].BDTYPE_CODE;
        this.dataAdd.BDOPERATION_RSTATUS = data[0].BDOPERATION_RSTATUS;
        this.onChangtype();
        this.dataAdd.PLBUILDING_BOOK = data[0].BDOPERATION_BOOK;
        this.dataAdd.PRBUILDING_MONEY = this.numberWithCommas(parseFloat(data[0].BDOPERATION_MONEY).toFixed(2));
        this.dataAdd.BDOPERATION_NAME = data[0].BDOPERATION_NAME;
        this.dataAdd.CITIZEN_IDA = data[0].CITIZEN_IDA;
        this.dataAdd.BDOPERATION_NAMEA = data[0].BDOPERATION_NAMEA;
        this.dataAdd.BDOPERATION_NAMEA1 = data[0].BDOPERATION_NAMEA;
        this.dataAdd.CITIZEN_IDCE = data[0].CITIZEN_IDCE;
        this.dataAdd.BDOPERATION_NAMECE = data[0].BDOPERATION_NAMECE;
        this.dataAdd.BDOPERATION_NAMECE1 = data[0].BDOPERATION_NAMECE;
        this.dataAdd.CITIZEN_IDEL = data[0].CITIZEN_IDEL;
        this.dataAdd.BDOPERATION_NAMEL = data[0].BDOPERATION_NAMEL;
        this.dataAdd.BDOPERATION_NAMEL1 = data[0].BDOPERATION_NAMEL;
        this.dataAdd.PLYEARBUDGET_CODE = data[0].PLYEARBUDGET_CODEB;
        this.dataAdd.CITIZEN_IDTEN = data[0].CITIZEN_IDTEN;
        this.dataAdd.CITIZEN_IDTEN1 = data[0].BDOPERATION_NAMETEN;
        this.dataAdd.BDOPERATION_NAMETEN = data[0].BDOPERATION_NAMETEN;
        this.dataAdd.CITIZEN_IDINS = data[0].CITIZEN_IDINS;
        this.dataAdd.CITIZEN_IDINS1 = data[0].BDOPERATION_NAMEINS;
        this.dataAdd.BDOPERATION_NAMEINS = data[0].BDOPERATION_NAMEINS;
        this.dataAdd.CITIZEN_IDSUP = data[0].CITIZEN_IDSUP;
        this.dataAdd.CITIZEN_IDSUP1 = data[0].BDOPERATION_NAMESUP;
        this.dataAdd.BDOPERATION_NAMESUP = data[0].BDOPERATION_NAMESUP;
        this.dataAdd.CITIZEN_IDSET = data[0].CITIZEN_IDSET;
        this.dataAdd.CITIZEN_IDSET1 = data[0].BDOPERATION_NAMESET;
        this.dataAdd.BDOPERATION_NAMESET = data[0].BDOPERATION_NAMESET;
        this.dataAdd.CITIZEN_IDDET = data[0].CITIZEN_IDDET;
        this.dataAdd.CITIZEN_IDDET1 = data[0].BDOPERATION_NAMEDET;
        this.dataAdd.BDOPERATION_NAMEDET = data[0].BDOPERATION_NAMEDET;
        this.dataAdd.FACULTY_TNAME = data[0].FACULTY_TNAME;
        if (data[0].sdate != null) {
          this.dataAdd.sdate = data[0].sdate;
        }
        if (data[0].sdate != null) {
          this.dataAdd.edate = data[0].edate;
        }
        //console.log(this.dataAdd.PRYEARASSET_CODE);
        if (data[0].BDTYPE_CODE == '2') {
          if(data[0].BDFORMAT_SDATEX !=null){
            this.dataAdd.BDOPERATIONTD_SDATE[0] = data[0].BDFORMAT_SDATEX;
            this.dataAdd.BDOPERATIONTD_EDATE[0] = data[0].BDFORMAT_EDATEX;
          }
          if(data[0].BDFORMAT_SDATEM !=null){ 
            this.dataAdd.BDOPERATIONTD_SDATE[1] = data[0].BDFORMAT_SDATEM;
            this.dataAdd.BDOPERATIONTD_EDATE[1] = data[0].BDFORMAT_EDATEM;
          }
    
          if(data[0].BDFORMAT_SDATED !=null){ 
            this.dataAdd.BDOPERATIONTD_SDATE[2] = data[0].BDFORMAT_SDATED;
            this.dataAdd.BDOPERATIONTD_EDATE[2] = data[0].BDFORMAT_EDATED;
          }
          if(data[0].BDFORMAT_SDATES !=null){  
            this.dataAdd.BDOPERATIONTD_SDATE[3] =data[0].BDFORMAT_SDATES;
            this.dataAdd.BDOPERATIONTD_EDATE[3] =data[0].BDFORMAT_EDATES;
          }
          if(data[0].BDFORMAT_SDATEA !=null){
            this.dataAdd.BDOPERATIONTD_SDATE[4] =data[0].BDFORMAT_SDATEA;
            this.dataAdd.BDOPERATIONTD_EDATE[4] =data[0].BDFORMAT_EDATEA;
          }
          if(data[0].BDFORMAT_SDATET !=null){ 
            this.dataAdd.BDOPERATIONTD_SDATE[5] =data[0].BDFORMAT_SDATET;
            this.dataAdd.BDOPERATIONTD_EDATE[5] =data[0].BDFORMAT_EDATET;
          }
        }

      });
    this.rowpbi = null;
    this.rowpbu = true;
  }
  // ฟังก์ขันสำหรับการดึงแทป
  onChangetype(type: any) {
    this.dataAdd.sdateshow = [];
    this.dataAdd.edateshow = [];
    this.dataAdd.tdateshow = [];
    this.dataAdd.ndateshow = [];
    this.dataAdd.BDFORMAT_SDATEM = '';
    this.dataAdd.BDFORMAT_EDATEM = '';
    this.dataAdd.BDSTRUCTURE_MONEY = '';
    this.dataAdd.BDFORMAT_NDATEM = '';
    this.dataAdd.type = type;
    this.dataAdd.opt = "viewtype";
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        //this.datalistshow = data;
        this.dataAdd.BDFORMAT_SDATEM = data[0].BDFORMAT_SDATE;
        this.dataAdd.BDFORMAT_EDATEM = data[0].BDFORMAT_EDATE;
        this.dataAdd.BDFORMAT_NDATEM = data[0].BDFORMAT_NDATE;
        this.dataAdd.BDSTRUCTURE_MONEY = this.numberWithCommas(parseFloat(data[0].BDSTRUCTURE_MONEY).toFixed(2));
        if (data[0].BDFORMAT_SDATEX != null) {
          this.dataAdd.sdateshow[0] = data[0].BDFORMAT_SDATEX;
          this.dataAdd.edateshow[0] = data[0].BDFORMAT_EDATEX;
          this.dataAdd.tdateshow[0] = data[0].BDFORMAT_TDATEX;
          this.dataAdd.ndateshow[0] = data[0].BDFORMAT_NDATEX;
        }
        if (data[0].BDFORMAT_SDATEM != null) {
          this.dataAdd.sdateshow[1] = data[0].BDFORMAT_SDATEM;
          this.dataAdd.edateshow[1] = data[0].BDFORMAT_EDATEM;
          this.dataAdd.tdateshow[1] = data[0].BDFORMAT_TDATEM;
          this.dataAdd.ndateshow[1] = data[0].BDFORMAT_NDATEM;
        }
        if (data[0].BDFORMAT_SDATED != null) {
          this.dataAdd.sdateshow[2] = data[0].BDFORMAT_SDATED;
          this.dataAdd.edateshow[2] = data[0].BDFORMAT_EDATED;
          this.dataAdd.tdateshow[2] = data[0].BDFORMAT_TDATED;
          this.dataAdd.ndateshow[2] = data[0].BDFORMAT_NDATED;
        }
        if (data[0].BDFORMAT_SDATES != null) {
          this.dataAdd.sdateshow[3] = data[0].BDFORMAT_SDATES;
          this.dataAdd.edateshow[3] = data[0].BDFORMAT_EDATES;
          this.dataAdd.tdateshow[3] = data[0].BDFORMAT_TDATES;
          this.dataAdd.ndateshow[3] = data[0].BDFORMAT_NDATES;
        }
        if (data[0].BDFORMAT_SDATEA != null) {
          this.dataAdd.sdateshow[4] = data[0].BDFORMAT_SDATEA;
          this.dataAdd.edateshow[4] = data[0].BDFORMAT_EDATEA;
          this.dataAdd.tdateshow[4] = data[0].BDFORMAT_TDATEA;
          this.dataAdd.ndateshow[4] = data[0].BDFORMAT_NDATEA;
        }
        if (data[0].BDFORMAT_SDATET != null) {
          this.dataAdd.sdateshow[5] = data[0].BDFORMAT_SDATET;
          this.dataAdd.edateshow[5] = data[0].BDFORMAT_EDATET;
          this.dataAdd.tdateshow[5] = data[0].BDFORMAT_TDATET;
          this.dataAdd.ndateshow[5] = data[0].BDFORMAT_NDATET;
        }
        if (data[0].BDFORMAT_SDATEE != null) {
          this.dataAdd.sdateshow[6] = data[0].BDFORMAT_SDATEE;
          this.dataAdd.edateshow[6] = data[0].BDFORMAT_EDATEE;
          this.dataAdd.tdateshow[6] = data[0].BDFORMAT_TDATEE;
          this.dataAdd.ndateshow[6] = data[0].BDFORMAT_NDATEE;
        }
        if (data[0].BDFORMAT_SDATER != null) {
          this.dataAdd.sdateshow[7] = data[0].BDFORMAT_SDATER;
          this.dataAdd.edateshow[7] = data[0].BDFORMAT_EDATER;
          this.dataAdd.tdateshow[7] = data[0].BDFORMAT_TDATER;
          this.dataAdd.ndateshow[7] = data[0].BDFORMAT_NDATER;
        }
        if (data[0].BDFORMAT_SDATEMT != null) {
          this.dataAdd.sdateshow[8] = data[0].BDFORMAT_SDATEMT;
          this.dataAdd.edateshow[8] = data[0].BDFORMAT_EDATEMT;
          this.dataAdd.tdateshow[8] = data[0].BDFORMAT_TDATEMT;
          this.dataAdd.ndateshow[8] = data[0].BDFORMAT_NDATEMT;
        }
      });
  }
  checkall() {
    if(this.dataAdd.checkall==true){
      for (let i = 0; i < this.datalist.length; i++) {
       this.dataAdd.check[i]=false;
      }
    }else{
      for (let i = 0; i < this.datalist.length; i++) {
        this.dataAdd.check[i]=true;
       }
    }  
  }
  insertdataapp() {
    let num =0;
    for (let i = 0; i < this.dataAdd.check.length; i++) {
        if(this.dataAdd.check[i]==true){
          num=1;
        }
     }
    ;
    this.dataAdd.opt = "approvep";
    if(num==0){
      this.toastr.warning("แจ้งเตือน:ยังไม่ได้เลือกข้อมูลการอนุมัติแผน");
    }else{
      
    Swal.fire({
      title: 'ต้องการอนุมัติข้อมูลแผนการจัดทำรูปแบบ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.value) {
        this.apiService
          .getupdate(this.dataAdd, this.url)
          .pipe(first())
          .subscribe((data: any) => {
            //console.log(data.status);       
            if (data.status == 1) {
              this.fetchdatalist();
              this.toastr.success("แจ้งเตือน:อนมุัติข้อมูลเรียบร้อยแล้ว");
            }else{
              this.toastr.warning("แจ้งเตือน:ไม่สามารถอนุมัติข้อมูลได้");
            }
          });
      }
    });
    }  
  }
}
