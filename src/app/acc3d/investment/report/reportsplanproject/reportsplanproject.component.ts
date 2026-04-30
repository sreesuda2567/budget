import { Component, OnInit,ElementRef, HostListener } from '@angular/core';
import { ApiPdoService } from '../../../../_services/api-pui.service';
import { TokenStorageService } from '../../../../_services/token-storage.service';
import { first, map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import * as XLSX from 'xlsx';
import * as XLSX from 'xlsx-js-style';
@Component({
  selector: 'app-reportsplanproject',
  templateUrl: './reportsplanproject.component.html',
  styleUrls: ['./reportsplanproject.component.scss']
})
export class ReportsplanprojectComponent implements OnInit {
  title = 'angular-app';
  fileName= 'report.xlsx';
  userList = [{}]
  datarstatus:any ;
  dataFac :any;
  dataIncome :any;
  dataCrpart :any;
  dataYear :any;
  dataUnit :any;
  dataProduct :any;
  dataAssettype :any;
  dataProvince :any;
  dataSubdistrict :any;
  dataDistrict :any;
  dataTagget :any;
  dataSection :any;
  datatype:any;
  dataCourse :any;
  dataSub :any;
  dataPsub :any=[];
  datalist:any ;
  dataPstatus:any ;
  dataPlproduct :any;
  datalistyear:any ;
  dataCam :any;
  datadetail :any;
  datalistdetail :any;
  url = "/acc3d/investment/report/reportsplanproject.php";
  url1 = "/acc3d/investment/userpermission.php";
  dataAdd:any = {};
  loading:any;
  rownum:any;
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
    this.dataAdd.PLGPRODUCT_CODE='';
    this.dataAdd.PRASSET_RSTATUS='';
    this.dataAdd.PLPROJECTTYPE='';
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
        this.dataAdd.PRIVILEGERSTATUS =data[0].PRIVILEGE_RSTATUS;
         // console.log(data);
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
          "opt": "viewrfac",
          "citizen":this.tokenStorage.getUser().citizen,
          "PRIVILEGERSTATUS":data[0].PRIVILEGE_RSTATUS,
          "CAMPUS_CODE": datacam[0].CAMPUS_CODE
        }
        // console.log(Tablesub);
        this.apiService
        .getdata(Tablesub,this.url1)
        .pipe(first())
        .subscribe((data: any) => {
          this.dataFac = data;
          this.dataAdd.FACULTY_CODE =data[0].FACULTY_CODE;
        });
      });            //สถานะ
            var Tabletar = {
              "opt": "viewPRSTATUS",
              "PRIVILEGERSTATUS":data[0].PRIVILEGE_RSTATUS
            }
            this.apiService
            .getdata(Tabletar,this.url1)
            .pipe(first())
            .subscribe((data: any) => {
              this.dataPstatus = data;
            }); 
      }); 
      
          //รายการประเภทเงิน
          var Tablein = {
            "opt": "viewincome"
          }
          this.apiService
          .getdata(Tablein,this.url1)
          .pipe(first())
          .subscribe((data: any) => {
            this.dataIncome = data;
            this.dataAdd.PLINCOME_CODE = '';//data[0].PLINCOME_CODE;
           // this.showHide('dataAdd.type',this.dataAdd.PLINCOME_CODE);
          // console.log(data[0].PLINCOME_CODE);
          }); 

           //รายการปี
           var Tabley = {
            "opt": "viewyear"
          }
          this.apiService
          .getdata(Tabley,this.url1)
          .pipe(first())
          .subscribe((data: any) => {
          //  console.log(data);
            this.dataYear = data;
            this.dataAdd.SPRYEARASSET_CODE = data[0].PLYEARBUDGET_CODE;
            this.dataAdd.EPRYEARASSET_CODE = data[0].PLYEARBUDGET_CODE;
                //รายการภาค
                var Table2 = {
                  "opt": "viewcrpart",
                  "PRYEARASSET_CODE":data[0].PLYEARBUDGET_CODE,
                  "FACULTY_CODE": "",
                  "PLINCOME_CODE": "01"
                }
                 //  console.log(Table2);
                    this.apiService
                    .getdata(Table2,this.url1)
                    .pipe(first())
                    .subscribe((datacr: any) => {
                      console.log(datacr);
                      this.dataCrpart = datacr;
                      this.dataAdd.CRPART_ID = '';//datacr[0].CRPART_ID;
                    }); 
      
          });   
         
         //รายการหน่วยนับ
      var Tablegc = {
        "opt": "viewgcunit"
      }
      this.apiService
      .getdata(Tablegc,this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataUnit = data;
  
      }); 
       
      //รายการผลิต
      var Tablepro = {
        "opt": "viewpro"
      }
      this.apiService
      .getdata(Tablepro,this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataProduct  = data;
  
      }); 
       //รายการประเภทครุภัณฑ์
       var Tablest = {
        "opt": "viewtstype"
      }
      this.apiService
      .getdata(Tablest,this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataAssettype  = data;
  
      }); 
 //ผลผลิต
 var Table4 = {
  "opt": "viewpro"
}     
this.apiService
.getdata(Table4,this.url1)
.pipe(first())
.subscribe((datapro: any) => {
this.dataPlproduct = datapro;        
//console.log(datapro);
});         
      this.dataAdd.CITIZEN_ID = this.tokenStorage.getUser().citizen;
      this.dataAdd.citizen = this.tokenStorage.getUser().citizen;
        }
