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
defineLocale('th', thBeLocale);
import Swal from 'sweetalert2';

@Component({
  selector: 'app-plexpenses',
  templateUrl: './plexpenses.component.html',
  styleUrls: ['./plexpenses.component.scss']
})
export class PlexpensesComponent implements OnInit {
  title = 'angular-app';
  fileName = 'report.xlsx';
  userList = [{}]

  dataYear: any;
  dataCam: any;
  datalist: any;
  datalists: any;
  loading: any;
  loadingdetail: any;
  dataAdd: any = { FNEXACCCODE: [], FRACCCODE: [], FNEXACCMONEY: [], FNEXACCRDATE: [], FNEXACCDEKA: [], FRACC1: [], FNEXACC_RDATE1: [], apstatus: [], FNEXACC_TYPE: [], FNEXACC_NUMBER: [] };
  dataFAdd: any = {};
  clickshow: any;
  datalistdetailmoney: any;
  searchTerm: any;
  show: any;
  dataFac: any;
  dataCrpart: any;
  dataPro: any;
  datarstatus: any;
  dataIncome: any;
  dataCredit: any;
  dataSubplmoneypay: any;
  dataPlmoneypay: any;
  dataType: any;
  numrow: any;
  locale = 'th-be';
  locales = listLocales();
  Momoney = 0;
  Mamoney = 0;
  Mcmoney = 0;
  Mrmoney = 0;
  rownum: any;
  dataMoneypay: any;
  element: any;
  number: any = [1, 2, 3, 4, 5];
  //apstatus: any;
  datafrc: any;
  dataEDepartment: any;
  page = 1;
  count = 0;
  tableSize = 20;
  tableSizes = [20, 30, 40];
  dataESubplmoneypay: any;
  dataESection: any;
  dataPlproduct: any;
  rowpbi: any;
  rowpbu: any;
  dataEpl: any;
  keyword = 'name';
  datacomplete = [];
  url = "/acc3d/unitcost/manage/plexpenses.php";
  url1 = "/acc3d/budget/userpermission.php";
  url2 = "/acc3d/unitcost/userpermission.php";
  constructor(
    private tokenStorage: TokenStorageService,
    private apiService: ApiPdoService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private eRef: ElementRef,
    private formBuilder: FormBuilder,
    private localeService: BsLocaleService
  ) { }

