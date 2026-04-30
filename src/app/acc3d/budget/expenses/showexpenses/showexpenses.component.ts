import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
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
//import { Console } from 'console';
defineLocale('th', thBeLocale);

@Component({
  selector: 'app-showexpenses',
  templateUrl: './showexpenses.component.html',
  styleUrls: ['./showexpenses.component.scss']
})
export class ShowexpensesComponent implements OnInit {
  datarstatus: any;
  dataFac: any;
  dataIncome: any;
  dataCrpart: any;
  dataYear: any;
  dataPlmoneypay: any;
  dataSubplmoneypay: any;
  dataPlproduct: any;
  datalist: any;
  datalistdetail: any;
  loading: any;
  dataEPlmoneypay: any;
  dataESubplmoneypay: any;
  dataEDepartment: any;
  dataESection: any;
  dataEIncome: any;
  dataECrpart: any;
  dataEYear: any;
  dataFncreditor: any;
  dataEpl: any;
  dataEfrc: any;
  dataEfrm: any;
  datafrc: any;
  datalists: any;
  dataMidbudget: any;
  dataType: any;
  url = "/acc3d/budget/expenses/showexpenses.php";
  url1 = "/acc3d/budget/userpermission.php";
  dataAdd: any = {};
  dataFAdd: any = {
    FNEXACCCODE: [], FRACCCODE: [], FNEXACCMONEY: [], FNEXACCRDATE: [], FNEXACCDEKA: [], FNEXACCCODEC: [], FRACCCODEC: []
    , FNEXACCMONEYC: [], FNEXACC_RDATE1: [], FRACCDATEC: [], FRACCDEKAC: [], FNEXACC_DATE1: [], apstatus: [], FNEXACC_CSTATUS: [], FNEXACC_TYPE: [], FNEXACC_NUMBER: []
    , FNEXACC_TYPE1: [], FNEXACC_NUMBER1: [], FNEXPENSES_PO: [], FNEXPENSES_DELIVERRY: []
  };
  searchTerm: any;
  selectedDevice: any;
  number: any = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,25,26,27,28,29,30];
  number1: any = [1, 2, 3];
  page = 1;
  count = 0;
  tableSize = 20;
  tableSizes = [20, 30, 40];
  rownum: any;
  locale = 'th-be';
  locales = listLocales();
  element: any;
  apstatus: any;
  Momoney = 0;
  Mamoney = 0;
  Mcmoney = 0;
  Mrmoney = 0;
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

    // this.dataAdd.DATENOWS=new Date(); 
    this.localeService.use(this.locale);
    this.dataAdd.citizen = this.tokenStorage.getUser().citizen;
    this.dataFAdd.PLPROJECT_CODE = '';
    this.dataAdd.PLMONEYPAY_CODE = '';
    this.dataAdd.search = '';
    this.dataEpl = null;
    this.fetchdata();
    //console.log(this.number);
  }
  keyword = 'name';
  datacomplete = [];

  selectEvent(item: any) {
    this.dataFAdd.FNCREDITOR_CODE = item.id;
    console.log(item);
  }

  onChangeSearch(val: string) {
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

  onFocused(id: any, val: any) {
    this.dataFAdd.FNCREDITOR_CODE1 = { "id": id, "name": val };
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
        this.dataAdd.UCAMPUS_CODE = data[0].CAMPUS_CODE;

      });
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
        this.dataFAdd.PRIVILEGE_RSTATUS = data[0].PRIVILEGE_RSTATUS;
        // console.log(data);
        if (data[0].PRIVILEGE_RSTATUS == 'A' || data[0].PRIVILEGE_RSTATUS == '2' || data[0].PRIVILEGE_RSTATUS == '6' || data[0].PRIVILEGE_RSTATUS == '9'
          || data[0].PRIVILEGE_RSTATUS == '5' || data[0].PRIVILEGE_RSTATUS == '3' || data[0].PRIVILEGE_RSTATUS == 'F'|| data[0].PRIVILEGE_RSTATUS == 'M') {
          this.dataAdd.PRIVILEGE_RSTATUS = data[0].PRIVILEGE_RSTATUS;
          // this.showDataelement();
          this.showDataelement();
        } else {
          this.hideDataelement();
        }
        var varNf = {
          "opt": "viewfac",
          "citizen": this.tokenStorage.getUser().citizen,
          "PRIVILEGERSTATUS": data[0].PRIVILEGE_RSTATUS
        }
        this.apiService
          .getdata(varNf, this.url1)
          .pipe(first())
          .subscribe((data: any) => {
            this.dataFac = data;
            // console.log(data[0].FACULTY_CODE);
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
        this.dataAdd.PLINCOME_CODE = '';//data[0].PLINCOME_CODE;
        // console.log(data[0].PLINCOME_CODE);
      });

    //รายการปี
    var Tabley = {
      "opt": "viewyear"
      
    }
    this.apiService
      .getdata(Tabley, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataYear = data;
        this.dataAdd.PLYEARBUDGET_CODE = data[0].PLYEARBUDGET_CODE;
        //รายการงบ
        var Tablepl = {
          "opt": "viewPLMONEYPAY",
          "PLYEARBUDGET_CODE": data[0].PLYEARBUDGET_CODE
        }
        this.apiService
          .getdata(Tablepl, this.url1)
          .pipe(first())
          .subscribe((data: any) => {
            this.dataPlmoneypay = data;
            this.dataAdd.PLMONEYPAY_CODE = '';
          });
        //รายการภาค
        var Table2 = {
          "opt": "viewCRPART",
          "PLYEARBUDGET_CODE": data[0].PLYEARBUDGET_CODE,
          "FACULTY_CODE": "",
          "PLINCOME_CODE": ""
        }
        this.apiService
          .getdata(Table2, this.url1)
          .pipe(first())
          .subscribe((data: any) => {
            this.dataCrpart = data;
            this.dataAdd.CRPART_ID = '';//data[0].CRPART_ID;
          });
        //ผลผลิต
        var Table4 = {
          "opt": "viewPLPRODUCT",
          "PLYEARBUDGET_CODE": data[0].PLYEARBUDGET_CODE
        }
        this.apiService
          .getdata(Table4, this.url1)
          .pipe(first())
          .subscribe((datapro: any) => {
            this.dataPlproduct = datapro;
            //console.log(datapro);
          });
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

    this.dataAdd.PLSUBMONEYPAY_CODE = '';
    this.dataAdd.DATENOWS = '';
    this.dataAdd.DATENOWT = '';

    // console.log(this.dataAdd);
  }
  // ฟังก์ขันสำหรับการดึงข้อมูลรายการงบ
  fetchdataPlmoneypay() {
    this.dataPlmoneypay=null;
    this.dataAdd.opt = "viewCPLMONEYPAY";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataPlmoneypay = data;
      });
    this.dataAdd.PLSUBMONEYPAY_CODE = '';
  }
  // ฟังก์ขันสำหรับการดึงข้อมูลรายการหมวดรายจ่ายย่อย
  fetchdataSubplmoneypay() {
    this.dataSubplmoneypay=null;
    this.dataESubplmoneypay=null;
    this.dataAdd.opt = "viewSUBPLMONEYPAY";
    //  console.log(this.dataAdd);
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataSubplmoneypay = data;
        this.dataESubplmoneypay = data;
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
  // ฟังก์ขันสำหรับการดึงข้อมูลรายการขอเบิก
  fetchdatalist() {
    if (this.dataAdd.DATENOWS != '') {
      this.applyLocale('thBeLocale');
      this.dataAdd.DATENOWS1 = this.datenow(this.dataAdd.DATENOWS);
      this.dataAdd.DATENOWT2 = this.datenow(this.dataAdd.DATENOWT);
    } else {
      this.dataAdd.DATENOWS1 = '';
      this.dataAdd.DATENOWT2 = '';
      //console.log(this.dataAdd.DATENOWS);  
    }
    this.Momoney = 0;
    this.Mamoney = 0;
    this.Mcmoney = 0;
    this.Mrmoney = 0;
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
          this.fetchdataSubplmoneypay();
          this.showdata();
          let omoney = 0; let amoney = 0; let cmoney = 0; let rmoney = 0;
          for (let i = 0; i < this.datalist.length; i++) {
            omoney += parseFloat(this.datalist[i].FNEXPENSES_OMONEY);
            amoney += parseFloat(this.datalist[i].FNEXPENSES_AMONEY);
            cmoney += parseFloat(this.datalist[i].FNEXPENSES_CMONEY);
            rmoney += parseFloat(this.datalist[i].FNEXPENSES_RMONEY);
          }
          this.Momoney = omoney;
          this.Mamoney = amoney;
          this.Mcmoney = cmoney;
          this.Mrmoney = rmoney;
        } else {
          this.rownum = null;
          this.loading = null;
          this.datalist = data.data;
          this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
        }
      });
    //รายการบัญชีแยกประเภท
    /*var Table = {
      "opt": "viewTable",
      "Table": "FRACC  where   FRACC_ASTATUS =1 order by FRACC_CODE"
    }*/
    this.datafrc=null;
   this.dataAdd.opt = "viewFRACC";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.datafrc = data;
        //console.log(data);
      });
    //รายการงบกลาง
  /*  var Tablem = {
      "opt": "PLMIDDLEBUDGET",
      "PLYEARBUDGET_CODE": this.dataAdd.PLYEARBUDGET_CODE
    }*/
    this.dataMidbudget=null;
    this.dataAdd.opt = "PLMIDDLEBUDGET";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataMidbudget = data;
        // this.dataAdd.PLMIDDLEBUDGET_CODE = data[0].PLMIDDLEBUDGET_CODE;
      });
    let PLTRBUDGET_CODE = this.dataAdd.FACULTY_CODE + this.dataAdd.PLYEARBUDGET_CODE + this.dataAdd.PLINCOME_CODE + this.dataAdd.CRPART_ID + this.dataAdd.PLYEARBUDGET_CODE + this.dataAdd.PLMONEYPAY_CODE;
    // console.log(PLTRBUDGET_CODE);
    this.showdatapl(PLTRBUDGET_CODE);
  }
  //ล้างข้อมูล
  canceldata(index: any, money: any) {
    this.dataFAdd.FNEXACCMONEY[index] = -money;
    this.sumdatafr();
  }
  //ล้างข้อมูล
  cleardata() {
    this.dataAdd.FNEXPENSES_NUMBOOK = '';
    this.dataAdd.FNEXPENSES_CCDATE = '';
    this.dataAdd.FNEXPENSES_TITLE = '';
    this.dataAdd.FNCREDITOR_CODE1 = '';
    this.dataAdd.FNEXPENSES_OMONEY = '';
    this.dataAdd.FNEXPENSES_EXTEND = '';
    this.dataFAdd.DEPARTMENT_CODE = '';
    this.dataFAdd.CRPART_ID = '';
    for (let i = 0; i < 30; i++) {
      this.dataFAdd.FNEXACCCODE[i] = '';
      this.dataFAdd.FRACCCODE[i] = '';
      this.dataFAdd.FNEXACCRDATE[i] = '';
      this.dataFAdd.FNEXACCDEKA[i] = '';
      this.dataFAdd.FNEXACCMONEY[i] = '';
      this.dataFAdd.FNEXACC_CSTATUS[i] = '';
      this.dataFAdd.FNEXACC_TYPE[i] = '';
      this.dataFAdd.FNEXACC_NUMBER[i] = null;
    }
    for (let i = 0; i < 2; i++) {
      this.dataFAdd.FNEXACCCODEC[i] = '';
      this.dataFAdd.FRACCCODEC[i] = '';
      this.dataFAdd.FNEXACCMONEYC[i] = '';
      this.dataFAdd.FRACCDATEC[i] = '';
      this.dataFAdd.FRACCDEKAC[i] = '';
      this.dataFAdd.FNEXACC_TYPE1[i] = '';
      this.dataFAdd.FNEXACC_NUMBER1[i] = null;
      this.dataFAdd.FNEXPENSES_PO[i] = '';
      this.dataFAdd.FNEXPENSES_DELIVERRY[i] = '';
    }
  }
  //ผลรวมเงินจ่ายจริง
  sumdatafr() {
    let summoney = 0;
    let sumfr = 0;
    let remon = 0;
    for (let i = 0; i < 30; i++) {
      //console.log(this.dataFAdd.FNEXACCMONEY[i]+'..'+this.dataFAdd.FRACCCODE[i]);
      if ((this.dataFAdd.FNEXACCMONEY[i] > 0 || this.dataFAdd.FNEXACCMONEY[i] < 0) && this.dataFAdd.FRACCCODE[i] != '2116010104' && this.dataFAdd.FRACCCODE[i] != '1102010101'&& this.dataFAdd.FRACCCODE[i] != '1102010102') {
       // console.log(this.dataFAdd.FNEXACCMONEY[i]);
        summoney += parseFloat(this.dataFAdd.FNEXACCMONEY[i]);
      } /*else if (this.dataFAdd.FNEXACCMONEY[i] > 0 && this.dataFAdd.FRACCCODE[i] == '2116010104') {
        if (this.dataFAdd.PLGPRODUCT_CODE == '128') {
          sumfr += parseFloat(this.dataFAdd.FNEXACCMONEY[i]);
        }
        if (this.dataFAdd.PLGPRODUCT_CODE != '128' && remon > 0) {
          sumfr += parseFloat(this.dataFAdd.FNEXACCMONEY[i]);
          this.dataFAdd.FNEXACC_CSTATUS[i] = '2'
        }
        remon++;
      }*/
    }
    this.dataFAdd.FNEXPENSES_RMONEY = summoney.toFixed(2) /*- sumfr*/;
  }
  //ผลรวมเงินผูกพัน
  sumdatafc() {
    let summoney = 0;
    for (let i = 0; i < 2; i++) {
      //console.log(this.dataFAdd.FNEXACCMONEY[i]+'..'+this.dataFAdd.FRACCCODE[i]);
      if (this.dataFAdd.FNEXACCMONEYC[i] > 0) {
        summoney += parseFloat(this.dataFAdd.FNEXACCMONEYC[i]);
      }
    }
    this.dataFAdd.FNEXPENSES_CMONEY = summoney;
  }

    //เลือกสาขา
    fetchdatadapart() {
      this.dataEDepartment = null;
        //สาขา
        var Table2 = {
          "opt": "viewDEPARTMENT",
          "FACULTY_CODE": this.dataFAdd.FACULTY_CODE,
          "PRIVILEGE_RSTATUS": this.dataAdd.PRIVILEGE_RSTATUS,
          "citizen": this.dataAdd.citizen
        }
        this.apiService
          .getdata(Table2, this.url1)
          .pipe(first())
          .subscribe((dataedp: any) => {
            this.dataEDepartment = dataedp;
          });
    }
  // ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
  editdata(id: any) {
    this.apstatus = null;
    this.cleardata();
    var Tablen = {
      "opt": "readone",
      "id": id
    }
    //console.log(Tablen);
    this.apiService
      .getdata(Tablen, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == 1) {
          //สาขา
          var Table2 = {
            "opt": "viewDEPARTMENT",
            "FACULTY_CODE": data.data[0].FACULTY_CODE,
            "PRIVILEGE_RSTATUS": this.dataAdd.PRIVILEGE_RSTATUS,
            "citizen": this.dataAdd.citizen
          }
          this.apiService
            .getdata(Table2, this.url1)
            .pipe(first())
            .subscribe((dataedp: any) => {
              this.dataEDepartment = dataedp;
            });
          //หลักสูตร
          var Table3 = {
            "opt": "viewSECTION",
            "DEPARTMENT_CODE": data.data[0].DEPARTMENT_CODE
          }
          this.apiService
            .getdata(Table3, this.url1)
            .pipe(first())
            .subscribe((datasec: any) => {
              this.dataESection = datasec;
            });
          this.datalists = data.data;
          this.dataFAdd.FNEXPENSES_CODE = data.data[0].FNEXPENSES_CODE;
          this.dataFAdd.PLTRBUDGET_CODE= data.data[0].PLTRBUDGET_CODE;
          this.showdatapl(data.data[0].PLTRBUDGET_CODE);
          this.dataFAdd.PLINCOME_CODE = data.data[0].PLINCOME_CODE;
          this.dataFAdd.CRPART_ID = data.data[0].CRPART_ID;
          this.dataFAdd.PLYEARBUDGET_CODE = data.data[0].PLYEARBUDGET_CODE;
          this.dataFAdd.PLGPRODUCT_CODE = data.data[0].PLGPRODUCT_CODE;
          this.dataFAdd.PLMONEYPAY_CODE = data.data[0].PLMONEYPAY_CODE;
          this.dataFAdd.PLSUBMONEYPAY_CODE = data.data[0].PLSUBMONEYPAY_CODE;
          this.dataFAdd.FACULTY_CODE = data.data[0].FACULTY_CODE;
          this.dataFAdd.PLPROJECT_CODE = data.data[0].PLPROJECT_CODE;
          this.dataFAdd.FNEXPENSES_NUMBOOK = data.data[0].FNEXPENSES_NUMBOOK;
          this.dataFAdd.FNEXPENSES_DEKA = data.data[0].FNEXPENSES_DEKA;
          this.dataFAdd.FNEXPENSES_STEP = data.data[0].FNEXPENSES_STEP;
          this.dataFAdd.FNEXPENSES_TITLE = data.data[0].FNEXPENSES_TITLE;
          this.dataFAdd.FNEXPENSES_CCDATE = data.data[0].FNEXPENSES_CCDATE;
          this.dataFAdd.FNCREDITOR_CODE = data.data[0].FNCREDITOR_CODE;
          this.dataFAdd.DEPARTMENT_CODE = data.data[0].DEPARTMENT_CODE;
          this.dataFAdd.SECTION_CODE = data.data[0].SECTION_CODE;
          this.dataFAdd.FNEXPENSES_OMONEY = this.numberWithCommas(parseFloat(data.data[0].FNEXPENSES_OMONEY).toFixed(2));
          this.dataFAdd.FNEXPENSES_AMONEY = this.numberWithCommas(parseFloat(data.data[0].FNEXPENSES_AMONEY).toFixed(2));
          this.dataFAdd.FNEXPENSES_CMONEY = this.numberWithCommas(parseFloat(data.data[0].FNEXPENSES_CMONEY).toFixed(2));
          this.dataFAdd.FNEXPENSES_RMONEY = this.numberWithCommas(parseFloat(data.data[0].FNEXPENSES_RMONEY).toFixed(2));
          this.dataFAdd.FNEXPENSES_CDATE = new Date(data.data[0].FNEXPENSES_CDATE);
          //console.log(data.data[0].FNEXPENSES_CDATE);
          if (data.data[0].FNEXPENSES_ADATE != null) {
            this.dataFAdd.FNEXPENSES_ADATE = new Date(data.data[0].FNEXPENSES_ADATE);
          } else {
            this.dataFAdd.FNEXPENSES_ADATE = '';
          }
          if (data.data[0].FNEXPENSES_CMDATE != null) {
            this.dataFAdd.FNEXPENSES_CMDATE = new Date(data.data[0].FNEXPENSES_CMDATE);
          } else {
            this.dataFAdd.FNEXPENSES_CMDATE = '';
          }
          if (data.data[0].FNEXPENSES_MDATE != null) {
            this.dataFAdd.FNEXPENSES_MDATE = new Date(data.data[0].FNEXPENSES_MDATE);
          } else {
            this.dataFAdd.FNEXPENSES_MDATE = '';
          }
          this.dataFAdd.FNEXPENSES_EXTEND = data.data[0].FNEXPENSES_EXTEND;
          this.dataAdd.PLMIDDLEBUDGET_CODE = data.data[0].PLMIDDLEBUDGET_CODE;
          //console.log(data.data[0].PLPROJECT_CODE);
          if (data.data[0].PLPROJECT_CODE == '') {
            this.dataFAdd.PLPROJECT_CODE1 = 0;
          } else {
            this.dataFAdd.PLPROJECT_CODE1 = 1;
          }
          if (this.dataFAdd.PLMONEYPAY_CODE1 == '26') {
            this.dataFAdd.PLMIDDLEBUDGET_CODE1 = 1;
          } else {
            this.dataFAdd.PLMIDDLEBUDGET_CODE1 = 0;
          }
          this.onFocused(data.data[0].FNCREDITOR_CODE, data.data[0].FNCREDITOR_NAME);
          //this.showdatapl(data.data[0].PLTRBUDGET_CODE);
          this.fetchdatalistfrm(data.data[0].FNEXPENSES_CODE);
          this.fetchdatalistfrc(data.data[0].FNEXPENSES_CODE);
          this.showdataplid(data.data[0].PLPROJECT_CODE);
          this.dataFAdd.FNEXACCCODE[0] = '';
          // console.log(data.data[0].PLTRBUDGET_CODE);
          //this.dataFAdd.FNEXACCMONEY[0] =100;this.numberWithCommas(Number(this.dataEfrc[i].FNEXACC_MONEY).toFixed(2));


        }

      });

  }
  //เปิดปิก input
  showDataelement() {
    return (this.element = true);
  }
  hideDataelement() {
    return (this.element = false);
  }
  showdataplid(val: any) {
    this.dataEpl = null;
    var varP = {
      "opt": "viewIDPLASSET",
      "id": val
    }
    //console.log(varP);
    this.dataAdd.htmlStringd = null;
    this.apiService
      .getdata(varP, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
       // this.dataEpl = data;
        this.dataAdd.htmlStringd = data[0].name;
        //console.log(data[0]);
      });
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
        // console.log(data);
      });
  }
  showdata() {
    var varP = {
      "opt": "viewFNCREDITOR",
      "search": ''
    }
    this.apiService
      .getdata(varP, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.datacomplete = data;
        // console.log(data);
      });
  }

  //ภาคเงิน
  fetchdatalistcr() {
    // console.log(2);
    this.dataAdd.opt = "viewCRPART";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataCrpart = data;
        this.dataAdd.CRPART_ID = data[0].CRPART_ID;
      });
  }
  //ภาคเงิน
  fetchdatalistcredit() {
    //console.log(1);
    this.dataFAdd.CRPART_ID = '';
    this.dataCrpart = null;
    this.dataFAdd.opt = "viewCRPARTedit";
    this.apiService
      .getdata(this.dataFAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataCrpart = data;
        
      });
  }
  //บัญชีแยกประเภท(ผูกพัน)
  fetchdatalistfrc(id: any) {
    var varP = {
      "opt": "viewFRC",
      "id": id
    }
    this.apiService
      .getdata(varP, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataEfrc = data;

        for (let i = 0; i < this.dataEfrc.length; i++) {
          this.dataFAdd.FNEXACCCODEC[i] = this.dataEfrc[i].FNEXACC_CODE;
          this.dataFAdd.FRACCCODEC[i] = this.dataEfrc[i].FRACC_CODE;
          this.dataFAdd.FRACCDATEC[i] = new Date(this.dataEfrc[i].FNEXACC_DATE);
          this.dataFAdd.FRACCDEKAC[i] = this.dataEfrc[i].FNEXACC_DEKA;
          this.dataFAdd.FNEXACC_TYPE1[i] = data[i].FNEXACC_TYPE;
          this.dataFAdd.FNEXACC_NUMBER1[i] = data[i].FNEXACC_NUMBER;
          this.dataFAdd.FNEXPENSES_PO[i] = data[i].FNEXPENSES_PO;
          this.dataFAdd.FNEXPENSES_DELIVERRY[i] = data[i].FNEXPENSES_DELIVERRY;
          //console.log(this.dataEfrc[i].FNEXACC_DATE);
          this.dataFAdd.FNEXACCMONEYC[i] = (parseFloat(this.dataEfrc[i].FNEXACC_MONEY).toFixed(2));
        }
      });
  }
  //บัญชีแยกประเภท(จ่ายจริง)
  fetchdatalistfrm(id: any) {
    this.dataFAdd.apstatus = [];
    var varP = {
      "opt": "viewFRM",
      "id": id
    }
    //console.log(varP);
    this.apiService
      .getdata(varP, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataEfrm = data;
        for (let i = 0; i < this.dataEfrm.length; i++) {
          this.dataFAdd.FNEXACCCODE[i] = this.dataEfrm[i].FNEXACC_CODE;
          this.dataFAdd.FRACCCODE[i] = this.dataEfrm[i].FRACC_CODE;
          this.dataFAdd.FNEXACCRDATE[i] = new Date(this.dataEfrm[i].FNEXACC_RDATE);
          this.dataFAdd.FNEXACCDEKA[i] = this.dataEfrm[i].FNEXACC_DEKA;
          this.dataFAdd.FNEXACC_TYPE[i] = data[i].FNEXACC_TYPE;
          this.dataFAdd.FNEXACC_NUMBER[i] = data[i].FNEXACC_NUMBER;
          this.dataFAdd.FNEXACC_CSTATUS[i] = this.dataEfrm[i].FNEXACC_CSTATUS;
          this.dataFAdd.FNEXACCMONEY[i] = (parseFloat(this.dataEfrm[i].FNEXACC_MONEY).toFixed(2));
          if (this.dataEfrm[i].FNEXACC_PSTATUS == '1' && this.dataAdd.PRIVILEGE_RSTATUS != 'A') {
            this.dataFAdd.apstatus[i] = true;
          } else {
            this.dataFAdd.apstatus[i] = null;
          }
        }
        //console.log(data.length);
      });
  }
  numberWithCommas(x: any) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
  //หลักสูตร
  fetchdatalistsubm() {
    this.dataESubplmoneypay = null;
    this.dataFAdd.opt = "viewSUBPLMONEYPAY";
    this.apiService
      .getdata(this.dataFAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataESubplmoneypay = data;
      });
  }
  //หลักสูตร
  fetchdatalistsub() {
    this.dataFAdd.opt = "viewSECTION";
    this.apiService
      .getdata(this.dataFAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataESection = data;
      });
  }
  //เช็คตัวเลข
  CheckNum(num: any) {
    if (num.keyCode < 46 || num.keyCode > 57) {
      alert('กรุณากรอกข้อมูล ที่เป็นตัวเลข');
      num.returnValue = false;
    }
  }
  //แก้ไขข้อมูล
  updatedata() {
    // Console.log(this.dataFAdd);
    // console.log(this.dataFAdd);
    this.dataFAdd.citizen = this.dataAdd.citizen;
    if (this.dataFAdd.PLMONEYPAY_CODE != '26' && (this.dataFAdd.FNEXPENSES_NUMBOOK == '' || this.dataFAdd.FNEXPENSES_CCDATE == ''
      || this.dataFAdd.FNEXPENSES_TITLE == '' || this.dataFAdd.FNEXPENSES_OMONEY == ''
      || this.dataFAdd.FNCREDITOR_CODE1 == '' || this.dataFAdd.DEPARTMENT_CODE == ''
      || this.dataFAdd.SECTION_CODE == '')) {
      if (this.dataFAdd.FNEXPENSES_EXTEND == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกเลขที่หนังสือ");
        //this.dataFAdd.FNEXPENSES_NUMBOOK.focus();
      }
      if (this.dataFAdd.FNEXPENSES_CCDATE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกวันที่ดำเนินการ");
        // this.dataFAdd.FNEXPENSES_CCDATE.focus();
      }
      if (this.dataFAdd.FNEXPENSES_TITLE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกชื่อเรื่อง/ชื่อโครงการ");
        //this.dataFAdd.FNEXPENSES_TITLE.focus();
      }
      if (this.dataFAdd.FNEXPENSES_OMONEY == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกขอเบิกเงินจำนวน");
        //this.dataFAdd.FNEXPENSES_OMONEY.focus();
      }
      if (this.dataFAdd.FNCREDITOR_CODE1 == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกเจ้าหนี้/ผู้ขอเบิก");
        //this.dataFAdd.FNCREDITOR_CODE.focus();
      }
      if (this.dataFAdd.DEPARTMENT_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกสาขา");
        //this.dataFAdd.DEPARTMENT_CODE.focus();
      }
      if (this.dataFAdd.SECTION_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกหลักสูตร");
        //this.dataFAdd.SECTION_CODE.focus();
      }
      if (this.dataFAdd.FNEXPENSES_NUMBOOK == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกเลขที่หนังสือ");
        //this.dataFAdd.SECTION_CODE.focus();
      }
    } else if (this.dataFAdd.PLMONEYPAY_CODE == '26' && this.dataFAdd.PLMIDDLEBUDGET_CODE == '') {
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกขอใช้งบกลาง");
      this.dataFAdd.PLMIDDLEBUDGET_CODE.focus();
    } else {
      // console.log((this.dataAdd.FNEXPENSES_CDATE));
      this.dataFAdd.FNEXPENSES_CDATE1 = this.datenow(this.dataFAdd.FNEXPENSES_CDATE);
      if (this.dataFAdd.FNEXPENSES_ADATE == '') {
        this.dataFAdd.FNEXPENSES_ADATE1 = '';
      } else {
        this.dataFAdd.FNEXPENSES_ADATE1 = this.datenow(this.dataFAdd.FNEXPENSES_ADATE);
      }
      if (this.dataFAdd.FNEXPENSES_CMDATE == '') {
        this.dataFAdd.FNEXPENSES_CMDATE1 = '';
      } else {
        this.dataFAdd.FNEXPENSES_CMDATE1 = this.datenow(this.dataFAdd.FNEXPENSES_CMDATE);
      }
      if (this.dataFAdd.FNEXPENSES_MDATE == '') {
        this.dataFAdd.FNEXPENSES_MDATE1 = '';
      } else {
        this.dataFAdd.FNEXPENSES_MDATE1 = this.datenow(this.dataFAdd.FNEXPENSES_MDATE);
      }

      for (let i = 0; i < this.dataFAdd.FNEXACCRDATE.length; i++) {
        if (parseFloat(this.dataFAdd.FNEXACCMONEY[i]) > 0 || parseFloat(this.dataFAdd.FNEXACCMONEY[i]) < 0 ) {
          // console.log(this.dataFAdd.FNEXACCMONEY[i]+'..'+this.datenow(this.dataFAdd.FNEXACCRDATE[i]));
          this.dataFAdd.FNEXACC_RDATE1[i] = this.datenow(this.dataFAdd.FNEXACCRDATE[i]);
        }
      }
      for (let i = 0; i < this.dataFAdd.FRACCDATEC.length; i++) {
        if (parseFloat(this.dataFAdd.FNEXACCMONEYC[i]) > 0 ) {
          // console.log(this.dataFAdd.FNEXACCMONEY[i]+'..'+this.datenow(this.dataFAdd.FNEXACCRDATE[i]));
          this.dataFAdd.FNEXACC_DATE1[i] = this.datenow(this.dataFAdd.FRACCDATEC[i]);
        }
      }
      //console.log(this.dataFAdd.FNEXACCMONEY.length);
      if (this.dataFAdd.PLPROJECT_CODE == '') {
        this.dataFAdd.PLPROJECT_CODE1 = 0;
      } else {
        this.dataFAdd.PLPROJECT_CODE1 = 1;
      }
      this.dataFAdd.opt = "update";
      this.apiService
        .getdata(this.dataFAdd, this.url)
        .pipe(first())
        .subscribe((data: any) => {
          if (data.status == 1) {
            this.datalistdetail = null;
            this.toastr.success("แจ้งเตือน:แก้ข้อมูลเรียบร้อยแล้ว");
            this.fetchdatalist();
            document.getElementById("ModalClose")?.click();
          } else {
            this.datalistdetail = null;
            this.toastr.warning("แจ้งเตือน:ไม่สามารถแก้ไขข้อมูลได้ เพราะไม่ยอดเงินจัดสรร");
          }
        });
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
        Swal.fire('ลบข้อมูล!', 'ลบข้อมูลเรียบร้อยแล้ว', 'success');
        this.datalistdetail = null;
        this.dataAdd.id = id;
        this.dataAdd.opt = "delete";
        this.apiService
          .getdata(this.dataAdd, this.url)
          .pipe(first())
          .subscribe((data: any) => {
            if (data.status == 1) {
              this.fetchdatalist();
              // console.log(data.status);
            }
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('ยกเลิก', 'ยกเลิกการลบข้อมูล', 'error');
      }
    });

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
