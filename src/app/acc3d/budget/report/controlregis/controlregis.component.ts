import { Component, OnInit,ElementRef, HostListener } from '@angular/core';
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
  selector: 'app-controlregis',
  templateUrl: './controlregis.component.html',
  styleUrls: ['./controlregis.component.scss']
})
export class ControlregisComponent implements OnInit {
  title = 'angular-app';
  fileName= 'report.xlsx';
  userList = [{}]

  dataYear :any;
  dataCam :any;
  datalist:any ;
  loading:any;
  loadingdetail:any;
  dataAdd:any = {};
  clickshow:any;
  datalistdetailmoney:any;
  searchTerm: any;
  show: any;
  dataFac :any;
  dataCrpart :any;
  dataPro :any;
  datarstatus:any;
  dataIncome :any;
  dataSubplmoneypay :any;
  dataPlmoneypay :any;
  numrow:any;
  locale = 'th-be';
  locales = listLocales();
  Momoney= 0;
  Mamoney= 0;
  Mcmoney= 0;
  Mrmoney= 0;
  rownum:any;
  url = "/acc3d/budget/report/controlregis.php";
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
    this.dataAdd.citizen =this.tokenStorage.getUser().citizen;
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
      var Tablesub = {
        "opt": "viewproy",
        "FACULTY_CODE": "",
        "PLYEARBUDGET_CODE": data[0].PLYEARBUDGET_CODE
      }
      // console.log(Tablesub);
      this.apiService
      .getdata(Tablesub,this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataPro = data;
        this.dataAdd.PLPRODUCT_CODE = data[0].PLPRODUCT_CODE
      });
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
            //รายการงบ
            var Tablepk = {
              "opt": "viewPLMONEYPAY",
              "PLYEARBUDGET_CODE":data[0].PLYEARBUDGET_CODE
          }
        this.apiService
        .getdata(Tablepk,this.url1)
        .pipe(first())
        .subscribe((data: any) => {
          this.dataPlmoneypay = data;
          this.dataAdd.PLMONEYPAY_CODE = ''; 
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
      this.dataAdd.FACULTY_CODE =data[0].FACULTY_CODE;
    });
  }
  fetchdataproduct(){
    this.dataAdd.PLPRODUCT_CODE='';
    this.dataAdd.opt = "viewproy";
    this.apiService
    .getdata(this.dataAdd,this.url1)
    .pipe(first())
    .subscribe((data: any) => {
      this.dataPro = data;
      this.dataAdd.PLPRODUCT_CODE = data[0].PLPRODUCT_CODE
      
    });
  } 
    //ภาคเงิน
    fetchdatalistcr(){  
      this.dataAdd.CRPART_ID ='';
      this.dataPlmoneypay=null;
      this.dataCrpart=null;
      this.dataAdd.opt = "viewCRPART"; 
      this.apiService
      .getdata(this.dataAdd,this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataCrpart = data;
        this.dataAdd.CRPART_ID = data[0].CRPART_ID;
       //หมวดรายจ่าย
       this.dataAdd.opt = "viewCPLMONEYPAY";
       this.apiService
         .getdata(this.dataAdd, this.url1)
         .pipe(first())
         .subscribe((data: any) => {
           this.dataPlmoneypay = data;
           this.dataAdd.PLMONEYPAY_CODE = data[0].PLMONEYPAY_CODE;
         });
      }); 
     }
         //ภาคเงิน
    fetchdatalistmon(){  
      this.dataPlmoneypay=null;
       //หมวดรายจ่าย
       this.dataAdd.opt = "viewCPLMONEYPAY";
       this.apiService
         .getdata(this.dataAdd, this.url1)
         .pipe(first())
         .subscribe((data: any) => {
           this.dataPlmoneypay = data;
           this.dataAdd.PLMONEYPAY_CODE = data[0].PLMONEYPAY_CODE;
         });
  
     }
      applyLocale(pop: any) {
        this.localeService.use(this.locale);
      }
      datenow(datenow:any){
        const yyyy = datenow.getFullYear();
        let mm = datenow.getMonth() + 1; // Months start at 0!
        let dd = datenow.getDate();
        return  yyyy+'-'+mm+'-'+dd;
        }  
  fetchdatalist(){
    
      this.Momoney=0;
      this.Mamoney=0;
      this.Mcmoney=0;
      this.Mrmoney=0;
      this.loading=true;
      this.datalist=null;
      this.dataAdd.opt = "readAll"; 
      this.apiService
      .getdata(this.dataAdd,this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if(data.status=='1'){
        this.datalist = data.data;
        this.dataAdd.CAMPUS_NAME=data.CAMPUS_NAME;
        this.dataAdd.PLINCOME_NAME=data.PLINCOME_NAME;
        this.loading=null;
        this.rownum=1; 
       // this.fetchdataSubplmoneypay();
        //this.showdata();  
        let omoney=0;let amoney=0;let cmoney=0;let rmoney=0;
        for(let i=0; i<this.datalist.length;i++){
         omoney += parseFloat(this.datalist[i].FNEXPENSES_OMONEY);
         amoney += parseFloat(this.datalist[i].FNEXPENSES_AMONEY);
         cmoney += parseFloat(this.datalist[i].FNEXPENSES_CMONEY);
         rmoney += parseFloat(this.datalist[i].FNEXPENSES_RMONEY);
        }
        this.Momoney=omoney;
        this.Mamoney=amoney;
        this.Mcmoney=cmoney;
        this.Mrmoney=rmoney;
        }else{
          this.rownum=null;
          this.loading=null; 
          this.datalist=data.data;
          this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล"); 
        }
      }); 
  }
  fetchdataexpen(value:any,FNEXACC_RSTATUS:any,type:any){ 
    this.dataAdd.PLSUBMONEYPAY_CODE=value;
    //console.log(value);
    this.dataAdd.PLPROJECT_CODE=FNEXACC_RSTATUS;
    this.dataAdd.FNEXACC_TYPE=type;
    this.dataAdd.opt = 'reportexpen'; 
    this.datalistdetailmoney=null;
    this.loadingdetail=true;
    this.apiService
      .getdata(this.dataAdd,this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if(data.status==1){
       this.datalistdetailmoney = data.data;
       this.loadingdetail=null; 
        }else{
          this.loadingdetail=null;
           this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
           this.datalistdetailmoney= data.data; 
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
  
    const moneyCols = [1,2, 3, 4, 5];
    const rightAlignCols = [1,2, 3, 4, 5];
  
    for (let R = range.s.r; R <= range.e.r; ++R) {
      const firstCellRef = XLSX.utils.encode_cell({ c: 0, r: R });
      const firstCellVal = (ws[firstCellRef]?.v || "").toString();
  
      // 🎨 กำหนดสีพื้นหลังตามหมวด
      let bgColor = undefined;
      if (firstCellVal.includes("ผลผลิตวิทย์ฯ")) {
        bgColor = "66CCFF";
      } else if (firstCellVal.includes("ผลผลิตสังคม")) {
        bgColor = "66CCFF";
      } else if (firstCellVal.includes("ผลผลิตการท่องเที่ยว")) {
        bgColor = "66CCFF";
      } else if (firstCellVal.includes("ผลผลิตบุคลากรภาครัฐ")) {
        bgColor = "66CCFF";
      } else if (firstCellVal.includes("งบลงทุน")) {
        bgColor = "a2dffc";
      } else if (firstCellVal.includes("งบเงินอุดหนุน")) {
        bgColor = "a2dffc";
      } else if (firstCellVal.includes("งบบุคลากร")) {
        bgColor = "a2dffc";
      }else if (firstCellVal.includes("งบดำเนินงาน")) {
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
        const isBold = (R === 0 ) || !!bgColor;
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
              (R === 0 ) ? 'center' :
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
