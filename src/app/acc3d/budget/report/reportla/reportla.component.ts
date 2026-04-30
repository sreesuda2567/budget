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
  selector: 'app-reportla',
  templateUrl: './reportla.component.html',
  styleUrls: ['./reportla.component.scss']
})
export class ReportlaComponent implements OnInit {
  title = 'angular-app';
  fileName= 'report.xlsx';
  userList = [{}]
  dataYear :any;
  dataCam :any;
  datalist:any ;
  loading:any;
  dataAdd:any = {};
  clickshow:any;
  searchTerm: any;
  dataFac :any;
  datarstatus:any;
  numrow:any;
  locale = 'th-be';
  locales = listLocales();
  rownum:any;
  url = "/acc3d/budget/report/reportla.php";
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
    this.dataAdd.date_type='FNEXPENSES_DATE';
    this.dataAdd.PLSUBMONEYPAY_CODE='';
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
    
    if(this.dataAdd.DATENOWS !=''){
      this.applyLocale('thBeLocale');
      this.dataAdd.DATENOWS1=this.datenow(this.dataAdd.DATENOWS);
      this.dataAdd.DATENOWT2=this.datenow(this.dataAdd.DATENOWT);
      }else{
      this.dataAdd.DATENOWS1='';
      this.dataAdd.DATENOWT2='';  
      //console.log(this.dataAdd.DATENOWS);  
      }

      this.loading=true;
      this.datalist=null;
      this.dataAdd.opt = "readAll"; 
      this.apiService
      .getdata(this.dataAdd,this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if(data.status=='1'){
        this.datalist = data.data;
        this.loading=null;
        this.rownum=1; 
        }else{
          this.rownum=null;
          this.loading=null; 
          this.datalist=data.data;
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
              const length = String(cell.v).length;
              if (length > max_width) max_width = length;
            }
          }
          colWidths.push({ wch: max_width + 2 });
        }
        ws['!cols'] = colWidths;
      
        // ใส่ border + alignment ให้ทุกเซลล์
        for (let R = range.s.r; R <= range.e.r; ++R) {
          for (let C = range.s.c; C <= range.e.c; ++C) {
            const cell_ref = XLSX.utils.encode_cell({ c: C, r: R });
            const cell = ws[cell_ref];
            if (!cell) continue;
      
            if (R === 0) {
              // หัวตาราง
              cell.s = {
                fill: {
                  patternType: "solid",
                  fgColor: { rgb: "D9E1F2" }, // สีฟ้าอ่อน
                },
                font: {
                  bold: true,
                  color: { rgb: "000000" },
                },
                alignment: {
                  horizontal: "center",
                  vertical: "center",
                  wrapText: true,
                },
                border: {
                  top: { style: "thin", color: { rgb: "000000" } },
                  bottom: { style: "thin", color: { rgb: "000000" } },
                  left: { style: "thin", color: { rgb: "000000" } },
                  right: { style: "thin", color: { rgb: "000000" } },
                }
              };
            } else {
              // ข้อมูลทั่วไป
              cell.s = {
                alignment: {
                  horizontal: C === 0 ? "center" : "left", // ✅ เงื่อนไขจัดกึ่งกลางเฉพาะคอลัมน์แรก
                  vertical: "center",
                  wrapText: true,
                },
                border: {
                  top: { style: "thin", color: { rgb: "000000" } },
                  bottom: { style: "thin", color: { rgb: "000000" } },
                  left: { style: "thin", color: { rgb: "000000" } },
                  right: { style: "thin", color: { rgb: "000000" } },
                }
              };
            }
          }
        }
      
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, this.fileName);
      }
}
