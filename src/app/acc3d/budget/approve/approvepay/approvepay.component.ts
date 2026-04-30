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
  selector: 'app-approvepay',
  templateUrl: './approvepay.component.html',
  styleUrls: ['./approvepay.component.scss']
})
export class ApprovepayComponent implements OnInit {
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
  datalists:any;
  datalistdetail:any;
  loading:any;
  dataESection :any;
  dataEIncome :any;
  dataECrpart :any;
  dataEYear :any;
  dataPlproduct :any;
  dataMidbudget :any;
  dataType:any;
  rownum:any;
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
  url = "/acc3d/budget/approve/approve_pay.php";
  url1 = "/acc3d/budget/userpermission.php";
  dataAdd:any = {};
  dataFAdd:any = {FRACC1:[],FNEXACCCODE:[],FRACCCODE:[],FNEXACCMONEY:[],FNEXACCRDATE:[],FNEXACCDEKA:[],FNEXACCCODEC:[],FRACCCODEC:[],FNEXACCMONEYC:[],FNEXACC_DEKA:[],FNEXACC_DATE:[],FNEXACC_DATE1:[],FNEXACC_TYPE:[],FNEXACC_NUMBER:[],FNEXACC_STATUS:[]};
  page = 1;
  count = 0;
  tableSize = 20;
  tableSizes = [20,30,40];
  number: any= [1,2,3,4,5]; 
  locale = 'th-be';
  locales = listLocales();
  keyword = 'name';
  datacomplete = [];

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
    this.dataFAdd.citizen =this.tokenStorage.getUser().citizen; 
    this.dataAdd.PLMONEYPAY_CODE = '';
    this.fetchdata();
    
  }
  selectEvent(item: any,num: any) { 
    //console.log(item.id+' '+num);
   this.dataFAdd.FRACCCODEC[num] = item.id; 
 }
 onChangeSearch(val: string) {
   var varP = {
     "opt": "viewfrcc",
     "search":val
   }
   this.apiService
   .getdata(varP,this.url1)
   .pipe(first())
   .subscribe((data: any) => {
     this.datacomplete = data;   
     // console.log(data);
   }); 
 }

 applyLocale(pop: any) {
   this.localeService.use(this.locale);
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
         //รายการงบ
   var Tablep = {
          "opt": "viewPLMONEYPAY",
          "PLYEARBUDGET_CODE":data[0].PLYEARBUDGET_CODE
      }
      //console.log(Table);   
    this.apiService
    .getdata(Tablep,this.url1)
    .pipe(first())
    .subscribe((data: any) => {
      this.dataMoneypay = data;
      this.dataAdd.PLMONEYPAY_CODE = data[0].PLMONEYPAY_CODE;
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
      //รายการงบกลาง
      var Tablem = {
       "opt": "PLMIDDLEBUDGET",
       "PLYEARBUDGET_CODE":data[0].PLYEARBUDGET_CODE
     }
     this.apiService
     .getdata(Tablem,this.url1)
     .pipe(first())
     .subscribe((data: any) => {
       this.dataMidbudget = data;
       this.dataAdd.PLMIDDLEBUDGET_CODE = data[0].PLMIDDLEBUDGET_CODE;
     });
      //ผลผลิต
      var Table4 = {
       "opt": "viewPLPRODUCT",
       "PLYEARBUDGET_CODE":data[0].PLYEARBUDGET_CODE
     }     
  this.apiService
  .getdata(Table4,this.url1)
  .pipe(first())
  .subscribe((datapro: any) => {
     this.dataPlproduct = datapro;        
     //console.log(datapro);
  }); 
            //รายการงบ
            var Tablepl1 = {
             "opt": "viewPLMONEYPAY",
             "PLYEARBUDGET_CODE":data[0].PLYEARBUDGET_CODE
         }
       this.apiService
       .getdata(Tablepl1,this.url1)
       .pipe(first())
       .subscribe((data: any) => {
         this.dataPlmoneypay = data;
         this.dataAdd.PLMONEYPAY_CODE = ''; 
       });  
  });
      //ประเภทเอกสาร
      var Tablet = {
        "opt": "viewnumbertype"
      }
      this.apiService
        .getdata(Tablet, this.url1)
        .pipe(first())
        .subscribe((data: any) => {
          this.dataType = data;
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
   this.dataAdd.CRPART_ID = '';//data[0].CRPART_ID;
        //หมวดรายจ่าย
        this.dataAdd.opt = "viewCPLMONEYPAY"; 
        this.apiService
       .getdata(this.dataAdd,this.url1)
       .pipe(first())
       .subscribe((data: any) => {
         this.dataMoneypay = data;
         this.dataAdd.PLMONEYPAY_CODE =''; //data[0].PLMONEYPAY_CODE;
       });
 }); 
         //รายการบัญชีแยกประเภท
         var Table = {
           "opt": "viewTable",
           "Table":"FRACC  where   FRACC_ASTATUS =1 order by FRACC_CODE"
         }
         this.apiService
         .getdata(Table,this.url1)
         .pipe(first())
         .subscribe((data: any) => {
           this.datafrc = data;
            //console.log(data);
         });    
}
//หมวดรายจ่าย
fetchdatalistmo(){  
 this.dataAdd.opt = "viewCPLMONEYPAY"; 
// console.log(this.dataAdd);
 this.apiService
 .getdata(this.dataAdd,this.url1)
 .pipe(first())
 .subscribe((data: any) => {
   this.dataMoneypay = data;
   this.dataAdd.PLMONEYPAY_CODE = data[0].PLMONEYPAY_CODE;
 }); 
}
  //หลักสูตร
  fetchdatalistsubm(){  
   this.dataFAdd.opt = "viewSUBPLMONEYPAY"; 
   this.apiService
   .getdata(this.dataFAdd,this.url1)
   .pipe(first())
   .subscribe((data: any) => {
      this.dataESubplmoneypay = data;
   }); 
 
  }
  //เช็คตัวเลข
