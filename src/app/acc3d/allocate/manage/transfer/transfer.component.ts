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
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {
  dataYear :any;
  dataCam :any;
  datalist:any ;
  dataIncome:any ;
  dataIncome2:any ;
  dataCrpart:any ;
  dataCrpart2:any ;
  dataSubplmoneypay:any ;
  dataSubplmoneypay2:any ;
  dataPlmoneypay:any ;
  dataPlmoneypay2:any ;
  dataPlproduct:any ;
  loading:any;
  dataFac:any;
  dataFacpl:any;
  datalists:any;
  url = "/acc3d/allocate/manage/transfer.php";
  url1 = "/acc3d/allocate/userpermission.php";
  dataAdd:any = {};
  locale = 'th-be';
  locales = listLocales();
  bon:any;
  page = 1;
  count = 0;
  tableSize = 20;
  tableSizes = [20,30,40];
  searchTerm: any;
  rownum:any;
  rowpbi:any;
  rowpbu:any;
  datarstatus:any;
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
    this.dataAdd.FACULTY_CODE = ''
    this.fetchdata();
    this.dataAdd.citizen =this.tokenStorage.getUser().citizen; 
    this.dataAdd.TYPEPLTR='1';
    this.dataAdd.PLPROJECT_STATUS='0';
  }
  fetchdata(){
    var varP = {
      "opt": "viewp",
      "citizen": this.tokenStorage.getUser().citizen
    }
    //ดึงรายการคณะตามสิทธิ์
    this.apiService.getdata(varP, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.datarstatus = data;
        this.dataAdd.PRIVILEGE_RSTATUS = data[0].PRIVILEGE_RSTATUS;
      });     
    var varN = {
      "opt": "viewCAMPUS"
    }
    this.apiService
  .getdata(varN,this.url1)
  .pipe(first())
  .subscribe((datacam: any) => {
    this.dataCam = datacam;
    this.dataAdd.CAMPUS_CODE = ''//datacam[0].CAMPUS_CODE;   
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
      this.fetchdatalist(); 
      this.onChangePlproduct();   
    }); 
      
  }

  fetchdatalist(){
    this.dataAdd.opt = "readAll";
    this.apiService
    .getdata(this.dataAdd,this.url)
    .pipe(first())
    .subscribe(
     (data: any) => {
      if(data.status==1){
      this.datalist = data.data;
      this.loading=null; 
      this.rownum='true';
    }else{
      this.datalist=data.data; 
      this.loading=null;
      this.rownum=null;
       this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
     }
    });
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
  
      this.apiService
      .delete(id,this.url)
      .pipe(first())
      .subscribe((data: any) => {
      if(data.status==1){
        Swal.fire('ลบข้อมูล!', 'ลบข้อมูลเรียบร้อยแล้ว', 'success');   
        this.fetchdata();
      }else{
       // console.log(data.status);
        Swal.fire('ยกเลิก', 'ไม่สามารถลบข้อมูลได้ เนื่องจากมีการใช้งาน', 'error');
      }
       }); 
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire('ยกเลิก', 'ยกเลิกการลบข้อมูล', 'error');
    }
  });
} 
onChangeCam(){
  this.dataFac=null;
  this.dataAdd.opt = "viewcfac";
  this.apiService
  .getdata(this.dataAdd,this.url1)
  .pipe(first())
  .subscribe((data: any) => {
    this.dataFac = data;    
  });
}
onChangeCampl(){
  this.dataFacpl=null;
  this.dataAdd.opt = "viewcfacall";
  this.apiService
  .getdata(this.dataAdd,this.url1)
  .pipe(first())
  .subscribe((data: any) => {
    this.dataFacpl = data;    
  });
}
onChangeIncome1(){
  this.dataIncome=null;
  this.dataAdd.opt = "viewIncome1";
  this.apiService
  .getdata(this.dataAdd,this.url1)
  .pipe(first())
  .subscribe((data: any) => {
    this.dataIncome = data;    
  });
}
onChangeIncome2(){
  this.dataIncome2=null;
  this.dataAdd.opt = "viewIncome2";
  this.apiService
  .getdata(this.dataAdd,this.url1)
  .pipe(first())
  .subscribe((data: any) => {
    this.dataIncome2 = data;    
  });
}
onChangeCrpart1(){
  this.dataCrpart=null;
  this.dataAdd.opt = "viewCRPART1";
  this.apiService
  .getdata(this.dataAdd,this.url1)
  .pipe(first())
  .subscribe((data: any) => {
    this.dataCrpart = data;
    //this.dataAdd.CRPART_ID1 = '';

  });
}
onChangeCrpart2(){
  this.dataCrpart2=null;
  this.dataAdd.opt = "viewCRPART2";
  this.apiService
  .getdata(this.dataAdd,this.url1)
  .pipe(first())
  .subscribe((data: any) => {
    this.dataCrpart2 = data;
    //this.dataAdd.CRPART_ID2 = '';

  });
}
onChangePlmoney1(){
  this.dataPlmoneypay=null;
  this.dataAdd.opt = "viewPLMONEYPAY1";
  this.apiService
  .getdata(this.dataAdd,this.url1)
  .pipe(first())
  .subscribe((data: any) => {
    this.dataPlmoneypay = data;    
  });
}
onChangePlmoney2(){
  this.dataPlmoneypay2=null;
  this.dataAdd.opt = "viewPLMONEYPAY2";
  this.apiService
  .getdata(this.dataAdd,this.url1)
  .pipe(first())
  .subscribe((data: any) => {
    this.dataPlmoneypay2 = data;    
  });
}
onChangeSubplmoney1(){
  this.dataSubplmoneypay=null;
  this.dataAdd.opt = "viewSUBPLMONEYPAY1";
  this.apiService
  .getdata(this.dataAdd,this.url1)
  .pipe(first())
  .subscribe((data: any) => {
    this.dataSubplmoneypay = data;    
  });
}
onChangeSubplmoney2(){
  this.dataSubplmoneypay2=null;
  this.dataAdd.opt = "viewSUBPLMONEYPAY2";
  this.apiService
  .getdata(this.dataAdd,this.url1)
  .pipe(first())
  .subscribe((data: any) => {
    this.dataSubplmoneypay2 = data;    
  });
}
onChangePlproduct(){
  this.dataPlproduct=null;
  this.dataAdd.opt = "viewPLPRODUCT";
  this.apiService
  .getdata(this.dataAdd,this.url1)
  .pipe(first())
  .subscribe((data: any) => {
    this.dataPlproduct = data;    
  });
}
keyword = 'name';
datacomplete = [];

