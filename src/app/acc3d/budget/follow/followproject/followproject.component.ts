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
defineLocale('th', thBeLocale);
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-followproject',
  templateUrl: './followproject.component.html',
  styleUrls: ['./followproject.component.scss']
})
export class FollowprojectComponent implements OnInit {
  title = 'angular-app';
  fileName= 'report.xlsx';
  userList = [{}]

  datarstatus:any ;
  dataFac :any;
  dataIncome :any;
  dataCrpart :any ;
  dataMoneypay :any;
  dataYear :any;
  dataPlmoneypay :any;
  dataSubplmoneypay :any;
  datalist:any;
  datalistresearch:any;
  datalists:any;
  datalistdetail:any;
  datalistex:any;
  datalisttd:any;
  datalisttdp:any;
  datalisttdpl:any;
  loading:any;
  dataESection :any;
  dataEIncome :any;
  dataECrpart :any;
  dataEYear :any;
  dataPlproduct :any;
  dataMidbudget :any;
  dataAdd:any = {};
  dataFAdd:any = {PLPROJECTDRESULTC:[],PLPROJECTDRESULTP:[],PLPROJECTDCODE:[],PLPROJECTDPCODE:[]};
  rownum:any;
  rownumre:any;
  rowpl:any;
  rowpm:any;
  rowpbi:any;
  rowpbu:any;
  pp:any;
  dataESubplmoneypay :any;
  dataEDepartment :any;
  datafrc :any;
  dataEpl :any ;
  searchTerm: any;
  statusreport: any;
  statusreportp: any;
  url = "/acc3d/budget/follow/followproject.php";
  url1 = "/acc3d/budget/userpermission.php";
  page = 1;
  count = 0;
  tableSize = 10;
  tableSizes = [10,20,30];
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
    this.dataFAdd.citizen =this.tokenStorage.getUser().citizen; 
    this.dataFAdd.PLTRACPROSIECT_PERSONO=''; 
    this.dataFAdd.PLTRACPROSIECT_DETAIL=''; 
    this.dataFAdd.PLTRACPROSIECT_PERSONS=''; 
    this.dataFAdd.PLTRACPROSIECT_PERSONP=''; 
    this.dataFAdd.PLTRACPROSIECT_PERCENT='';
    this.dataAdd.PLPROJECTTYPE=1;
    this.rownum=null; 
    this.rownumre=true;  
  }
  fetchdata(){
    //ดึงคณะตามสังกัด
    var varN = {
     "opt": "viewufac",
     "citizen":this.tokenStorage.getUser().citizen
   }
   this.apiService
 .getdata(varN,this.url1)
 .pipe(first())
 .subscribe((data: any) => {
   this.dataAdd.UFACULTY_CODE = data[0].FACULTY_CODE;
   this.dataAdd.UCAMPUS_CODE = data[0].CAMPUS_CODE;
 
 });
     var varP = {
      "opt": "viewp",
      "citizen":this.tokenStorage.getUser().citizen
    }
       //ดึงรายการคณะตามสิทธิ์
    this.apiService.getdata(varP,this.url1)
    .pipe(first())
    .subscribe((data: any) => {
      this.datarstatus = data;
      this.dataAdd.PRIVILEGE_RSTATUS=data[0].PRIVILEGE_RSTATUS;
       var varN = {
        "opt": "viewfac",
        "citizen":this.tokenStorage.getUser().citizen,
         "PRIVILEGERSTATUS":data[0].PRIVILEGE_RSTATUS
      }
      this.apiService
    .getdata(varN,this.url1)
    .pipe(first())
    .subscribe((data: any) => {
      this.dataFac = data;
     // console.log(data[0].FACULTY_CODE);
      this.dataAdd.FACULTY_CODE = data[0].FACULTY_CODE;
 
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
   }
      //ภาคเงิน
  fetchdatalistcr(){  
        this.dataAdd.opt = "viewCRPART"; 
        this.apiService
        .getdata(this.dataAdd,this.url1)
        .pipe(first())
        .subscribe((data: any) => {
          this.dataCrpart = data;
          this.dataAdd.CRPART_ID = data[0].CRPART_ID;
        }); 
}
       fetchdatalist(){ 
        this.dataAdd.opt = 'readAll';
        this.loading=true;
        this.datalist = null;
        this.datalistresearch = null;
        this.apiService
       .getdata(this.dataAdd,this.url)
       .pipe(first())
       .subscribe((data: any) => {
        if(data.status==1){
         this.datalist = data.data; 
         this.datalistresearch= data.dataresearch; 
         this.loading=null;  
         this.rownum=1; 
         if(this.datalist.length==0 && this.datalistresearch.length==0){
          this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
          this.datalist = data.data; 
         }

         for(let i=0; i<this.datalist.length;i++){
          this.dataAdd.FNEXPENSES_CODE[i] =this.datalist[i].FNEXPENSES_CODE;
          this.dataAdd.PLPROJECT_CODE[i] =this.datalist[i].PLPROJECT_CODE;
          this.dataAdd.PLPROJECT_RSTATUS[i] =this.datalist[i].PLPROJECT_RSTATUS;
        }
        }
      });
       }  
       numberWithCommas(x:any) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
      }
       editdata(id: any,type: any){ 
        this.localeService.use(this.locale);
        this.dataAdd.opt = 'readone';  
        this.dataAdd.id=id;
        this.dataFAdd.PLPROJECTTYPE1=type;
        this.dataAdd.PLPROJECTTYPE1=type;
        //console.log(this.dataAdd.PLPROJECTTYPE1);
        this.apiService
       .getdata(this.dataAdd,this.url)
       .pipe(first())
       .subscribe((data: any) => {//datalisttd
        if(data.status==1){
        //this.dataFAdd= data.data[0];
        //console.log(data.data[0].PLPROJECT_RSTATUS);
        //this.dataFAdd.PLPROJECT_RSTATUS= data.data[0].PLPROJECT_RSTATUS;
        this.dataFAdd.PLPROJECT_PSTATUS= data.data[0].PLPROJECT_PSTATUS;
        this.showinput(data.data[0].PLPROJECT_PSTATUS);
       /* if(data.data[0].PLPROJECT_PSTATUS==0){
          //console.log(1);
          this.statusreport=true;
          this.statusreportp=null;PLPROJECT_RDETAIL
        }*/
        this.dataFAdd.PLTRACPROSIECT_NAME= data.data[0].PLTRACPROSIECT_NAME;
        this.dataFAdd.PLTRACPROSIECT_TEL= data.data[0].PLTRACPROSIECT_TEL;
        this.dataFAdd.PLPROJECT_RSTATUS= data.data[0].PLPROJECT_RSTATUS;
        this.dataFAdd.PLPROJECT_CODE= data.data[0].PLPROJECT_CODE;
        this.dataFAdd.PLPROJECT_NAME= data.data[0].PLPROJECT_NAME;
        this.dataFAdd.PLPROJECT_RDETAIL= data.data[0].PLPROJECT_RDETAIL;
        if(data.data[0].PLTRACPROSIECT_PERCENT !=''){  
         this.dataFAdd.PLTRACPROSIECT_PERCENT= data.data[0].PLTRACPROSIECT_PERCENT;
        }else{
          this.dataFAdd.PLTRACPROSIECT_PERCENT='';
        } 
        if(data.data[0].PLTRACPROSIECT_PERSONP !=''){  
        this.dataFAdd.PLTRACPROSIECT_PERSONP= data.data[0].PLTRACPROSIECT_PERSONP;
        }else{
          this.dataFAdd.PLTRACPROSIECT_PERSONP='';  
        }
        if(data.data[0].PLTRACPROSIECT_PERSONS !=''){  
        this.dataFAdd.PLTRACPROSIECT_PERSONS= data.data[0].PLTRACPROSIECT_PERSONS;
         }else{
        this.dataFAdd.PLTRACPROSIECT_PERSONS=''; 
         } 
        if(data.data[0].PLTRACPROSIECT_PERSONO !=''){  
           this.dataFAdd.PLTRACPROSIECT_PERSONO= data.data[0].PLTRACPROSIECT_PERSONO;
         }else{
           this.dataFAdd.PLTRACPROSIECT_PERSONO=''; 
         }
         if(data.data[0].PLTRACPROSIECT_DETAIL !=''){ 
            this.dataFAdd.PLTRACPROSIECT_DETAIL= data.data[0].PLTRACPROSIECT_DETAIL;
          }else{
            
            this.dataFAdd.PLTRACPROSIECT_DETAIL=''; 
        }
        if(data.data[0].PLTRACPROSIECT_SDATE !=null){
          this.dataFAdd.PLTRACPROSIECT_SDATE = new Date(data.data[0].PLTRACPROSIECT_SDATE); 
          this.dataFAdd.PLTRACPROSIECT_EDATE = new Date(data.data[0].PLTRACPROSIECT_EDATE); 
        }else{
          this.dataFAdd.PLTRACPROSIECT_SDATE ='';
          this.dataFAdd.PLTRACPROSIECT_EDATE ='';
        } 
        if(data.data[0].PLPROJECT_RDATE !=null){
          this.dataFAdd.PLPROJECT_RDATE = new Date(data.data[0].PLPROJECT_RDATE); 
        } 
        this.datalists= data.data; 
        this.datalistex= data.dataex;
        this.datalisttd= data.datatd;
        this.datalisttdp= data.datatdp;
        this.datalisttdpl= data.datatdpl;
       // console.log(this.datalisttd.length);
       for(let i=0; i<this.datalisttd.length;i++){
        this.dataFAdd.PLPROJECTDRESULTC[i]= this.datalisttd[i].PLPROJECTD_RESULT;
        this.dataFAdd.PLPROJECTDCODE[i]= this.datalisttd[i].PLPROJECTD_CODE;
       }
       for(let i=0; i<this.datalisttdp.length;i++){
        this.dataFAdd.PLPROJECTDRESULTP[i]= this.datalisttdp[i].PLPROJECTD_RESULT;
        this.dataFAdd.PLPROJECTDPCODE[i]= this.datalisttdp[i].PLPROJECTD_CODE;
       }
      // console.log(this.dataFAdd.PLPROJECTDRESULTC[0]);
        let summoney=0;let summoneyre=0;
        for(let i=0; i<this.datalistex.length;i++){
          console.log(this.datalistex[i].FNEXPENSES_RMONEY);
          summoney += Number(this.datalistex[i].FNEXPENSES_RMONEY);
          summoneyre += Number(this.datalistex[i].FNEXPENSES_AMONEY-this.datalistex[i].FNEXPENSES_CMONEY-this.datalistex[i].FNEXPENSES_RMONEY);
        }
        
        this.dataAdd.moneydetail = this.numberWithCommas(summoney.toFixed(2));
        this.dataAdd.moneydetailre = this.numberWithCommas(summoneyre.toFixed(2));
        }else{
          this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
        } 
        //console.log(this.datalists);
       });
       }   
       CheckNum(num: any){
        //console.log(num.keyCode); 
              if (num.keyCode < 46 || num.keyCode > 57){
            alert('กรุณากรอกข้อมูล ที่เป็นตัวเลข');
                num.returnValue = false;
                }
           }      
  //แก้ไขข้อมูล
  updatedata(){ 
    this.dataFAdd.PLPROJECTTYPE=this.dataAdd.PLPROJECTTYPE;  
    if(this.dataFAdd.PLPROJECT_PSTATUS ==0 && (this.dataFAdd.PLTRACPROSIECT_SDATE =='' || this.dataFAdd.PLTRACPROSIECT_EDATE =='' || this.dataFAdd.PLTRACPROSIECT_PERCENT ==''
    || this.dataFAdd.PLTRACPROSIECT_NAME =='' || this.dataFAdd.PLTRACPROSIECT_TEL =='' || this.dataFAdd.PLTRACPROSIECT_PERSONP =='' 
    || this.dataFAdd.PLTRACPROSIECT_PERSONS =='' || this.dataFAdd.PLTRACPROSIECT_PERSONO =='')){
       if(this.dataFAdd.PLTRACPROSIECT_SDATE ==''){
        this.toastr.warning("แจ้งเตือน:กรุณากรอกวันที่ดำเนินโครงการ");
       }
       if(this.dataFAdd.PLTRACPROSIECT_EDATE ==''){
        this.toastr.warning("แจ้งเตือน:กรุณากรอกวันที่สิ้นสุดโครงการ");
       }
       if(this.dataFAdd.PLTRACPROSIECT_PERCENT ==''){
        this.toastr.warning("แจ้งเตือน:กรุณากรอกร้อยละความพึงพอใจของผู้เข้าร่วม");
       }
       if(this.dataFAdd.PLTRACPROSIECT_NAME ==''){
        this.toastr.warning("แจ้งเตือน:กรุณากรอกชื่อเจ้าของโครงการ");
       }
       if(this.dataFAdd.PLTRACPROSIECT_TEL ==''){
        this.toastr.warning("แจ้งเตือน:กรุณากรอกเบอร์โทรติดต่อ");
       }
       if(this.dataFAdd.PLTRACPROSIECT_PERSONP ==''){
        this.toastr.warning("แจ้งเตือน:กรุณากรอกจำนวนบุคลากร");
       }
       if(this.dataFAdd.PLTRACPROSIECT_PERSONS ==''){
        this.toastr.warning("แจ้งเตือน:กรุณากรอกจำนวนนักศึกษา");
       }
       if(this.dataFAdd.PLTRACPROSIECT_PERSONO ==''){
        this.toastr.warning("แจ้งเตือน:กรุณากรอกจำนวนบุคลากรภายนอก");
       }
      }if(this.dataFAdd.PLPROJECT_PSTATUS ==1 && (this.dataFAdd.PLPROJECT_RDETAIL =='' || this.dataFAdd.PLPROJECT_RDATE =='')){
        if(this.dataFAdd.PLPROJECT_RDATE ==''){
          this.toastr.warning("แจ้งเตือน:กรุณากรอกวันที่สามารถรายงานผลได้");
         }
         if(this.dataFAdd.PLPROJECT_RDETAIL ==''){
          this.toastr.warning("แจ้งเตือน:กรุณากรอกระบุสาเหตุ");
         }
      }else{
        if(this.dataFAdd.PLPROJECT_PSTATUS ==0 ){

        this.dataFAdd.PLTRACPROSIECT_SDATE1=this.datenow(this.dataFAdd.PLTRACPROSIECT_SDATE);
        this.dataFAdd.PLTRACPROSIECT_EDATE1=this.datenow(this.dataFAdd.PLTRACPROSIECT_EDATE);
        }
        if(this.dataFAdd.PLPROJECT_PSTATUS ==1 ){
          this.dataFAdd.PLPROJECT_RDATE1=this.datenow(this.dataFAdd.PLPROJECT_RDATE);  
        }
        this.dataFAdd.opt = "update";    
      this.apiService
    .getdata(this.dataFAdd,this.url)
    .pipe(first())
    .subscribe((data: any) => {
      //console.log(1);
      if(data.status==1){
        this.toastr.success("แจ้งเตือน:บันทึกข้อมูลเรียบร้อยแล้ว");
        this.fetchdatalist();
        document.getElementById("ModalClose")?.click();
      }
    }); 
      }   

  }
  datenow(datenow:any){
    const yyyy = datenow.getFullYear();
    let mm = datenow.getMonth() + 1; // Months start at 0!
    let dd = datenow.getDate();
    return  yyyy+'-'+mm+'-'+dd;
    } 

  showinput(value:any){
    //console.log(value);
    if(value==1){
    this.statusreport=null;
    this.statusreportp=true;
    this.dataFAdd.PLPROJECT_RSTATUS=3;
    }else{
    this.statusreport=true; 
    this.statusreportp=null;
    }

  }  
  onTableDataChange(event: any){
        this.page = event;
        this.fetchdatalist();
  } 
         
        
  onTableSizeChange(event: any): void {
        this.tableSize = event.target.value;
        this.page = 1;
        this.fetchdatalist();
  }  
  exportexcel(): void
  {
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);
  
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
    /* save to file */  
    XLSX.writeFile(wb, this.fileName);
  
  } 
  printModalPdf() {
    const printContent = document.getElementById('printArea');
    if (!printContent) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>รายละเอียดโครงการ - ${this.dataFAdd.PLPROJECT_NAME}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700&display=swap');
            * { box-sizing: border-box; }
            body {
              font-family: 'TH Sarabun New', 'Sarabun', 'Tahoma', sans-serif;
              padding: 20px;
              font-size: 14pt;
              color: #333;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 0;
            }
            td, th {
              border: 1px solid #dee2e6;
              padding: 8px 10px;
              vertical-align: top;
            }
            .bg-warning {
              background-color: #ffc107 !important;
            }
            .bg-info {
              background-color: #0dcaf0 !important;
            }
            .text-danger { color: #dc3545 !important; }
            .text-white { color: #fff !important; }
            td[bgcolor="#999999"], tr[bgcolor="#999999"], [bgcolor="#999999"] {
              background-color: #999999 !important;
              color: #000;
              font-weight: bold;
              text-align: center;
            }
            strong { font-weight: bold; }
            .d-print-none { display: none !important; }
            .row { display: flex; flex-wrap: wrap; }
            .col-md-11 { flex: 0 0 91.66%; max-width: 91.66%; }
            .col-md-1 { flex: 0 0 8.33%; max-width: 8.33%; }
            .table { width: 100%; margin-bottom: 0; }
            .table-bordered td, .table-bordered th { border: 1px solid #dee2e6; }
            .table-hover tbody tr:hover { background-color: rgba(0,0,0,.075); }
            @media print {
              body { margin: 0; padding: 15px; }
              .d-print-none { display: none !important; }
              .bg-warning { background-color: #ffc107 !important; }
              .bg-info { background-color: #0dcaf0 !important; }
              td[bgcolor="#999999"], tr[bgcolor="#999999"], [bgcolor="#999999"] {
                background-color: #999999 !important;
              }
            }
            @page {
              size: A4;
              margin: 15mm;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    }, 800);
  }
}
