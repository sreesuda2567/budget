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
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss']
})
export class BasicComponent implements OnInit {
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
  dataAdd: any = { sdateshow: [], edateshow: [], tdateshow: [],ndateshow: [], BDTYPEDATE_CODE: [], BDOPERATIONTD_SDATE: [], BDOPERATIONTD_EDATE: [], BDOPERATIONTD_TDATE: [] };
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
  url = "/acc3d/buildingdesign/design/basic.php";
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
  selectEvent(item: any, num: any) {
    if (num == 1) {
      this.dataAdd.CITIZEN_IDA = item.id;
      this.dataAdd.BDOPERATION_NAMEA = item.name;
    } else if (num == 2) {
      this.dataAdd.CITIZEN_IDCE = item.id;
      this.dataAdd.BDOPERATION_NAMECE = item.name;
    } else if (num == 3) {
      this.dataAdd.CITIZEN_IDEL = item.id;
      this.dataAdd.BDOPERATION_NAMEL = item.name;
    }else if (num == 4) {
      this.dataAdd.CITIZEN_IDTEN = item.id;
      this.dataAdd.BDOPERATION_NAMETEN = item.name;
    }else if (num == 5) {
      this.dataAdd.CITIZEN_IDINS = item.id;
      this.dataAdd.BDOPERATION_NAMEINS = item.name; 
    }else if (num == 6) {
      this.dataAdd.CITIZEN_IDSUP = item.id;
      this.dataAdd.BDOPERATION_NAMESUP = item.name;
    }else if (num == 7) {
      this.dataAdd.CITIZEN_IDSET = item.id;
      this.dataAdd.BDOPERATION_NAMESET = item.name;
    }else if (num == 8) {
      this.dataAdd.CITIZEN_IDDET = item.id;
      this.dataAdd.BDOPERATION_NAMEDET = item.name;
    }
  }

