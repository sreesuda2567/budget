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
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listgf',
  templateUrl: './listgf.component.html',
  styleUrls: ['./listgf.component.scss']
})
export class ListgfComponent implements OnInit {

  dataYear :any;
  dataCam :any;
  datalist:any ;
  loading:any;
  url = "/acc3d/budget/manage/gf.php";
  url1 = "/acc3d/budget/userpermission.php";
  dataAdd:any = {CHECK3D_GF_MONEYAL:[],CHECK3D_GF_MONEYGF:[],CHECK3D_GF_CODE:[],PLSUBMONEYPAY_CODE:[],PLGPRODUCT_CODE:[]};
  locale = 'th-be';
  locales = listLocales();
  bon:any;
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
    this.localeService.use(this.locale);
    //this.dataAdd.CHECK3D_GF_DATE=new Date(); 

  }
  fetchdata(){
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
    //ดึงวันที่
    var varN = {
      "opt": "viewdategf",
      "citizen":this.tokenStorage.getUser().citizen
    }
    this.apiService
  .getdata(varN,this.url1)
  .pipe(first())
  .subscribe((data: any) => {
    //console.log(data.date);
    this.dataAdd.CHECK3D_GF_DATE = new Date(data.date);
  
  });
}
fetchdatalist(){
  this.applyLocale('thBeLocale');
  this.dataAdd.CHECK3D_GF_DATE1=this.datenow(this.dataAdd.CHECK3D_GF_DATE); 
  //console.log(this.datenow(this.dataAdd.CHECK3D_GF_DATE));  
  this.dataAdd.moneybl1=0;
  this.dataAdd.moneybl2=0;
  this.datalist=null;
  this.loading=true;
  this.dataAdd.opt = "readAll"; 
  this.dataAdd.CHECK3D_GF_MONEYAL=[];
  this.dataAdd.CHECK3D_GF_MONEYGF=[];
  this.dataAdd.CHECK3D_GF_CODE=[];
  this.dataAdd.PLSUBMONEYPAY_CODE=[];
  this.dataAdd.PLGPRODUCT_CODE=[];
  this.apiService
  .getdata(this.dataAdd,this.url)
  .pipe(first())
  .subscribe((data: any) => {
    this.bon=1;
    this.loading=null;
    this.datalist = data.data;
    let monall=0;
    let monmon=0;
    for(let i=0; i<this.datalist.length;i++){
      this.dataAdd.CHECK3D_GF_MONEYAL[i] =this.numberWithCommas(parseFloat(this.datalist[i].CHECK3D_GF_MONEYAL).toFixed(2));
      this.dataAdd.CHECK3D_GF_MONEYGF[i] =this.numberWithCommas(parseFloat(this.datalist[i].CHECK3D_GF_MONEYGF).toFixed(2));
      this.dataAdd.CHECK3D_GF_CODE[i] =this.datalist[i].CHECK3D_GF_CODE;
      this.dataAdd.PLSUBMONEYPAY_CODE[i] =this.datalist[i].PLSUBMONEYPAY_CODE;
      this.dataAdd.PLGPRODUCT_CODE[i] =this.datalist[i].PLGPRODUCT_CODE;
       monall +=parseFloat(this.datalist[i].CHECK3D_GF_MONEYAL);
      monmon +=parseFloat(this.datalist[i].CHECK3D_GF_MONEYGF)
    }
    this.dataAdd.moneybl1=this.numberWithCommas(monall.toFixed(2));;
    this.dataAdd.moneybl2=this.numberWithCommas(monmon.toFixed(2));;
  }); 
  //console.log(this.dataAdd.moneybl1);
}
numberWithCommas(x:any) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}
datenow(datenow:any){
  const yyyy = datenow.getFullYear();
  let mm = datenow.getMonth() + 1; // Months start at 0!
  let dd = datenow.getDate();
  return  yyyy+'-'+mm+'-'+dd;
  }
  applyLocale(pop: any) {
    this.localeService.use(this.locale);
   // pop.hide();
   // pop.show();
  }
// ฟังก์ขันสำหรับการเพิ่มข้อมูล/และแก้ไขข้อมูล
insertdata(){ 
  this.applyLocale('thBeLocale');
  this.dataAdd.CHECK3D_GF_DATE1=this.datenow(this.dataAdd.CHECK3D_GF_DATE); 
  this.dataAdd.opt = "insert"; 
    this.apiService
     .getdata(this.dataAdd,this.url)
     .pipe(first())
     .subscribe((data: any) => {
       //console.log(data.status);       
     if (data.status == 1) {
       this.toastr.success("แจ้งเตือน:เพิ่มข้อมูลเรียบร้อยแล้ว");
       this.fetchdatalist();
     } 
     });
}
}
