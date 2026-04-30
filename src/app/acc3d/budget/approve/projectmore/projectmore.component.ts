import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
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
  selector: 'app-projectmore',
  templateUrl: './projectmore.component.html',
  styleUrls: ['./projectmore.component.scss']
})
export class ProjectmoreComponent implements OnInit {
  title = 'angular-app';
  fileName = 'report.xlsx';
  userList = [{}]

  datarstatus: any;
  dataFac: any;
  dataIncome: any;
  dataCrpart: any;
  dataMoneypay: any;
  dataYear: any;
  dataPlmoneypay: any;
  dataSubplmoneypay: any;
  datalist: any;
  datalistresearch: any;
  datalists: any;
  datalistdetail: any;
  datalistex: any;
  datalisttd: any;
  datalisttdp: any;
  loading: any;
  dataESection: any;
  dataEIncome: any;
  dataECrpart: any;
  dataEYear: any;
  dataPlproduct: any;
  dataMidbudget: any;
  dataPlan: any;
  dataPlme: any;
  dataPlansub: any;
  dataPlmeasures: any;
  dataPlandicator: any;
  dataPstrategy: any;
  dataEProjecttype: any;
  dataSearchtype: any;
  dataPstatus: any;
  dataFAdd: any = {};
  dataAdd: any = {PLPROJECTD_CODE: [], PLPROJECTD_RSTATUS: [], PLPROJECTD_NAME: [], PLPROJECTD_VALUE: [], PLINDICATOR_CODE: [], PLPROJECTGROUPDT_NAME: [] };
  dataPlm: any;
  dataPls: any;
  dataPli: any;
  dataPlp: any;
  rownum: any;
  rownumre: any;
  rowpl: any;
  rowpm: any;
  rowpbi: any;
  rowpbu: any;
  pp: any;
  number: any = [1, 2, 3, 4, 5];
  dataESubplmoneypay: any;
  dataEDepartment: any;
  datafrc: any;
  dataEpl: any;
  searchTerm: any;
  statusreport: any;
  statusreportp: any;
  url = "/acc3d/budget/approve/projectmore.php";
  url1 = "/acc3d/allocate/userpermission.php";
  url2 = "/acc3d/budget/userpermission.php";
  page = 1;
  count = 0;
  tableSize = 10;
  tableSizes = [10, 20, 30];
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
    private localeService: BsLocaleService
  ) { }

  ngOnInit(): void {
        this.fetchdata();
    this.dataAdd.citizen = this.tokenStorage.getUser().citizen;
    this.dataAdd.PLTRACPROSIECT_PERSONO = '';
    this.dataAdd.PLTRACPROSIECT_DETAIL = '';
    this.dataAdd.PLTRACPROSIECT_PERSONS = '';
    this.dataAdd.PLTRACPROSIECT_PERSONP = '';
    this.dataAdd.PLTRACPROSIECT_PERCENT = '';
    this.dataAdd.PLPROJECTTYPE = 1;
    this.rownum = true;
    this.rownumre = true;
    this.localeService.use(this.locale);
    this.applyLocale('thBeLocale');
    this.rownum = null;
    this.dataAdd.PLINCOME_CODE = 13;
    this.fetchdatalistcr();
    this.dataAdd.CRPART_ID = '00';
  }
 applyLocale(pop: any) {
    this.localeService.use(this.locale);
  }
  fetchdata() {
    var varP = {
      "opt": "viewp",
      "citizen": this.tokenStorage.getUser().citizen
    }
    //ดึงรายการคณะตามสิทธิ์
    this.apiService.getdata(varP, this.url2)
      .pipe(first())
      .subscribe((data: any) => {
        this.datarstatus = data;
        this.dataAdd.PRIVILEGE_RSTATUS = data[0].PRIVILEGE_RSTATUS;
        var varN = {
          "opt": "viewfac",
          "citizen": this.tokenStorage.getUser().citizen,
          "PRIVILEGERSTATUS": data[0].PRIVILEGE_RSTATUS
        }
        this.apiService
          .getdata(varN, this.url2)
          .pipe(first())
          .subscribe((data: any) => {
            this.dataFac = data;
            // console.log(data[0].FACULTY_CODE);
            this.dataAdd.FACULTY_CODE = data[0].FACULTY_CODE;
            this.fetchdatalist();

          });
      });
    //รายการประเภทเงิน
    var Table = {
      "opt": "viewTable",
      "Table": "PLINCOME where PLINCOME_ASTATUS=1"
    }
    this.apiService
      .getdata(Table, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataIncome = data;
        //this.dataAdd.PLINCOME_CODE = data[0].PLINCOME_CODE;
      });

    //รายการปี
    var Tabley = {
      "opt": "viewyear"
      
    }
    this.apiService
      .getdata(Tabley, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataYear = data;
        this.dataAdd.PLYEARBUDGET_CODE = data[0].PLYEARBUDGET_CODE;
        //รายการภาค
        var Table2 = {
          "opt": "viewCRPART",
          "PLYEARBUDGET_CODE": data[0].PLYEARBUDGET_CODE,
          "FACULTY_CODE": "",
          "PLINCOME_CODE": ""
        }
        this.apiService
          .getdata(Table2, this.url1)
          .pipe(first())
          .subscribe((data: any) => {
            this.dataCrpart = data;
            //this.dataAdd.CRPART_ID = data[0].CRPART_ID;
          });
        //ยุทธศาสตร์ 
        var Tablepl = {
          "opt": "viewPLSTRATEGY",
          "PRYEARASSET_CODE": data[0].PLYEARBUDGET_CODE
        }
        this.apiService
          .getdata(Tablepl, this.url1)
          .pipe(first())
          .subscribe((data: any) => {
            this.dataPstrategy = data;
          }); 
          var Table1 = {
            "opt": "viewPLPRODUCT",
            "PLYEARBUDGET_CODE": data[0].PLYEARBUDGET_CODE
          }
          this.apiService
          .getdata(Table1,this.url1)
          .pipe(first())
          .subscribe((data: any) => {
            this.dataPlproduct = data;    
          }); 
      });
     //ลักษณะโครงการ
     var Table4 = {
      "opt": "viewPLPROJECTTYPE"
    }
    this.apiService
      .getdata(Table4, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataEProjecttype = data;
       // this.dataAdd.PLPROJECTTYPE_CODE = data[0].PLPROJECTTYPE_CODE;
        //this.fetchdataPLINDICATOR();
      });  
   //ลักษณะโครงการ dataPstatus
   var Table5 = {
    "opt": "viewPLRESEARCHTYPE"
  }
  this.apiService
    .getdata(Table5, this.url1)
    .pipe(first())
    .subscribe((data: any) => {
      this.dataSearchtype = data;
    });  
    var Table6 = {
      "opt": "viewPLPROJECTPSTATUS"
    }
    this.apiService
      .getdata(Table6, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataPstatus = data;
      });        
  }
  //ภาคเงิน
  fetchdatalistcr() {
    this.dataAdd.opt = "viewCRPART";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataCrpart = data;
        this.dataAdd.CRPART_ID = data[0].CRPART_ID;
        //this.fetchdatalist();
      });
  }
    //ภาคเงิน