  onChangeSearch(val: any, work: any) {
   /* let position = '';
    if (work == 1) {
      position = 'สถาปนิก';
    }
    if (work == 2) {
      position = 'วิศวกร';
    }
    if (work == 3) {
      position = 'วิศวกร';
    }*/
    var varP = {
      "opt": "viewperson",
      "search": val/*,
      "work": position*/
    }
    this.apiService
      .getdata(varP, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.datacomplete = data;
        // console.log(data);
      });
  }
  onChangtype() {
    if (this.dataAdd.BDTYPE_CODE == '2') {
      this.dataAdd.type = 1;
    } else {
      this.dataAdd.type = '';
    }
  }
  showinput() {
    this.rowpbi = 1;
    this.rowpbu = '';
  }
  fetchdataCam() {
    this.dataFac = null;
    this.dataAdd.opt = "viewfacinvestment";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataFac = data;

      });
  }
  onChangeBuilding() {
    this.dataBuild = null;
    this.dataAdd.opt = "viewbuild";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataBuild = data.data;

      });
  }
  onChangeBuildmoney() {
    this.dataAdd.opt = "viewbuildmoney";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataAdd.PRBUILDING_MONEY = this.numberWithCommas(parseFloat(data[0].PRBUILDING_MONEY).toFixed(2));
        this.dataAdd.BDOPERATION_NAME = data[0].PRREGISBUILDING_NAME
      });
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

        } else {
          this.rownum = null;
          this.loading = null;
          this.datalist = data.data;
          this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
        }
      });
  }
  setshowbti() {
    this.dataAdd.PLYEARBUDGET_CODE = '';
    this.dataAdd.PRYEARASSET_CODE = '';
    this.dataAdd.FACULTY_CODE = '';
    this.dataAdd.PRBUILDING_CODE = '';
    this.dataAdd.BDOPERATION_CODE = '';
    this.dataAdd.BDOPERATION_NAME = '';
    this.dataAdd.PRBUILDING_MONEY = '';
    this.dataAdd.BDOPERATION_ADATE = new Date();
    this.dataAdd.CITIZEN_IDA = '';
    this.dataAdd.BDOPERATION_NAMEA = '';
    this.dataAdd.BDOPERATION_NAMEA1 = '';
    this.dataAdd.CITIZEN_IDCE = '';
    this.dataAdd.BDOPERATION_NAMECE = '';
    this.dataAdd.BDOPERATION_NAMECE1 = '';
    this.dataAdd.CITIZEN_IDEL = '';
    this.dataAdd.BDOPERATION_NAMEL = '';
    this.dataAdd.BDOPERATION_NAMEL1 = '';
    this.dataAdd.type = '';
    this.dataAdd.BDTYPE_CODE = '';
    this.dataAdd.FACULTY_CODE = '';
    this.dataAdd.PRBUILDING_CODE = '';
    this.dataAdd.BDOPERATION_RSTATUS= 0;
    this.dataAdd.sdate = '';
    this.dataAdd.edate = '';
    this.dataAdd.CITIZEN_IDTEN= '';
    this.dataAdd.CITIZEN_IDTEN1= '';
    this.dataAdd.BDOPERATION_NAMETEN= '';
    this.dataAdd.CITIZEN_IDINS= '';
    this.dataAdd.CITIZEN_IDINS1= '';
    this.dataAdd.BDOPERATION_NAMEINS= '';
    this.dataAdd.CITIZEN_IDSUP= '';
    this.dataAdd.CITIZEN_IDSUP1= '';
    this.dataAdd.BDOPERATION_NAMESUP= '';
    this.dataAdd.CITIZEN_IDSET= '';
    this.dataAdd.CITIZEN_IDSET1= '';
    this.dataAdd.BDOPERATION_NAMESET= '';
    this.dataAdd.CITIZEN_IDDET= '';
    this.dataAdd.CITIZEN_IDDET1= '';
    this.dataAdd.BDOPERATION_NAMEDET= '';
    for (let i = 0; i < 6; i++) {
      this.dataAdd.BDOPERATIONTD_SDATE[i] = '';
      this.dataAdd.BDOPERATIONTD_EDATE[i] = '';
      this.dataAdd.BDOPERATIONTD_TDATE[i] = '';
    }
    this.dataAdd.BDTYPEDATE_CODE[0] = '16';
    this.dataAdd.BDTYPEDATE_CODE[1] = '17';
    this.dataAdd.BDTYPEDATE_CODE[2] = '18';
    this.dataAdd.BDTYPEDATE_CODE[3] = '19';
    this.dataAdd.BDTYPEDATE_CODE[4] = '20';
    this.dataAdd.BDTYPEDATE_CODE[5] = '21';
  }
  //แก้ไขข้อมูล
  updatedata() {
    if (this.dataAdd.PLYEARBUDGET_CODE == '' || this.dataAdd.PRYEARASSET_CODE == '' || this.dataAdd.FACULTY_CODE == ''
      || this.dataAdd.PRBUILDING_CODE == '' || this.dataAdd.BDOPERATION_NAME == '' || this.dataAdd.PRBUILDING_MONEY == ''
      || this.dataAdd.PLBUILDING_BOOK == '' || this.dataAdd.BDTYPE_CODE == '' || this.dataAdd.CITIZEN_IDA == ''
      || this.dataAdd.CITIZEN_IDCE == '' || this.dataAdd.CITIZEN_IDEL == ''|| this.dataAdd.CITIZEN_IDTEN1 == ''
      || this.dataAdd.CITIZEN_IDINS1 == ''|| this.dataAdd.CITIZEN_IDSUP1 == ''|| this.dataAdd.CITIZEN_IDSET1 == ''
      || this.dataAdd.CITIZEN_IDDET1 == ''
    ) {
      if (this.dataAdd.PLYEARBUDGET_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกแผนปีงบประมาณ");
      }
      if (this.dataAdd.PRYEARASSET_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกบรรจุลงในแผนประจำปี");
      }
      if (this.dataAdd.FACULTY_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกคณะ/หน่วยงาน");
      }
      if (this.dataAdd.PRBUILDING_CODE == '' || this.dataAdd.BDOPERATION_NAME == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกโครงการ");
      }
      if (this.dataAdd.PRBUILDING_MONEY == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกกรอบงบประมาณ");
      }
      if (this.dataAdd.PLBUILDING_BOOK == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกเลขที่หนังสืออนมุัติให้จัดทำแบบ");
      }
      if (this.dataAdd.BDTYPE_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกวิธีดำเนินการโครงการ");
      }
      if (this.dataAdd.CITIZEN_IDA == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกสถาปนิก");
      }
      if (this.dataAdd.CITIZEN_IDCE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกวิศวกรโยธา");
      }
      if (this.dataAdd.CITIZEN_IDEL == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกวิศวกรไฟฟ้า");
      }
      if (this.dataAdd.CITIZEN_IDTEN1 == '' || this.dataAdd.CITIZEN_IDINS1 == '' || this.dataAdd.CITIZEN_IDSUP1 == '' || this.dataAdd.CITIZEN_IDSET1 == ''
        || this.dataAdd.CITIZEN_IDDET1 == ''
      ) {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกคณะกรรมการ");
      }
    } else if ((this.dataAdd.BDTYPE_CODE == '2') && (this.dataAdd.BDOPERATIONTD_SDATE[0] != '' && this.dataAdd.BDOPERATIONTD_EDATE[0] == '')) {
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกวันที่ประเมินราคาก่อสร้างให้ครบถ้วน");
    } else if ((this.dataAdd.BDTYPE_CODE == '2') && (this.dataAdd.BDOPERATIONTD_SDATE[1] != '' && this.dataAdd.BDOPERATIONTD_EDATE[1] == '')) {
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกวันที่แต่งตั้งคณะกรรมการ ร่าง TORให้ครบถ้วน");
    } else if ((this.dataAdd.BDTYPE_CODE == '2') && (this.dataAdd.BDOPERATIONTD_SDATE[2] != '' && this.dataAdd.BDOPERATIONTD_EDATE[2] == '')) {
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกวันที่แต่งตั้งคณะกรรมการจ้างออกแบบให้ครบถ้วน");
    } else if ((this.dataAdd.BDTYPE_CODE == '2') && (this.dataAdd.BDOPERATIONTD_SDATE[3] != '' && this.dataAdd.BDOPERATIONTD_EDATE[3] == '')) {
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกวันที่พิจารณาผลการประกวดแบบให้ครบถ้วน");
    } else if ((this.dataAdd.BDTYPE_CODE == '2') && (this.dataAdd.BDOPERATIONTD_SDATE[4] != '' && this.dataAdd.BDOPERATIONTD_EDATE[4] == '')) {
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกวันที่ระยะเวลาจัดทำแบบรูปรายการและประมาณราคาให้ครบถ้วน");
    } else if ((this.dataAdd.BDTYPE_CODE == '2') && (this.dataAdd.BDOPERATIONTD_SDATE[5] != '' && this.dataAdd.BDOPERATIONTD_EDATE[5] == '')) {
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกวันที่ระยะเวลาจัดทำแบบรูปรายการและประมาณราคาให้ครบถ้วน");
    } else {
      if (this.dataAdd.BDTYPE_CODE == '2') {
        if(this.dataAdd.BDOPERATIONTD_SDATE[0] !=''){
          this.dataAdd.BDOPERATIONTD_SDATE[0] = this.datenow(this.dataAdd.BDOPERATIONTD_SDATE[0]);
          this.dataAdd.BDOPERATIONTD_EDATE[0] = this.datenow(this.dataAdd.BDOPERATIONTD_EDATE[0]);
         }
         if(this.dataAdd.BDOPERATIONTD_TDATE[0] !=''){
          this.dataAdd.BDOPERATIONTD_TDATE[0] = this.datenow(this.dataAdd.BDOPERATIONTD_TDATE[0]);
         }
         if(this.dataAdd.BDOPERATIONTD_SDATE[1] !=''){
          this.dataAdd.BDOPERATIONTD_SDATE[1] = this.datenow(this.dataAdd.BDOPERATIONTD_SDATE[1]);
          this.dataAdd.BDOPERATIONTD_EDATE[1] = this.datenow(this.dataAdd.BDOPERATIONTD_EDATE[1]);
         }
         if(this.dataAdd.BDOPERATIONTD_TDATE[1] !=''){
          this.dataAdd.BDOPERATIONTD_TDATE[1] = this.datenow(this.dataAdd.BDOPERATIONTD_TDATE[1]);
         }
         if(this.dataAdd.BDOPERATIONTD_SDATE[2] !=''){
          this.dataAdd.BDOPERATIONTD_SDATE[2] = this.datenow(this.dataAdd.BDOPERATIONTD_SDATE[2]);
          this.dataAdd.BDOPERATIONTD_EDATE[2] = this.datenow(this.dataAdd.BDOPERATIONTD_EDATE[2]);
         }
         if(this.dataAdd.BDOPERATIONTD_TDATE[2] !=''){
          this.dataAdd.BDOPERATIONTD_TDATE[2] = this.datenow(this.dataAdd.BDOPERATIONTD_TDATE[2]);
         }
         if(this.dataAdd.BDOPERATIONTD_SDATE[3] !=''){
          this.dataAdd.BDOPERATIONTD_SDATE[3] = this.datenow(this.dataAdd.BDOPERATIONTD_SDATE[3]);
          this.dataAdd.BDOPERATIONTD_EDATE[3] = this.datenow(this.dataAdd.BDOPERATIONTD_EDATE[3]);  
         } 
         if(this.dataAdd.BDOPERATIONTD_TDATE[3] !=''){
          this.dataAdd.BDOPERATIONTD_TDATE[3] = this.datenow(this.dataAdd.BDOPERATIONTD_TDATE[3]);
         }
         if(this.dataAdd.BDOPERATIONTD_SDATE[4] !=''){
          this.dataAdd.BDOPERATIONTD_SDATE[4] = this.datenow(this.dataAdd.BDOPERATIONTD_SDATE[4]);
          this.dataAdd.BDOPERATIONTD_EDATE[4] = this.datenow(this.dataAdd.BDOPERATIONTD_EDATE[4]);  
         }
         if(this.dataAdd.BDOPERATIONTD_TDATE[4] !=''){
          this.dataAdd.BDOPERATIONTD_TDATE[4] = this.datenow(this.dataAdd.BDOPERATIONTD_TDATE[4]);
         }
         if(this.dataAdd.BDOPERATIONTD_SDATE[5] !=''){
          this.dataAdd.BDOPERATIONTD_SDATE[5] = this.datenow(this.dataAdd.BDOPERATIONTD_SDATE[5]);
          this.dataAdd.BDOPERATIONTD_EDATE[5] = this.datenow(this.dataAdd.BDOPERATIONTD_EDATE[5]);  
         }
         if(this.dataAdd.BDOPERATIONTD_TDATE[5] !=''){
          this.dataAdd.BDOPERATIONTD_TDATE[5] = this.datenow(this.dataAdd.BDOPERATIONTD_TDATE[5]);
         }
      }
      this.dataAdd.BDOPERATION_ADATE1 = this.datenow(this.dataAdd.BDOPERATION_ADATE);
      this.dataAdd.opt = "update";
      this.apiService
        .getupdate(this.dataAdd, this.url)
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
  // ฟังก์ขันสำหรับการเพิ่มข้อมูล
  insertdata() {
    if (this.dataAdd.PLYEARBUDGET_CODE == '' || this.dataAdd.PRYEARASSET_CODE == '' || this.dataAdd.FACULTY_CODE == ''
      || this.dataAdd.PRBUILDING_CODE == '' || this.dataAdd.BDOPERATION_NAME == '' || this.dataAdd.PRBUILDING_MONEY == ''
      || this.dataAdd.PLBUILDING_BOOK == '' || this.dataAdd.BDTYPE_CODE == '' || this.dataAdd.CITIZEN_IDA == ''
      || this.dataAdd.CITIZEN_IDCE == '' || this.dataAdd.CITIZEN_IDEL == '' || this.dataAdd.CITIZEN_IDTEN1 == ''
      || this.dataAdd.CITIZEN_IDINS1 == ''|| this.dataAdd.CITIZEN_IDSUP1 == ''|| this.dataAdd.CITIZEN_IDSET1 == ''
      || this.dataAdd.CITIZEN_IDDET1 == ''
    ) {
      if (this.dataAdd.PLYEARBUDGET_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกแผนปีงบประมาณ");
      }
      if (this.dataAdd.PRYEARASSET_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกบรรจุลงในแผนประจำปี");
      }
      if (this.dataAdd.FACULTY_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกคณะ/หน่วยงาน");
      }
      if (this.dataAdd.PRBUILDING_CODE == '' || this.dataAdd.BDOPERATION_NAME == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกโครงการ");
      }
      if (this.dataAdd.PRBUILDING_MONEY == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกกรอบงบประมาณ");
      }
      if (this.dataAdd.PLBUILDING_BOOK == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกเลขที่หนังสืออนมุัติให้จัดทำแบบ");
      }
      if (this.dataAdd.BDTYPE_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกวิธีดำเนินการโครงการ");
      }
      if (this.dataAdd.CITIZEN_IDA == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกสถาปนิก");
      }
      if (this.dataAdd.CITIZEN_IDCE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกวิศวกรโยธา");
      }
      if (this.dataAdd.CITIZEN_IDEL == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกวิศวกรไฟฟ้า");
      }
      if (this.dataAdd.CITIZEN_IDTEN1 == '' || this.dataAdd.CITIZEN_IDINS1 == '' || this.dataAdd.CITIZEN_IDSUP1 == '' || this.dataAdd.CITIZEN_IDSET1 == ''
        || this.dataAdd.CITIZEN_IDDET1 == ''
      ) {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกคณะกรรมการ");
      }
    } else if ((this.dataAdd.BDTYPE_CODE == '2') && (this.dataAdd.BDOPERATIONTD_SDATE[0] != '' && this.dataAdd.BDOPERATIONTD_EDATE[0] == '')) {
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกวันที่ประเมินราคาก่อสร้างให้ครบถ้วน");
    } else if ((this.dataAdd.BDTYPE_CODE == '2') && (this.dataAdd.BDOPERATIONTD_SDATE[1] != '' && this.dataAdd.BDOPERATIONTD_EDATE[1] == '')) {
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกวันที่แต่งตั้งคณะกรรมการ ร่าง TORให้ครบถ้วน");
    } else if ((this.dataAdd.BDTYPE_CODE == '2') && (this.dataAdd.BDOPERATIONTD_SDATE[2] != '' && this.dataAdd.BDOPERATIONTD_EDATE[2] == '')) {
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกวันที่แต่งตั้งคณะกรรมการจ้างออกแบบให้ครบถ้วน");
    } else if ((this.dataAdd.BDTYPE_CODE == '2') && (this.dataAdd.BDOPERATIONTD_SDATE[3] != '' && this.dataAdd.BDOPERATIONTD_EDATE[3] == '')) {
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกวันที่พิจารณาผลการประกวดแบบให้ครบถ้วน");
    } else if ((this.dataAdd.BDTYPE_CODE == '2') && (this.dataAdd.BDOPERATIONTD_SDATE[4] != '' && this.dataAdd.BDOPERATIONTD_EDATE[4] == '')) {
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกวันที่ระยะเวลาจัดทำแบบรูปรายการและประมาณราคาให้ครบถ้วน");
    } else if ((this.dataAdd.BDTYPE_CODE == '2') && (this.dataAdd.BDOPERATIONTD_SDATE[5] != '' && this.dataAdd.BDOPERATIONTD_EDATE[5] == '')) {
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกวันที่ระยะเวลาจัดทำแบบรูปรายการและประมาณราคาให้ครบถ้วน");
    } else {
      if (this.dataAdd.BDTYPE_CODE == '2') {
        if(this.dataAdd.BDOPERATIONTD_SDATE[0] !=''){
          this.dataAdd.BDOPERATIONTD_SDATE[0] = this.datenow(this.dataAdd.BDOPERATIONTD_SDATE[0]);
          this.dataAdd.BDOPERATIONTD_EDATE[0] = this.datenow(this.dataAdd.BDOPERATIONTD_EDATE[0]);
         }
         if(this.dataAdd.BDOPERATIONTD_SDATE[1] !=''){
          this.dataAdd.BDOPERATIONTD_SDATE[1] = this.datenow(this.dataAdd.BDOPERATIONTD_SDATE[1]);
          this.dataAdd.BDOPERATIONTD_EDATE[1] = this.datenow(this.dataAdd.BDOPERATIONTD_EDATE[1]);
         }
         if(this.dataAdd.BDOPERATIONTD_SDATE[2] !=''){
          this.dataAdd.BDOPERATIONTD_SDATE[2] = this.datenow(this.dataAdd.BDOPERATIONTD_SDATE[2]);
          this.dataAdd.BDOPERATIONTD_EDATE[2] = this.datenow(this.dataAdd.BDOPERATIONTD_EDATE[2]);
         }
         if(this.dataAdd.BDOPERATIONTD_SDATE[3] !=''){
          this.dataAdd.BDOPERATIONTD_SDATE[3] = this.datenow(this.dataAdd.BDOPERATIONTD_SDATE[3]);
          this.dataAdd.BDOPERATIONTD_EDATE[3] = this.datenow(this.dataAdd.BDOPERATIONTD_EDATE[3]);  
         } 
         if(this.dataAdd.BDOPERATIONTD_SDATE[4] !=''){
          this.dataAdd.BDOPERATIONTD_SDATE[4] = this.datenow(this.dataAdd.BDOPERATIONTD_SDATE[4]);
          this.dataAdd.BDOPERATIONTD_EDATE[4] = this.datenow(this.dataAdd.BDOPERATIONTD_EDATE[4]);  
         }
         if(this.dataAdd.BDOPERATIONTD_SDATE[5] !=''){
          this.dataAdd.BDOPERATIONTD_SDATE[5] = this.datenow(this.dataAdd.BDOPERATIONTD_SDATE[5]);
          this.dataAdd.BDOPERATIONTD_EDATE[5] = this.datenow(this.dataAdd.BDOPERATIONTD_EDATE[5]);  
         }
      }
      this.dataAdd.BDOPERATION_ADATE1 = this.datenow(this.dataAdd.BDOPERATION_ADATE);
      //console.log(111);
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
            this.toastr.warning("แจ้งเตือน:ไม่สามารถเพิ่มข้อมูลได้ มีรายการนี้อยู่แล้ว");

          }
        });
    }
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
  // ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
  editdata(id: any) {
    this.setshowbti();
    //this.dataAdd.MAINPROGRAM_CODE = name;
    // this.htmlStringd = name;
    this.apiService
      .getById(id, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataAdd.BDOPERATION_CODE = data[0].BDOPERATION_CODE;
        this.dataAdd.BDOPERATION_ADATE = new Date(data[0].BDOPERATION_ADATE);
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
        this.onChangeyear();
        this.dataAdd.PRYEARASSET_CODE = data[0].PRYEARASSET_CODEB;
        this.fetchdataCam();
        this.dataAdd.FACULTY_CODE = data[0].FACULTY_CODEB;
        this.onChangeBuilding();
        this.dataAdd.PRBUILDING_CODE = data[0].PRBUILDING_CODE;
        if (data[0].sdate != null) {
          this.dataAdd.sdate = data[0].sdate;
        }
        if (data[0].sdate != null) {
          this.dataAdd.edate = data[0].edate;
        }
        //console.log(this.dataAdd.PRYEARASSET_CODE);
        if (data[0].BDTYPE_CODE == '2') {
          if(data[0].BDFORMAT_SDATEX !=null){
            this.dataAdd.BDOPERATIONTD_SDATE[0] = new Date(data[0].BDFORMAT_SDATEX);
            this.dataAdd.BDOPERATIONTD_EDATE[0] = new Date(data[0].BDFORMAT_EDATEX);
          }
          if(data[0].BDFORMAT_TDATEX !=null){
            this.dataAdd.BDOPERATIONTD_TDATE[0] = new Date(data[0].BDFORMAT_TDATEX);
          }
          if(data[0].BDFORMAT_SDATEM !=null){ 
            this.dataAdd.BDOPERATIONTD_SDATE[1] = new Date(data[0].BDFORMAT_SDATEM);
            this.dataAdd.BDOPERATIONTD_EDATE[1] = new Date(data[0].BDFORMAT_EDATEM);
          }
          if(data[0].BDFORMAT_TDATEM !=null){
            this.dataAdd.BDOPERATIONTD_TDATE[1] = new Date(data[0].BDFORMAT_TDATEM);
          }
          if(data[0].BDFORMAT_SDATED !=null){ 
            this.dataAdd.BDOPERATIONTD_SDATE[2] = new Date(data[0].BDFORMAT_SDATED);
            this.dataAdd.BDOPERATIONTD_EDATE[2] = new Date(data[0].BDFORMAT_EDATED);
          }
          if(data[0].BDFORMAT_TDATED !=null){
            this.dataAdd.BDOPERATIONTD_TDATE[2] = new Date(data[0].BDFORMAT_TDATED);
          }
          if(data[0].BDFORMAT_SDATES !=null){  
            this.dataAdd.BDOPERATIONTD_SDATE[3] = new Date(data[0].BDFORMAT_SDATES);
            this.dataAdd.BDOPERATIONTD_EDATE[3] = new Date(data[0].BDFORMAT_EDATES);
          }
          if(data[0].BDFORMAT_TDATES !=null){
            this.dataAdd.BDOPERATIONTD_TDATE[3] = new Date(data[0].BDFORMAT_TDATES);
          }
          if(data[0].BDFORMAT_SDATEA !=null){
            this.dataAdd.BDOPERATIONTD_SDATE[4] = new Date(data[0].BDFORMAT_SDATEA);
            this.dataAdd.BDOPERATIONTD_EDATE[4] = new Date(data[0].BDFORMAT_EDATEA);
          }
          if(data[0].BDFORMAT_TDATEA !=null){
            this.dataAdd.BDOPERATIONTD_TDATE[4] = new Date(data[0].BDFORMAT_TDATEA);
          }
          if(data[0].BDFORMAT_SDATET !=null){ 
            this.dataAdd.BDOPERATIONTD_SDATE[5] = new Date(data[0].BDFORMAT_SDATET);
            this.dataAdd.BDOPERATIONTD_EDATE[5] = new Date(data[0].BDFORMAT_EDATET);
          }
          if(data[0].BDFORMAT_TDATET !=null){
            this.dataAdd.BDOPERATIONTD_TDATE[5] = new Date(data[0].BDFORMAT_TDATET);
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
  // ฟังก์ชัน การแสดงข้อมูลตามต้องการ
onTableDataChange(event: any){
  this.page = event;
  this.fetchdatalist();
  } 
   
  
  onTableSizeChange(event: any): void {
  this.tableSize = event.target.value;
  this.page = 1;
  this.fetchdatalist();
  } 
}
