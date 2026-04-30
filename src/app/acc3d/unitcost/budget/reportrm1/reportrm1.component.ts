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
  selector: 'app-reportrm1',
  templateUrl: './reportrm1.component.html',
  styleUrls: ['./reportrm1.component.scss']
})
export class Reportrm1Component implements OnInit {
  title = 'angular-app';
  fileName= 'report.xlsx';
  userList = [{}]

  datarstatus:any ;
  dataFac :any;
  dataYear :any;
  dataCam :any;
  url = "/acc3d/unitcost/report/reportrm1.php";
  url1 = "/acc3d/unitcost/userpermission.php";
  datalist:any;
  datalistde:any;
  searchTerm: any;
  searchTermde: any;
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
    "opt": "viewCRPART",
    "PLYEARBUDGET_CODE":data[0].PLYEARBUDGET_CODE,
    "FACULTY_CODE": "",
    "PLINCOME_CODE": "01"
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
          "Table":"PLINCOME where PLINCOME_ASTATUS=1 and PLINCOME_CODE='01'"
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
          this.dataAdd.CRPART_ID = '';//data[0].CRPART_ID;
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
    this.datalistde=null;
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
     this.dataAdd.DATENOW=data.DATENOW;
     // console.log(this.datalistde);
      }else{
        this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
        this.loading=null;  
       }
     });
      
 }  
 fetchdataexpen(opt:any,PLSUBMONEYPAY_CODE:any,PLSUBMONEYPAY_NAME:any,PLMONEYPAY_CODE:any,type:any){ 
  this.dataAdd.PLSUBMONEYPAY_CODE=PLSUBMONEYPAY_CODE;
  this.dataAdd.PLSUBMONEYPAY_NAME=PLSUBMONEYPAY_NAME;
  this.dataAdd.PLMONEYPAY_CODE=PLMONEYPAY_CODE;
  this.dataAdd.opt = opt; 
  this.dataAdd.type = type; 
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
   
     const moneyCols = [1,2, 3, 4, 5, 6,7,8,9,10,11];
     const rightAlignCols = [1,2, 3, 4, 5, 6,7,8,9,10,11];
   
     for (let R = range.s.r; R <= range.e.r; ++R) {
       const firstCellRef = XLSX.utils.encode_cell({ c: 0, r: R });
       const firstCellVal = (ws[firstCellRef]?.v || "").toString();
   
       // 🎨 กำหนดสีพื้นหลังตามหมวด
       let bgColor = undefined;
       if (firstCellVal.includes("งบบุคลากร")) {
         bgColor = "66CCFF";
       } else if (firstCellVal.includes("งบดำเนินงาน")) {
         bgColor = "66CCFF";
       } else if (firstCellVal.includes("งบเงินอุดหนุน")) {
         bgColor = "66CCFF";
       } else if (firstCellVal.includes("งบลงทุน")) {
         bgColor = "66CCFF";
       } else if (firstCellVal.includes("งบกลาง")) {
         bgColor = "66CCFF";
       } else if (firstCellVal.includes("สมทบมหาวิทยาลัย")) {
         bgColor = "66CCFF";
       } 
   
       for (let C = range.s.c; C <= range.e.c; ++C) {
         const cell_ref = XLSX.utils.encode_cell({ c: C, r: R });
   
         // 🧱 สร้าง cell ว่างถ้ายังไม่มี
         if (!ws[cell_ref]) {
           ws[cell_ref] = { t: 's', v: '' };
         }
   
         const cell = ws[cell_ref];
         const isHeader = (R === 3 || R === 4 );
         const isBold = (R === 0 || R === 1 || R === 2||R === 3 || R === 4) || !!bgColor;
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
             (R === 0) ? 'right' :
             (R === 1 || R === 2 || R === 3 || R === 4) ? 'center' :
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
 exportexceldetail(): void
 {
   /* pass here the table id */
   let element = document.getElementById('excel-tabledetail');
   const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

   /* generate workbook and add the worksheet */
   const wb: XLSX.WorkBook = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

   /* save to file */  
   XLSX.writeFile(wb, this.fileName);
 } 
}
