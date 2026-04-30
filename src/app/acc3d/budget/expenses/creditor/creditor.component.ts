import { Component, OnInit,ElementRef, HostListener } from '@angular/core';
import { ApiPdoService } from '../../../../_services/api-pui.service';
import { TokenStorageService } from '../../../../_services/token-storage.service';
import { first, map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-creditor',
  templateUrl: './creditor.component.html',
  styleUrls: ['./creditor.component.scss']
})
export class CreditorComponent implements OnInit {
  citizen: any;
  user: any;
  key:any;
 // param: any = { MASSAGE_CITIZEN: null }
  datatypec :any;
  datapre :any;
  dataprovince :any;
  datalist:any ;
  rowpbi:any;
  rowpbu:any;
  url = "/acc3d/budget/expenses/creditor.php";
  url1 = "/acc3d/budget/userpermission.php";
  dataAdd:any = {};
  searchTerm: any;
  selectedDevice : any;
  loading:any;


  page = 1;
  count = 0;
  tableSize = 20;
  tableSizes = [20,30,40];

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
   // this.fetchdata();
    this.fetchdatal();
    this.dataAdd.citizen =this.tokenStorage.getUser().citizen; 
    this.rowpbi=1;
    this.rowpbu='';
  }
  fetchdatal(){ 
        //ประเภทเจ้าหนี้
        this.dataAdd.opt = "GCTYPECOMPANY"; 
        this.apiService
        .getdata(this.dataAdd,this.url1)
        .pipe(first())
        .subscribe((data: any) => {
        this.datatypec = data;
        this.dataAdd.GCTYPECOMPANY_CODE = data[0].GCTYPECOMPANY_CODE;
        }); 
        //คำนำหน้า
        this.dataAdd.opt = "GCPRECOMPANY"; 
        this.apiService
        .getdata(this.dataAdd,this.url1)
        .pipe(first())
        .subscribe((data: any) => {
        this.datapre = data;
        this.dataAdd.GCPRECOMPANY_CODE = data[0].GCPRECOMPANY_CODE; 
        });
        //จังหวัด
        this.dataAdd.opt = "PROVINCE"; 
        this.apiService
        .getdata(this.dataAdd,this.url1)
        .pipe(first())
        .subscribe((data: any) => {
        this.dataprovince = data;
        this.dataAdd.PROVINCE_ID = data[0].PROVINCE_ID;
        });
  }
  // ฟังก์ชัน โชว์ปุ่ม
showinput(){
  this.rowpbi=1;
  this.rowpbu='';
} 
setshowbti(){
  this.dataAdd.FNCREDITOR_CODE = '';
  this.dataAdd.GCTYPECOMPANY_CODE = '';
  this.dataAdd.GCPRECOMPANY_CODE = '';
  this.dataAdd.FNCREDITOR_NAME = '';
  this.dataAdd.FNCREDITOR_ENAME = '';
  this.dataAdd.FNCREDITOR_BUILDING = '';
  this.dataAdd.FNCREDITOR_HADDR = '';
  this.dataAdd.FNCREDITOR_STREET = '';
  this.dataAdd.FNCREDITOR_DISTRICT = '';
  this.dataAdd.FNCREDITOR_CITY = '';
  this.dataAdd.PROVINCE_ID = '';
  this.dataAdd.FNCREDITOR_ZIPCODE = '';
  this.dataAdd.FNCREDITOR_PHONE = '';
  this.dataAdd.FNCREDITOR_EXTPHONE = '';
  this.dataAdd.FNCREDITOR_FAX = '';
  this.dataAdd.FNCREDITOR_EXTFAX = '';
  this.dataAdd.FNCREDITOR_EMAIL = '';
} 
  fetchdata(){ 
    this.dataAdd.FNCREDITOR_NAME= this.searchTerm;
    this.dataAdd.opt = "readAll"; 
    this.loading=true;
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
         //console.log('1');
       }
    }); 

  } 

   // ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
 editdata(id: any){  
  this.apiService
  .getById(id,this.url)
  .pipe(first())
  .subscribe((data: any) => {
    this.dataAdd = data[0];
    this.rowpbi='';
    this.rowpbu=1;
    //console.log(data[0]);
  });
 }
 // ฟังก์ขันสำหรับการเพิ่มข้อมูล/และแก้ไขข้อมูล
 insertdata(){  
  if(this.dataAdd.GCTYPECOMPANY_CODE =='' || this.dataAdd.GCPRECOMPANY_CODE =='' || this.dataAdd.FNCREDITOR_NAME ==''  
  || this.dataAdd.PROVINCE_ID =='' ){
     if(this.dataAdd.GCTYPECOMPANY_CODE ==''){
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกประเภทเจ้าหนี้");
      this.dataAdd.GCTYPECOMPANY_CODE.focus();
     }
     if(this.dataAdd.GCPRECOMPANY_CODE ==''){
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกคำนำหน้า");
      this.dataAdd.GCPRECOMPANY_CODE.focus();
     }
     if(this.dataAdd.FNCREDITOR_NAME ==''){
      this.toastr.warning("แจ้งเตือน:กรุณากรอกชื่อ");
      this.dataAdd.FNCREDITOR_NAME.focus();
     }
     if(this.dataAdd.PROVINCE_ID ==''){
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกจังหวัด");
      this.dataAdd.PROVINCE_ID.focus();
     }
     
  }else{
    this.dataAdd.opt = "insert";
    this.searchTerm=this.dataAdd.FNCREDITOR_NAME;
    this.apiService
     .getupdate(this.dataAdd,this.url)
     .pipe(first())
     .subscribe((data: any) => {
       //console.log(data);       
     if (data.status == 1) {
       this.toastr.success("แจ้งเตือน::เพิ่มข้อมูลเรียบร้อยแล้ว ");
       this.fetchdata();
       document.getElementById("ModalClose")?.click();

     } else {
      this.toastr.warning("แจ้งเตือน:ไม่สามารถเพิ่มข้อมูลได้");

     }
     });
   }  
 }
  //แก้ไขข้อมูล
  updatedata(){ 
    if(this.dataAdd.GCTYPECOMPANY_CODE =='' || this.dataAdd.GCPRECOMPANY_CODE =='' || this.dataAdd.FNCREDITOR_NAME ==''  
    || this.dataAdd.PROVINCE_ID =='' ){
       if(this.dataAdd.GCTYPECOMPANY_CODE ==''){
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกประเภทเจ้าหนี้");
        this.dataAdd.GCTYPECOMPANY_CODE.focus();
       }
       if(this.dataAdd.GCPRECOMPANY_CODE ==''){
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกคำนำหน้า");
        this.dataAdd.GCPRECOMPANY_CODE.focus();
       }
       if(this.dataAdd.FNCREDITOR_NAME ==''){
        this.toastr.warning("แจ้งเตือน:กรุณากรอกชื่อ");
        this.dataAdd.FNCREDITOR_NAME.focus();
       }
       if(this.dataAdd.PROVINCE_ID ==''){
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกจังหวัด");
        this.dataAdd.PROVINCE_ID.focus();
       }
       
    }else{
      this.dataAdd.opt = "update"; 
      this.apiService
       .getupdate(this.dataAdd,this.url)
       .pipe(first())
       .subscribe((data: any) => {      
       if (data.status == 1) {
         this.toastr.success("แจ้งเตือน:แก้ไขข้อมูลเรียบร้อยแล้ว");
         this.fetchdata();
        document.getElementById("ModalClose")?.click();
       } 
       });
     }
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
   fixedEncode(str: any) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
      return '%' + c.charCodeAt(0).toString(16).toUpperCase();
    });
  }

}
