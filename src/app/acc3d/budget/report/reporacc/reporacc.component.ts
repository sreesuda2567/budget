import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { ApiPdoService } from '../../../../_services/api-pui.service';
import { TokenStorageService } from '../../../../_services/token-storage.service';
import { first, map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx-js-style';

@Component({
  selector: 'app-reporacc',
  templateUrl: './reporacc.component.html',
  styleUrls: ['./reporacc.component.scss']
})
export class ReporaccComponent implements OnInit {
  title = 'angular-app';
  fileName = 'report.xlsx';
  userList = [{}]

  datarstatus: any;
  dataFac: any;
  dataIncome: any;
  dataCrpart: any;
  dataYear: any;
  datalist: any;
  datalistdetail:any;
  loading: any;
  loadingdetail: any;
  dataEYear: any;
  rownum: any;
  rownum1: any;
  dataAdd: any = {};
  searchTerm: any;
  dataCam :any;
  url = "/acc3d/budget/report/report_acc.php";
  url1 = "/acc3d/budget/userpermission.php";
  constructor(
    private tokenStorage: TokenStorageService,
    private apiService: ApiPdoService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private eRef: ElementRef,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.dataAdd.citizen = this.tokenStorage.getUser().citizen;
    this.fetchdata();
  }
  fetchdata() {
    var varP = {
      "opt": "viewp",
      "citizen":this.tokenStorage.getUser().citizen
    }
    //ดึงรายการคณะตามสิทธิ์
    this.apiService.getdata(varP,this.url1)
       .pipe(first())
       .subscribe((data: any) => {
         this.datarstatus = data;
         this.dataAdd.PRIVILEGE_RSTATUS = data[0].PRIVILEGE_RSTATUS;
         var varN = {
          "opt": "viewcam",
          "citizen":this.tokenStorage.getUser().citizen,
           "PRIVILEGERSTATUS":data[0].PRIVILEGE_RSTATUS
        }
        this.apiService
      .getdata(varN,this.url1)
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
    .getdata(Tabley,this.url1)
    .pipe(first())
    .subscribe((data: any) => {
      this.dataYear = data; 
      this.dataAdd.PLYEARBUDGET_CODE = data[0].PLYEARBUDGET_CODE;   

          //รายการภาค
   var Table2 = {
    "opt": "viewCRPART",
    "PLYEARBUDGET_CODE":data[0].PLYEARBUDGET_CODE,
    "FACULTY_CODE": "",
    "PLINCOME_CODE": ""
  }
  this.apiService
  .getdata(Table2,this.url1)
  .pipe(first())
  .subscribe((data: any) => {
    this.dataCrpart = data;
    this.dataAdd.CRPART_ID = data[0].CRPART_ID;
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
  fetchdataCam(){
    // console.log(1);
     this.dataFac=null;
     this.dataAdd.opt = "viewfacreport";
     this.apiService
     .getdata(this.dataAdd,this.url1)
     .pipe(first())
     .subscribe((data: any) => {
       this.dataFac = data;
        if(this.dataAdd.PRIVILEGE_RSTATUS =='A' || this.dataAdd.PRIVILEGE_RSTATUS !='1'){
      this.dataAdd.FACULTY_CODE = '';//data[0].FACULTY_CODE;
      }else{
         this.dataAdd.FACULTY_CODE = data[0].FACULTY_CODE; 
      }
     });
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
    this.loading = true;
    this.datalist = null;
    this.dataAdd.opt = 'readAll';
    this.rownum = null;
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == '1') {
        this.datalist = data.data;
        this.loading = null;
        this.rownum = 1;
        }else{
          this.rownum = null;
          this.loading = null;
          this.datalist = data.data;
          this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
        }
      })
  }
  fetchdataexpen(FRACC_CODE:any,FNEXACC_RSTATUS:any){ 
    this.dataAdd.FRACC_CODE=FRACC_CODE;
    this.dataAdd.FNEXACC_RSTATUS=FNEXACC_RSTATUS;
    this.dataAdd.opt = 'reportexpen'; 
    this.datalistdetail=null;
    this.loadingdetail=true;
    this.apiService
      .getdata(this.dataAdd,this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if(data.status==1){
       this.datalistdetail = data.data;
       this.loadingdetail=null; 
        }else{
          this.loadingdetail=null;
           this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
           this.datalistdetail= data.data; 
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

    const numberCols = [3, 4 , 5];

    for (let R = range.s.r; R <= range.e.r; ++R) {
      const isBoldRow = (R === 0 );
      const isLastRow = R === range.e.r;

      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_ref = XLSX.utils.encode_cell({ c: C, r: R });
        const cell = ws[cell_ref];
        if (!cell) continue;

        const isNumber = numberCols.includes(C) && typeof cell.v === 'number';

        let horizontalAlign: "left" | "center" | "right" = "left";
        if (R === 0) {
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
        if (R === 0) {
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
