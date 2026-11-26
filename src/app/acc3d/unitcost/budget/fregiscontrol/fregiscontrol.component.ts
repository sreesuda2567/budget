import { Component, OnInit, ElementRef, HostListener, ViewChild, AfterViewInit, OnDestroy, AfterViewChecked } from '@angular/core';
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
import * as XLSX from 'xlsx-js-style';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fregiscontrol',
  templateUrl: './fregiscontrol.component.html',
  styleUrls: ['./fregiscontrol.component.scss']
})
export class FregiscontrolComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  @ViewChild('topScrollContainer') topScrollContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('tableContainer') tableContainer!: ElementRef<HTMLDivElement>;

  private isSyncingScroll: boolean = false;
  private resizeObserver?: ResizeObserver;
  tableScrollWidth: number = 3300;

  title = 'angular-app';
  fileName = 'report.xlsx';
  userList = [{}]

  dataYear: any;
  dataCam: any;
  datalist: any;
  datalistapp: any;
  loading: any;
  loadingdetail: any;
  dataAdd: any = { check: [], FNEXACCPAYDATE_CODE: [], FNCREDITOR_NAME: [], FNEXPENSES_TITLE: [], MONEY: [], FNEXPENSES_PDATE: [], FNEXPENSES_PODATE: [], FNEXPENSES_PO: [], FNEXPENSES_DELIVERRY: [], FNEXPENSES_ORDER: [], FNEXACC_TYPE: [], FNEXACC_NUMBER: [] };
  get totalAmount(): number {
    if (!this.datalist) return 0;
    return this.datalist.reduce((sum: number, item: any, index: number) => {
      if (this.dataAdd.check[index]) {
        const amountStr = this.dataAdd.MONEY[index] ? this.dataAdd.MONEY[index].toString().replace(/,/g, '') : '0';
        return sum + (Number(amountStr) || 0);
      }
      return sum;
    }, 0);
  }
  isAllChecked(): boolean {
    if (!this.datalist || this.datalist.length === 0) return false;
    return this.datalist.every((_: any, index: number) => !!this.dataAdd.check[index]);
  }
  toggleCheckAll(event: any): void {
    const isChecked = event.target.checked;
    if (!this.datalist) return;
    this.datalist.forEach((_: any, index: number) => {
      this.dataAdd.check[index] = isChecked;
    });
  }
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
  rownum1: any;
  rowpbi: any;
  rowpbu: any;
  page = 1;
  count = 0;
  number = 0;
  tableSize = 20;
  tableSizes = [20, 30, 40];
  htmlStringd: any;
  dataType: any;
  url = "/acc3d/unitcost/manage/fregiscontrol.php";
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
    this.dataAdd.FNEXACCPAYDATE_NUMBER = '';
    this.dataAdd.FNEXACCPAYDATE_NOTE = '';
    this.dataAdd.FNEXPENSES_STEP = '';
    this.rownum1 = 1;
    this.applyLocale('thBeLocale');
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
    if (this.dataAdd.DATENOWS != '') {
      // this.applyLocale('thBeLocale');
      this.dataAdd.DATENOWS1 = this.datenow(this.dataAdd.DATENOWS);
      this.dataAdd.DATENOWT2 = this.datenow(this.dataAdd.DATENOWT);
    } else {
      this.dataAdd.DATENOWS1 = '';
      this.dataAdd.DATENOWT2 = '';
      //console.log(this.dataAdd.DATENOWS);  
    }
    this.loading = true;
    this.datalist = null;
    this.dataAdd.opt = "readAll";
    this.rownum1 = null;
    this.rownum = null;
    this.dataAdd.FNCREDITOR_NAME = [];
    this.dataAdd.FNEXPENSES_TITLE = [];
    this.dataAdd.FNEXACCPAYDATE_CODE = [];
    this.dataAdd.FNEXPENSES_PDATE = [];
   // this.dataAdd.FNEXPENSES_PDATE = [];
    this.dataAdd.FNEXPENSES_PO = [];
    this.dataAdd.FNEXPENSES_DELIVERRY = [];
    this.dataAdd.FNEXPENSES_ORDER = [];
    this.dataAdd.FNEXACC_TYPE = [];
    this.dataAdd.FNEXACC_NUMBER = [];
    this.dataAdd.MONEY = [];
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == '1') {
          this.datalist = data.data;
          this.dataAdd.CAMPUS_NAME = data.CAMPUS_NAME;
          this.dataAdd.PLINCOME_NAME = data.PLINCOME_NAME;

          this.loading = null;
          this.rownum1 = 1;
          setTimeout(() => {
            this.resetScroll();
            this.updateScrollWidth();
          }, 50);
          //this.fetchdataSubplmoneypay();
          //this.showdata();  
          for (let i = 0; i < this.datalist.length; i++) {
            this.dataAdd.FNCREDITOR_NAME[i] = this.datalist[i].FNCREDITOR_NAME;
            this.dataAdd.FNEXPENSES_TITLE[i] = this.datalist[i].FNEXPENSES_TITLE;
            this.dataAdd.FNEXACCPAYDATE_CODE[i] = this.datalist[i].FNEXACCPAYDATE_CODE;
            this.dataAdd.FNEXPENSES_PDATE[i] = this.datalist[i].FNEXPENSES_PDATE;
            this.dataAdd.FNEXPENSES_PODATE[i] = this.datalist[i].FNEXPENSES_PODATE;
            this.dataAdd.FNEXPENSES_PO[i] = this.datalist[i].FNEXPENSES_PO;
            this.dataAdd.FNEXPENSES_DELIVERRY[i] = this.datalist[i].FNEXPENSES_DELIVERRY;
            this.dataAdd.FNEXPENSES_ORDER[i] = this.datalist[i].FNEXPENSES_ORDER;
            this.dataAdd.FNEXACC_TYPE[i] = this.datalist[i].FNEXACC_TYPE;
            this.dataAdd.FNEXACC_NUMBER[i] = this.datalist[i].FNEXACC_NUMBER;
            this.dataAdd.MONEY[i] = this.numberWithCommas(parseFloat(this.datalist[i].FNEXPENSES_RMONEY).toFixed(2));
            this.dataAdd.check[i] = false;
          }
        } else {
          this.rownum1 = null;
          this.loading = null;
          this.datalist = data.data;
          this.dataAdd.FNEXPENSES_STEP = null;
          this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
        }
      });
  }
  fetchdatalistapp() {
    // console.log(1);
    this.loading = true;
    if (this.dataAdd.DATENOWS != '') {
      // this.applyLocale('thBeLocale');
      this.dataAdd.DATENOWS1 = this.datenow(this.dataAdd.DATENOWS);
      this.dataAdd.DATENOWT2 = this.datenow(this.dataAdd.DATENOWT);
    } else {
      this.dataAdd.DATENOWS1 = '';
      this.dataAdd.DATENOWT2 = '';
      //console.log(this.dataAdd.DATENOWS);  
    }
    this.loading = true;
    this.datalistapp = null;
    this.rownum = null;
    this.rownum1 = null;
    this.dataAdd.opt = "readapp";
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == '1') {
          this.datalistapp = data.data;
          // this.dataAdd.CAMPUS_NAME=data.CAMPUS_NAME;
          // this.dataAdd.PLINCOME_NAME=data.PLINCOME_NAME;

          this.loading = null;
          this.rownum = 1;
          setTimeout(() => {
            this.resetScroll();
            this.updateScrollWidth();
          }, 50);
        } else {
          this.rownum = null;
          this.loading = null;
          this.datalistapp = data.data;
          this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
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
  updatedata() {
    if (this.dataAdd.FNEXACREGIS_VOUCHER == '' || this.dataAdd.FNEXACREGIS_RECEIPT == ''
      || this.dataAdd.FNEXACREGIS_TAX == '' || this.dataAdd.FNEXACREGIS_FINE == '') {
      if (this.dataAdd.FNEXACREGIS_VOUCHER == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกเลขที่ใบสำคัญ");
      }
      if (this.dataAdd.FNEXACREGIS_RECEIPT == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกเลขเลขที่ใบเสร็จ");
      }
      /* if (this.dataAdd.FNEXACREGIS_DELIVERRY1 == '') {
         this.toastr.warning("แจ้งเตือน:กรุณากรอกเลขเลขที่ใบส่งของ");
       }
       if (this.dataAdd.FNEXACREGIS_ORDER1 == '') {
         this.toastr.warning("แจ้งเตือน:กรุณากรอกเลขเลขที่ใบสั่งซื้อ");
       }*/
      if (this.dataAdd.FNEXACREGIS_TAX == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกภาษี");
      }
      if (this.dataAdd.FNEXACREGIS_FINE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกค่าปรับ");
      }
    } else {

      this.dataAdd.opt = "update";
      if (this.dataAdd.DATENOWP != '' && this.dataAdd.DATENOWP != null) {
        this.dataAdd.DATENOWP1 = this.datenow(this.dataAdd.DATENOWP);
      } else {
        this.dataAdd.DATENOWP1 = '';
      }
      if (this.dataAdd.FNEXACREGIS_PDATE != '' && this.dataAdd.FNEXACREGIS_PDATE != null) {
        this.dataAdd.FNEXACREGIS_PDATE1 = this.datenow(this.dataAdd.FNEXACREGIS_PDATE);
      } else {
        this.dataAdd.FNEXACREGIS_PDATE1 = '';
      }
      this.apiService
        .getupdate(this.dataAdd, this.url)
        .pipe(first())
        .subscribe((data: any) => {
          //console.log(data.status);       
          if (data.status == 1) {

            //this.fetchdatalist();
            this.toastr.success("แจ้งเตือน:แก้ไขข้อมูลเรียบร้อยแล้ว");
            this.fetchdatalistapp();
            document.getElementById("ModalClose")?.click();
          }
        });
    }
  }
  insertdata() {
    let num = 0;
    for (let i = 0; i < this.dataAdd.check.length; i++) {
      if (this.dataAdd.check[i] == true) {
        num = 1;
        //console.log(this.dataAdd.check[i]);
      }
    }
    if (this.dataAdd.FNEXACREGIS_DOC == '' || this.dataAdd.FNEXACREGIS_VOUCHER == '' || this.dataAdd.FNEXACREGIS_RECEIPT == ''
      || this.dataAdd.FNEXACREGIS_DELIVERRY == '' || this.dataAdd.FNEXACREGIS_ORDER == '' || this.dataAdd.FNEXACREGIS_INSPEC == ''
      /*|| this.dataAdd.FNEXACREGIS_TAX == '' || this.dataAdd.FNEXACREGIS_FINE == ''*/) {
      if (this.dataAdd.FNEXACREGIS_DOC == '' || num == 0) {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกเลขเอกสาร");
      }
      if (this.dataAdd.FNEXACREGIS_VOUCHER == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกเลขที่ใบสำคัญ");
      }
      if (this.dataAdd.FNEXACREGIS_RECEIPT == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกเลขเลขที่ใบเสร็จ");
      }
      if (this.dataAdd.FNEXACREGIS_DELIVERRY == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกเลขเลขที่ใบส่งของ");
      }
      if (this.dataAdd.FNEXACREGIS_ORDER == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกเลขเลขที่ใบสั่งซื้อ");
      }
      if (this.dataAdd.FNEXACREGIS_INSPEC == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกเลขที่เอกสารตรวจรับ");
      }
      /*if (this.dataAdd.FNEXACREGIS_TAX == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกภาษี");
      }
      if (this.dataAdd.FNEXACREGIS_FINE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกค่าปรับ");
      }*/
      if (num == 0) {
        this.loadingdetail = null;
        this.toastr.warning("แจ้งเตือน:ยังไม่ได้เลือกข้อมูลรายการลงวันที่จ่าย");
      }
    } else {
      this.loadingdetail = true;
      this.dataAdd.opt = 'insert';
      // this.applyLocale('thBeLocale');
      if (this.dataAdd.DATENOWP != '' && this.dataAdd.DATENOWP != null) {
        this.dataAdd.DATENOWP1 = this.datenow(this.dataAdd.DATENOWP);
      } else {
        this.dataAdd.DATENOWP1 = '';
      }
      if (this.dataAdd.FNEXACREGIS_PDATE != '' && this.dataAdd.FNEXACREGIS_PDATE != null) {
        this.dataAdd.FNEXACREGIS_PDATE1 = this.datenow(this.dataAdd.FNEXACREGIS_PDATE);
      } else {
        this.dataAdd.FNEXACREGIS_PDATE1 = '';
      }
      this.apiService
        .getdata(this.dataAdd, this.url)
        .pipe(first())
        .subscribe(
          (data: any) => {
            if (data.status == '1') {
              this.loadingdetail = null;
              this.dataAdd.FNEXPENSES_STEP = '';
              this.fetchdatalist();
              //  this.fetchdatalistapp();
              this.toastr.success("แจ้งเตือน:บันทึกข้อมูลเรียบร้อย ");
              document.getElementById("ModalClose")?.click();
              //this.clickshow = null;

            }
          });
    }

  }
  showinput() {
    this.rowpbi = 1;
    this.rowpbu = '';
    this.setshowbti();
  }
  showsec() {

    this.clickshow = true;
    this.setshowbti();
    for (let i = 0; i < this.dataAdd.check.length; i++) {

      if (this.dataAdd.check[i] == true) {
        //console.log(this.dataAdd.FNEXPENSES_TITLE[i]);
        this.dataAdd.FNEXACREGIS_PAYEE = this.dataAdd.FNCREDITOR_NAME[i];
        this.dataAdd.FNEXACREGIS_NOTE = this.dataAdd.FNEXPENSES_TITLE[i];
        this.dataAdd.FNEXACREGIS_TYPE = this.dataAdd.FNEXACC_TYPE[i];
        this.dataAdd.FNEXACREGIS_DOC = this.dataAdd.FNEXACC_NUMBER[i];

        if (this.dataAdd.FNEXPENSES_PDATE[i] != null) {
          if (this.dataAdd.FNEXACREGIS_TYPE != 'BE' && this.dataAdd.FNEXACREGIS_TYPE != 'BD' && this.dataAdd.FNEXACREGIS_TYPE != 'G1' && this.dataAdd.FNEXACREGIS_TYPE != 'JV' && this.dataAdd.FNEXACREGIS_TYPE != 'K1'&& this.dataAdd.FNEXACREGIS_TYPE != 'KN') {
            this.dataAdd.DATENOWP = new Date(this.dataAdd.FNEXPENSES_PODATE [i]);
          }
          if (this.dataAdd.FNEXACREGIS_TYPE == 'KH' || this.dataAdd.FNEXACREGIS_TYPE == 'KG') {
            this.dataAdd.FNEXACREGIS_PDATE = new Date(this.dataAdd.FNEXPENSES_PDATE[i]);
          }
          this.dataAdd.FNEXACREGIS_INSPEC = this.dataAdd.FNEXPENSES_ORDER[i];
          this.dataAdd.FNEXACREGIS_DELIVERRY = this.dataAdd.FNEXPENSES_DELIVERRY[i];
          this.dataAdd.FNEXACREGIS_ORDER = this.dataAdd.FNEXPENSES_PO[i];
        } else {
          this.dataAdd.FNEXACREGIS_INSPEC = '-';
          this.dataAdd.FNEXACREGIS_DELIVERRY = '-';
          this.dataAdd.FNEXACREGIS_ORDER = '-';
        }


      }
    }
  }
  fetchclose() {
    this.clickshow = null;
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
              this.fetchdatalistapp();
            }
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('ยกเลิก', 'ยกเลิกการลบข้อมูล', 'error');
      }
    });
  }
  // ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
  editdata(id: any, name: any) {
    this.setshowbti();
    // this.dataAdd.id = id;
    this.htmlStringd = name;
    //console.log(id);
    this.apiService
      .getById(id, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataAdd.FNEXACCPAYDATE_CODE = data[0].FNEXACCPAYDATE_CODE;
        this.dataAdd.FNEXACREGIS_VOUCHER = data[0].FNEXACREGIS_VOUCHER;
        this.dataAdd.FNEXACREGIS_RECEIPT = data[0].FNEXACREGIS_RECEIPT;
        this.dataAdd.FNEXACREGIS_DELIVERRY = data[0].FNEXACREGIS_DELIVERRY;
        this.dataAdd.FNEXACREGIS_ORDER = data[0].FNEXACREGIS_ORDER;
        this.dataAdd.FNEXACREGIS_INSPEC = data[0].FNEXACREGIS_INSPEC;
        this.dataAdd.FNEXACREGIS_DOC = data[0].FNEXACREGIS_DOC;
        this.dataAdd.FNEXACREGIS_TYPE = data[0].FNEXACREGIS_TYPE;
        this.dataAdd.FNEXACREGIS_TAX = this.numberWithCommas(parseFloat(data[0].FNEXACREGIS_TAX).toFixed(2));//data[0].FNEXACREGIS_TAX;
        this.dataAdd.FNEXACREGIS_FINE = this.numberWithCommas(parseFloat(data[0].FNEXACREGIS_FINE).toFixed(2));//data[0].FNEXACREGIS_FINE;
        this.dataAdd.FNEXACREGIS_NOTE = data[0].FNEXACREGIS_NOTE;
        this.dataAdd.FNEXACREGIS_OTHER = data[0].FNEXACREGIS_OTHER;
        this.dataAdd.FNEXACREGIS_CODE = data[0].FNEXACREGIS_CODE;
        this.dataAdd.FNEXACREGIS_PAYEE = data[0].FNEXACREGIS_PAYEE;
        this.dataAdd.FNEXACREGIS_MONEY = this.numberWithCommas(parseFloat(data[0].FNEXACREGIS_MONEY).toFixed(2));
        // this.dataAdd.FNEXACCPAYDATE_MONEY= this.numberWithCommas(parseFloat(data[0].FNEXACCPAYDATE_MONEY).toFixed(2));
        if (data[0].FNEXACREGIS_DINSPEC != null) {
          this.dataAdd.DATENOWP = new Date(data[0].FNEXACREGIS_DINSPEC);
        } else {
          this.dataAdd.DATENOWP = '';
        }
        if (data[0].FNEXACREGIS_PDATE != null) {
          this.dataAdd.FNEXACREGIS_PDATE =new Date(data[0].FNEXACREGIS_PDATE);
        } else {
          this.dataAdd.FNEXACREGIS_PDATE = '';
        }
        // this.dataAdd.numb = data[0].FNEXACREGIS_DOC;

      });
    this.rowpbi = null;
    this.rowpbu = true;
  }

  setshowbti() {
    // this.dataAdd.FNEXACCPAYDATE_CODE = '';
    this.dataAdd.FNEXPENSES_STEP = '';
    this.dataAdd.FNEXACREGIS_VOUCHER = '';
    this.dataAdd.FNEXACREGIS_RECEIPT = '';
    this.dataAdd.FNEXACREGIS_DELIVERRY = '';
    this.dataAdd.FNEXACREGIS_ORDER = '';
    this.dataAdd.FNEXACREGIS_TAX = 0;
    this.dataAdd.FNEXACREGIS_FINE = 0;
    this.dataAdd.FNEXACREGIS_NOTE = '';
    this.dataAdd.FNEXACREGIS_OTHER = '';
    this.dataAdd.FNEXACREGIS_PAYEE = '';
    this.dataAdd.DATENOWP = '';
    this.dataAdd.FNEXACREGIS_PDATE = '';
    this.dataAdd.FNEXACREGIS_INSPEC = '';
    this.dataAdd.FNEXACREGIS_DOC = '';
  }
  exportexcel(): void {
    const tableEl = document.getElementById('excel-table');
    if (!tableEl) {
      this.toastr.warning("ไม่พบตารางข้อมูลสำหรับส่งออก");
      return;
    }

    // โคลนตารางเพื่อตัดคอลัมน์จัดการข้อมูล / Checkbox และดึงค่าจาก input ออกมาเป็นข้อความ
    const clonedTable = tableEl.cloneNode(true) as HTMLTableElement;

    // แทนที่ input ในตารางด้วยค่า value จริง
    clonedTable.querySelectorAll('input').forEach((input: HTMLInputElement) => {
      if (input.type === 'text' || input.type === 'number') {
        const textNode = document.createTextNode(input.value || '');
        input.parentNode?.replaceChild(textNode, input);
      }
    });

    // ตัดคอลัมน์ที่ไม่จำเป็นใน Excel ออก (เช่น จัดการข้อมูล, เลือก)
    const thead = clonedTable.querySelector('thead');
    if (thead) {
      const headerRow = thead.querySelector('tr');
      if (headerRow) {
        const ths = Array.from(headerRow.querySelectorAll('th'));
        const removeIndices: number[] = [];
        ths.forEach((th, idx) => {
          const txt = th.innerText.trim();
          if (txt.includes('จัดการข้อมูล') || txt === 'เลือก' || txt.includes('เลือก')) {
            removeIndices.push(idx);
          }
        });

        // ลบจากขวาไปซ้ายเพื่อไม่ให้ index เคลื่อน
        removeIndices.sort((a, b) => b - a).forEach(colIdx => {
          headerRow.children[colIdx]?.remove();
          clonedTable.querySelectorAll('tbody tr').forEach(row => {
            row.children[colIdx]?.remove();
          });
        });
      }
    }

    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(clonedTable, { raw: false });
    if (!ws || !ws['!ref']) {
      this.toastr.warning("ไม่มีข้อมูลสำหรับส่งออก");
      return;
    }

    const range = XLSX.utils.decode_range(ws['!ref']);

    // คำนวณความกว้างคอลัมน์อัตโนมัติ
    const colWidths: { wch: number }[] = [];
    for (let C = range.s.c; C <= range.e.c; ++C) {
      let maxWidth = 10;
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const cell = ws[XLSX.utils.encode_cell({ c: C, r: R })];
        if (cell && cell.v != null) {
          const len = String(cell.v).trim().length;
          if (len > maxWidth) maxWidth = len;
        }
      }
      colWidths.push({ wch: Math.min(Math.max(maxWidth + 4, 10), 65) });
    }
    ws['!cols'] = colWidths;

    // ตรวจสอบคอลัมน์การเงินและคอลัมน์กึ่งกลางจากชื่อหัวตาราง
    const moneyCols: number[] = [];
    const centerCols: number[] = [];
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const headerCell = ws[XLSX.utils.encode_cell({ c: C, r: 0 })];
      const headerText = headerCell ? String(headerCell.v).trim() : '';
      if (headerText.includes('จำนวนเงิน') || headerText.includes('ภาษี') || headerText.includes('ค่าปรับ') || headerText.includes('ยอดเงิน')) {
        moneyCols.push(C);
      } else if (
        headerText === 'ที่' ||
        headerText.includes('วันที่') ||
        headerText.includes('ประเภทเอกสาร') ||
        headerText.includes('เลข') ||
        headerText.includes('รหัส') ||
        headerText.includes('ผลผลิต') ||
        headerText.includes('ภาค') ||
        headerText.includes('เงิน')
      ) {
        centerCols.push(C);
      }
    }

    // จัดสไตล์เซลล์ทั้งหมดให้เหมือนกับหน้าเว็บ
    for (let R = range.s.r; R <= range.e.r; ++R) {
      const isHeader = (R === 0);

      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellRef = XLSX.utils.encode_cell({ c: C, r: R });
        let cell = ws[cellRef];
        if (!cell) {
          ws[cellRef] = { t: 's', v: '' };
          cell = ws[cellRef];
        }

        const isMoney = moneyCols.includes(C);
        const isCenter = centerCols.includes(C);

        // แปลงค่าเงินเป็น Number สำหรับการคำนวณใน Excel
        if (isMoney && !isHeader) {
          if (cell.v != null && typeof cell.v === 'string') {
            const cleanNum = parseFloat(cell.v.replace(/,/g, ''));
            if (!isNaN(cleanNum)) {
              cell.v = cleanNum;
              cell.t = 'n';
            }
          }
        }

        const horizontalAlign = isHeader ? 'center' : (isMoney ? 'right' : (isCenter ? 'center' : 'left'));

        cell.s = {
          fill: isHeader
            ? { patternType: 'solid', fgColor: { rgb: 'CFF4FC' } } // สีฟ้าเดียวกับหัวตาราง alert-info
            : undefined,
          font: {
            name: 'Prompt',
            sz: isHeader ? 11 : 10,
            bold: isHeader,
            color: { rgb: isHeader ? '055160' : '000000' }
          },
          alignment: {
            horizontal: horizontalAlign,
            vertical: 'center',
            wrapText: true
          },
          border: {
            top: { style: 'thin', color: { rgb: isHeader ? 'B6EFFB' : 'CBD5E1' } },
            bottom: { style: 'thin', color: { rgb: isHeader ? 'B6EFFB' : 'CBD5E1' } },
            left: { style: 'thin', color: { rgb: isHeader ? 'B6EFFB' : 'CBD5E1' } },
            right: { style: 'thin', color: { rgb: isHeader ? 'B6EFFB' : 'CBD5E1' } }
          },
          ...(cell.t === 'n' && isMoney ? { numFmt: '#,##0.00' } : {})
        };
      }
    }

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const sheetName = this.rownum ? 'รายการลงทะเบียนคุม' : 'ลงทะเบียนคุม';
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    const exportFileName = this.rownum ? 'รายการลงทะเบียนคุม.xlsx' : 'ลงทะเบียนคุม.xlsx';
    XLSX.writeFile(wb, exportFileName);
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

  ngAfterViewInit(): void {
    this.updateScrollWidth();
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.updateScrollWidth();
      });
      if (this.tableContainer && this.tableContainer.nativeElement) {
        this.resizeObserver.observe(this.tableContainer.nativeElement);
      }
    }
  }

  ngAfterViewChecked(): void {
    this.updateScrollWidth();
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.updateScrollWidth();
  }

  onTopScroll(): void {
    if (this.isSyncingScroll) return;
    this.isSyncingScroll = true;
    if (this.tableContainer && this.topScrollContainer) {
      this.tableContainer.nativeElement.scrollLeft = this.topScrollContainer.nativeElement.scrollLeft;
    }
    requestAnimationFrame(() => {
      this.isSyncingScroll = false;
    });
  }

  onTableScroll(): void {
    if (this.isSyncingScroll) return;
    this.isSyncingScroll = true;
    if (this.topScrollContainer && this.tableContainer) {
      this.topScrollContainer.nativeElement.scrollLeft = this.tableContainer.nativeElement.scrollLeft;
    }
    requestAnimationFrame(() => {
      this.isSyncingScroll = false;
    });
  }

  updateScrollWidth(): void {
    if (this.tableContainer && this.tableContainer.nativeElement) {
      const container = this.tableContainer.nativeElement;
      const table = container.querySelector('table');
      const width = table ? Math.max(table.scrollWidth, container.scrollWidth) : container.scrollWidth;
      if (width > 0 && Math.abs(this.tableScrollWidth - width) > 2) {
        this.tableScrollWidth = width;
      }
    }
  }

  resetScroll(): void {
    if (this.topScrollContainer && this.topScrollContainer.nativeElement) {
      this.topScrollContainer.nativeElement.scrollLeft = 0;
    }
    if (this.tableContainer && this.tableContainer.nativeElement) {
      this.tableContainer.nativeElement.scrollLeft = 0;
    }
  }
}
