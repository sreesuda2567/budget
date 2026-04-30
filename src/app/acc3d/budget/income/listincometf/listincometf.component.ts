import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { ApiPdoService } from '../../../../_services/api-pui.service';
import { TokenStorageService } from '../../../../_services/token-storage.service';
import { first, map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx-js-style';

@Component({
  selector: 'app-listincometf',
  templateUrl: './listincometf.component.html',
  styleUrls: ['./listincometf.component.scss']
})
export class ListincometfComponent implements OnInit {
  title = 'angular-app';
  fileName = 'report.xlsx';
  userList = [{}]

  datarstatus: any;
  dataFac: any;
  dataIncome: any;
  dataCrpart: any;
  dataYear: any;
  dataPlmoneypay: any;
  dataSubplmoneypay: any;
  datalist: any;
  datalistdetail: any;
  loading: any;
  dataESection: any;
  dataEIncome: any;
  dataECrpart: any;
  dataEYear: any;
  dataPlproduct: any;
  rownum: any;
  pp: any;
  datalistde: any;
  datalistto: any;

  url = "/acc3d/budget/income/incometf.php";
  url1 = "/acc3d/budget/userpermission.php";
  dataAdd: any = {};
  constructor(
    private tokenStorage: TokenStorageService,
    private apiService: ApiPdoService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private eRef: ElementRef,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.fetchdata();
    this.dataAdd.citizen = this.tokenStorage.getUser().citizen;
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
    var Tablep = {
      "opt": "viewTable",
      "Table": "PLINCOME where PLINCOME_ASTATUS=1"
    }
    this.apiService
      .getdata(Tablep, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataIncome = data;
        this.dataAdd.PLINCOME_CODE = data[0].PLINCOME_CODE;
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
            this.dataAdd.CRPART_ID = data[0].CRPART_ID;
          });

      });


    // console.log(this.dataAdd);
  }

  //ภาคเงิน
  fetchdatalistcr() {




    this.dataAdd.opt = "viewCRPART";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataCrpart = data;
        this.dataAdd.CRPART_ID = data[0].CRPART_ID;
      });
  }

  fetchdatalist() {
    //ผลผลิต  
    this.loading = true;
    this.datalist = null;
    this.dataAdd.opt = 'PLPRODUCTTR';
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((datapro: any) => {
        this.dataPlproduct = datapro;
        this.rownum = 1;
      });

    this.loading = true;
    this.datalist = null;

    this.dataAdd.opt = 'readAll';
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == 1) {
          this.datalist = data.data;
          this.datalistto = data.data2;
          this.loading = null;
          this.rownum = 1;
        }

      })
  }
  exportexcel(): void {
    const element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const range = XLSX.utils.decode_range(ws['!ref']!);

    // 📏 ปรับความกว้างคอลัมน์อัตโนมัติ
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

    const moneyCols = [1, 2, 3, 4, 5, 6, 7];
    const rightAlignCols = [1, 2, 3, 4, 5, 6, 7];

    for (let R = range.s.r; R <= range.e.r; ++R) {
      const firstCellRef = XLSX.utils.encode_cell({ c: 0, r: R });
      const firstCellVal = (ws[firstCellRef]?.v || "").toString();

      // 🎨 กำหนดสีพื้นหลังตามหมวด
      let bgColor = undefined;
      if (firstCellVal.includes("งบลงทุน")) {
        bgColor = "a2dffc";
      } else if (firstCellVal.includes("งบเงินอุดหนุน")) {
        bgColor = "a2dffc";
      } else if (firstCellVal.includes("งบบุคลากร")) {
        bgColor = "a2dffc";
      } else if (firstCellVal.includes("งบดำเนินงาน")) {
        bgColor = "a2dffc";
      } else if (firstCellVal.includes("งบกลาง")) {
        bgColor = "a2dffc";
      } else if (firstCellVal.includes("สมทบมหาวิทยาลัย")) {
        bgColor = "a2dffc";
      }

      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_ref = XLSX.utils.encode_cell({ c: C, r: R });

        // 🧱 สร้าง cell ว่างถ้ายังไม่มี
        if (!ws[cell_ref]) {
          ws[cell_ref] = { t: 's', v: '' };
        }

        const cell = ws[cell_ref];
        const isHeader = R === 0;
        const isBold = (R === 0) || !!bgColor;
        const isMoneyColumn = moneyCols.includes(C);
        const isNumber = isMoneyColumn && typeof cell.v === 'number';
        const isRightAlign = rightAlignCols.includes(C);
        const isLastRow = R === range.e.r;

        cell.s = {
          fill: isLastRow
            ? { patternType: 'solid', fgColor: { rgb: 'FFE699' } }
            : bgColor
              ? { patternType: 'solid', fgColor: { rgb: bgColor } }
              : (isHeader
                ? { patternType: 'solid', fgColor: { rgb: '5084f2' } }
                : undefined),
          font: isBold
            ? { bold: true, color: { rgb: '000000' } }
            : undefined,
          alignment: {
            horizontal:
              (R === 0) ? 'center' :
                (isRightAlign ? 'right' : 'left'),
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
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'รายงาน.xlsx');
  }
}