changmoneypay() {
this.dataPlmoneypay =null;  
this.dataAdd.opt = 'viewPLMONEYPAY';
this.apiService
  .getdata(this.dataAdd, this.url2)
  .pipe(first())
  .subscribe((data: any) => {
    this.dataPlmoneypay = data;
   // this.dataAdd.PLMONEYPAY_CODE = data[0].PLMONEYPAY_CODE;
    this.fetchdatalistsubm();
  });
    }
    keyword = 'name';
    datacomplete = [];
    selectEvent(item: any) {
      this.dataAdd.PLPROJECT_HCITIZEN = item.id; 
      this.dataAdd.PLPROJECT_HEADER = item.name; 
      this.dataAdd.PLPROJECT_HPHONE = item.TELEPHONE; 
      //console.log(item);
    }
    onChangeSearch(val: string) {
      var varP = {
        "opt": "viewNAME",
        "search":val,
        "FACULTY_CODE":this.dataAdd.FACULTY_CODE
      }
      this.apiService
      .getdata(varP,this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.datacomplete = data; 
        this.dataAdd.PRPLPROJECT_HPHONE = data[0].TELEPHONE;   
        // console.log(data);
      }); 
    } 
           
  fetchdatalist() {
    this.dataAdd.opt = 'readAll';
    this.loading = true;
    this.datalist = null;
    this.datalistresearch = null;
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == 1) {
          this.datalist = data.data;
          this.datalistresearch = data.dataresearch;
          this.loading = null;
          this.rownum = null;
          this.rownum = 'true';
          if (this.datalist.length == 0 && this.datalistresearch.length == 0) {
            this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
            this.datalist = data.data;
            this.rownum = null;
          }

          for (let i = 0; i < this.datalist.length; i++) {
            this.dataAdd.FNEXPENSES_CODE[i] = this.datalist[i].FNEXPENSES_CODE;
            this.dataAdd.PLPROJECT_CODE[i] = this.datalist[i].PLPROJECT_CODE;
            //this.dataAdd.PLPROJECT_RSTATUS[i] = this.datalist[i].PLPROJECT_RSTATUS;
          }
        }
      });
  }
  numberWithCommas(x: any) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
  showdata(id: any, type: any) {
    this.localeService.use(this.locale);
    this.dataAdd.opt = 'readshow';  
    this.dataAdd.id=id;
    this.dataAdd.PLPROJECTTYPE1=type;
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
   // this.dataFAdd.PLPROJECT_RSTATUS= data.data[0].PLPROJECT_RSTATUS;
    this.dataFAdd.PLPROJECT_CODE= data.data[0].PLPROJECT_CODE;
    this.dataFAdd.PLPROJECT_NAME= data.data[0].PLPROJECT_NAME;
    this.dataFAdd.PLPROJECT_RDETAIL= data.data[0].PLPROJECT_RDETAIL;
    //this.dataFAdd.PLPROJECT_RSTATUS= data.data[0].PLPROJECT_RSTATUS;
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
    
   /*for(let i=0; i<this.datalisttd.length;i++){
    this.dataFAdd.PLPROJECTDRESULTC[i]= this.datalisttd[i].PLPROJECTD_RESULT;
    this.dataFAdd.PLPROJECTDCODE[i]= this.datalisttd[i].PLPROJECTD_CODE;
   }
   for(let i=0; i<this.datalisttdp.length;i++){
    this.dataFAdd.PLPROJECTDRESULTP[i]= this.datalisttd[i].PLPROJECTD_RESULT;
    this.dataFAdd.PLPROJECTDPCODE[i]= this.datalisttd[i].PLPROJECTD_CODE;
   }*/
   //console.log(3);
    let summoney=0;let summoneyre=0;
     console.log(this.datalistex.length); 
    for(let i=0; i<this.datalistex.length;i++){
     
      summoney += Number(this.datalistex[i].FNEXPENSES_RMONEY);
      summoneyre += Number(this.datalistex[i].FNEXPENSES_AMONEY-this.datalistex[i].FNEXPENSES_RMONEY);
    }
    
    this.dataFAdd.moneydetail = this.numberWithCommas(summoney.toFixed(2));
    this.dataFAdd.moneydetailre = this.numberWithCommas(summoneyre.toFixed(2));
    }else{
      this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
    } 
    //console.log(this.datalists);
   });
  }
  editdata(id: any, type: any) {
    this.setshowbti();
    this.localeService.use(this.locale);
    this.dataAdd.opt = 'readone';  
    this.dataAdd.id=id;
    this.dataAdd.PLPROJECTTYPE1=type;
    this.apiService
   .getdata(this.dataAdd,this.url)
   .pipe(first())
   .subscribe((data: any) => {//datalisttd
    if(data.status==1){
    this.changmoneypay();
    this.dataAdd.PLPROJECT_CODE= data.data[0].PLPROJECT_CODE;
    this.dataAdd.PLPROJECT_NAME= data.data[0].PLPROJECT_NAME;
    this.dataAdd.PLPROJECT_TIME= data.data[0].PLPROJECT_TIME;
    this.dataAdd.PLGPRODUCT_CODE= data.data[0].PLGPRODUCT_CODE;
    this.dataAdd.PLMONEYPAY_CODE= data.data[0].PLMONEYPAY_CODE;
    this.dataAdd.PLPROJECT_DETAIL= data.data[0].PLPROJECT_DETAIL;
    this.dataAdd.PLSUBMONEYPAY_CODE= data.data[0].PLSUBMONEYPAY_CODE;
    this.dataAdd.PLPROJECTTYPE_CODE= data.data[0].PLPROJECTTYPE_CODE;
    this.dataAdd.PLPROJECT_PERSONS= data.data[0].PLPROJECT_PERSONS;
    this.dataAdd.PLPROJECT_PERSONP= data.data[0].PLPROJECT_PERSONP;
    this.dataAdd.PLPROJECT_PERSONO= data.data[0].PLPROJECT_PERSONO;
    this.dataAdd.PLPROJECT_MONEY=   parseFloat(data.data[0].PLPROJECT_MONEY).toFixed(2);
    this.dataAdd.PLPROJECT_ASTATUS= data.data[0].PLPROJECT_ASTATUS;
    this.dataAdd.PLRESEARCHTYPE_CODE= data.data[0].PLRESEARCHTYPE_CODE;
    this.dataAdd.PLPROJECT_DETAIL= data.data[0].PLPROJECT_DETAIL;
    //console.log(data.data[0].PLPROJECT_RSTATUS);
    //if(data.data[0].PLPROJECT_DETAIL !=''){
      
    //this.dataAdd.PLPROJECT_DETAIL= data.data[0].PLPROJECT_DETAIL;
    //console.log(this.dataAdd.PLPROJECT_DETAIL.length);
    //}
    this.dataAdd.PRPLPROJECT_HEADER1= data.data[0].PLPROJECT_HEADER;
    this.dataAdd.PLPROJECT_HEADER = data.data[0].PLPROJECT_HEADER;
    this.dataAdd.PLPROJECT_HPHONE= data.data[0].PLPROJECT_HPHONE;
    this.dataAdd.PLPROJECT_SDATE = new Date(data.data[0].PLPROJECT_SDATE); 
    this.dataAdd.PLPROJECT_EDATE = new Date(data.data[0].PLPROJECT_EDATE); 
    this.dataAdd.PLSTRATEGY_CODE= data.data[0].PLSTRATEGY_CODE;
    this.fetchdataPLESTIMATEPLAN();
    this.dataAdd.PLESTIMATEPLAN_CODE= data.data[0].PLESTIMATEPLAN_CODE;
    this.fetchdataPLSTRATEGIES();
    this.dataAdd.PLSTRATEGIES_CODE= data.data[0].PLSTRATEGIES_CODE;
    this.fetchdataPLMEASURES();
    this.dataAdd.PLMEASURES_CODE= data.data[0].PLMEASURES_CODE;
    this.fetchdataPLPLAND();
    this.dataAdd.PLPLAND_CODE= data.data[0].PLPLAND_CODE;
    this.fetchdataPLMISSION();
    this.datalisttd= data.datatd;
    this.datalisttdp= data.datatdp;
    //this.dataAdd.PLPROJECTD_CODE=[];
   // this.dataAdd.PLPROJECTD_RSTATUS=[];
   // this.dataAdd.PLPROJECTD_NAME=[];
    //this.dataAdd.PLPROJECTD_VALUE=[];
    //this.dataAdd.PLINDICATOR_CODE=[];
    for(let i=0; i<this.number.length;i++){
        this.dataAdd.PLPROJECTD_CODE[i]='';
        this.dataAdd.PLPROJECTD_RSTATUS[i]= '';
        this.dataAdd.PLPROJECTD_NAME[i]= '';
        this.dataAdd.PLPROJECTD_VALUE[i]= '';
        this.dataAdd.PLINDICATOR_CODE[i]='';
     }
    for(let i=0; i<this.datalisttd.length;i++){
      this.dataAdd.PLPROJECTD_CODE[i]= this.datalisttd[i].PLPROJECTD_CODE;
      this.dataAdd.PLPROJECTD_RSTATUS[i]= this.datalisttd[i].PLPROJECTD_RSTATUS;
      this.dataAdd.PLPROJECTD_NAME[i]= this.datalisttd[i].PLPROJECTD_NAME;
      this.dataAdd.PLPROJECTD_VALUE[i]= this.datalisttd[i].PLPROJECTD_VALUE;
      this.dataAdd.PLINDICATOR_CODE[i]= this.datalisttd[i].PLINDICATOR_CODE;
     }

     this.rowpbi='';
     this.rowpbu=1;
    }else{
      this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
    } 
    //console.log(this.datalists);
   });
  }
  showinputb() {
    this.rowpbi = 1;
    this.rowpbu = '';
  }
  CheckNum(num: any) {
    //console.log(num.keyCode); 
    if (num.keyCode < 46 || num.keyCode > 57) {
      alert('กรุณากรอกข้อมูล ที่เป็นตัวเลข');
      num.returnValue = false;
    }
  }
  //แก้ไขข้อมูล
  updatedata() {

    if (this.dataAdd.PLPROJECT_NAME == '' || this.dataAdd.PLPROJECT_SDATE == '' || this.dataAdd.PLPROJECT_EDATE == '' 
      || this.dataAdd.PLGPRODUCT_CODE == '' || this.dataAdd.PLPROJECTTYPE_CODE == '' || this.dataAdd.PLMONEYPAY_CODE == ''
      || this.dataAdd.PLSUBMONEYPAY_CODE == '' || this.dataAdd.PRPLPROJECT_HEADER1 == '' || this.dataAdd.PLPROJECT_HPHONE == ''
      || this.dataAdd.PLPROJECT_MONEY == ''|| this.dataAdd.PLSTRATEGY_CODE == ''|| this.dataAdd.PLESTIMATEPLAN_CODE == ''
      || this.dataAdd.PLSTRATEGIES_CODE == ''|| this.dataAdd.PLMEASURES_CODE == ''|| this.dataAdd.PLPLAND_CODE == '') {
      if (this.dataAdd.PLPROJECT_NAME == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาชื่อโครงการ");
      }
      if (this.dataAdd.PLPROJECT_SDATE == '' ||this.dataAdd.PLPROJECT_EDATE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกวันที่ดำเนินโครงการ");
      }
      if (this.dataAdd.PLGPRODUCT_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกผลผลิต");
      }
      if (this.dataAdd.PRPLPROJECT_HEADER1 == '' || this.dataAdd.PLPROJECT_HPHONE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกชื่อเจ้าของโครงการและเบอร์โทร");
      }
      if (this.dataAdd.PLPROJECTTYPE_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกลักษณะโครงการ");
      }
      if (this.dataAdd.PLSTRATEGY_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกยุทธศาสตร์");
      }
      if (this.dataAdd.PLESTIMATEPLAN_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกเป้าประสงค์");
      }

      if (this.dataAdd.PLSTRATEGIES_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกกลยุทธ์");
      }
      if (this.dataAdd.PLMEASURES_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกมาตรการ");
      }
      if (this.dataAdd.PLPLAND_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกแผนงาน");
      }
    } else {

      if(this.dataAdd.PLPROJECT_SDATE ==''){
        this.dataAdd.PLPROJECT_SDATE1='';
        this.dataAdd.PLPROJECT_EDATE1='';
      }else{
        this.dataAdd.PLPROJECT_SDATE1=this.datenow(this.dataAdd.PLPROJECT_SDATE);
        this.dataAdd.PLPROJECT_EDATE1=this.datenow(this.dataAdd.PLPROJECT_EDATE);
      }
     // console.log(1);
      this.dataAdd.opt = "update";
      // console.log(this.dataAdd.opt);
      this.apiService
        .getdata(this.dataAdd, this.url)
        .pipe(first())
        .subscribe((data: any) => {
        //  console.log(1);
          if (data.status == 1) {
            this.toastr.success("แจ้งเตือน:แก้ข้อมูลเรียบร้อยแล้ว");
             this.fetchdatalist();
            document.getElementById("ModalClose")?.click();
          }else{
            this.toastr.warning("แจ้งเตือน:ไม่มีเงินจัดสรร");
          }
        });
    }

  }
   //เพิ่มข้อมูล
   insertdata() {

    if (this.dataAdd.PLPROJECT_NAME == '' || this.dataAdd.PLPROJECT_SDATE == '' || this.dataAdd.PLPROJECT_EDATE == '' 
      || this.dataAdd.PLGPRODUCT_CODE == '' || this.dataAdd.PLPROJECTTYPE_CODE == '' || this.dataAdd.PLMONEYPAY_CODE == ''
      || this.dataAdd.PLSUBMONEYPAY_CODE == '' || this.dataAdd.PRPLPROJECT_HEADER1 == '' || this.dataAdd.PLPROJECT_HPHONE == ''
      || this.dataAdd.PLSTRATEGY_CODE == ''|| this.dataAdd.PLESTIMATEPLAN_CODE == ''
      || this.dataAdd.PLSTRATEGIES_CODE == ''|| this.dataAdd.PLMEASURES_CODE == ''|| this.dataAdd.PLPLAND_CODE == '') {
      if (this.dataAdd.PLPROJECT_NAME == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาชื่อโครงการ");
      }
      if (this.dataAdd.PLPROJECT_SDATE == '' ||this.dataAdd.PLPROJECT_EDATE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกวันที่ดำเนินโครงการ");
      }
      if (this.dataAdd.PLGPRODUCT_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกผลผลิต");
      }
      if (this.dataAdd.PRPLPROJECT_HEADER1 == '' || this.dataAdd.PLPROJECT_HPHONE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกชื่อเจ้าของโครงการและเบอร์โทร");
      }
      if (this.dataAdd.PLPROJECTTYPE_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกลักษณะโครงการ");
      }
      if (this.dataAdd.PLSTRATEGY_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกยุทธศาสตร์");
      }
      if (this.dataAdd.PLESTIMATEPLAN_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกเป้าประสงค์");
      }

      if (this.dataAdd.PLSTRATEGIES_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกกลยุทธ์");
      }
      if (this.dataAdd.PLMEASURES_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกมาตรการ");
      }
      if (this.dataAdd.PLPLAND_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกแผนงาน");
      }
      if (this.dataAdd.PLMONEYPAY_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกประเภทงบ");
      }
      if (this.dataAdd.PLSUBMONEYPAY_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกหมวดรายจ่ายย่อย");
      }
      console.log(1);
    } else {

      if(this.dataAdd.PLPROJECT_SDATE ==''){
        this.dataAdd.PLPROJECT_SDATE1='';
        this.dataAdd.PLPROJECT_EDATE1='';
      }else{
        this.dataAdd.PLPROJECT_SDATE1=this.datenow(this.dataAdd.PLPROJECT_SDATE);
        this.dataAdd.PLPROJECT_EDATE1=this.datenow(this.dataAdd.PLPROJECT_EDATE);
      }
      this.dataAdd.opt = "insert";
      this.apiService
        .getdata(this.dataAdd, this.url)
        .pipe(first())
        .subscribe((data: any) => {
          console.log(1);
          if (data.status == 1) {
            this.toastr.success("แจ้งเตือน:บันทึกข้อมูลเรียบร้อยแล้ว");
             this.fetchdatalist();
            document.getElementById("ModalClose")?.click();
          }
        });
    }

  }
  //ลบ
  deleteData(id: any){
    this.dataAdd.opt = "delete";
    this.dataAdd.id=id;
    Swal.fire({
      title: 'ต้องการลบข้อมูล?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.value) {
    
        this.apiService
        .getdata(this.dataAdd,this.url)
        .pipe(first())
        .subscribe((data: any) => {
        if(data.status==1){
          Swal.fire('ลบข้อมูล!', 'ลบข้อมูลเรียบร้อยแล้ว', 'success');   
          this.fetchdatalist();
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
  //หลักสูตร
  fetchdatalistsubm() {
    this.dataESubplmoneypay=null;
    this.dataAdd.opt = "viewSUBPLMONEYPAYPROJECT";
    this.apiService
      .getdata(this.dataAdd, this.url2)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataESubplmoneypay = data;
      });
  }
  datenow(datenow: any) {
    const yyyy = datenow.getFullYear();
    let mm = datenow.getMonth() + 1; // Months start at 0!
    let dd = datenow.getDate();
    return yyyy + '-' + mm + '-' + dd;
  }
  // เคลียร์ค่า textbox
  setshowbti() {
    this.dataAdd.PLPROJECT_CODE = '';
    this.dataAdd.PLPROJECT_NAME = '';
    this.dataAdd.PLPROJECT_TIME = '1';
    this.dataAdd.PLGPRODUCT_CODE = '';
    this.dataAdd.PLPROJECTTYPE_CODE = '';
    this.dataAdd.PLMONEYPAY_CODE = '';
    this.dataAdd.PLSUBMONEYPAY_CODE = '';
    this.dataAdd.PRPLPROJECT_HEADER1 = '';
    this.dataAdd.PLPROJECT_HPHONE = '';
    this.dataAdd.PLPROJECT_PERSONS = 0;
    this.dataAdd.PLPROJECT_PERSONP = 0;
    this.dataAdd.PLPROJECT_PERSONO = 0;
    this.dataAdd.PLPROJECT_SDATE = '';
    this.dataAdd.PLPROJECT_EDATE = '';
    this.dataAdd.PLPROJECT_MONEY = 0;
    this.dataAdd.PLPROJECT_ASTATUS = 0;
    this.dataAdd.PLPROJECT_STATUS = 0;
    this.dataAdd.PLPROJECT_DETAIL='';
    this.dataAdd.PLSTRATEGY_CODE = '';
    this.dataAdd.PLESTIMATEPLAN_CODE = '';
    this.dataAdd.PLSTRATEGIES_CODE = '';
    this.dataAdd.PLMEASURES_CODE = '';
    this.dataAdd.PLPLAND_CODE = '';
    this.dataAdd.PLRESEARCHTYPE_CODE = '';
    this.dataAdd.PLPROJECT_RSTATUS= 0;
    if(this.dataAdd.PLPROJECTTYPE=='1'){
      this.dataAdd.type=1;
      this.dataAdd.searchtype=null;
    }else{
      this.dataAdd.type=null;
      this.dataAdd.searchtype=1;
    }
    //console.log(1);
    for (let i = 0; i < this.number.length; i++) {
      this.dataAdd.PLPROJECTD_NAME[i] = '';
      this.dataAdd.PLPROJECTD_VALUE[i] = '';
      this.dataAdd.PLINDICATOR_CODE[i] = '';
      this.dataAdd.PLPROJECTD_CODE[i]= '';
      //console.log(1);
    }
  }
  //เป้าประสงค์
  fetchdataPLESTIMATEPLAN() {
    this.dataPlan=null;
    this.dataAdd.opt = "viewPLESTIMATEPLAN";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataPlan = data;
       // this.dataAdd.PLESTIMATEPLAN_CODE = data[0].PLESTIMATEPLAN_CODE;
      });
    //this.fetchdataPLSTRATEGIES();
  }
  //กลยุทธ์
  fetchdataPLSTRATEGIES() {
    this.dataPlme=null;
    this.dataAdd.opt = "viewPLSTRATEGIES";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataPlme = data;
       // this.dataAdd.PLSTRATEGIES_CODE = data[0].PLSTRATEGIES_CODE;
      });
    //this.fetchdataPLMEASURES();
  }
  //มาตรการ
  fetchdataPLMEASURES() {
    this.dataPlmeasures=null;
    this.dataAdd.opt = "viewPLMEASURES";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataPlmeasures = data;
      //  this.dataAdd.PLMEASURES_CODE = data[0].PLMEASURES_CODE;
      });
    //this.fetchdataPLPLAND();
  }
  //แผนงาน
  fetchdataPLPLAND() {
    this.dataPlansub=null;
    this.dataAdd.opt = "viewPLPLAND";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataPlansub = data;
       // this.dataAdd.PLPLAND_CODE = data[0].PLPLAND_CODE;
      });
     // this.fetchdataPLMISSION();
  }
  fetchdataPLMISSION(){
    this.dataPlm=null;
    this.dataPls=null;
    this.dataPli=null;
    this.dataPlp=null;
    this.dataAdd.opt = "viewPLMISSION";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataPlm = data.dataplm;
        this.dataPls = data.datapls;
        this.dataPli = data.datapli;
        this.dataPlp = data.dataplp;
      });
  }
  //ตัวชี้วัดโครงการ
  fetchdataPLINDICATOR() {
    this.dataAdd.opt = "viewPLINDICATOR";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataPlandicator = data;
        for (let i = 0; i < this.dataPlandicator.length; i++) {
          this.dataAdd.PLPROJECTD_NAME[i] = this.dataPlandicator[i].PLINDICATOR_NAME;
          this.dataAdd.PLPROJECTD_VALUE[i] = this.dataPlandicator[i].PLINDICATOR_VALUE;
          this.dataAdd.PLINDICATOR_CODE[i] = this.dataPlandicator[i].PLINDICATOR_CODE;
          this.dataAdd.PLPROJECTD_CODE[i]= '';
          this.dataAdd.PLPROJECTD_RSTATUS[i] = 3;
        }
      });
  }
  showinput(value: any) {
    //console.log(value);
    if (value == 1) {
      this.statusreport = null;
      this.statusreportp = true;
      //this.dataAdd.PLPROJECT_RSTATUS = 3;
    } else {
      this.statusreport = true;
      this.statusreportp = null;
    }

  }
  onTableDataChange(event: any) {
    this.page = event;
    this.fetchdatalist();
  }


  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.fetchdatalist();
  }
  exportexcel(): void {
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }
}