selectEvent1(item: any) {
  this.dataAdd.PLPROJECT_CODE1 = item.id; 
  this.dataAdd.PLPROJECT_TYPE = item.type; 
  this.dataAdd.PLTRBUDGETD_MONEY =  parseFloat(item.money).toFixed(2); 
  
}
selectEvent2(item: any) {
  this.dataAdd.PLPROJECT_CODE2 = item.id; 
}
onChangeSearch1(val: string) {
  this.dataAdd.opt="viewPLASSET1";
  this.dataAdd.search=val;
  this.apiService
  .getdata(this.dataAdd,this.url1)
  .pipe(first())
  .subscribe((data: any) => {
    this.datacomplete = data;   
    // console.log(data);
  }); 
}
onChangeSearch2(val: string) {
  this.dataAdd.opt="viewPLASSET2";
  this.dataAdd.search=val;
  this.apiService
  .getdata(this.dataAdd,this.url1)
  .pipe(first())
  .subscribe((data: any) => {
    this.datacomplete = data;   
    // console.log(data);
  }); 
}
showinput() {
  this.rowpbi = 1;
  this.rowpbu = '';
}
setshowbti(){
 // this.dataAdd.FACULTY_CODE1 = '';
  //this.dataAdd.PLINCOME_CODE1 = '';
//  this.dataAdd.CRPART_ID1 = '';
  //this.dataAdd.PLMONEYPAY_CODE1 = '';
  //this.dataAdd.PLGPRODUCT_CODE1 = '';
  //this.dataAdd.PLSUBMONEYPAY_CODE1 = '';
 // this.dataAdd.FACULTY_CODE2 = '';
 // this.dataAdd.PLINCOME_CODE1 = '';
 // this.dataAdd.CRPART_ID2 = '';
  //this.dataAdd.PLMONEYPAY_CODE2 = '';
 // this.dataAdd.PLGPRODUCT_CODE2 = '';
 // this.dataAdd.PLSUBMONEYPAY_CODE2 = '';
  this.dataAdd.PLTRBUDGETD_DETAIL = '';
  this.dataAdd.PLTRBUDGETD_LINK = '';
  this.dataAdd.PLTRBUDGETD_CODE = '';
  this.dataAdd.PLTRBUDGETD_MONEY = '';
  this.dataAdd.PLTRBUDGETD_NOTE = '';
  this.dataAdd.PLPROJECT_CODE1 = '';
  this.dataAdd.PLPROJECT_CODE2 = '';
  this.dataAdd.PLPROJECT_NAME1 = '';
  this.dataAdd.PLPROJECT_NAME2 = '';
  this.dataAdd.PLPROJECT_STATUS='0';
  this.onChangeCam();
  this.onChangeCampl();
  }
   // ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
   editdata(id: any){  
    this.setshowbti();
   // this.onChangeCam();
    //this.onChangeIncome();
    this.apiService
    .getById(id,this.url)
    .pipe(first())
    .subscribe((data: any) => {
      this.datalists=data;
     // this.dataAdd = data[0];
     this.dataAdd.PLTRBUDGETD_DETAIL = data[0].PLTRBUDGETD_DETAIL;
     this.dataAdd.PLTRBUDGETD_LINK = data[0].PLTRBUDGETD_LINK;
     this.dataAdd.PLTRBUDGETD_CODE = data[0].PLTRBUDGETD_CODE;
     this.dataAdd.PLTRBUDGETD_MONEY = parseFloat(data[0].PLTRBUDGETD_MONEY).toFixed(2);
     this.dataAdd.PLTRBUDGETD_NOTE = data[0].PLTRBUDGETD_NOTE;
      this.dataAdd.FACULTY_CODE1 = data[0].FACULTY_CODE1;
      this.onChangeIncome1();
      this.dataAdd.PLINCOME_CODE1 = data[0].PLINCOME_CODE1;
      this.onChangeCrpart1();
      this.dataAdd.CRPART_ID1 = data[0].CRPART_ID1;
      this.onChangePlmoney1();
      this.dataAdd.PLMONEYPAY_CODE1 = data[0].PLMONEYPAY_CODE1;
      this.dataAdd.PLGPRODUCT_CODE1 = data[0].PLGPRODUCT_CODE1;
      this.onChangeSubplmoney1();
      this.dataAdd.PLSUBMONEYPAY_CODE1 = data[0].PLSUBMONEYPAY_CODE1;
      this.dataAdd.FACULTY_CODE2 = data[0].FACULTY_CODE2;
      this.onChangeIncome2();
      this.dataAdd.PLINCOME_CODE2 = data[0].PLINCOME_CODE2;
      this.onChangeCrpart2();
      this.dataAdd.CRPART_ID2 = data[0].CRPART_ID2;
      this.onChangePlmoney2();
      this.dataAdd.PLMONEYPAY_CODE2 = data[0].PLMONEYPAY_CODE2;
      this.dataAdd.PLGPRODUCT_CODE2 = data[0].PLGPRODUCT_CODE2;
      this.onChangeSubplmoney2();
      this.dataAdd.PLSUBMONEYPAY_CODE2 = data[0].PLSUBMONEYPAY_CODE2;
      this.dataAdd.PLPROJECT_CODE1 = data[0].PLPROJECT_CODE1;
      this.dataAdd.PLPROJECT_CODE2 = data[0].PLPROJECT_CODE2;
      if(data[0].PLPROJECT_NAME1){
       // console.log()
        this.dataAdd.PLPROJECT_NAME1 = data[0].PLPROJECT_NAME1;
      }
      if(data[0].PLASSET_NAME1){
        this.dataAdd.PLPROJECT_NAME1 = data[0].PLASSET_NAME1;
      }
      if(data[0].PLBUILDING_NAME1){
        this.dataAdd.PLPROJECT_NAME1 = data[0].PLBUILDING_NAME1;
      }
      if(data[0].PLPROJECTADD_NAME1){
        this.dataAdd.PLPROJECT_NAME1 = data[0].PLPROJECTADD_NAME1;
      }
      if(data[0].PLRESEARCH_NAME1){
        this.dataAdd.PLPROJECT_NAME1 = data[0].PLRESEARCH_NAME1;
      }
      if(data[0].PLPROJECT_NAME2){
        this.dataAdd.PLPROJECT_NAME2 = data[0].PLPROJECT_NAME2;
      }
      if(data[0].PLASSET_NAME2){
        this.dataAdd.PLPROJECT_NAME2 = data[0].PLASSET_NAME2;
      }
      if(data[0].PLBUILDING_NAME2){
        this.dataAdd.PLPROJECT_NAME2 = data[0].PLBUILDING_NAME2;
      }
      if(data[0].PLPROJECTADD_NAME2){
        this.dataAdd.PLPROJECT_NAME2 = data[0].PLPROJECTADD_NAME2;
      }
      if(data[0].PLRESEARCH_NAME2){
        this.dataAdd.PLPROJECT_NAME2 = data[0].PLRESEARCH_NAME2;
      }
      
      this.rowpbi='';
      this.rowpbu=1;
      //console.log(data[0]);
    });
   } 
