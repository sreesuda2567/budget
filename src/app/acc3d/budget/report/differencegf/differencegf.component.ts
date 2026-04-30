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
import Swal from 'sweetalert2';

@Component({
  selector: 'app-differencegf',
  templateUrl: './differencegf.component.html',
  styleUrls: ['./differencegf.component.scss']
})
export class DifferencegfComponent implements OnInit {
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
  searchTermde: any;
  loadingacc: any;
  show: any;
  url = "/acc3d/budget/report/differencegf1.php";
  url1 = "/acc3d/budget/userpermission.php";

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
    this.dataAdd.citizen =this.tokenStorage.getUser().citizen;
    this.dataAdd.MONTH='';
    this.show=null;  
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
        console.log(data[0].PRIVILEGE_RSTATUS);
         this.dataAdd.PRIVILEGE_RSTATUS = data[0].PRIVILEGE_RSTATUS;
        });      
    //ดึงคณะตามสังกัด
    var varN = {
     "opt": "viewCAMPUS",
     "citizen":this.tokenStorage.getUser().citizen
   }
   this.apiService
 .getdata(varN,this.url1)
 .pipe(first())
 .subscribe((data: any) => {
  this.dataCam = data;
   this.dataAdd.CAMPUS_CODE = data[0].CAMPUS_CODE;
 
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
}
fetchdatalist(){
  this.loading=true;
  this.dataAdd.opt = 'readgf'; 
  this.dataAdd.moneybl1=0;
  this.dataAdd.moneybl2=0;
  this.dataAdd.moneybl3=0;
  this.dataAdd.moneybl4=0;
  this.dataAdd.moneybl5=0;
  this.datalist=null;
  this.apiService
  .getdata(this.dataAdd,this.url)
  .pipe(first())
  .subscribe((data: any) => {
    if(data.status==1){
      this.datalist = data.data; 
      this.dataAdd.CHECK3D_GF_DATE= data.CHECK3D_GF_DATE;
      this.dataAdd.NAME= data.name;
      this.loading=null;
      this.show=true; 
      let moneybl1=0; let moneybl2=0; let moneybl3=0; let moneybl4=0; 
      for(let i=0; i<this.datalist.length;i++){
        moneybl1 += Number(this.datalist[i].CHECK3D_GF_MONEYAL);
        moneybl2 += Number(this.datalist[i].CHECK3D_GF_MONEYGF);
        moneybl3 += Number(this.datalist[i].FNEXPENSES_RMONEY);
        moneybl4 += Number(this.datalist[i].FNEXPENSES_RMONEYT);
         }  
         this.dataAdd.moneybl1=this.numberWithCommas(moneybl1.toFixed(2));   
         this.dataAdd.moneybl2=this.numberWithCommas(moneybl2.toFixed(2));
         this.dataAdd.moneybl3=this.numberWithCommas(moneybl3.toFixed(2));
         this.dataAdd.moneybl4=this.numberWithCommas(moneybl4.toFixed(2));
         this.dataAdd.moneybl5=this.numberWithCommas((moneybl4*100/moneybl2).toFixed(2));
    }else{
      this.loading=null; 
      this.datalist=data.data;
      this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล"); 
    }
   });
}
fetchclose(){
  this.clickshow=null;  
}
numberWithCommas(x:any) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}
fetchdataexpen(opt:any,codepl:any,codepls:any,codepr:any,codele:any,name:any){ 
  this.dataAdd.opt = opt;
  this.dataAdd.PLMONEYPAY_CODE = codepl;
  this.dataAdd.PLSUBMONEYPAY_CODE = codepls;
  this.dataAdd.PLPRODUCT_CODE = codepr;
  this.dataAdd.PLSUBMONEYPAY_LEVEL = codele;
  this.dataAdd.htmlStringd=name;
  //this.clickshow=true;
  this.datalistdetailmoney=null;
  this.loadingdetail=true;
  this.dataAdd.moneydetail=0;
  this.dataAdd.moneydetailo=0;
  this.dataAdd.moneydetaila=0;
  this.apiService
  .getdata(this.dataAdd,this.url)
  .pipe(first())
  .subscribe(
   (data: any) => {
    if(data.status==1){
     this.datalistdetailmoney = data.data;
     this.loadingdetail=null; 
     console.log(this.datalistdetailmoney);   
  /* let summoney=0;let summoneyo=0;let summoneya=0;
   for(let i=0; i<this.datalistdetailmoney.length;i++){
    summoney += Number(this.datalistdetailmoney[i].FNEXPENSES_RMONEY);
    summoneyo += Number(this.datalistdetailmoney[i].FNEXPENSES_OMONEY);
    summoneya += Number(this.datalistdetailmoney[i].FNEXPENSES_AMONEY);
   }
   this.dataAdd.moneydetail = this.numberWithCommas(summoney.toFixed(2));
   this.dataAdd.moneydetailo = this.numberWithCommas(summoneyo.toFixed(2));
   this.dataAdd.moneydetaila = this.numberWithCommas(summoneya.toFixed(2));*/
  }else{
    this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
    this.loadingdetail=null;  
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
  
    const moneyCols = [1,2, 3, 4];
    const rightAlignCols = [1,2, 3, 4];
  
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
        const isHeader = R === 1;
        const isBold = (R === 0 || R === 1 || R === 2) || !!bgColor;
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
              (R === 0 || R === 1) ? 'center' :
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
