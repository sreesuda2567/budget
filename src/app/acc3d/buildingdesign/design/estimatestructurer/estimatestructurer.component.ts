import { Component, OnInit, ElementRef, HostListener, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-estimatestructurer',
  templateUrl: './estimatestructurer.component.html',
  styleUrls: ['./estimatestructurer.component.scss']
})
export class EstimatestructurerComponent implements OnInit {
  title = 'angular-app';
  fileName = 'report.xlsx';
  userList = [{}]

  dataYear: any;
  dataCam: any;
  dataFac: any;
  dataBuild: any
  datalist: any;
  loading: any;
  loadingdetail: any;
  dataAdd: any = {BDTYPEDATE_CODE:[],BDOPERATIONTD_SDATE:[],BDOPERATIONTD_EDATE:[],BDOPERATIONTD_TDATE:[] };
  clickshow: any;
  searchTerm: any;
  show: any;
  dataPro: any;
  datarstatus: any;
  numrow: any;
  rowpbi: any;
  rowpbu: any;
  dataAaset: any;
  locale = 'th-be';
  locales = listLocales();
  rownum: any;
  dataMyear: any;
  url = "/acc3d/buildingdesign/design/estimatestructure.php";
  url1 = "/acc3d/buildingdesign/userpermission.php";
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
    this.dataAdd.citizen = this.tokenStorage.getUser().citizen;
    this.fetchdata();
  }
  fetchdata() {
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
    //ปีงบประมาณ
    var Tabletar = {
      "opt": "viewmyear"
    }
    this.apiService
    .getdata(Tabletar,this.url1)
    .pipe(first())
    .subscribe((data: any) => {
      this.dataMyear = data;
      this.dataAdd.PLYEARBUDGET_CODE = data[0].PLYEARBUDGET_CODE;
      //this.onChangeyear();
      this.fetchdatalist();
    });

  }
    // ฟังก์ขันสำหรับการดึงปีตามแผน