// ฟังก์ขันสำหรับการเพิ่มข้อมู
insertdata(){ 
  if(this.dataAdd.FACULTY_CODE1 =='' || this.dataAdd.PLINCOME_CODE1 =='' || this.dataAdd.CRPART_ID1 ==''  
  || this.dataAdd.PLMONEYPAY_CODE1 ==''|| this.dataAdd.PLGPRODUCT_CODE1 ==''|| this.dataAdd.PLSUBMONEYPAY_CODE1 =='' 
  || this.dataAdd.FACULTY_CODE2 =='' || this.dataAdd.PLINCOME_CODE2 =='' || this.dataAdd.CRPART_ID2 ==''  
  || this.dataAdd.PLMONEYPAY_CODE2 ==''|| this.dataAdd.PLGPRODUCT_CODE2 ==''|| this.dataAdd.PLSUBMONEYPAY_CODE2 =='' 
  || this.dataAdd.PLTRBUDGETD_MONEY =='' || this.dataAdd.PLTRBUDGETD_DETAIL =='' ){
   this.toastr.warning("แจ้งเตือน:กรุณากรอกข้อมูลให้ครบถ้วน");
  }else{
  this.dataAdd.opt = "insert"; 
  this.apiService
  .getupdate(this.dataAdd,this.url)
  .pipe(first())
  .subscribe((data: any) => {
    //console.log(data.status);       
  if (data.status == 1) {
    this.toastr.success("แจ้งเตือน:เพิ่มข้อมูลเรียบร้อยแล้ว");
    this.fetchdatalist();
    document.getElementById("ModalClose")?.click();
  }else {
   this.toastr.warning("แจ้งเตือน:ไม่สามารถเพิ่มข้อมูลได้ ไม่มียอดจัดสรร");
  
  } 
  });
  }
  }  
  //แก้ไขข้อมูล
updatedata() {
  this.dataAdd.opt = "update";
  this.apiService
   .getupdate(this.dataAdd, this.url)
   .pipe(first())
   .subscribe((data: any) => {
     //console.log(data.status);       
     if (data.status == 1) {
       this.fetchdatalist();
       //this.fetchdatalist();
       this.toastr.success("แจ้งเตือน:แก้ไขข้อมูลเรียบร้อยแล้ว");
       document.getElementById("ModalClose")?.click();
     }
   });
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