//ภาคเงิน
fetchdatalistcr(){  
  this.dataAdd.opt = "viewcrpart"; 
  this.apiService
  .getdata(this.dataAdd,this.url1)
  .pipe(first())
  .subscribe((data: any) => {
   //  console.log(data);
    this.dataCrpart = data;
    this.dataAdd.CRPART_ID = data[0].CRPART_ID;
 
  }); 
}
fetchdataCam(){
  this.dataAdd.opt = "viewrfac";
  this.apiService
  .getdata(this.dataAdd,this.url1)
  .pipe(first())
  .subscribe((data: any) => {
    this.dataFac = data;
    this.dataAdd.FACULTY_CODE ='';//data[0].FACULTY_CODE;
    
  });
}
  // ฟังก์ขันสำหรับการดึงข้อมูลครุภัณฑ์
  fetchdatalist(){ 
    this.datalist = null; 
    this.datalistyear = null; 
    this.loading=true; 
    this.dataAdd.opt = "readAll";
    this.rownum= null;
    this.apiService
    .getdata(this.dataAdd,this.url)
    .pipe(first())
    .subscribe(
     (data: any) => {
      if(data.status==1){
      this.datalist = data.data;
      this.datalistyear = data.datayear;
      this.datadetail = data.datadetail;
      this.datalistdetail= data.datalistdetail;
      this.dataAdd.PLINCOME_NAME=data.PLINCOME_NAME; 
      this.dataAdd.PRSTATUS_NAME=data.PRSTATUS_NAME;
      this.rownum=data.numth; 
     // console.log(this.rownum);
      this.loading=null; 
    }else{
      this.datalist=data.data; 
      this.datalistdetail= data.datalistdetail;
      this.loading=null;
       this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
     }
    });
  }   
  /*exportexcel(): void
  {

 let element = document.getElementById('excel-table');
 let elementdetail = document.getElementById('excel-tabledetail');
 const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
 const wsdetail: XLSX.WorkSheet =XLSX.utils.table_to_sheet(elementdetail);


 const wb: XLSX.WorkBook = XLSX.utils.book_new();
 const wbdetail: XLSX.WorkBook = XLSX.utils.book_new();
 XLSX.utils.book_append_sheet(wb, ws, 'สรุปแผนความต้องการ');
 XLSX.utils.book_append_sheet(wb, wsdetail, 'รายการโครงการ');
 

    XLSX.writeFile(wb, this.fileName);
 
  }   */
  exportexcel(): void {
       let table = document.getElementById('excel-table') as HTMLTableElement;
       let tableDetail = document.getElementById('excel-tabledetail') as HTMLTableElement;
   
       if (!table || !tableDetail) {
           console.error("Table elements not found");
           return;
       }
   
       // ✅ แปลง HTML Table เป็น Sheet
       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);
       const wsDetail: XLSX.WorkSheet = XLSX.utils.table_to_sheet(tableDetail);
   
       // ✅ จัดกึ่งกลางหัวข้อหลัก
       this.centerAlignHeader(ws);
       this.centerAlignHeader(wsDetail);
   
       // ✅ ใส่สีให้แถวต่าง ๆ ตามเงื่อนไข
       this.applyRowStyles(ws);
       this.applyRowStyles(wsDetail);
   
       // ✅ ตั้งค่ารูปแบบตัวเลข
       this.formatNumbers(ws);
       this.formatNumbers(wsDetail);
   
       // ✅ ปรับขนาดคอลัมน์ให้อัตโนมัติ
       this.autoFitColumns(ws);
       this.autoFitColumns(wsDetail);
   
       // ✅ เพิ่ม Sheet ลง Workbook
       XLSX.utils.book_append_sheet(wb, ws, "รายงานแผนความต้องการ");
       XLSX.utils.book_append_sheet(wb, wsDetail, "รายการโครงการ");
   
       // ✅ บันทึกไฟล์ Excel
       XLSX.writeFile(wb, "รายงานแผนความต้องการรายการโครงการ.xlsx");
   }
   
   // ✅ ฟังก์ชันจัดกึ่งกลางหัวข้อหลัก (3 แถวแรกไม่มีสี)
   centerAlignHeader(ws: XLSX.WorkSheet) {
       const headers = ["A1", "A2", "A3"];
       headers.forEach(headerCell => {
           if (ws[headerCell]) {
               if (!ws[headerCell].s) ws[headerCell].s = {};
               ws[headerCell].s.alignment = { horizontal: "center", vertical: "center" };
               ws[headerCell].s.font = { bold: true, size: 14 };
           }
       });
   
       // ✅ รวมเซลล์ให้ข้อความอยู่ตรงกลาง (ไม่มีสีพื้นหลัง)
       ws["!merges"] = [
           { s: { r: 0, c: 0 }, e: { r: 0, c: 12 } },
           { s: { r: 1, c: 0 }, e: { r: 1, c: 12 } },
           { s: { r: 2, c: 0 }, e: { r: 2, c: 12 } }
       ];
   }
   
   // ✅ ฟังก์ชันกำหนดสีให้แถวต่าง ๆ (แถวที่ 4-5 เป็นสีเทา)
   applyRowStyles(ws: XLSX.WorkSheet) {
       const range = XLSX.utils.decode_range(ws["!ref"] || "");
   
       for (let R = range.s.r; R <= range.e.r; ++R) {
           if (R < 3) continue; // ✅ ข้าม 3 แถวแรก ไม่ต้องใส่สี
   
           const firstCellRef = XLSX.utils.encode_cell({ r: R, c: 0 });
           const firstCell = ws[firstCellRef];
   
           if (firstCell && typeof firstCell.v === "string") {
               const cellValue = firstCell.v.trim();
               let bgColor = "";
   
               if (R === 3 || R === 4) {
                   bgColor = "D3D3D3"; // ✅ สีเทา (แถวที่ 4-5)
               } else if (cellValue.includes("รวมทั้งหมด")) {
                   bgColor = "F4A460"; // ✅ สีส้มอ่อน
               } else if (isNaN(Number(cellValue))) {
                   bgColor = "A7E3FF"; // ✅ สีฟ้าอ่อน
               }
   
               if (bgColor) {
                   for (let C = range.s.c; C <= range.e.c; ++C) {
                       const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
                       if (!ws[cellRef]) ws[cellRef] = { v: "", t: "s" };
   
                       ws[cellRef].s = {
                           fill: { patternType: "solid", fgColor: { rgb: bgColor } },
                           font: { bold: true, color: { rgb: "000000" } },
                           alignment: { horizontal: "right", vertical: "right" }
                       };
                   }
               }
           }
       }
   }
   
   // ✅ ฟังก์ชันกำหนดรูปแบบตัวเลข (คอลัมน์ "รายการ" ทศนิยม 1 ตำแหน่ง)
   formatNumbers(ws: XLSX.WorkSheet) {
       const range = XLSX.utils.decode_range(ws["!ref"] || "");
       for (let R = range.s.r; R <= range.e.r; ++R) {
           for (let C = range.s.c; C <= range.e.c; ++C) {
               const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
               const cell = ws[cellRef];
   
               if (cell && typeof cell.v === "number") {
                   if (C === 0) {
                       cell.z = "0"; // ✅ ช่องลำดับ เป็นตัวเลขธรรมดา ไม่มีทศนิยม
                   } else if (C >= 3 && (C % 2 === 1)) {
                       cell.z = "#,##0.00"; // ✅  คอลัมน์งบประมาณ มีทศนิยม 2 ตำแหน่ง
                   } else if (C >= 3) {
                       cell.z = "#,##0"; // ✅ คอลัมน์ "รายการ" ไม่มีทศนิยม
                   } else {
                       cell.z = "#,##0"; // ✅ ตัวเลขอื่นๆ 
                   }
               }
           }
       }
   }
   
   // ✅ ฟังก์ชันปรับขนาดคอลัมน์ให้อัตโนมัติ
   autoFitColumns(ws: XLSX.WorkSheet) {
       const range = XLSX.utils.decode_range(ws["!ref"] || "");
       const colWidths: number[] = Array(range.e.c + 1).fill(10);
   
       for (let R = range.s.r; R <= range.e.r; R++) {
           for (let C = range.s.c; C <= range.e.c; C++) {
               const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
               const cell = ws[cellRef];
               if (cell && cell.v) {
                   colWidths[C] = Math.max(colWidths[C], cell.v.toString().length + 5);
               }
           }
       }
       ws["!cols"] = colWidths.map(w => ({ wch: w }));
   }
}
