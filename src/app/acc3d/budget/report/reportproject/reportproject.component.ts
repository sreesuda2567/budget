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
import * as XLSX from 'xlsx-js-style';

@Component({
  selector: 'app-reportproject',
  templateUrl: './reportproject.component.html',
  styleUrls: ['./reportproject.component.scss']
})
export class ReportprojectComponent implements OnInit {
  title = 'angular-app';
  fileName = 'report.xlsx';
  userList = [{}]

  dataYear: any;
  dataCam: any;
  datalist: any;
  datalistdetail: any;
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
  url = "/acc3d/budget/report/reportproject.php";
  url1 = "/acc3d/budget/userpermission.php";
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
    this.dataAdd.DATENOWS = '';
    this.dataAdd.DATENOWT = '';
    this.dataAdd.PLPROJECTTYPE = 0;
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
        //console.log(data[0].PRIVILEGE_RSTATUS);
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
            this.dataAdd.CRPART_ID = data[0].CRPART_ID;
          });
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
      });
    //รายการประเภทเงิน
    var Tablein = {
      "opt": "viewTable",
      "Table": "PLINCOME where PLINCOME_ASTATUS=1"
    }
    this.apiService
      .getdata(Tablein, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataIncome = data;
        this.dataAdd.PLINCOME_CODE = data[0].PLINCOME_CODE;
        // console.log(data[0].PLINCOME_CODE);
      });
  }
  fetchdataCam() {
    this.dataFac = null;
    this.dataAdd.opt = "viewfacreport";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataFac = data;
                if (this.dataAdd.CAMPUS_CODE != '') {
          this.dataAdd.FACULTY_CODE = data[0].FACULTY_CODE;
        } else {
          this.dataAdd.FACULTY_CODE = '';
        }

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
    this.dataCrpart = null;
    this.dataAdd.CRPART_ID = '';
    this.dataAdd.opt = "viewCRPART";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataCrpart = data;
        //this.dataAdd.CRPART_ID = data[0].CRPART_ID;

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
    this.datalistdetail = null;
    this.dataAdd.opt = "readAll";
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == '1') {
          this.datalist = data.data;
          this.datalistdetail = data.data2;
          this.dataAdd.CAMPUS_NAME = data.CAMPUS_NAME;
          this.dataAdd.PLINCOME_NAME = data.PLINCOME_NAME;
          this.loading = null;
          this.rownum = 1;
          this.fetchdataSubplmoneypay();
          //this.showdata();  
          let moneybl1 = 0; let moneybl2 = 0; let moneybl3 = 0; let moneybl4 = 0; let moneybl5 = 0;
          for (let i = 0; i < this.datalist.length; i++) {
            moneybl1 += Number(this.datalist[i].PLASSET_MONEY);
            moneybl2 += Number(this.datalist[i].PLPROJECT_MONEYTD);
            moneybl3 += Number(this.datalist[i].UPRICE_MONEY);
            moneybl4 += Number(this.datalist[i].PLPROJECT_MONEYR);
            moneybl5 += Number(this.datalist[i].PLPROJECT_MONEYRS);
          }
          this.dataAdd.moneybl1 = moneybl1;
          this.dataAdd.moneybl2 = moneybl2;
          this.dataAdd.moneybl3 = moneybl3;
          this.dataAdd.moneybl4 = moneybl4;
          this.dataAdd.moneybl5 = moneybl5;
        } else {
          this.rownum = null;
          this.loading = null;
          this.datalist = data.data;
          this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
        }
      });
  }
 /* exportexcel(): void {
    const element = document.getElementById('excel-table');
  
    if (!element) {
      console.error('ไม่พบ element: #excel-table');
      return;
    }
  
    const clonedElement = element.cloneNode(true) as HTMLElement;
    clonedElement.querySelectorAll('td').forEach(td => {
      td.innerHTML = td.innerHTML.replace(/<br\s*\/?>/gi, '\n');
    });
  
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(clonedElement);

    const range = XLSX.utils.decode_range(ws['!ref']!);
  
    const colWidths = [];
    for (let C = range.s.c; C <= range.e.c; ++C) {
      let max_width = 10;
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const cell = ws[XLSX.utils.encode_cell({ c: C, r: R })];
        if (cell && cell.v != null) {
          const length = String(cell.v).length;
          if (length > max_width) max_width = length;
        }
      }
      colWidths.push({ wch: max_width + 2 });
    }
    ws['!cols'] = colWidths;
  
    const moneyCols = [10,11, 12, 13, 14, 15,16,17,18,19];
    const rightAlignCols = [10,11, 12, 13, 14, 15,16,17,18,19];
    const statusColumnIndex = 30; // ปรับตามตำแหน่งจริงของคอลัมน์ "สถานะ"
  
    for (let R = range.s.r; R <= range.e.r; ++R) {
      const isHeader = R === 2 || R === 3;
      const isBold = R <= 3;
  
      // 👉 ดึงค่าเฉพาะคอลัมน์ "สถานะ" เท่านั้น
      const statusCellRef = XLSX.utils.encode_cell({ c: statusColumnIndex, r: R });
      const statusText = (ws[statusCellRef]?.v || "").toString();
  
      // 👉 คำนวณสีพื้นหลัง เฉพาะคอลัมน์สถานะเท่านั้น
      const getCellFillColor = (c: number): any => {
        if (c !== statusColumnIndex) return undefined;
  
        if (statusText.includes("ยังไม่ดำเนินโครงการ")) return "FF9D9D";
        if (statusText.includes("อยู่ระหว่างขออนุญาตดำเนินโครงการ")) return "FFFF91";
        if (statusText.includes("ดำเนินการเสร็จเรียบร้อยแล้ว")) return "99DD99";
        if (statusText.includes("ไม่สามารถรายงานโครงการได้")) return "FFAA71";
        if (statusText.includes("ดำเนินการเสร็จแล้ว/เบิกจ่ายเงินเรียบร้อยแล้ว")) return "B5B5DB";
        if (statusText.includes("ไม่ดำเนินการตามแผน")) return "999999";
        if (statusText.includes("ยกเลิกโครงการ")) return "999999";
        if (statusText.includes("อนุมัติการเบิกจ่าย")) return "3586FF";
        if (statusText.includes("โอนให้หน่วยงานอื่นดำเนินการ")) return "f59adb";
  
        return undefined;
      };
  
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellRef = XLSX.utils.encode_cell({ c: C, r: R });
        if (!ws[cellRef]) {
          ws[cellRef] = { t: 's', v: '' };
        }
  
        const cell = ws[cellRef];
        const isMoneyColumn = moneyCols.includes(C);
        const isNumber = isMoneyColumn && typeof cell.v === 'number';
        const isRightAlign = rightAlignCols.includes(C);
        const bgColor = getCellFillColor(C); // 🎯 ใส่สีเฉพาะเซลล์ที่ต้องการ
  
        cell.s = {
          fill: bgColor
            ? { patternType: 'solid', fgColor: { rgb: bgColor } }
            : (isHeader
                ? { patternType: 'solid', fgColor: { rgb: '5084f2' } }
                : undefined),
          font: isBold
            ? { bold: true, color: { rgb: '000000' } }
            : undefined,
          alignment: {
            horizontal: R <= 3 ? 'center' : (isRightAlign ? 'right' : 'left'),
            vertical: 'center',
            wrapText: true,
          },
          border: {
            top: { style: 'thin', color: { rgb: '000000' } },
            bottom: { style: 'thin', color: { rgb: '000000' } },
            left: { style: 'thin', color: { rgb: '000000' } },
            right: { style: 'thin', color: { rgb: '000000' } },
          },
          ...(isNumber && { numFmt: '#,##0.00' }),
        };
      }
    }
  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'รายงานการดำเนินโครงการ');
    
    XLSX.writeFile(wb, 'รายงาน.xlsx');
  }*/
    exportexcel(): void {
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
    
      const tableIds = [
        { id: 'excel-tabledetail', sheetName: 'สรุปผลรวม' },
        { id: 'excel-table', sheetName: 'รายงานการดำเนินโครงการ' }
      ];
    
      for (const { id, sheetName } of tableIds) {
        const element = document.getElementById(id);
        if (!element) {
          console.error(`ไม่พบ element: #${id}`);
          continue;
        }
    
        const clonedElement = element.cloneNode(true) as HTMLElement;
        clonedElement.querySelectorAll('td').forEach(td => {
          td.innerHTML = td.innerHTML.replace(/<br\s*\/?>/gi, '\n');
        });
    
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(clonedElement);
        const range = XLSX.utils.decode_range(ws['!ref']!);
    
        const colWidths = [];
        for (let C = range.s.c; C <= range.e.c; ++C) {
          let max_width = 10;
          for (let R = range.s.r; R <= range.e.r; ++R) {
            const cell = ws[XLSX.utils.encode_cell({ c: C, r: R })];
            if (cell && cell.v != null) {
              const length = String(cell.v).length;
              if (length > max_width) max_width = length;
            }
          }
          colWidths.push({ wch: max_width + 2 });
        }
    
        if (id === 'excel-table') {
          colWidths[0] = { wch: 5 };
        }
    
        ws['!cols'] = colWidths;
    
        // ✅ excel-table
        if (id === 'excel-table') {
          const moneyCols = [ 10,11, 12, 13, 14, 15, 16, 17, 18, 19];
          const rightAlignCols = [ 10, ...moneyCols];
          const statusColumnIndex = 42;
    
          for (let R = range.s.r; R <= range.e.r; ++R) {
            const isHeader = R === 2 || R === 3;
            const isBold = R <= 3;
            const isLastRow = R === range.e.r;
    
            for (let C = range.s.c; C <= range.e.c; ++C) {
              const cellRef = XLSX.utils.encode_cell({ c: C, r: R });
              if (!ws[cellRef]) ws[cellRef] = { t: 's', v: '' };
    
              const cell = ws[cellRef];
              const isMoneyColumn = moneyCols.includes(C);
              const isNumber = isMoneyColumn && typeof cell.v === 'number';
              const isRightAlign = rightAlignCols.includes(C);
    
              const statusText = (ws[XLSX.utils.encode_cell({ c: statusColumnIndex, r: R })]?.v || "").toString();
              const getCellFillColor = (): string | undefined => {
                if (isLastRow) return 'bcbcbc';
                if (C !== statusColumnIndex) return undefined;
                if (statusText.includes("ยังไม่ดำเนินโครงการ")) return "FF9D9D";
                if (statusText.includes("อยู่ระหว่างขออนุญาตดำเนินโครงการ")) return "FFFF91";
                if (statusText.includes("ดำเนินการเสร็จเรียบร้อยแล้ว")) return "99DD99";
                if (statusText.includes("ไม่สามารถรายงานโครงการได้")) return "FFAA71";
                if (statusText.includes("ดำเนินการเสร็จแล้ว/เบิกจ่ายเงินเรียบร้อยแล้ว")) return "B5B5DB";
                if (statusText.includes("ไม่ดำเนินการตามแผน")) return "999999";
                if (statusText.includes("ยกเลิกโครงการ")) return "999999";
                if (statusText.includes("อนุมัติการเบิกจ่าย")) return "3586FF";
                if (statusText.includes("โอนให้หน่วยงานอื่นดำเนินการ")) return "f59adb";
                return undefined;
              };
    
              const bgColor = getCellFillColor();
    
              cell.s = {
                fill: bgColor
                  ? { patternType: 'solid', fgColor: { rgb: bgColor } }
                  : (isHeader
                      ? { patternType: 'solid', fgColor: { rgb: 'bcbcbc' } }
                      : undefined),
                font: isBold || isLastRow ? { bold: true } : undefined,
                alignment: {
                  horizontal: isLastRow
                    ? 'right'
                    : (R <= 3
                      ? 'center'
                      : (isRightAlign ? 'right' : 'left')),
                  vertical: 'center',
                  wrapText: true,
                },
                border: {
                  top: { style: 'thin', color: { rgb: '000000' } },
                  bottom: { style: 'thin', color: { rgb: '000000' } },
                  left: { style: 'thin', color: { rgb: '000000' } },
                  right: { style: 'thin', color: { rgb: '000000' } },
                },
                ...(isNumber && { numFmt: '#,##0.00' }),
              };
            }
          }
        }
    
        // ✅ excel-tabledetail
        if (id === 'excel-tabledetail') {
          const highlightRows = [0, 1, 2, 3];
          const colorRows = [2, 3];
          const numberCols = Array.from({ length: 15 }, (_, i) => i + 1); // คอลัมน์ 2–16
    
          const colorMap: { [col: number]: string } = {
            0: 'bcbcbc', 1: 'bcbcbc', 2: 'bcbcbc',
            3: '999999', 4: '999999',
            5: 'f59adb', 6: 'f59adb',
            7: 'FF9D9D', 8: 'FF9D9D',
            9: 'FFFF91', 10: 'FFFF91',
            11: 'FFAA71', 12: 'FFAA71',
            13: '99DD99', 14: '99DD99', 15: '99DD99', 16: '99DD99'
          };
    
          for (let R = range.s.r; R <= range.e.r; ++R) {
            const isHighlight = highlightRows.includes(R);
            const isColorRow = colorRows.includes(R);
            const isLastRow = R === range.e.r;
    
            for (let C = range.s.c; C <= range.e.c; ++C) {
              const cellRef = XLSX.utils.encode_cell({ c: C, r: R });
              if (!ws[cellRef]) continue;
    
              const cell = ws[cellRef];
              const isNumberCol = numberCols.includes(C);
              const isNumeric = isNumberCol && typeof cell.v === 'number';
              const bgColor = isLastRow ? 'bcbcbc' : (isColorRow ? colorMap[C] : undefined);
              const alignCenter = isColorRow;
    
              cell.s = {
                font: isHighlight || isLastRow ? { bold: true } : undefined,
                alignment: {
                  horizontal: isLastRow
                    ? 'right'
                    : alignCenter
                    ? 'center'
                    : isNumberCol
                    ? 'right'
                    : isHighlight
                    ? 'center'
                    : 'left',
                  vertical: 'center',
                  wrapText: true,
                },
                fill: bgColor
                  ? { patternType: 'solid', fgColor: { rgb: bgColor } }
                  : undefined,
                border: {
                  top: { style: 'thin', color: { rgb: '000000' } },
                  bottom: { style: 'thin', color: { rgb: '000000' } },
                  left: { style: 'thin', color: { rgb: '000000' } },
                  right: { style: 'thin', color: { rgb: '000000' } },
                },
                ...(isNumeric && { numFmt: '#,##0.00' }),
              };
            }
          }
        }
    
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
      }
    
      XLSX.writeFile(wb, 'รายงาน.xlsx');
    }
}
