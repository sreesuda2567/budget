import {
  Component,
  OnInit,
  ElementRef,
  HostListener,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PDFDocument } from 'pdf-lib';
import { ApiPdoService } from '../../../../_services/api-pui.service';
import { TokenStorageService } from '../../../../_services/token-storage.service';
import { first, map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UploadfileserviceService } from '../../../../acc3d/_services/uploadfileservice.service';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { thLocale } from 'ngx-bootstrap/locale'; // ✅ เปลี่ยนเป็น path ที่ถูกต้อง
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
defineLocale('th', thLocale); // โหลด locale ภาษาไทย
import * as XLSX from 'xlsx-js-style';

@Component({
  selector: 'app-reportpaymentapp',
  templateUrl: './reportpaymentapp.component.html',
  styleUrls: ['./reportpaymentapp.component.scss']
})
export class ReportpaymentappComponent implements OnInit {
title = 'angular-app';
  fileName = 'report.xlsx';
  userList = [{}];

  dataYear: any;
  dataCam: any;
  dataFac: any;
  datalist: any;
  datalistdetail: any;
  loading: any;
  loadingdetail: any;
  dataAdd: any = {};
  searchTerm: any;
  show: any;
  dataPro: any;
  datarstatus: any;
  dataStafftype: any;
  numrow: any;
  rownum: any;
  dataNameb: any;
  dataIncome: any;
  url = '/acc3d/budget/report/reportpayment.php';
  url1 = "/acc3d/appmoney/userpermission.php";
  page = 1;
  count = 0;
  number = 0;
  tableSize = 20;
  tableSizes = [20, 30, 40, 100, 200];
  rowpbi: any;
  rowpbu: any;
  file: any;
  previewPdfUrl: string = '';
  safePdfUrl: SafeResourceUrl = '';
  constructor(
    private tokenStorage: TokenStorageService,
    private apiService: ApiPdoService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private eRef: ElementRef,
    private formBuilder: FormBuilder,
    private Uploadfiles: UploadfileserviceService,
    private localeService: BsLocaleService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
     this.localeService.use('th');
    this.dataAdd.citizen = this.tokenStorage.getUser().citizen;
    this.dataAdd.DATENOWS = '';
    this.dataAdd.DATENOWT = '';
    this.dataAdd.FACULTY_CODE = '';
    this.dataAdd.PLINCOME_CODE = '';
    this.fetchdata();
  }
fetchdata() {
    var varP = {
      opt: 'viewp',
      citizen: this.tokenStorage.getUser().citizen,
    };
    //ดึงรายการคณะตามสิทธิ์
    this.apiService
      .getdata(varP, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.datarstatus = data;
        this.dataAdd.PRIVILEGE_RSTATUS = data[0].PRIVILEGE_RSTATUS;
        var varN = {
          opt: 'viewcam',
          citizen: this.tokenStorage.getUser().citizen,
          PRIVILEGERSTATUS: data[0].PRIVILEGE_RSTATUS,
        };
        this.apiService
          .getdata(varN, this.url1)
          .pipe(first())
          .subscribe((datacam: any) => {
            this.dataCam = datacam;
            this.dataAdd.CAMPUS_CODE = datacam[0].CAMPUS_CODE;
            var Tabley = {
              opt: 'viewyearapp',
            };
            this.apiService
              .getdata(Tabley, this.url1)
              .pipe(first())
              .subscribe((datay: any) => {
                this.dataYear = datay;
                this.dataAdd.PLYEARBUDGET_CODE = datay[0].PLYEARBUDGET_CODE;
                
              });
          });
      });
      //รายการประเภทเงิน
        var Tablein = {
          "opt": "viewTable",
          "Table":"PLINCOME where PLINCOME_ASTATUS=1"
        }
        this.apiService
        .getdata(Tablein,this.url1)
        .pipe(first())
        .subscribe((data: any) => {
          this.dataIncome = data;
          this.dataAdd.PLINCOME_CODE = data[0].PLINCOME_CODE;
        // console.log(data[0].PLINCOME_CODE);
        }); 
  }

  fetchdatareport() {
    this.dataNameb = null;
    var varN1 = {
      opt: 'viewnamereport',
      citizen: this.tokenStorage.getUser().citizen,
      FACULTY_CODE: this.dataAdd.FACULTY_CODE,
    };
    this.apiService
      .getdata(varN1, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataNameb = data;
        this.dataAdd.CITIZEN_IDA = data[0].CITIZEN_ID;
      });
  }
  showinput(type: any) {
    // console.log(type);
    this.fetchdatareport();
    this.dataAdd.type = type;
    if (type == 1) {
      this.rowpbi = '';
      this.rowpbu = 1;
    } else {
      this.rowpbi = 1;
      this.rowpbu = '';
    }
  }
  fetchdataFac() {
    this.dataFac = null;
    this.dataAdd.opt = 'viewfacreport';
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataFac = data;
        this.dataAdd.FACULTY_CODE = data[0].FACULTY_CODE;
      });
  }
  onChangepdf(event: any) {
    this.file = event.target.files[0];
  }

  fetchdataload() {
    this.datalistdetail = null;
    this.dataAdd.FNANNALSMAP_CODE = [];
    this.dataAdd.check = [];
    this.dataAdd.opt = 'viewannal';
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == '1') {
          this.datalistdetail = data.data;
        }
      });
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
    this.dataAdd.opt = 'readAll';
    this.dataAdd.check = [];
    this.dataAdd.FNEXACC_CODE = [];
    this.dataAdd.FNEXACC_DETAIL = [];
        if (this.dataAdd.DATENOWS != '') {
      this.dataAdd.DATENOWS1 = this.datenow(this.dataAdd.DATENOWS);
      this.dataAdd.DATENOWT2 = this.datenow(this.dataAdd.DATENOWT);
    } else {
      this.dataAdd.DATENOWS1 = '';
      this.dataAdd.DATENOWT2 = '';
      //console.log(this.dataAdd.DATENOWS);  
    }
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

        } else {
          this.rownum = null;
          this.loading = null;
          this.datalist = data.data;
          this.toastr.warning('แจ้งเตือน:ไม่มีข้อมูล');
        }
      });
  }

