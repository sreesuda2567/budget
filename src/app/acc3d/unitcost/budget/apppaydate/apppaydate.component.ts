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
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-apppaydate',
  templateUrl: './apppaydate.component.html',
  styleUrls: ['./apppaydate.component.scss']
})
export class ApppaydateComponent implements OnInit {
  title = 'angular-app';
  fileName = 'report.xlsx';
  userList = [{}]

  dataYear: any;
  dataCam: any;
  datalist: any;
  loading: any;
  loadingdetail: any;
  dataAdd: any = { check: [], FNEXACC_CODE: [], FNEXACC_DETAIL: [], USERNAME_CISCO: [] };
  clickshow: any;
  datalistdetailmoney: any;
  searchTerm: any;
  show: any;
  dataFac: any;
  dataCrpart: any;
  dataPro: any;
  datarstatus: any;
  dataIncome: any;
  dataSubplmoneypay: any;
  dataPlmoneypay: any;
  numrow: any;
  locale = 'th-be';
  locales = listLocales();
  Momoney = 0;
  Mamoney = 0;
  Mcmoney = 0;
  Mrmoney = 0;
  rownum: any;
  htmlStringd: any;
  url = "/acc3d/unitcost/manage/apppaydate.php";
  url1 = "/acc3d/unitcost/userpermission.php";
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
    this.fetchdata();
    this.dataAdd.citizen = this.tokenStorage.getUser().citizen;
    this.dataAdd.date_type = 'FNEXPENSES_DATE';
    this.dataAdd.PLSUBMONEYPAY_CODE = '';
    this.dataAdd.DATENOWS = new Date();
    this.dataAdd.DATENOWT = new Date();
    this.dataAdd.FNEXPENSES_STEP = '';
    this.dataAdd.FNEXACCTD_NOTE = '';
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
            //คณะ/หน่วยงาน
            var Tablesub = {
              "opt": "viewfac",
              "CAMPUS_CODE": datacam[0].CAMPUS_CODE
            }
            // console.log(Tablesub);
            this.apiService
              .getdata(Tablesub, this.url1)
              .pipe(first())
              .subscribe((dataf: any) => {
                this.dataFac = dataf;
                this.dataAdd.FACULTY_CODE = '';
              });

          });
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
        var Tablesub = {
          "opt": "viewproy",
          "FACULTY_CODE": "",
          "PLYEARBUDGET_CODE": data[0].PLYEARBUDGET_CODE
        }
        // console.log(Tablesub);
        this.apiService
          .getdata(Tablesub, this.url1)
          .pipe(first())
          .subscribe((data: any) => {
            this.dataPro = data;
            this.dataAdd.PLPRODUCT_CODE = '';
          });
        //รายการภาค
        var Table2 = {
          "opt": "viewcrpart",
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
        //รายการงบ
        var Table = {
          "opt": "viewPLMONEYPAY",
          "PLYEARBUDGET_CODE": data[0].PLYEARBUDGET_CODE
        }
        this.apiService
          .getdata(Table, this.url1)
          .pipe(first())
          .subscribe((data: any) => {
            this.dataPlmoneypay = data;
            this.dataAdd.PLMONEYPAY_CODE = '';
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
        this.dataAdd.PLINCOME_CODE = data[0].PLINCOME_CODE;
        // console.log(data[0].PLINCOME_CODE);
      });
  }
  fetchdataCam() {
    this.dataFac = null;
    this.dataAdd.opt = "viewfac";
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
    this.dataAdd.check = [];
    this.dataAdd.FNEXACC_CODE = [];
    this.dataAdd.FNEXACC_DETAIL = [];
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
          this.dataAdd.CAMPUS_NAME = data.CAMPUS_NAME;
          this.dataAdd.PLINCOME_NAME = data.PLINCOME_NAME;

          this.loading = null;
          this.rownum = 1;
         // this.fetchdataSubplmoneypay();
          //this.showdata();  
          for (let i = 0; i < this.datalist.length; i++) {
            this.dataAdd.FNEXACC_CODE[i] = this.datalist[i].FNEXACC_CODE;
            this.dataAdd.FNEXACC_DETAIL[i] = 'เลข 3 ดี:' + this.datalist[i].FNEXPENSES_STEP + ' ' + this.datalist[i].FACULTY_TNAME;
            this.dataAdd.USERNAME_CISCO[i] = this.datalist[i].USERNAME_CISCO;
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
  submitData(status: any) {
    this.loading = true;
    this.dataAdd.opt = 'UPDATE';
    this.dataAdd.STATUS = status;
    let num = 0;
    for (let i = 0; i < this.dataAdd.check.length; i++) {
      if (this.dataAdd.check[i] == true) {
        num = 1;
        //console.log(this.dataAdd.check[i]);
      }
    }
    //console.log(this.dataAdd.check);
    if (num == 0) {
      this.loading = null;
      this.toastr.warning("แจ้งเตือน:ยังไม่ได้เลือกข้อมูลรายการที่อนุมัติ");
    } else {
      this.apiService
        .getdata(this.dataAdd, this.url)
        .pipe(first())
        .subscribe(
          (data: any) => {
            if (data.status == '1') {
              this.loading = null;
              this.toastr.success("แจ้งเตือน:อนุมัติข้อมูลเรียบร้อย ");
              this.fetchdatalist();
            }
          });
    }
  }
  returnData(status: any) {
    if (this.dataAdd.FNEXACCTD_NOTE == '') {
      this.toastr.warning("แจ้งเตือน:กรุณากรอกหมายเหตุ");
    } else {
      this.loadingdetail = true;
      this.dataAdd.opt = 'RETURN';
      this.dataAdd.STATUS = status;
      let num = 0;
      for (let i = 0; i < this.dataAdd.check.length; i++) {
        if (this.dataAdd.check[i] == true) {
          num = 1;
          //console.log(this.dataAdd.check[i]);
        }
      }
      //console.log(this.dataAdd.check);
      if (num == 0) {
        this.loadingdetail = null;
        this.toastr.warning("แจ้งเตือน:ยังไม่ได้เลือกข้อมูลรายการที่ส่งคืน");
      } else {
        this.apiService
          .getdata(this.dataAdd, this.url)
          .pipe(first())
          .subscribe(
            (data: any) => {
              if (data.status == '1') {
                this.loadingdetail = null;
                this.fetchdatalist();
                this.toastr.success("แจ้งเตือน:ส่งคืนข้อมูลเรียบร้อย ");
                document.getElementById("ModalClose")?.click();
              }
            });
      }
    }
  }
  checkall() {
    if (this.dataAdd.checkall == true) {
      for (let i = 0; i < this.datalist.length; i++) {
        this.dataAdd.check[i] = false;
      }
    } else {
      for (let i = 0; i < this.datalist.length; i++) {
        this.dataAdd.check[i] = true;
      }
    }
  }
  // ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
  editdata(id: any, name: any) {
    console.log(id);
    this.setshowbti();
    //this.dataAdd.MAINPROGRAM_CODE = name;
    this.htmlStringd = name;
    this.apiService
      .getById(id, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataAdd.FNEXACCPAYDATE_CODE = data[0].FNEXACCPAYDATE_CODE;
        this.dataAdd.FNEXACCPAYDATE_NUMBER = data[0].FNEXACCPAYDATE_NUMBER;
        this.dataAdd.FNEXACCPAYDATE_NOTE = data[0].FNEXACCPAYDATE_NOTE;
        this.dataAdd.FNEXACCPAYDATE_TYPE = data[0].FNEXACCPAYDATE_TYPE;
        this.dataAdd.FNEXACCPAYDATE_MONEY = this.numberWithCommas(parseFloat(data[0].FNEXACCPAYDATE_MONEY).toFixed(2));
        this.dataAdd.DATENOWP = new Date(data[0].FNEXACCPAYDATE_DATEPD);

      });
  }
  updatedata() {
    if ((this.dataAdd.FNEXACCPAYDATE_NUMBER == '' || this.dataAdd.FNEXACCPAYDATE_MONEY == '')) {
      if (this.dataAdd.FNEXACCPAYDATE_NUMBER == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกเลขเอกสาร");
      }
      if (this.dataAdd.FNEXACCPAYDATE_MONEY == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกจำนวนเงิน");
      }

    } else {
      this.dataAdd.DATENOWP1 = this.datenow(this.dataAdd.DATENOWP);
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
  setshowbti() {
    this.dataAdd.FNEXACCPAYDATE_NUMBER = '';
    this.dataAdd.FNEXACCPAYDATE_NOTE = '';
    this.dataAdd.DATENOWP = new Date();
  }
  CheckNum(num: any) {
    //console.log(num.keyCode); 
    if (num.keyCode < 46 || num.keyCode > 57) {
      alert('กรุณากรอกข้อมูล ที่เป็นตัวเลข');
      num.returnValue = false;
    }
  }
  numberWithCommas(x: any) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
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