onChangeyear() {
  //รายการปี
  this.dataAdd.opt = "viewyearduring";
  this.dataYear=null;
  this.apiService
    .getdata(this.dataAdd, this.url1)
    .pipe(first())
    .subscribe((data: any) => {
      this.dataYear = data;
     // this.fetchdatalist();
      //this.dataAdd.PRYEARASSET_CODE = data[0].PRYEARASSET_CODE;
    });
}
fetchdatalist() {
  this.loading = true;
  this.datalist = null;
  this.dataAdd.opt = "readAllr";
  this.apiService
    .getdata(this.dataAdd, this.url)
    .pipe(first())
    .subscribe((data: any) => {
      if (data.status == '1') {
        this.datalist = data.data;
        this.loading = null;
        this.rownum = 1;

      } else {
        this.rownum = null;
        this.loading = null;
        this.datalist = data.data;
        this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
      }
    });
}
setshowbti() {

  for(let i=0; i<4;i++){
    this.dataAdd.BDOPERATIONTD_SDATE[i] ='';
    this.dataAdd.BDOPERATIONTD_EDATE[i] ='';
    this.dataAdd.BDOPERATIONTD_TDATE[i] ='';
  }
  this.dataAdd.BDTYPEDATE_CODE[0]='10';
  this.dataAdd.BDTYPEDATE_CODE[1]='11';
  this.dataAdd.BDTYPEDATE_CODE[2]='12';
  this.dataAdd.BDTYPEDATE_CODE[3]='13';
}
// ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
editdata(id: any) {
  this.setshowbti();
  //this.dataAdd.MAINPROGRAM_CODE = name;
  // this.htmlStringd = name;
  this.apiService
    .getById(id, this.url)
    .pipe(first())
    .subscribe((data: any) => {
      this.dataAdd.BDSTRUCTURE_CODE = data[0].BDOPERATION_CODE;
      this.dataAdd.BDOPERATION_MONEY = this.numberWithCommas(parseFloat(data[0].BDOPERATION_MONEY).toFixed(2));
      this.dataAdd.BDSTRUCTURE_MONEY = this.numberWithCommas(parseFloat(data[0].BDSTRUCTURE_MONEY).toFixed(2));
      this.dataAdd.BDOPERATION_RSTATUS = data[0].BDOPERATION_RSTATUS;
      this.Checkmoney();
      if(data[0].BDFORMAT_SDATEX !=null){
        this.dataAdd.BDOPERATIONTD_SDATE[0] = new Date(data[0].BDFORMAT_SDATEX);
        this.dataAdd.BDOPERATIONTD_EDATE[0] = new Date(data[0].BDFORMAT_EDATEX);
      }
      if(data[0].BDFORMAT_TDATEX !=null){
        this.dataAdd.BDOPERATIONTD_TDATE[0] = new Date(data[0].BDFORMAT_TDATEX);
      }
      if(data[0].BDFORMAT_SDATEM !=null){ 
        this.dataAdd.BDOPERATIONTD_SDATE[1] = new Date(data[0].BDFORMAT_SDATEM);
        this.dataAdd.BDOPERATIONTD_EDATE[1] = new Date(data[0].BDFORMAT_EDATEM);
      }
      if(data[0].BDFORMAT_TDATEM !=null){
        this.dataAdd.BDOPERATIONTD_TDATE[1] = new Date(data[0].BDFORMAT_TDATEM);
      }
      if(data[0].BDFORMAT_SDATED !=null){ 
        this.dataAdd.BDOPERATIONTD_SDATE[2] = new Date(data[0].BDFORMAT_SDATED);
        this.dataAdd.BDOPERATIONTD_EDATE[2] = new Date(data[0].BDFORMAT_EDATED);
      }
      if(data[0].BDFORMAT_TDATED !=null){
        this.dataAdd.BDOPERATIONTD_TDATE[2] = new Date(data[0].BDFORMAT_TDATED);
      }
      if(data[0].BDFORMAT_SDATES !=null){  
        this.dataAdd.BDOPERATIONTD_SDATE[3] = new Date(data[0].BDFORMAT_SDATES);
        this.dataAdd.BDOPERATIONTD_EDATE[3] = new Date(data[0].BDFORMAT_EDATES);
      }
      if(data[0].BDFORMAT_TDATES !=null){
        this.dataAdd.BDOPERATIONTD_TDATE[3] = new Date(data[0].BDFORMAT_TDATES);
      }
     /* if(data[0].BDSTRUCTURE_SDATEM !=null){
        this.dataAdd.BDSTRUCTURE_SDATEM = new Date(data[0].BDSTRUCTURE_SDATEM);
        this.dataAdd.BDSTRUCTURE_EDATEM = new Date(data[0].BDSTRUCTURE_EDATEM);
        this.dataAdd.BDSTRUCTURE_SDATEP = new Date(data[0].BDSTRUCTURE_SDATEP);
        this.dataAdd.BDSTRUCTURE_EDATEP = new Date(data[0].BDSTRUCTURE_EDATEP);
        this.dataAdd.BDSTRUCTURE_SDATES = new Date(data[0].BDSTRUCTURE_SDATES);
        this.dataAdd.BDSTRUCTURE_EDATES = new Date(data[0].BDSTRUCTURE_EDATES);
        this.dataAdd.BDSTRUCTURE_SDATEMT = new Date(data[0].BDSTRUCTURE_SDATEMT);
        this.dataAdd.BDSTRUCTURE_EDATEMT = new Date(data[0].BDSTRUCTURE_EDATEMT);
        this.dataAdd.BDSTRUCTURE_MONEY = this.numberWithCommas(parseFloat(data[0].BDSTRUCTURE_MONEY).toFixed(2));
      }*/

    });
  this.rowpbi = null;
  this.rowpbu = true;
}
numberWithCommas(x: any) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}
CheckNum(num: any) {
  //console.log(num.keyCode); 
  if (num.keyCode < 46 || num.keyCode > 57) {
    alert('กรุณากรอกข้อมูล ที่เป็นตัวเลข');
    num.returnValue = false;
  }
}
Checkmoney() {
  this.dataAdd.moneyde='';  
let money1=parseFloat(this.dataAdd.BDSTRUCTURE_MONEY.replace(/,/g , ""));
let money2=parseFloat(this.dataAdd.BDOPERATION_MONEY.replace(/,/g , ""));


if(money1>money2){
  this.dataAdd.moneyde='ราคาสูง';
}
if(money2>money1){
  //console.log(11);
  this.dataAdd.moneyde='ราคาต่ำ';
}  

}
datenow(datenow: any) {
  const yyyy = datenow.getFullYear();
  let mm = datenow.getMonth() + 1; // Months start at 0!
  let dd = datenow.getDate();
  return yyyy + '-' + mm + '-' + dd;
}
//แก้ไขข้อมูล
updatedata(){ 
  if (this.dataAdd.BDOPERATIONTD_SDATE[0] != '' &&  this.dataAdd.BDOPERATIONTD_EDATE[0]== '') {
    this.toastr.warning("แจ้งเตือน:กรุณาเลือกวันที่ถอดปริมาณวัสดุให้ครบถ้วน");
}else  if (this.dataAdd.BDOPERATIONTD_SDATE[1] != '' && this.dataAdd.BDOPERATIONTD_EDATE[1]== '') {
  this.toastr.warning("แจ้งเตือน:กรุณาเลือกวันที่สืบราคาให้ครบถ้วน");
}else if (this.dataAdd.BDOPERATIONTD_SDATE[2]!= '' &&  this.dataAdd.BDOPERATIONTD_EDATE[2]== '') {
  this.toastr.warning("แจ้งเตือน:กรุณาเลือกวันที่แบ่งงวด (จัดทำแบบร่าง)ให้ครบถ้วน");
}else if (this.dataAdd.BDOPERATIONTD_SDATE[3]!= '' &&  this.dataAdd.BDOPERATIONTD_EDATE[3]== '') {
  this.toastr.warning("แจ้งเตือน:กรุณาเลือกวันที่ประชุมคณะกรรมการราคาให้ครบถ้วน");
}else {

   if(this.dataAdd.BDOPERATIONTD_TDATE[0] !=''){
    this.dataAdd.BDOPERATIONTD_TDATE[0] = this.datenow(this.dataAdd.BDOPERATIONTD_TDATE[0]);
   }


   if(this.dataAdd.BDOPERATIONTD_TDATE[1] !=''){
    this.dataAdd.BDOPERATIONTD_TDATE[1] = this.datenow(this.dataAdd.BDOPERATIONTD_TDATE[1]);
   }

   if(this.dataAdd.BDOPERATIONTD_TDATE[2] !=''){
    this.dataAdd.BDOPERATIONTD_TDATE[2] = this.datenow(this.dataAdd.BDOPERATIONTD_TDATE[2]);
   }

   if(this.dataAdd.BDOPERATIONTD_TDATE[3] !=''){
    this.dataAdd.BDOPERATIONTD_TDATE[3] = this.datenow(this.dataAdd.BDOPERATIONTD_TDATE[3]);
   }
      this.dataAdd.opt = "updater"; 
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
}