exportexcel(): void {
    const element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const range = XLSX.utils.decode_range(ws['!ref']!);

    // ปรับความกว้างคอลัมน์
    const colWidths = [];
    for (let C = range.s.c; C <= range.e.c; ++C) {
      let max_width = 10;
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const cell = ws[XLSX.utils.encode_cell({ c: C, r: R })];
        if (cell && cell.v != null) {
          const length = String(cell.v).toString().length;
          if (length > max_width) max_width = length;
        }
      }
      colWidths.push({ wch: max_width + 2 });
    }
    ws['!cols'] = colWidths;

    const numberCols = [10];

    for (let R = range.s.r; R <= range.e.r; ++R) {
      const isBoldRow = (R === 0);
      const isLastRow = R === range.e.r;

      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_ref = XLSX.utils.encode_cell({ c: C, r: R });
        let cell = ws[cell_ref];
        if (!cell) {
          ws[cell_ref] = { t: 's', v: '' };
          cell = ws[cell_ref];
        }
        
        if (cell.t === 'z' || cell.v == null || (typeof cell.v === 'string' && cell.v.trim() === '')) {
          cell.t = 's';
          cell.v = '';
        }

        const isNumber = numberCols.includes(C) && typeof cell.v === 'number';

        let horizontalAlign: "left" | "center" | "right" = "left";
        if (R === 0 ) {
          horizontalAlign = "center";
        } else if (C === 0) {
          horizontalAlign = "center";
        } else if (numberCols.includes(C)) {
          horizontalAlign = "right";
        }

        const baseStyle: any = {
          alignment: {
            horizontal: horizontalAlign,
            vertical: "center",
            wrapText: true,
          },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
        };

        // ✅ ใส่ font ตัวหนา
        if (isBoldRow) {
          baseStyle.font = {
            bold: true,
            color: { rgb: '000000' },
          };
        }

        // ✅ ใส่สีหัวตาราง (แถว 2)
        if (R === 0 ) {
          baseStyle.fill = {
            patternType: "solid",
            fgColor: { rgb: "5084f2" },
          };
        }


        // ✅ ใส่ format ตัวเลข
        if (isNumber) {
          baseStyle.numFmt = '#,##0.00';
        }

        cell.s = baseStyle;
      }
    }

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.fileName || 'รายงาน.xlsx');
  }
}
