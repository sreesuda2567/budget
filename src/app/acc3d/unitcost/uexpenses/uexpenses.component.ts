import { Component, OnInit,ElementRef, HostListener ,ViewChild} from '@angular/core';
import { ApiPdoService } from '../../../_services/api-pui.service';
import { TokenStorageService } from '../../../_services/token-storage.service';
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


@Component({
  selector: 'app-uexpenses',
  templateUrl: './uexpenses.component.html',
  styleUrls: ['./uexpenses.component.scss']
})
export class UexpensesComponent implements OnInit {
  title = 'angular-app';
  fileName= 'report.xlsx';
  userList = [{}]

  datarstatus:any ;
  dataFac :any;
  dataYear :any;
  dataCam :any;
  dataPro :any;
  url = "/acc3d/unitcost/report/uexpenses.php";
  url1 = "/acc3d/unitcost/userpermission.php";
  datalist:any;
  datalistde:any;
  searchTerm: any;
  loading:any;
  dataAdd:any = {};
  loadingdetail:any;
  datalistdetailmoney:any;
  clickshow:any;
  locale = 'th-be';
  locales = listLocales();
  tableco = ["งปม.","นอกงปม.","งบกลาง"];
  dataitem:any=[];
  numrow:any;
  page = 1;
  count = 0;
  tableSize = 10;
  tableSizes = [5,10,20,30];
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
    this.dataAdd.PLPRODUCT_CODE='';
    this.dataAdd.DATENOWS = ''; 
    this.dataAdd.DATENOWT = ''; 
    this.dataAdd.CRPART_ID=';'
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
  fetchdataproduct(){
    this.dataAdd.opt = "viewproy";
    this.apiService
    .getdata(this.dataAdd,this.url1)
    .pipe(first())
    .subscribe((data: any) => {
      this.dataPro = data;
      
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
     this.datalist = data.datacolumn; 
     this.datalistde = data.data; 
     this.loading=null; 
     for(let i=0; i<this.datalistde.length;i++){
      this.dataitem.push(data.data[i]);
      } 
     // console.log(this.datalistde);
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
 fetchdataexpen(opt:any,plpro:any,fac:any,code:any,name:any,colum:any){ 
  this.dataAdd.opt = opt;
  this.dataAdd.FACULTY_CODE1 = fac;
  this.dataAdd.FRACCUNIT_CODE = code;
  this.dataAdd.CRPART_ID='';
  if(plpro =='16' || plpro =='17'){
  this.dataAdd.CRPART_ID = plpro;
  //console.log(11); 
  }
  //console.log(this.dataAdd.CRPART_ID);
  
  this.dataAdd.colum = colum;
  this.dataAdd.htmlStringd=name;
  this.clickshow=true;
  this.loadingdetail=true; 
  this.dataAdd.moneydetail=0;
  this.dataAdd.moneydetailo=0;
  this.dataAdd.moneydetaila=0;
  this.datalistdetailmoney = null;
  //console.log(plpro);
  this.apiService
  .getdata(this.dataAdd,this.url)
  .pipe(first())
  .subscribe(
   (data: any) => {
     this.datalistdetailmoney = data;
     this.loadingdetail=null;    
   let summoney=0;let summoneyo=0;let summoneya=0;
   for(let i=0; i<this.datalistdetailmoney.length;i++){
    // summoney += Number(this.datalistdetailmoney[i].FNEXPENSES_RMONEY);
     summoneyo += Number(this.datalistdetailmoney[i].FNEXACC_MONEY);
    // summoneya += Number(this.datalistdetailmoney[i].FNEXPENSES_AMONEY);
    }
    //this.dataAdd.moneydetail = this.numberWithCommas(summoney.toFixed(2));
    this.dataAdd.moneydetailo = this.numberWithCommas(summoneyo.toFixed(2));
    //this.dataAdd.moneydetaila = this.numberWithCommas(summoneya.toFixed(2));
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
