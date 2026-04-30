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
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-reportincome',
  templateUrl: './reportincome.component.html',
  styleUrls: ['./reportincome.component.scss']
})
export class ReportincomeComponent implements OnInit {
  title = 'angular-app';
  fileName= 'report.xlsx';
  userList = [{}]

  dataYear :any;
  dataCam :any;
  datalist:any ;
  datalistpay:any ;
  datalistpayd:any ;
  loading:any;
  loadingdetail:any;
  dataAdd:any = {};
  clickshow:any;
  searchTerm: any;
  show: any;
  dataFac :any;
  dataCrpart :any;
  dataPro :any;
  datarstatus:any;
  dataIncome :any;
  dataCrcourse: any;
  numrow:any;
  locale = 'th-be';
  locales = listLocales();
  Momoney= 0;
  Mamoney= 0;
  Mcmoney= 0;
  Mrmoney= 0;
  rownum:any;
  url = "/acc3d/budget/report/reportincome.php";
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
    this.localeService.use(this.locale);
    this.fetchdata();
    this.dataAdd.citizen =this.tokenStorage.getUser().citizen;
    this.dataAdd.PLINCOME_CODE='02';
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
        var Tablecr = {
          "opt": "viewCRCOURSE"
        }
        this.apiService
        .getdata(Tablecr,this.url1)
        .pipe(first())
        .subscribe((data: any) => {
          this.dataCrcourse = data;
          this.dataAdd.CRCOURSE_ID = data[0].CRCOURSE_ID;
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

    //ภาคเงิน
    fetchdatalistcr(){  
      this.dataAdd.CRPART_ID ='';
      this.dataAdd.opt = "viewCRPART"; 
      this.apiService
      .getdata(this.dataAdd,this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataCrpart = data;
       // this.dataAdd.CRPART_ID = data[0].CRPART_ID;
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
      this.datalistpay=null;
      this.dataAdd.opt = "readAll"; 
      this.apiService
      .getdata(this.dataAdd,this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if(data.status=='1'){
        this.datalist = data.data;
        this.datalistpay= data.data2;
        this.datalistpayd= data.data3;
        this.dataAdd.numpay= data.data3.length;
        this.dataAdd.CAMPUS_NAME=data.CAMPUS_NAME;
        this.dataAdd.CRCOURSE_TNAME=data.CRCOURSE_TNAME;
        this.loading=null;
        this.rownum=1; 
        //console.log(this.datalist.FACULTY);
        }else{
          this.rownum=null;
          this.loading=null; 
          this.datalist=data.data;
          this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล"); 
        }
      }); 
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
}
