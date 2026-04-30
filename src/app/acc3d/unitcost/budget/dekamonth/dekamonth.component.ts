import { Component, OnInit,ElementRef, HostListener ,ViewChild} from '@angular/core';
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
  selector: 'app-dekamonth',
  templateUrl: './dekamonth.component.html',
  styleUrls: ['./dekamonth.component.scss']
})
export class DekamonthComponent implements OnInit {
  title = 'angular-app';
  fileName= 'report.xlsx';
  userList = [{}]

  datarstatus:any ;
  dataFac :any;
  dataYear :any;
  dataCam :any;
  url = "/acc3d/unitcost/report/dekamonth.php";
  url1 = "/acc3d/unitcost/userpermission.php";
  datalist:any;
  datalistde:any;
  searchTerm: any;
  loading:any;
  loadingdetail:any;
  dataAdd:any = {};
  numrow:any;
  dataPro :any;
  dataIncome :any;
  dataCrpart :any;
  
  locale = 'th-be';
  locales = listLocales();

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
    this.fetchdata();
    this.localeService.use(this.locale);
    this.dataAdd.DATENOWS = ''; 
    this.dataAdd.DATENOWT = ''; 
    this.dataAdd.PLPRODUCT_CODE='';
    this.dataAdd.CRPART_ID='';
  }
  fetchdata(){
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
         //คณะ/หน่วยงาน
         var Tablesub = {
          "opt": "viewfac",
          "CAMPUS_CODE": datacam[0].CAMPUS_CODE
        }
        // console.log(Tablesub);
        this.apiService
        .getdata(Tablesub,this.url1)
        .pipe(first())
        .subscribe((data: any) => {
          this.dataFac = data;
          this.dataAdd.FACULTY_CODE =''; //data[0].FACULTY_CODE;
        });
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
      var Tablesub = {
        "opt": "viewproy",
        "PLYEARBUDGET_CODE": data[0].PLYEARBUDGET_CODE
      }
      // console.log(Tablesub);
      this.apiService
      .getdata(Tablesub,this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataPro = data;
      });
      //รายการภาค
   var Table2 = {
    "opt": "viewcrpart",
    "PLYEARBUDGET_CODE":data[0].PLYEARBUDGET_CODE,
    "FACULTY_CODE": "",
    "PLINCOME_CODE": ""
  }
  this.apiService
  .getdata(Table2,this.url1)
  .pipe(first())
  .subscribe((data: any) => {
    //console.log(data);
    this.dataCrpart = data;
    this.dataAdd.CRPART_ID = data[0].CRPART_ID;
  });  
    }); 
    
        //รายการประเภทเงิน
        var Table = {
          "opt": "viewTable",
          "Table":"PLINCOME where PLINCOME_ASTATUS=1"
        }
        this.apiService
        .getdata(Table,this.url1)
        .pipe(first())
        .subscribe((data: any) => {
          this.dataIncome = data;
          this.dataAdd.PLINCOME_CODE = data[0].PLINCOME_CODE;
        // console.log(data[0].PLINCOME_CODE);
        }); 
  }
      //ภาคเงิน
      fetchdatalistcr(){  
        this.dataAdd.CRPART_ID ='';
        this.dataAdd.opt = "viewCRPART"; 
        this.apiService
        .getdata(this.dataAdd,this.url1)
        .pipe(first())
        .subscribe((data: any) => {
          this.dataCrpart = data;
          this.dataAdd.CRPART_ID = data[0].CRPART_ID;
        }); 
       }
  fetchdataCam(){
    this.dataAdd.opt = "viewfac";
    this.apiService
    .getdata(this.dataAdd,this.url1)
    .pipe(first())
    .subscribe((data: any) => {
      this.dataFac = data;
      
    });
  }
  datenow(datenow:any){
    const yyyy = datenow.getFullYear();
    let mm = datenow.getMonth() + 1; // Months start at 0!
    let dd = datenow.getDate();
    return  yyyy+'-'+mm+'-'+dd;
    } 
  fetchdatalist(){
    this.numrow=null;
    this.loading=true;
    this.dataAdd.opt = 'readAll';  
    if(this.dataAdd.DATENOWS !=''){
      this.dataAdd.DATENOWS1=this.datenow(this.dataAdd.DATENOWS);
      this.dataAdd.DATENOWT2=this.datenow(this.dataAdd.DATENOWT);
      }else{
      this.dataAdd.DATENOWS1='';
      this.dataAdd.DATENOWT2='';  
      //console.log(this.dataAdd.DATENOWS);  
      }
    this.apiService
    .getdata(this.dataAdd,this.url)
    .pipe(first())
    .subscribe((data: any) => {
      if(data.status==1){
     this.numrow  =1; 
     this.datalistde = data.data; 
     this.loading=null; 
     this.dataAdd.CAMPUS_NAME=data.CAMPUS_NAME;
     this.dataAdd.PLINCOME_NAME=data.PLINCOME_NAME;
     this.dataAdd.PLGPRODUCT_SHORTNAME=data.PLGPRODUCT_SHORTNAME;
     this.dataAdd.PLPRODUCT_CODE=data.PLPRODUCT_CODE;
     this.dataAdd.DATENOW=data.DATENOW;
     // console.log(this.datalistde);
      }else{
        this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
        this.loading=null;  
       }
     });
      
 }  
 fetchdataexpen(FRACC_CODE:any,PLINCOME_CODE:any,CRPART_ID:any,FNEXACC_RSTATUS:any){ 
  this.dataAdd.FRACC_CODE=FRACC_CODE;
  this.dataAdd.PLINCOME_CODE=PLINCOME_CODE;
  this.dataAdd.CRPART_ID=CRPART_ID;
  this.dataAdd.FNEXACC_RSTATUS=FNEXACC_RSTATUS;
  this.dataAdd.opt = 'reportexpen'; 
  this.datalist=null;
  this.loading=true;
  this.apiService
    .getdata(this.dataAdd,this.url)
    .pipe(first())
    .subscribe((data: any) => {
      if(data.status==1){
     this.datalist = data.data;
     this.loading=null; 
      }else{
        this.loading=null;
         this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
         this.datalist= data.data; 
      }
     });

 }