CheckNum(num: any){
 if (num.keyCode < 46 || num.keyCode > 57){
alert('กรุณากรอกข้อมูล ที่เป็นตัวเลข');
   num.returnValue = false;
   }
}  
fetchdatalist(){ 
this.loading=true;  
this.dataAdd.opt = 'readAll';  
this.apiService
.getdata(this.dataAdd,this.url)
.pipe(first())
.subscribe((data: any) => {
if(data.status==1){
this.datalist = data.data; 
this.loading=null;  
this.rownum=1; 

}else{
this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
this.loading=null;  
this.datalist = data.data; 
//console.log('1');
}
});
}
fetchdatalist1(){ 
this.dataAdd.opt = 'readAll1';  
this.apiService
.getdata(this.dataAdd,this.url)
.pipe(first())
.subscribe((data: any) => {
if(data.status==1){
this.datalist = data.data; 
this.loading=null;  
this.rownum=1; 
for(let i=0; i<this.datalist.length;i++){
this.dataAdd.FNEXPENSES_CODE[i] =this.datalist[i].FNEXPENSES_CODE;
this.dataAdd.PLPROJECT_CODE[i] =this.datalist[i].PLPROJECT_CODE;
this.dataAdd.PLPROJECT_RSTATUS[i] =this.datalist[i].PLPROJECT_RSTATUS;
}
}else{
this.loading=null;  
this.datalist = data.data; 
//console.log('1');
}
});
}
//ล้างข้อมูล
cleardata(){ 
  this.dataFAdd.FNEXPENSES_PDATE='';
  this.dataFAdd.FNEXPENSES_PO='';
  for(let i=0; i<this.dataFAdd.FNEXACCMONEYC.length;i++){
   // this.dataFAdd.FNEXACCCODEC[i] =null;
    this.dataFAdd.FNEXACC_DEKA[i] =null;
    this.dataFAdd.FNEXACC_DATE[i] =null;
    this.dataFAdd.FRACCCODEC[i] =null;
    this.dataFAdd.FRACC1[i] =null;
    this.dataFAdd.FNEXACCMONEYC[i] =null;
    this.dataFAdd.FNEXACC_TYPE[i] =null;
    this.dataFAdd.FNEXACC_NUMBER[i] =null;
    this.dataFAdd.FNEXACC_STATUS[i] =null;

  }
}  
// ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข 
editdata(id: any){  
  //this.dataFAdd.FRACCCODEC[0] = 0;
  this.cleardata();
 this.localeService.use(this.locale);
 this.apiService
.getById(id,this.url)
.pipe(first())
.subscribe((data: any) => {
this.datalists = data.datae;
this.showdataplid(data.datae[0].PLPROJECT_CODE);
this.dataFAdd.PLPROJECT_CODE =data.datae[0].PLPROJECT_CODE;
this.dataFAdd.PLMONEYPAY_CODE = data.datae[0].PLMONEYPAY_CODE;
this.dataFAdd.PLYEARBUDGET_CODE = data.datae[0].PLYEARBUDGET_CODE;
this.dataFAdd.FACULTY_CODE = data.datae[0].FACULTY_CODE;
this.dataFAdd.PLINCOME_CODE =data.datae[0].PLINCOME_CODE;
this.dataFAdd.CRPART_ID = data.datae[0].CRPART_ID;
this.fetchdatalistsubm();
}); 
this.apiService
.getById(id,this.url)
.pipe(first())
.subscribe((data: any) => {
this.dataFAdd.FNEXPENSES_CODE = data.datae[0].FNEXPENSES_CODE;
this.dataFAdd.PLSUBMONEYPAY_CODE = data.datae[0].PLSUBMONEYPAY_CODE;
this.dataFAdd.FNEXPENSES_TITLE = data.datae[0].FNEXPENSES_TITLE;
this.dataFAdd.FNEXPENSES_STEP = data.datae[0].FNEXPENSES_STEP;
this.dataFAdd.PLGPRODUCT_CODE = data.datae[0].PLGPRODUCT_CODE;
this.dataFAdd.FNEXPENSES_DEKA = data.datae[0].FNEXPENSES_DEKA;
this.dataFAdd.FNEXACC_TYPE[0] = 'KN'; 
this.dataFAdd.FNEXPENSES_MDATE = new Date(); 
this.dataFAdd.FNEXPENSES_CMONEY = this.numberWithCommas(parseFloat(data.datae[0].FNEXPENSES_CMONEY).toFixed(2));
this.dataFAdd.FNEXPENSES_RMONEY = 0;//this.numberWithCommas(parseFloat(data.datae[0].FNEXPENSES_CMONEY).toFixed(2));
//console.log(data.datac);
for(let i=0; i<data.datac.length;i++){
  this.dataFAdd.FRACC1[i] =data.datac[i].FRACC_TNAME+'--->'+data.datac[i].FRACC_CODE;
  this.dataFAdd.FRACCCODEC[i] =data.datac[i].FRACC_CODE;
  this.dataFAdd.FNEXACCMONEYC[i] =-(parseFloat(data.datac[i].FNEXACC_MONEY).toFixed(2));
  this.dataFAdd.FNEXACC_DEKA[i] =data.datac[i].FNEXACC_DEKA;
  this.dataFAdd.FNEXACC_TYPE[i] ='G1';
  this.dataFAdd.FNEXACC_NUMBER[i] =data.datac[i].FNEXACC_NUMBER;//'';
  this.dataFAdd.FNEXACC_DATE[i] =new Date(); 
  this.dataFAdd.FNEXPENSES_PO =data.datac[i].FNEXPENSES_PO;
  this.dataFAdd.FNEXACC_STATUS[i] =1;
  if(data.datac[i].FNEXPENSES_PDATE !=null){
  this.dataFAdd.FNEXPENSES_PDATE =new Date(data.datac[i].FNEXPENSES_PDATE); 
  }else{
    this.dataFAdd.FNEXPENSES_PDATE ='';
  }
  console.log(this.dataFAdd.FNEXPENSES_PDATE);
}
}); 


}
showmo(){
  let sum =0;
  for(let i=0; i<this.dataFAdd.FNEXACCMONEYC.length;i++){
    if(this.dataFAdd.FRACCCODEC[i] !='2116010104' && this.dataFAdd.FNEXACCMONEYC[i] >0){
    sum +=parseFloat(this.dataFAdd.FNEXACCMONEYC[i].replace(/,/g , ""));
    }
  }
  this.dataFAdd.FNEXPENSES_RMONEY =this.numberWithCommas(sum.toFixed(2));
  //console.log(sum);
}
// ฟังก์ชันสำหรับการลบข้อมูล
deleteData(id: any){
Swal.fire({
title: 'ต้องการลบข้อมูล?',
icon: 'warning',
showCancelButton: true,
confirmButtonText: 'ตกลง',
cancelButtonText: 'ยกเลิก',
}).then((result) => {
if (result.value) { 
 this.datalistdetail=null;
 this.dataAdd.id = id; 
 this.dataAdd.opt = "delete"; 
 this.apiService
 .getdata(this.dataAdd,this.url)
 .pipe(first())
 .subscribe((data: any) => {
 if(data.status==1){
 Swal.fire('ลบข้อมูล!', 'ลบข้อมูลเรียบร้อยแล้ว', 'success');     
 this.fetchdatalist1();
 }
  }); 
} else if (result.dismiss === Swal.DismissReason.cancel) {
 Swal.fire('ยกเลิก', 'ยกเลิกการลบข้อมูล', 'error');
}
});

} 
showdataplid(val:any){ 
var varP = {
"opt": "viewIDPLASSET",
"id":val
}
//console.log(varP);
this.dataAdd.htmlStringd = null;
this.apiService
.getdata(varP,this.url1)
.pipe(first())
.subscribe((data: any) => {
//this.dataEpl = data;  
if(data.length>0) 
this.dataAdd.htmlStringd = data[0].name;
//console.log(data[0]);
}); 
}
datenow(datenow:any){
  const yyyy = datenow.getFullYear();
  let mm = datenow.getMonth() + 1; // Months start at 0!
  let dd = datenow.getDate();
  return  yyyy+'-'+mm+'-'+dd;
  }