  ngOnInit(): void {
    this.localeService.use(this.locale);
    this.dataAdd.citizen = this.tokenStorage.getUser().citizen;
    this.fetchdata();

  }
  fetchdata() {
    //ดึงคณะตามสังกัด
    var varN = {
      "opt": "viewufac",
      "citizen": this.tokenStorage.getUser().citizen
    }
    this.apiService
      .getdata(varN, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataAdd.UFACULTY_CODE = data[0].FACULTY_CODE;
        this.dataAdd.CAMPUS_CODE = data[0].CAMPUS_CODE;
        var varP = {
          "opt": "viewp",
          "citizen": this.tokenStorage.getUser().citizen
        }
        //ดึงรายการคณะตามสิทธิ์
        this.apiService.getdata(varP, this.url2)
          .pipe(first())
          .subscribe((data: any) => {
            this.datarstatus = data;
            this.dataAdd.PRIVILEGE_RSTATUS = data[0].PRIVILEGE_RSTATUS;
            var varN = {
              "opt": "viewfacf",
              "citizen": this.tokenStorage.getUser().citizen,
              "PRIVILEGERSTATUS": data[0].PRIVILEGE_RSTATUS,
              "CAMPUS_CODE": this.dataAdd.CAMPUS_CODE
            }
            this.apiService
              .getdata(varN, this.url2)
              .pipe(first())
              .subscribe((data: any) => {
                //  console.log(data);
                this.dataFac = data;
                this.dataAdd.FACULTY_CODE = data[0].FACULTY_CODE;
              });
          });

        //รายการประเภทเงิน
        var Table = {
          "opt": "viewTable",
          "Table": "PLINCOME where PLINCOME_ASTATUS=1"
        }
        this.apiService
          .getdata(Table, this.url1)
          .pipe(first())
          .subscribe((data: any) => {
            this.dataIncome = data;
            this.dataAdd.PLINCOME_CODE = '11';//data[0].PLINCOME_CODE;
            this.dataAdd.CRPART_ID = '00';
            //this.fetchdatalistsubm();

          });
        //รายการปี
        var Table = {
          "opt": "viewyear",
          "Table": "PLYEARBUDGET where (PLYEARBUDGET_RSTATUS='D' or PLYEARBUDGET_RSTATUS='A' ) order by PLYEARBUDGET_CODE desc"
        }
        this.apiService
          .getdata(Table, this.url1)
          .pipe(first())
          .subscribe((data: any) => {
            this.dataYear = data;
            this.dataAdd.PLYEARBUDGET_CODE = data[0].PLYEARBUDGET_CODE;

          });
      });
    //รายการภาค
    var Table2 = {
      "opt": "viewFNCREDIT"
    }
    this.apiService
      .getdata(Table2, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataCredit = data;
        this.dataAdd.FNCREDITOR_CODE = data[0].FNCREDITOR_CODE;
      });
    //ประเภทเอกสาร
    var Tablet = {
      "opt": "viewnumbertype"
    }
    this.apiService
      .getdata(Tablet, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataType = data;
      });
  }
  //เช็คตัวเลข
  CheckNum(num: any) {
    if (num.keyCode < 46 || num.keyCode > 57) {
      alert('กรุณากรอกข้อมูล ที่เป็นตัวเลข');
      num.returnValue = false;
    }
  }
  // ฟังก์ขันสำหรับการดึงข้อมูลรายการงบ
  fetchdataPlmoneypay() {
    this.dataPlmoneypay = null;
    this.dataAdd.opt = "viewCPLMONEYPAY";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataPlmoneypay = data;
        this.dataAdd.PLMONEYPAY_CODE = data[0].PLMONEYPAY_CODE;
        this.fetchdatalistsubm();
      });

  }
  showdeka() {
    //this.dataAdd.FNEXACCDEKA[0] = this.dataAdd.FNEXPENSES_DEKA;
    //console.log(this.dataAdd.FNEXPENSES_CMDATE);
    // if(this.dataAdd.FNEXPENSES_CMDATE !=''){
    // this.dataAdd.FNEXACCRDATE[0] = new Date(this.dataAdd.FNEXPENSES_CMDATE);
    //  }

    /* for (let i = 0; i < this.dataAdd.FRACC1.length; i++) {
       if(this.dataAdd.FRACC1[i] !=''){
       this.dataAdd.FNEXACCDEKA[i] = this.dataAdd.FNEXPENSES_DEKA;
       if(this.dataAdd.FNEXPENSES_MDATE !=''){
       this.dataAdd.FNEXACCRDATE[i] = new Date(this.dataAdd.FNEXPENSES_MDATE);
       }
       }
     }*/
    this.dataAdd.FNEXACCRDATE[0] = new Date(this.dataAdd.FNEXPENSES_MDATE);
  }
  //หมวดรายจ่าย
  fetchdatalistsubm() {
    this.dataESubplmoneypay = null;
    this.dataAdd.opt = "viewSUBPLMONEYPAYP";
    this.apiService
      .getdata(this.dataAdd, this.url2)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataESubplmoneypay = data;
        // this.dataAdd.PLSUBMONEYPAY_CODE = data[0].PLSUBMONEYPAY_CODE; 
      });
  }
  //รายการโครงการ
  fetchdatalistpl() {
    let PLTRBUDGET_CODE = this.dataAdd.FACULTY_CODE + this.dataAdd.PLYEARBUDGET_CODE + this.dataAdd.PLINCOME_CODE + this.dataAdd.CRPART_ID + this.dataAdd.PLYEARBUDGET_CODE + this.dataAdd.PLMONEYPAY_CODE;
    // console.log(PLTRBUDGET_CODE);
    this.showdatapl(PLTRBUDGET_CODE);
  }
  showdatapl(val: any) {
    var varP = {
      "opt": "viewPLASSET",
      "search": val
    }
    this.apiService
      .getdata(varP, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataEpl = data;
        this.dataAdd.PLPROJECT_CODE = '';//data[0].id; 
      });
  }
  selectEvent1(item: any) {
    this.dataAdd.FNCREDITOR_CODE = item.id;
    //console.log(item);
  }

  onChangeSearch1(val: string) {
    var varP = {
      "opt": "viewFNCREDITOR",
      "search": val
    }
    this.apiService
      .getdata(varP, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.datacomplete = data;
        // console.log(data);
      });


  }
  //หมวดรายจ่าย
  fetchdatalistpro() {
    this.dataPlproduct = null;
    this.dataAdd.opt = "PLPRODUCT";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataPlproduct = data;
        this.dataAdd.PLGPRODUCT_CODE = data[0].PLGPRODUCT_CODE;
      });
  }
  //ผลรวมเงินจ่ายจริง
  sumdatafr() {
    let summoney = 0;
    let fr = 0;
    for (let i = 0; i < 5; i++) {
      //console.log(this.dataFAdd.FNEXACCMONEY[i]+'..'+this.dataFAdd.FRACCCODE[i]);
      if ((this.dataAdd.FNEXACCMONEY[i] > 0 || this.dataAdd.FNEXACCMONEY[i] < 0) && this.dataAdd.FRACCCODE[i] != '2116010104') {
        summoney += parseFloat(this.dataAdd.FNEXACCMONEY[i]);

        // console.log(this.dataAdd.apstatus[i]);
        if (this.dataAdd.apstatus[i] == true) {
          fr = 1;
        }
      } /*else if (this.dataAdd.FNEXACCMONEY[i] > 0 && this.dataAdd.FRACCCODE[i] == '2116010104') {
        sumfr += parseFloat(this.dataAdd.FNEXACCMONEY[i]);
      }*/
    }
    if (fr == 0) {
      this.dataAdd.FNEXPENSES_OMONEY = summoney.toFixed(2);
      this.dataAdd.FNEXPENSES_AMONEY = summoney.toFixed(2);
    }
    this.dataAdd.FNEXPENSES_CMONEY = 0;
    this.dataAdd.FNEXPENSES_RMONEY = summoney.toFixed(2) /*- sumfr*/;
    this.dataAdd.FNEXPENSES_CDATE = new Date(this.dataAdd.FNEXACCRDATE[0]);
    this.dataAdd.FNEXPENSES_ADATE = new Date(this.dataAdd.FNEXACCRDATE[0]);
    this.dataAdd.FNEXPENSES_CMDATE = new Date(this.dataAdd.FNEXACCRDATE[0]);
    this.dataAdd.FNEXPENSES_MDATE = new Date(this.dataAdd.FNEXACCRDATE[0]);
  }
  fetchdataCam() {
    // console.log(1);
    this.dataFac = null;
    this.dataAdd.opt = "viewcfac";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataFac = data;

      });
  }
  fetchdataproduct() {
    this.dataAdd.opt = "viewproy";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataPro = data;

      });
  }
  //ภาคเงิน
  fetchdatalistcr() {
    this.dataAdd.FFACULTY_CODE = this.dataAdd.FACULTY_CODE;
    this.dataAdd.CRPART_ID = '';
    this.dataAdd.opt = "viewCRPART";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataCrpart = data;
        this.dataAdd.CRPART_ID = data[0].CRPART_ID;
      });
  }
  // ฟังก์ขันสำหรับการดึงข้อมูลรายการหมวดรายจ่ายย่อย
  fetchdataSubplmoneypay() {
    this.dataAdd.opt = "viewSUBPLMONEYPAY";
    //  console.log(this.dataAdd);
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataSubplmoneypay = data;
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
  //แก้ไขข้อมูล
  updatedata() {
    if (this.dataAdd.FNEXPENSES_NUMBOOK == '' || this.dataAdd.FNEXPENSES_CCDATE == '' || this.dataAdd.FNEXPENSES_TITLE == '' || this.dataAdd.FNEXPENSES_OMONEY == ''
      || this.dataAdd.FNCREDITOR_CODE == '' || this.dataAdd.DEPARTMENT_CODE == ''
      || this.dataAdd.SECTION_CODE == '' || this.dataAdd.PLMONEYPAY_CODE == '' || this.dataAdd.PLSUBMONEYPAY_CODE == '' || this.dataAdd.PLGPRODUCT_CODE == '') {
      if (this.dataAdd.FNEXPENSES_CCDATE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกวันที่ดำเนินการ");
      }
      if (this.dataAdd.FNEXPENSES_TITLE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกชื่อเรื่อง/ชื่อโครงการ");
      }
      if (this.dataAdd.FNEXPENSES_OMONEY == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกขอเบิกเงินจำนวน");
      }
      if (this.dataAdd.FNCREDITOR_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกเจ้าหนี้/ผู้ขอเบิก");
      }
      if (this.dataAdd.DEPARTMENT_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกสาขา");
      }
      if (this.dataAdd.SECTION_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกหลักสูตร");
      }
      if (this.dataAdd.FNEXPENSES_NUMBOOK == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกเลขที่หนังสือ");
      }
      if (this.dataAdd.PLMONEYPAY_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกประเภทงบ");
      }
      if (this.dataAdd.PLSUBMONEYPAY_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกหมวดรายจ่ายย่อย");
      }
      if (this.dataAdd.PLGPRODUCT_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกผลผลิต");
      }
    } else {
      // console.log(this.dataAdd);
      this.dataAdd.FNEXPENSES_CDATE1 = this.datenow(this.dataAdd.FNEXPENSES_CDATE);
      if (this.dataAdd.FNEXPENSES_ADATE == '') {
        this.dataAdd.FNEXPENSES_ADATE1 = '';
      } else {
        this.dataAdd.FNEXPENSES_ADATE1 = this.datenow(this.dataAdd.FNEXPENSES_ADATE);
      }
      if (this.dataAdd.FNEXPENSES_CMDATE == '') {
        this.dataAdd.FNEXPENSES_CMDATE1 = '';
      } else {
        this.dataAdd.FNEXPENSES_CMDATE1 = this.datenow(this.dataAdd.FNEXPENSES_CMDATE);
      }
      if (this.dataAdd.FNEXPENSES_MDATE == '') {
        this.dataAdd.FNEXPENSES_MDATE1 = '';
      } else {
        this.dataAdd.FNEXPENSES_MDATE1 = this.datenow(this.dataAdd.FNEXPENSES_MDATE);
      }

      for (let i = 0; i < this.dataAdd.FNEXACCRDATE.length; i++) {
        if (this.dataAdd.FNEXACCRDATE[i]) {
          //  console.log(i);
          // console.log(this.dataAdd.FNEXACCMONEY[i]+'..'+this.datenow(this.dataAdd.FNEXACCRDATE[i]));
          this.dataAdd.FNEXACC_RDATE1[i] = this.datenow(this.dataAdd.FNEXACCRDATE[i]);
        }
      }

      this.dataAdd.opt = "update";
      this.apiService
        .getdata(this.dataAdd, this.url)
        .pipe(first())
        .subscribe((data: any) => {
          if (data.status == 1) {
            this.datalist = null;
            this.toastr.success("แจ้งเตือน:แก้ข้อมูลเรียบร้อยแล้ว");
            this.fetchdatalist();
            document.getElementById("ModalClose")?.click();
          } else {
            this.datalist = null;
            this.toastr.warning("แจ้งเตือน:ไม่สามารถแก้ไขข้อมูลได้ เพราะไม่ยอดเงินจัดสรร");
          }
        });
    }
  }
  // ฟังก์ขันสำหรับการเพิ่มข้อมูล
  insertdata() {
    this.loading = true;
    if (this.dataAdd.FNEXPENSES_NUMBOOK == '' || this.dataAdd.FNEXPENSES_CCDATE == '' || this.dataAdd.FNEXPENSES_TITLE == '' || this.dataAdd.FNEXPENSES_OMONEY == ''
      || this.dataAdd.FNCREDITOR_CODE == '' || this.dataAdd.DEPARTMENT_CODE == ''
      || this.dataAdd.SECTION_CODE == '') {

      if (this.dataAdd.FNEXPENSES_CCDATE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกวันที่ดำเนินการ");
      }
      if (this.dataAdd.FNEXPENSES_TITLE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกชื่อเรื่อง/ชื่อโครงการ");
      }
      if (this.dataAdd.FNEXPENSES_OMONEY == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกขอเบิกเงินจำนวน");
      }
      if (this.dataAdd.FNCREDITOR_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกเจ้าหนี้/ผู้ขอเบิก");
      }
      if (this.dataAdd.DEPARTMENT_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกสาขา");
      }
      if (this.dataAdd.SECTION_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกหลักสูตร");
      }
      if (this.dataAdd.FNEXPENSES_NUMBOOK == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกเลขที่หนังสือ");
      }
    } else {
      // console.log(1);
      this.dataAdd.FNEXPENSES_CDATE1 = this.datenow(this.dataAdd.FNEXPENSES_CDATE);
      if (this.dataAdd.FNEXPENSES_ADATE == '') {
        this.dataAdd.FNEXPENSES_ADATE1 = '';
      } else {
        this.dataAdd.FNEXPENSES_ADATE1 = this.datenow(this.dataAdd.FNEXPENSES_ADATE);
      }
      if (this.dataAdd.FNEXPENSES_CMDATE == '') {
        this.dataAdd.FNEXPENSES_CMDATE1 = '';
      } else {
        this.dataAdd.FNEXPENSES_CMDATE1 = this.datenow(this.dataAdd.FNEXPENSES_CMDATE);
      }
      if (this.dataAdd.FNEXPENSES_MDATE == '') {
        this.dataAdd.FNEXPENSES_MDATE1 = '';
      } else {
        this.dataAdd.FNEXPENSES_MDATE1 = this.datenow(this.dataAdd.FNEXPENSES_MDATE);
      }

      for (let i = 0; i < this.dataAdd.FNEXACCRDATE.length; i++) {
        if (parseFloat(this.dataAdd.FNEXACCMONEY[i]) > 0) {
          //  console.log(i);
          //  console.log(this.dataAdd.FNEXACCMONEY[i] + '..' + this.datenow(this.dataAdd.FNEXACCRDATE[i]));
          this.dataAdd.FNEXACC_RDATE1[i] = this.datenow(this.dataAdd.FNEXACCRDATE[i]);
        }
      }
      this.dataAdd.opt = "insert";
      this.apiService
        .getupdate(this.dataAdd, this.url)
        .pipe(first())
        .subscribe((data: any) => {
          //console.log(data.status);       
          if (data.status == 1) {
            this.loading = null;
            this.toastr.success("แจ้งเตือน:เพิ่มข้อมูลเรียบร้อยแล้ว");
            this.fetchdatalist();
            document.getElementById("ModalClose")?.click();
          } else {
            this.toastr.warning("แจ้งเตือน:ไม่สามารถเพิ่มข้อมูลได้");
          }
        });
    }
  }
  //หมวดรายจ่าย
  fetchdatalistmo() {
    this.dataMoneypay = null;
    this.dataAdd.opt = "viewCPLMONEYPAY";
    // console.log(this.dataAdd);
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataMoneypay = data;
        this.dataAdd.PLMONEYPAY_CODE = data[0].PLMONEYPAY_CODE;
      });
  }

  //สาขา
  fetchdatalistdepart() {
    this.dataEDepartment = null;
    this.dataAdd.opt = "viewDEPARTMENTSALARY";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((dataedp: any) => {
        this.dataEDepartment = dataedp;
        this.dataAdd.DEPARTMENT_CODE = dataedp[0].DEPARTMENT_CODE;
        this.fetchdatalistsub();
      });
  }
  //หลักสูตร
  fetchdatalistsub() {
    this.dataESection = null;
    this.dataAdd.opt = "viewSECTION";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataESection = data;
        this.dataAdd.SECTION_CODE = data[0].SECTION_CODE;
      });
  }
  showinput() {
    this.rowpbi = 1;
    this.rowpbu = '';
    this.fetchdatalistdepart();
    this.fetchdataPlmoneypay();
    this.fetchdatalistpro();
  }
  //หลักสูตร
  fetchdatalistsection() {
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((datasec: any) => {
        this.dataESection = datasec;
      });
  }
  selectEvent(item: any, num: any) {
    // console.log(item.id);
    this.dataAdd.FRACCCODE[num] = item.id;
  }
  onChangeSearch(val: string) {
    var varP = {
      "opt": "viewfrcc",
      "search": val
    }
    this.apiService
      .getdata(varP, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.datacomplete = data;
        // console.log(data);
      });
  }
  // ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
  editdata(id: any) {
    this.cleardata();
    this.fetchdatalistdepart();
    // this.apstatus = null;
    this.apiService
      .getById(id, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == 1) {
          //สาขา          
          this.datalists = data.data;
          //this.dataAdd= data.data[0];
          this.dataAdd.FACULTY_CODE = data.data[0].FACULTY_CODE;
          this.fetchdataPlmoneypay();
          this.fetchdatalistpro();
          // this.dataAdd.FFACULTY_CODE = data.data[0].FFACULTY_CODE;
          this.dataAdd.FNEXPENSES_CODE = data.data[0].FNEXPENSES_CODE;
          this.dataAdd.PLGPRODUCT_CODE = data.data[0].PLGPRODUCT_CODE;
          this.dataAdd.PLMONEYPAY_CODE = data.data[0].PLMONEYPAY_CODE;
          // this.fetchdatalistsubm();
          this.dataAdd.PLSUBMONEYPAY_CODE = data.data[0].PLSUBMONEYPAY_CODE;
          this.dataAdd.FNEXPENSES_NUMBOOK = data.data[0].FNEXPENSES_NUMBOOK;
          this.dataAdd.FNEXPENSES_DEKA = data.data[0].FNEXPENSES_DEKA;
          this.dataAdd.FNEXPENSES_TITLE = data.data[0].FNEXPENSES_TITLE;
          this.dataAdd.FNEXPENSES_CCDATE = data.data[0].FNEXPENSES_CCDATE;
          this.dataAdd.FNCREDITOR_CODE = data.data[0].FNCREDITOR_CODE;
          this.dataAdd.DEPARTMENT_CODE = data.data[0].DEPARTMENT_CODE;
          this.dataAdd.SECTION_CODE = data.data[0].SECTION_CODE;
          this.dataAdd.FNEXPENSES_EXTEND = data.data[0].FNEXPENSES_EXTEND;
          this.dataAdd.FNEXPENSES_OMONEY = this.numberWithCommas(parseFloat(data.data[0].FNEXPENSES_OMONEY).toFixed(2));
          this.dataAdd.FNEXPENSES_AMONEY = this.numberWithCommas(parseFloat(data.data[0].FNEXPENSES_AMONEY).toFixed(2));
          this.dataAdd.FNEXPENSES_CMONEY = this.numberWithCommas(parseFloat(data.data[0].FNEXPENSES_CMONEY).toFixed(2));
          this.dataAdd.FNEXPENSES_RMONEY = this.numberWithCommas(parseFloat(data.data[0].FNEXPENSES_RMONEY).toFixed(2));
          this.dataAdd.FNEXPENSES_CDATE = new Date(data.data[0].FNEXPENSES_CDATE);
          this.dataAdd.FNEXPENSES_ADATE = new Date(data.data[0].FNEXPENSES_ADATE);
          this.dataAdd.FNEXPENSES_CMDATE = new Date(data.data[0].FNEXPENSES_CMDATE);
          this.dataAdd.FNEXPENSES_MDATE = new Date(data.data[0].FNEXPENSES_MDATE);
          this.dataAdd.PLPROJECT_CODE = data.data[0].PLPROJECT_CODE;
          this.onFocused(data.data[0].FNCREDITOR_CODE, data.data[0].FNCREDITOR_NAME);
          this.showdatapl(data.data[0].PLTRBUDGET_CODE);
          this.fetchdatalistfrm(data.data[0].FNEXPENSES_CODE);
        }
      });
    this.rowpbi = null;
    this.rowpbu = true;
  }
  onFocused(id: any, val: any) {
    this.dataFAdd.FNCREDITOR_CODE1 = { "id": id, "name": val };
  }
  //บัญชีแยกประเภท(จ่ายจริง)
  fetchdatalistfrm(id: any) {
    var varP = {
      "opt": "viewFRM",
      "id": id
    }
    //console.log(varP);
    this.apiService
      .getdata(varP, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        for (let i = 0; i < data.length; i++) {
          this.dataAdd.FNEXACCCODE[i] = data[i].FNEXACC_CODE;
          this.dataAdd.FRACCCODE[i] = data[i].FRACC_CODE;
          this.dataAdd.FRACC1[i] = data[i].FRACC_TNAME;
          this.dataAdd.FNEXACCRDATE[i] = new Date(data[i].FNEXACC_RDATE);
          this.dataAdd.FNEXACCDEKA[i] = data[i].FNEXACC_DEKA;
          this.dataAdd.FNEXACC_TYPE[i] = data[i].FNEXACC_TYPE;
          this.dataAdd.FNEXACC_NUMBER[i] = data[i].FNEXACC_NUMBER;
          this.dataAdd.FNEXACCMONEY[i] = (parseFloat(data[i].FNEXACC_MONEY).toFixed(2));
          if (data[i].FNEXACC_PSTATUS == '1') {
            this.dataAdd.apstatus[i] = true;
          } else {
            this.dataAdd.apstatus[i] = null;
          }
        }
        //console.log(data.length);
      });
  }
  //ล้างข้อมูล
  cleardata() {
    //this.apstatus=null;
    this.dataAdd.FNEXPENSES_CODE = '';
    this.dataAdd.FNEXPENSES_NUMBOOK = '';
    this.dataAdd.FNEXPENSES_CCDATE = '';
    this.dataAdd.FNEXPENSES_TITLE = '';
    this.dataAdd.FNEXPENSES_OMONEY = '';
    this.dataAdd.FNEXPENSES_EXTEND = '';
    this.dataAdd.DEPARTMENT_CODE = '';
    this.dataAdd.FNEXPENSES_OMONEY = '';
    this.dataAdd.FNEXPENSES_AMONEY = '';
    this.dataAdd.FNEXPENSES_CMONEY = '';
    this.dataAdd.FNEXPENSES_RMONEY = '';
    this.dataAdd.FNEXPENSES_CDATE = '';
    this.dataAdd.FNEXPENSES_ADATE = '';
    this.dataAdd.FNEXPENSES_CMDATE = '';
    this.dataAdd.FNEXPENSES_MDATE = '';
    this.dataAdd.PLMONEYPAY_CODE = '';
    this.dataAdd.PLSUBMONEYPAY_CODE = '';
    this.dataAdd.PLGPRODUCT_CODE = '';
    this.dataAdd.PLPROJECT_CODE = '';
    this.dataAdd.FNCREDITOR_CODE1 = '';
    this.dataAdd.FNCREDITOR_CODE = '';
    for (let i = 0; i < 5; i++) {
      this.dataAdd.FNEXACCCODE[i] = '';
      this.dataAdd.FRACCCODE[i] = '';
      this.dataAdd.FNEXACCRDATE[i] = '';
      this.dataAdd.FNEXACCDEKA[i] = '';
      this.dataAdd.FNEXACCMONEY[i] = '';
      this.dataAdd.FRACC1[i] = '';
      this.dataAdd.apstatus[i] = null;
      this.dataAdd.FNEXACC_TYPE[i] = '';
      this.dataAdd.FNEXACC_NUMBER[i] = null;
    }

  }
  // ฟังก์ชันสำหรับการลบข้อมูล
  deleteData(id: any) {
    Swal.fire({
      title: 'ต้องการลบข้อมูล?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.value) {
        this.datalist = null;
        this.dataAdd.id = id;
        this.dataAdd.opt = "delete";
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
  numberWithCommas(x: any) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
  // ฟังก์ชัน การแสดงข้อมูลตามต้องการ
  showmoney(i: any, money: any) {
    //console.log(parseFloat(this.dataAdd.MONEY[i]));
    if (parseFloat(this.dataAdd.MONEY[i]) > 0) {
      this.dataAdd.MONEY[i] = '';
    } else {
      this.dataAdd.MONEY[i] = this.numberWithCommas(parseFloat(money).toFixed(2));
    }
  }
  showapp() {
    //console.log('1');
    this.clickshow = true;
  }
  fetchclose() {
    this.clickshow = null;
  }
  // ฟังก์ชัน การแสดงข้อมูลตามต้องการ
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