/* exportexcel(): void
 {

   let element = document.getElementById('excel-table');
   const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);


   const wb: XLSX.WorkBook = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');


   XLSX.writeFile(wb, this.fileName);

 } */
exportexcel(): void {
  const element = document.getElementById('excel-table');
  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
  const range = XLSX.utils.decode_range(ws['!ref']!);

  // 📌 merge ให้ตรงกับ thead
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 22 } }, // วันที่
    { s: { r: 1, c: 0 }, e: { r: 1, c: 22 } }, // รายงานสรุป
    { s: { r: 2, c: 0 }, e: { r: 2, c: 22 } }, // {{dataAdd.PLINCOME_NAME}}

    // หัวตารางคงที่ (rowspan 3)
    { s: { r: 3, c: 0 }, e: { r: 5, c: 0 } }, // ที่
    { s: { r: 3, c: 1 }, e: { r: 5, c: 1 } }, // เลขที่ฎีกา
    { s: { r: 3, c: 2 }, e: { r: 5, c: 2 } }, // รหัสบัญชี
    { s: { r: 3, c: 3 }, e: { r: 5, c: 3 } }, // ชื่อรายการ
    { s: { r: 3, c: 4 }, e: { r: 5, c: 4 } }, // คณะ
    { s: { r: 3, c: 5 }, e: { r: 5, c: 5 } }, // จำนวนเงิน
    { s: { r: 3, c: 6 }, e: { r: 5, c: 6 } }, // เลขเอกสาร
    { s: { r: 3, c: 7 }, e: { r: 5, c: 7 } }, // แหล่งเงิน
    { s: { r: 3, c: 8 }, e: { r: 5, c: 8 } }, // หมวดรายจ่าย
    { s: { r: 3, c: 9 }, e: { r: 5, c: 9 } }, // ชื่อโครงการ
    { s: { r: 3, c: 10 }, e: { r: 5, c: 10 } }, // ผลผลิต

    // ผลผลิตรวม
    { s: { r: 3, c: 11 }, e: { r: 3, c: 22 } },

    // งบบุคลากร
    { s: { r: 4, c: 11 }, e: { r: 4, c: 11 } },
    // งบดำเนินงาน
    { s: { r: 4, c: 12 }, e: { r: 4, c: 13 } },
    // งบลงทุน
    { s: { r: 4, c: 14 }, e: { r: 4, c: 15 } },
    // งบอุดหนุน
    { s: { r: 4, c: 16 }, e: { r: 4, c: 21 } },
    // งบกลาง
    { s: { r: 4, c: 22 }, e: { r: 4, c: 22 } },
  ];

  // 📌 เติมข้อความ header ที่ merge หาย
  ws['K5'] = { v: "งบดำเนินงาน", t: "s" };
  ws['M5'] = { v: "งบลงทุน", t: "s" };
  ws['O5'] = { v: "งบอุดหนุน", t: "s" };

  // 📌 ปรับความกว้างคอลัมน์
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
  colWidths[0] = { wch: 5 };
  ws['!cols'] = colWidths;

  // 📌 คอลัมน์ที่เป็นตัวเลข
  const numberCols = [5,  11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,22];

  // 📌 ใส่ style ทุก cell
  for (let R = range.s.r; R <= range.e.r; ++R) {
    const isBoldRow = (R <= 5);
    const isLastRow = R === range.e.r;

    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell_ref = XLSX.utils.encode_cell({ c: C, r: R });
      if (!ws[cell_ref]) continue;

      const isNumber = numberCols.includes(C) && typeof ws[cell_ref].v === 'number';

      // alignment
      let horizontalAlign: "left" | "center" | "right" = "left";
      if (R === 0) horizontalAlign = "right";
      else if (R <= 5) horizontalAlign = "center";
      else if (C === 0) horizontalAlign = "center";
      else if (numberCols.includes(C)) horizontalAlign = "right";

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

      if (isBoldRow) {
        baseStyle.font = { bold: true, color: { rgb: "000000" } };
        baseStyle.fill = { patternType: "solid", fgColor: { rgb: "9BC5EE" } };
      }

      if (isLastRow) {
        baseStyle.fill = { patternType: "solid", fgColor: { rgb: "FFE699" } };
      }

      if (isNumber) {
        baseStyle.numFmt = "#,##0.00";
      }

      ws[cell_ref].s = baseStyle;
    }
  }

  // 📌 ใส่ border ครบทุก cell ที่ merge (กันเส้นหาย)
  ws['!merges'].forEach(merge => {
    for (let R = merge.s.r; R <= merge.e.r; R++) {
      for (let C = merge.s.c; C <= merge.e.c; C++) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[cellRef]) ws[cellRef] = { v: "", t: "s" };
        ws[cellRef].s = {
          ...(ws[cellRef].s || {}),
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
        };
      }
    }
  });

  // 📌 export
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, this.fileName || 'รายงาน.xlsx');
}


}
