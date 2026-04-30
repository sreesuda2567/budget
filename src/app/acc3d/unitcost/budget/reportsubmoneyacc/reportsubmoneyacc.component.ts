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
import * as XLSX from 'xlsx-js-style';

@Component({
  selector: 'app-reportsubmoneyacc',
  templateUrl: './reportsubmoneyacc.component.html',
  styleUrls: ['./reportsubmoneyacc.component.scss']
})
export class ReportsubmoneyaccComponent implements OnInit {
  title = 'angular-app';
  fileName = 'report.xlsx';
  userList = [{}]

  dataYear: any;
  dataCam: any;
  datalist: any;
  loading: any;
  loadingdetail: any;
  dataAdd: any = {};
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
  url = "/acc3d/unitcost/report/reportsubmoneyacc.php";
  url1 = "/acc3d/unitcost/userpermission.php";
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
    this.dataAdd.date_type = 'FNEXPENSES_DATE';
    this.dataAdd.PLSUBMONEYPAY_CODE = '';
    this.dataAdd.DATENOWS = '';
    this.dataAdd.DATENOWT = '';
    this.dataAdd.TYPEREPORT = '';
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
      //  this.fetchdatalistcr();
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
  // ฟังก์ขันสำหรับการดึงข้อมูลรายการงบ
  fetchdataPlmoneypay() {
    this.dataAdd.opt = "viewCPLMONEYPAY";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataPlmoneypay = data;
      });
    this.dataAdd.PLSUBMONEYPAY_CODE = '';
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
          this.dataAdd.datenow = data.datenow;

          this.loading = null;
          this.rownum = 1;
          this.fetchdataSubplmoneypay();
          //this.showdata();  
          let omoney = 0; let amoney = 0; let cmoney = 0; let rmoney = 0;
          for (let i = 0; i < this.datalist.length; i++) {
            //  omoney += parseFloat(this.datalist[i].FNEXPENSES_OMONEY);
            //  amoney += parseFloat(this.datalist[i].FNEXPENSES_AMONEY);
            // cmoney += parseFloat(this.datalist[i].FNEXPENSES_CMONEY);
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
    // ✅ บังคับคอลัมน์แรก (C === 0) ให้กว้างประมาณ 5%
    colWidths[0] = { wch: 5 };
    ws['!cols'] = colWidths;

    const numberCols = [7];

    for (let R = range.s.r; R <= range.e.r; ++R) {
      const isBoldRow = (R === 0 || R === 1 || R === 2 || R === 3);
      const isLastRow = R === range.e.r;

      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_ref = XLSX.utils.encode_cell({ c: C, r: R });
        const cell = ws[cell_ref];
        if (!cell) continue;

        const isNumber = numberCols.includes(C) && typeof cell.v === 'number';

        let horizontalAlign: "left" | "center" | "right" = "left";
        if (R === 2) {
          horizontalAlign = "right";
        } else if (R === 3) {
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
        if (R === 3) {
          baseStyle.fill = {
            patternType: "solid",
            fgColor: { rgb: "5084f2" },
          };
        }

        // ✅ ใส่สีส้มแถวสุดท้าย
        if (isLastRow) {
          baseStyle.fill = {
            patternType: "solid",
            fgColor: { rgb: "FFE699" },
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
