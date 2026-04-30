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
  selector: 'app-poday',
  templateUrl: './poday.component.html',
  styleUrls: ['./poday.component.scss']
})
export class PodayComponent implements OnInit {
 title = 'angular-app';
  fileName = 'report.xlsx';
  userList = [{}]

  dataYear: any;
  dataCam: any;
  datalist: any;
  loading: any;
  loadingdetail: any;
  dataAdd: any = { check: [], FNEXACC_CODE: [], FNEXPENSES_CODE: [], USERNAME_CISCO: [], FNEXACC_DETAIL: [] };
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
  url = "/acc3d/budget/approve/poday.php";
  url1 = "/acc3d/budget/userpermission.php";
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
    this.fetchdata();
    this.dataAdd.citizen = this.tokenStorage.getUser().citizen;
    this.dataAdd.PLSUBMONEYPAY_CODE = '';
    this.dataAdd.DATENOWS = new Date();
    this.dataAdd.DATENOWT = new Date();
    this.dataAdd.FNEXPENSES_STEP = '';
    this.dataAdd.FACULTY_CODE = '';
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
            //รายการปี
    var Tabley = {
      "opt": "viewyear"
    }
    this.apiService
      .getdata(Tabley, this.url1)
      .pipe(first())
      .subscribe((dataY: any) => {
        this.dataYear = dataY;
        this.dataAdd.PLYEARBUDGET_CODE = dataY[0].PLYEARBUDGET_CODE;
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
            this.fetchdatalist();
          });
         
        });
      });



  }
  fetchdataCam(){
    // console.log(1);
     this.dataFac=null;
     this.dataAdd.opt = "viewcfac";
     this.apiService
     .getdata(this.dataAdd,this.url1)
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
    this.dataAdd.FNEXPENSES_CODE = [];
    this.dataAdd.USERNAME_CISCO = [];
    this.dataAdd.FNEXACC_DETAIL = [];
    this.applyLocale('thBeLocale');
    this.dataAdd.DATENOWS1 = this.datenow(this.dataAdd.DATENOWS);
    this.dataAdd.DATENOWT2=this.datenow(this.dataAdd.DATENOWT);
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
          //this.fetchdataSubplmoneypay();
          //this.showdata();  
          for (let i = 0; i < this.datalist.length; i++) {
            this.dataAdd.FNEXACC_CODE[i] = this.datalist[i].FNEXACC_CODE;
            this.dataAdd.FNEXPENSES_CODE[i] = this.datalist[i].FNEXPENSES_CODE;
            this.dataAdd.USERNAME_CISCO[i] = this.datalist[i].USERNAME_CISCO;
            this.dataAdd.FNEXACC_DETAIL[i] = 'หน่วยงาน :'+this.datalist[i].FACULTY_TNAME+' เลข 3ดี :'+this.datalist[i].FNEXPENSES_STEP;
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
  clearvalue(){
    this.dataAdd.FNEXACCTD_NOTE = '';
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
