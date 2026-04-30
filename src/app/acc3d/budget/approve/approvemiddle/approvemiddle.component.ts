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
defineLocale('th', thBeLocale);

@Component({
  selector: 'app-approvemiddle',
  templateUrl: './approvemiddle.component.html',
  styleUrls: ['./approvemiddle.component.scss']
})
export class ApprovemiddleComponent implements OnInit {
  url = "/acc3d/budget/approve/approve_middle.php";
  url1 = "/acc3d/budget/userpermission.php";
  dataAdd:any = {};
  datarstatus:any ;
  dataFac :any;
  dataYear :any;
  dataMiddle:any;
  loading:any;
  page = 1;
  count = 0;
  tableSize = 20;
  tableSizes = [20,30,40];
  searchTerm: any;
  rownum:any;
  rowpbi:any;
  rowpbu:any;
  datalist:any ;
  locale = 'th-be';
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
    this.dataAdd.PLMIDDLEBUDGET_ADATE=new Date(); 
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
      //console.log(this.datarstatus);
      this.datarstatus = data;
      this.dataAdd.PRIVILEGE_RSTATUS = data[0].PRIVILEGE_RSTATUS;
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
      this.dataAdd.FACULTY_CODE = data[0].FACULTY_CODE
      this.fetchdatalist();
    });
});
      //รายการปี
      var Table = {
        "opt": "viewyear"
        
      }
      this.apiService
      .getdata(Table,this.url1)
      .pipe(first())
      .subscribe((datay: any) => {
        this.dataYear = datay;
        this.dataAdd.PLYEARBUDGET_CODE = datay[0].PLYEARBUDGET_CODE;  
             //รายการงบกลาง
var Tablem = {
  "opt": "viewmiddle",
  "PLYEARBUDGET_CODE":datay[0].PLYEARBUDGET_CODE,
  "FACULTY_CODE":''
}
console.log(Tablem); 
this.apiService
.getdata(Tablem,this.url1)
.pipe(first())
.subscribe((datam: any) => {
  this.dataMiddle = datam;
  
  }); 
        });                 
} 
// ฟังก์ขันสำหรับการดึงข้อมูลครุภัณฑ์
fetchdatalist(){  
 //console.log(this.dataAdd); 
  this.dataAdd.opt = "readAll"; 
  this.loading=true;
 this.apiService
   .getdata(this.dataAdd,this.url)
   .pipe(first())
   .subscribe((data: any) => {
     if(data.status==1){
     // console.log(data); 
     this.datalist = data.data;
     this.rownum='true';
     this.loading=null;
     }else{
      this.datalist=data.data; 
       this.rownum=null;
       this.loading=null;
       this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
     }
     //this.rownum=this.datalist.length;

   });
   }
  // ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
  editdata(id: any){ 
    this.localeService.use(this.locale); 
    this.apiService
    .getById(id,this.url)
    .pipe(first())
    .subscribe((data: any) => {
      this.dataAdd.PLMIDDLEBUDGET_CODE=data[0].PLMIDDLEBUDGET_CODE;
      this.dataAdd.PLTRBUDGET_CODE=data[0].PLTRBUDGET_CODE;
      this.dataAdd.PLMIDDLEBUDGET_BOOK=data[0].PLMIDDLEBUDGET_BOOK;
      this.dataAdd.PLMIDDLEBUDGET_NAME=data[0].PLMIDDLEBUDGET_NAME;
      this.dataAdd.PLMIDDLEBUDGET_ANOTE=data[0].PLMIDDLEBUDGET_ANOTE;
      this.dataAdd.PLMIDDLEBUDGET_MONEY= this.numberWithCommas(parseFloat(data[0].PLMIDDLEBUDGET_MONEY).toFixed(2)); 
      if(data[0].PLMIDDLEBUDGET_AMONEY>0){
      this.dataAdd.PLMIDDLEBUDGET_AMONEY= this.numberWithCommas(parseFloat(data[0].PLMIDDLEBUDGET_AMONEY).toFixed(2)); 
      this.dataAdd.PLMIDDLEBUDGET_ADATE=new Date(data[0].PLMIDDLEBUDGET_ADATE2);
      }else{
        this.dataAdd.PLMIDDLEBUDGET_AMONEY= this.numberWithCommas(parseFloat(data[0].PLMIDDLEBUDGET_MONEY).toFixed(2));
        this.dataAdd.PLMIDDLEBUDGET_ANOTE=''; 
        this.dataAdd.PLMIDDLEBUDGET_ADATE=new Date(); 
      }
      //console.log((data[0].PLMIDDLEBUDGET_ADATE2));
      //console.log(new Date(data[0].PLMIDDLEBUDGET_ADATE2));
      //console.log(new Date("2023-06-05T12:00:00Z"));
    });
   }
   datenow(datenow:any){
    // let y=datenow.split(" ")
    const yyyy = datenow.getFullYear();
    let mm = datenow.getMonth() + 1; // Months start at 0!
    let dd = datenow.getDate();
      return  yyyy+'-'+mm+'-'+dd;
    
     /* if(datenow.getFullYear()>0){
      return  datenow.getFullYear();
      }else{
        let y=datenow.split("/")
        return  y[0];
      }*/
    }
 //แก้ไขข้อมูล
 updatedata(){ 
  // console.log(this.dataAdd);  
   if(this.dataAdd.PLMIDDLEBUDGET_AMONEY <0 ){
      if(this.dataAdd.PLMIDDLEBUDGET_MONEY <0){
       this.toastr.warning("แจ้งเตือน:กรุณากรอกจำนวนเงิน");
      }
     // console.log(this.dataAdd);   
   }else{
    // console.log(new Date());
     //console.log(this.dataAdd.PLMIDDLEBUDGET_ADATE);  
     //console.log(this.datenow(this.dataAdd.PLMIDDLEBUDGET_ADATE)); 
    this.dataAdd.PLMIDDLEBUDGET_ADATE1=this.datenow(this.dataAdd.PLMIDDLEBUDGET_ADATE); 
      this.dataAdd.opt = "update"; 
     this.apiService
      .getupdate(this.dataAdd,this.url)
      .pipe(first())
      .subscribe((data: any) => {      
      if (data.status == 1) {
        this.toastr.success("แจ้งเตือน:อนุมัติรายการเรียบร้อยแล้ว");
        this.fetchdatalist();
       document.getElementById("ModalClose")?.click();
      } 
      });
    }
 }
 CheckNum(num: any){
  //console.log(num.keyCode); 
        if (num.keyCode < 46 || num.keyCode > 57){
      alert('กรุณากรอกข้อมูล ที่เป็นตัวเลข');
          num.returnValue = false;
          }
     }  
   numberWithCommas(x:any) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  } 
  // ฟังก์ชัน การแสดงข้อมูลตามต้องการ
  onTableDataChange(event: any){
    this.page = event;
    this.fetchdata();
    } 
     
    
    onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.fetchdata();
    } 

}
