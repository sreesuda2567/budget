import { Component, OnInit,ElementRef, HostListener } from '@angular/core';
import { ApiPdoService } from '../../../../_services/api-pui.service';
import { TokenStorageService } from '../../../../_services/token-storage.service';
import { first, map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-regisasset',
  templateUrl: './regisasset.component.html',
  styleUrls: ['./regisasset.component.scss']
})
export class RegisassetComponent implements OnInit {
  datalist:any ;
  loading:any;
  rownum:any;
  rownumed:any;
  searchTerm: any;
  dataFac :any;
  dataProvince :any;
  dataSubdistrict :any;
  dataDistrict :any;
  dataAssettype :any;
  dataUnit :any;
  datalistname:any;
  url = "/acc3d/investment/register/regis_asset.php";
  url1 = "/acc3d/investment/userpermission.php";
  dataAdd:any = {};
  rowpbi:any;
  rowpbu:any;
  page = 1;
  count = 0;
  number=0;
  tableSize = 20;
  tableSizes = [20,30,40];

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
    document.getElementById("ModalClose")?.click();
    this.fetchdata();
    this.dataAdd.CITIZEN_ID = this.tokenStorage.getUser().citizen;
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
         this.dataAdd.PRIVILEGE_RSTATUS = data[0].PRIVILEGE_RSTATUS;
          // console.log(data);
          var varN = {
           "opt": "viewfac",
           "citizen":this.tokenStorage.getUser().citizen,
            "PRIVILEGERSTATUS":data[0].PRIVILEGE_RSTATUS
         }
         this.apiService
       .getdata(varN,this.url1)
       .pipe(first())
       .subscribe((datafac: any) => {
         this.dataFac = datafac;
        // console.log(data[0].FACULTY_CODE);
         this.dataAdd.FACULTY_CODE = datafac[0].FACULTY_CODE;
         this.fetchdatalist();
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
     //รายการจังหวัด
     var Tableprovince = {
      "opt": "viewprovince"
    }
    this.apiService
    .getdata(Tableprovince,this.url1)
    .pipe(first())
    .subscribe((data: any) => {
      this.dataProvince  = data;
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
  setnameasset(){
    this.dataAdd.opt = "nameprovince";
    this.apiService
    .getdata(this.dataAdd,this.url)
    .pipe(first())
    .subscribe(
     (data: any) => {
      if(data.status==1){
      this.dataAdd.PRREGISASSET_NAME = this.dataAdd.PRREGISASSET_NAME+data.name;
    }else{
       this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูลพื้นที่");
     }
    });
  } 
   // ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
 editdata(id: any){ 
  this.setshowbti();
  this.apiService
  .getById(id,this.url)
  .pipe(first())
  .subscribe((data: any) => {
    this.dataAdd.PROVINCE_ID= data[0].PROVINCE_ID;
    this.dataAdd.DISTRICT_ID= data[0].DISTRICT_ID;
    this.onChangesubdistrict(data[0].SUB_DISTRICT_ID);
    this.onChangedistrict(data[0].DISTRICT_ID);
    
    this.dataAdd.SUB_DISTRICT_ID= data[0].SUB_DISTRICT_ID;
    this.dataAdd.PLASSETTYPE_CODE= data[0].PLASSETTYPE_CODE;
    this.dataAdd.PRREGISASSET_CODE= data[0].PRREGISASSET_CODE;
    this.dataAdd.PRREGISASSET_NAME= data[0].PRREGISASSET_NAME;
    this.dataAdd.GCUNIT_CODE= data[0].GCUNIT_CODE;
   // this.dataAdd.SUB_DISTRICT_ID= data[0].SUB_DISTRICT_ID;
  });
  this.dataAdd.DISTRICT_ID= this.dataAdd.DISTRICT_ID;
  this.rowpbi=null;
  this.rowpbu=true;
 }
 onChangedistrict(deviceValue: any) {
  this.dataDistrict=null;
  this.dataAdd.opt = "viewdistrict"; 
  this.apiService
  .getdata(this.dataAdd,this.url1)
  .pipe(first())
  .subscribe((data: any) => {
    this.dataDistrict  = data;
    //console.log(this.dataAdd.DISTRICT_ID);
    /*if(deviceValue){
    this.dataAdd.DISTRICT_ID=deviceValue;
    }*/
  });         
} 
onChangesubdistrict(deviceValue: any) {
  this.dataSubdistrict=null;
  this.dataAdd.opt = "viewsubdistrict"; 
  this.apiService
  .getdata(this.dataAdd,this.url1)
  .pipe(first())
  .subscribe((data: any) => {
    this.dataSubdistrict  = data;
    /* if(deviceValue){
      this.dataAdd.SUB_DISTRICT_ID=deviceValue;
     }*/
  });  
  //console.log(Value);    
}
 // ฟังก์ขันสำหรับการเพิ่มข้อมูล
insertdata(){ 
  if(this.dataAdd.SUB_DISTRICT_ID =='' || this.dataAdd.PRREGISASSET_NAME =='' || this.dataAdd.PLASSETTYPE_CODE =='' || this.dataAdd.GCUNIT_CODE =='' ){
    if(this.dataAdd.PLASSETTYPE_CODE ==''){
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกประเภทครุภัณฑ์");
     }
     if(this.dataAdd.SUB_DISTRICT_ID ==''){
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกตำบล");
     }
     if(this.dataAdd.PRREGISASSET_NAME ==''){
      this.toastr.warning("แจ้งเตือน:กรุณากรอกชื่อครุภัณฑ์");
     } 
     if(this.dataAdd.GCUNIT_CODE ==''){
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกหน่วยนับ");
     }  
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
      this.toastr.warning("แจ้งเตือน:ไม่สามารถเพิ่มข้อมูลได้ มีรายการนี้อยู่แล้ว");

     } 
     });
   }
}
  //แก้ไขข้อมูล
updatedata(){ 
  if(this.dataAdd.SUB_DISTRICT_ID =='' || this.dataAdd.PRREGISASSET_NAME =='' || this.dataAdd.PLASSETTYPE_CODE =='' || this.dataAdd.GCUNIT_CODE =='' ){
    if(this.dataAdd.PLASSETTYPE_CODE ==''){
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกประเภทครุภัณฑ์");
     }
     if(this.dataAdd.SUB_DISTRICT_ID ==''){
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกตำบล");
     }
     if(this.dataAdd.PRREGISASSET_NAME ==''){
      this.toastr.warning("แจ้งเตือน:กรุณากรอกชื่อครุภัณฑ์");
     } 
     if(this.dataAdd.GCUNIT_CODE ==''){
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกหน่วยนับ");
     }  
    }else{
      this.dataAdd.opt = "update"; 
      this.apiService
       .getupdate(this.dataAdd,this.url)
       .pipe(first())
       .subscribe((data: any) => {      
       if (data.status == 1) {
         this.toastr.success("แจ้งเตือน:แก้ไขข้อมูลเรียบร้อยแล้ว");
         this.fetchdatalist();
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
                this.fetchdatalist();
                }
                 }); 
              } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('ยกเลิก', 'ยกเลิกการลบข้อมูล', 'error');
              }
            });
            }
setshowbti(){
  this.dataAdd.PRREGISASSET_CODE = '';
  this.dataAdd.PLASSETTYPE_CODE = '';
  this.dataAdd.PROVINCE_ID = '';
  this.dataAdd.DISTRICT_ID = '';
  this.dataAdd.SUB_DISTRICT_ID = '';
  this.dataAdd.PRREGISASSET_NAME = '';
  this.dataAdd.GCUNIT_CODE = '';
}
keyname(){
  this.dataAdd.opt = "readname";
    this.apiService
    .getdata(this.dataAdd,this.url)
    .pipe(first())
    .subscribe(
     (data: any) => {
      if(data.status==1){
      this.datalistname = data.data;
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
  showinput(){
    this.rowpbi=1;
    this.rowpbu='';
  }
}
