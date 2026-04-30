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
  selector: 'app-reportledger',
  templateUrl: './reportledger.component.html',
  styleUrls: ['./reportledger.component.scss']
})
export class ReportledgerComponent implements OnInit {
  title = 'angular-app';
  fileName= 'report.xlsx';
  userList = [{}]

  datarstatus:any ;
  dataFac :any;
  dataYear :any;
  dataCam :any;
  url = "/acc3d/unitcost/report/reportledger.php";
  url1 = "/acc3d/unitcost/userpermission.php";
  datalist:any;
  datalistde:any;
  searchTerm: any;
  loading:any;
  loadingdetail:any;
  dataAdd:any = {};
  numrow:any;
  dataIncome:any;
  locale = 'th-be';
  locales = listLocales();
  rownum: any;

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
     // console.log(this.datalistde);
      }
     });
      
 }  
 fetchdataexpen(FRACC_CODE:any,FNEXACC_RSTATUS:any){ 
  this.dataAdd.FRACC_CODE=FRACC_CODE;
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
 exportexcel(): void {
  const element = document.getElementById('excel-table');
  if (!element) {
    console.error('ไม่พบตารางที่มี id="excel-table"');
    return;
  }

  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
  const range = XLSX.utils.decode_range(ws['!ref']!);

  // ✅ ปรับความกว้างคอลัมน์อัตโนมัติ
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

  const numberCols = [2, 3, 4, 5]; // ปรับตามคอลัมน์ตัวเลขจริง

  for (let R = range.s.r; R <= range.e.r; ++R) {
    const isBoldRow = R === 0; // ✅ แถวแรกเป็นหัวตาราง
    const isLastRow = R === range.e.r;

    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellRef = XLSX.utils.encode_cell({ c: C, r: R });
      const cell = ws[cellRef];
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

      // ✅ ใส่สี + font ตัวหนาสำหรับหัวตาราง
      if (R === 1) {
        baseStyle.font = {
          bold: true,
          color: { rgb: '000000' }, // ตัวอักษรขาว
        };
        baseStyle.fill = {
          patternType: "solid",
          fgColor: { rgb: "5084f2" }, // สีฟ้าเข้ม
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