//แก้ไขข้อมูล
updatedata(){ 
  if(this.dataAdd.FNEXPENSES_DEKA==''|| this.dataAdd.FNEXPENSES_CMDATE =='' || this.dataFAdd.FRACCCODEC[0] =='' ){
    if(this.dataAdd.FNEXPENSES_DEKA ==''){
      this.toastr.warning("แจ้งเตือน:กรุณากรอกเลขฎีกา 10 ตัวอักษร");
      //this.dataAdd.FNEXPENSES_DEKA.nativeElement.focus();
     }
     if(this.dataAdd.FNEXPENSES_CMDATE ==''){
      this.toastr.warning("แจ้งเตือน:กรุณากรอกวันที่ผูกพัน");
      //this.dataAdd.FNEXPENSES_DEKA.focus();
     }
     if(this.dataFAdd.FRACCCODEC[0]==''){
      this.toastr.warning("แจ้งเตือน:กรุณากรอกเลขบัญชีแยกประเภท");
      //this.dataAdd.FNEXPENSES_DEKA[0].nativeElement.focus();
     }

  }else{ 
Swal.fire({
title: 'ต้องการอนุมัติข้อมูล?',
icon: 'warning',
showCancelButton: true,
confirmButtonText: 'ตกลง',
cancelButtonText: 'ยกเลิก',
}).then((result) => {
if (result.value) { 
  this.dataFAdd.opt = "update"; 

    this.dataFAdd.FNEXPENSES_CMDATE1=this.datenow(this.dataFAdd.FNEXPENSES_MDATE); 
    if (this.dataFAdd.FNEXPENSES_PDATE != '') {
      this.dataFAdd.FNEXPENSES_PDATE1 = this.datenow(this.dataFAdd.FNEXPENSES_PDATE);
    } else {
      this.dataFAdd.FNEXPENSES_PDATE1 = '';
    }
    for(let i=0; i<this.dataFAdd.FNEXACC_DATE.length;i++){
      if(this.dataFAdd.FNEXACC_DATE[i]){
       // console.log(i);
      this.dataFAdd.FNEXACC_DATE1[i]=this.datenow(this.dataFAdd.FNEXACC_DATE[i]); 
      }
    }
  

  this.apiService
  .getdata(this.dataFAdd,this.url)
  .pipe(first())
  .subscribe((data: any) => {
  if(data.status==1){
  Swal.fire('อนุมัติข้อมูล!', 'อนุมัติข้อมูลเรียบร้อยแล้ว', 'success');  
  document.getElementById("ModalClose")?.click();   
  this.fetchdatalist();
  }
   });
  
} else if (result.dismiss === Swal.DismissReason.cancel) {
  Swal.fire('ยกเลิก', 'ยกเลิกการอนุมัติข้อมูล', 'error');
}
});
  }

}
showdeka(){
  for(let i=0; i<this.dataFAdd.FRACC1.length;i++){
  this.dataFAdd.FNEXACC_DEKA[i] =this.dataFAdd.FNEXPENSES_DEKA;
  this.dataFAdd.FNEXACC_DATE[i] =new Date(this.dataFAdd.FNEXPENSES_MDATE);
  }
}
numberWithCommas(x:any) {
var parts = x.toString().split(".");
parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
return parts.join(".");
}
 // ฟังก์ชัน การแสดงข้อมูลตามต้องการ
 showmoney(i: any,money: any){
   this.dataAdd.MONEY[i] =this.numberWithCommas(parseFloat(money).toFixed(2));
   } 
// ฟังก์ชัน การแสดงข้อมูลตามต้องการ


onTableDataChange(event: any){
 this.page = event;
 this.fetchdatalist();
 } 
  
 
 onTableSizeChange(event: any): void {
 this.tableSize = event.target.value;
 this.page = 1;
 this.fetchdatalist();
 }    


}
