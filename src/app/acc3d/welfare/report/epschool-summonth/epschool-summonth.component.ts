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
import * as XLSX from 'xlsx-js-style';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-epschool-summonth',
  templateUrl: './epschool-summonth.component.html',
  styleUrls: ['./epschool-summonth.component.scss']
})
export class EpschoolSummonthComponent implements OnInit {
  title = 'angular-app';
  fileName = 'สรุปยอดการเบิกการศึกษาบุตร.xlsx';
  userList = [{}]

  dataYear: any;
  dataCam: any;
  dataFac: any;
  datalist: any;
  loading: any;
  loadingdetail: any;
  dataAdd: any = { };
  clickshow: any;
  searchTerm: any;
  show: any;
  dataPro: any;
  datarstatus: any;
  dataStafftype: any;
  numrow: any;
  locale = 'th-be';
  locales = listLocales();
  rownum: any;
  url = "/acc3d/welfare/report/epschool_summonth.php";
  url1 = "/acc3d/welfare/userpermission.php";
  keyword = 'name';
  datalistdetail: any;
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
    this.dataAdd.STAFFTYPE_ID = '';
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
      });
      var Tablesub = {
        "opt": "viewSTAFFTYPE"
      }
      // console.log(Tablesub);
      this.apiService
        .getdata(Tablesub, this.url1)
        .pipe(first())
        .subscribe((data: any) => {
          this.dataStafftype = data;
          this.dataAdd.STAFFTYPE_ID = '';
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
        this.dataAdd.FACULTY_CODE = '';
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
          this.dataAdd.CAMPUS_NAME = data.CAMPUS_NAME;
          this.dataAdd.PLINCOME_NAME = data.PLINCOME_NAME;
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
    fetchdatadetail(CODE:any,MONTHNAME:any,FACULTY_CODE:any,FACULTY_TNAME:any){ 
    this.dataAdd.MONTH=CODE;
    this.dataAdd.MONTHNAME=MONTHNAME;
    this.dataAdd.FACULTY_NAME=FACULTY_CODE;
    this.dataAdd.FACULTYNAME=FACULTY_TNAME;
    this.dataAdd.opt = 'reportdetail'; 
    this.datalistdetail=null;
    this.loading=true;
    this.apiService
      .getdata(this.dataAdd,this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if(data.status==1){
       this.datalistdetail = data.data;
       this.loading=null; 
        }else{
          this.loading=null;
           this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
           this.datalistdetail= data.data; 
        }
       });
  
   }
  getMonthTotal(month: string): number {
    if (!this.datalist) return 0;
    return this.datalist.reduce((sum: number, item: any) => {
      return sum + (parseFloat(item[month]) || 0);
    }, 0);
  }
  exportexcel(): void {
    const element = document.getElementById('excel-table');
    if (!element) {
      this.toastr.warning("ไม่พบตารางข้อมูลสำหรับส่งออก");
      return;
    }

    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, { raw: true });
    const range = XLSX.utils.decode_range(ws['!ref']!);

    // ปรับความกว้างคอลัมน์อัตโนมัติ
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
      colWidths.push({ wch: Math.min(Math.max(max_width + 4, 10), 50) });
    }
    ws['!cols'] = colWidths;

    const numberCols = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

    for (let R = range.s.r; R <= range.e.r; ++R) {
      const isHeader = (R === 0);
      const isLastRow = (R === range.e.r);

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

        // แปลงคอลัมน์ตัวเลขเงินให้เป็น number
        if (numberCols.includes(C) && R > 0) {
          if (cell.v && typeof cell.v === 'string') {
            const numVal = parseFloat(cell.v.replace(/,/g, ''));
            if (!isNaN(numVal)) {
              cell.v = numVal;
              cell.t = 'n';
            }
          }
        }

        // แปลงคอลัมน์ลำดับ ให้เป็น number ถ้าเป็นตัวเลข
        if (C === 0 && R > 0 && !isLastRow) {
          if (cell.v && typeof cell.v === 'string') {
            const intVal = parseInt(cell.v.replace(/,/g, ''), 10);
            if (!isNaN(intVal)) {
              cell.v = intVal;
              cell.t = 'n';
            }
          }
        }

        const isNumber = numberCols.includes(C) && cell.t === 'n';

        let horizontalAlign: "left" | "center" | "right" = "left";
        if (R === 0) {
          horizontalAlign = "center";
        } else if (isLastRow && C === 0) {
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

        // สไตล์หัวตาราง (แถว 0) - ตัวหนา, สีฟ้า bg-info
        if (isHeader) {
          baseStyle.font = {
            bold: true,
            color: { rgb: '000000' },
          };
          baseStyle.fill = {
            patternType: "solid",
            fgColor: { rgb: "5BC0DE" },
          };
        }

        // สไตล์แถวรวม (แถวสุดท้าย tfoot) - ตัวหนา, สีพื้นหลัง #D1ECF1
        if (isLastRow) {
          baseStyle.font = {
            bold: true,
            color: { rgb: '000000' },
          };
          baseStyle.fill = {
            patternType: "solid",
            fgColor: { rgb: "D1ECF1" },
          };
        }

        // รูปแบบตัวเลขเงิน #,##0.00
        if (isNumber) {
          baseStyle.numFmt = '#,##0.00';
        }

        cell.s = baseStyle;
      }
    }

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'สรุปยอดการศึกษาบุตร');
    XLSX.writeFile(wb, this.fileName || 'สรุปยอดการเบิกการศึกษาบุตร.xlsx');
  }
}
