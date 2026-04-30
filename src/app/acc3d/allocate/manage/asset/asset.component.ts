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
  selector: 'app-asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.scss']
})
export class AssetComponent implements OnInit {
  title = 'angular-app';
  fileName = 'report.xlsx';
  userList = [{}]

  datarstatus: any;
  dataFac: any;
  dataIncome: any;
  dataCrpart: any;
  dataMoneypay: any;
  dataYear: any;
  dataGcunit: any;
  dataPlmoneypay: any;
  dataSubplmoneypay: any;
  datalist: any;
  datalistresearch: any;
  datalistother: any;
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
  datasubtype: any;
  dataBuildg: any;
  dataBuildtype: any;
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
  url = "/acc3d/allocate/manage/asset.php";
  url1 = "/acc3d/allocate/userpermission.php";
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
    private localeService: BsLocaleService,
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
    this.rownumre = true;
    this.localeService.use(this.locale);
    this.applyLocale('thBeLocale');
    this.rownum = null;
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
    this.apiService.getdata(varP, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.datarstatus = data;
        this.dataAdd.PRIVILEGE_RSTATUS = data[0].PRIVILEGE_RSTATUS;
        var varN = {
          "opt": "viewfaculty"
        }
        this.apiService
          .getdata(varN, this.url1)
          .pipe(first())
          .subscribe((data: any) => {
            this.dataFac = data;
            // console.log(data[0].FACULTY_CODE);
            this.dataAdd.FACULTY_CODE = '';//data[0].FACULTY_CODE;

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
        this.dataAdd.PLINCOME_CODE = data[0].PLINCOME_CODE;
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
            this.dataAdd.CRPART_ID = data[0].CRPART_ID;
            
          });
        //ยุทธศาสตร์ 
        var Table = {
          "opt": "viewPLSTRATEGY",
          "PRYEARASSET_CODE": data[0].PLYEARBUDGET_CODE
        }
        this.apiService
          .getdata(Table, this.url1)
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
     //หน่วยนับ
     var Table1 = {
      "opt": "viewGCUNIT"
    }
    this.apiService
      .getdata(Table1, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataGcunit = data;
      });  
   //ประเภทครุภัณฑ์
   var Table1 = {
    "opt": "viewPLASSETTYPE"
  }
  this.apiService
    .getdata(Table1, this.url1)
    .pipe(first())
    .subscribe((data: any) => {
      this.dataSearchtype = data;
    }); 
  //ประเภทครุภัณฑ์ย่อย
  var Table1 = {
    "opt": "viewPLSUBASSETTYPE"
  }
  this.apiService
    .getdata(Table1, this.url1)
    .pipe(first())
    .subscribe((data: any) => {
      this.datasubtype = data;
    });  
    //ประเภทครุภัณฑ์ย่อย
  var Table1 = {
    "opt": "viewPLBUILDINGCATE"
  }
  this.apiService
    .getdata(Table1, this.url1)
    .pipe(first())
    .subscribe((data: any) => {
      this.dataBuildg = data;
    }); 
     //ประเภทครุภัณฑ์ย่อย
  var Table1 = {
    "opt": "viewPLBUILDINGTYPE"
  }
  this.apiService
    .getdata(Table1, this.url1)
    .pipe(first())
    .subscribe((data: any) => {
      this.dataBuildtype = data;
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
    //หมวดเงิน
changmoneypay() {
this.dataPlmoneypay =null;  
this.dataAdd.opt = 'viewPLMONEYPAY';
this.apiService
  .getdata(this.dataAdd, this.url1)
  .pipe(first())
  .subscribe((data: any) => {
    this.dataPlmoneypay = data;
    //this.dataAdd.PLMONEYPAY_CODE = data[0].PLMONEYPAY_CODE;
    
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
    this.datalistother= null;
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == 1) {
          this.datalist = data.data;
          this.datalistresearch = data.dataresearch;
          this.datalistother = data.dataother;
          this.loading = null;
          this.rownum = true;
          if (this.datalist.length == 0 && this.datalistresearch.length == 0 && this.datalistother.length == 0) {
            this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
            this.datalist = data.data;
            this.rownum = null;
          }

          for (let i = 0; i < this.datalist.length; i++) {
            this.dataAdd.FNEXPENSES_CODE[i] = this.datalist[i].FNEXPENSES_CODE;
            this.dataAdd.PLPROJECT_CODE[i] = this.datalist[i].PLPROJECT_CODE;
            this.dataAdd.PLPROJECT_RSTATUS[i] = this.datalist[i].PLPROJECT_RSTATUS;
          }
        }
      });
  }
  numberWithCommas(x: any) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
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
    this.dataAdd.FACULTY_CODE1= data.data[0].FACULTY_CODE1;
    this.dataAdd.PLGPRODUCT_CODE= data.data[0].PLGPRODUCT_CODE;
    this.dataAdd.PLMONEYPAY_CODE= data.data[0].PLMONEYPAY_CODE;
    this.fetchdatalistsubm();
    this.dataAdd.PLPROJECT_RDETAIL= data.data[0].PLPROJECT_RDETAIL;
    //console.log(data.data[0].PLSUBMONEYPAY_CODE);
    this.dataAdd.PLSUBMONEYPAY_CODE= data.data[0].PLSUBMONEYPAY_CODE;
    this.dataAdd.PLPROJECTTYPE_CODE= data.data[0].PLPROJECTTYPE_CODE;
    this.dataAdd.PLPROJECT_MONEY=   parseFloat(data.data[0].PLPROJECT_MONEY).toFixed(2);
    this.dataAdd.PLPROJECT_ASTATUS= data.data[0].PLPROJECT_ASTATUS;
    this.dataAdd.PLPROJECT_STATUS= data.data[0].PLPROJECT_STATUS;
    this.dataAdd.GCUNIT_CODE= data.data[0].GCUNIT_CODE;
    this.dataAdd.PLASSET_AMOUNT=parseFloat(data.data[0].PLASSET_AMOUNT).toFixed(0);
    this.dataAdd.PLASSETTYPE_CODE= data.data[0].PLASSETTYPE_CODE;
    this.dataAdd.PLSTRATEGY_CODE= data.data[0].PLSTRATEGY_CODE;
    this.dataAdd.PLSUBASSETTYPE_CODE= data.data[0].PLSUBASSETTYPE_CODE;
    this.dataAdd.PLBUILDINGCATE_CODE= data.data[0].PLBUILDINGCATE_CODE;
    this.dataAdd.PLBUILDINGTYPE_CODE= data.data[0].PLBUILDINGTYPE_CODE;
    this.fetchdataPLESTIMATEPLAN();
    this.dataAdd.PLESTIMATEPLAN_CODE= data.data[0].PLESTIMATEPLAN_CODE;
    this.fetchdataPLSTRATEGIES();
    this.dataAdd.PLSTRATEGIES_CODE= data.data[0].PLSTRATEGIES_CODE;
    this.fetchdataPLMEASURES();
    this.dataAdd.PLMEASURES_CODE= data.data[0].PLMEASURES_CODE;
    this.fetchdataPLPLAND();
    this.dataAdd.PLPLAND_CODE= data.data[0].PLPLAND_CODE;
    this.fetchdataPLMISSION();
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
    if (this.dataAdd.PLPROJECT_NAME == ''  || this.dataAdd.FACULTY_CODE1 == ''
      || this.dataAdd.PLGPRODUCT_CODE == '' || this.dataAdd.PLMONEYPAY_CODE == ''
      || this.dataAdd.PLSUBMONEYPAY_CODE == '') {

      if (this.dataAdd.PLPROJECT_NAME == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาชื่อโครงการ");
      }
      if (this.dataAdd.PLGPRODUCT_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกผลผลิต");
      }
      if (this.dataAdd.FACULTY_CODE1 == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกคณะ/หน่วยงานที่รับผิดชอบ");
      }
      if (this.dataAdd.PLMONEYPAY_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกประเภทงบ");
      }
      if (this.dataAdd.PLSUBMONEYPAY_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกหมวดรายจ่ายย่อย");
      }
    } else {

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

    if (this.dataAdd.PLPROJECT_NAME == ''  || this.dataAdd.FACULTY_CODE1 == ''
      || this.dataAdd.PLGPRODUCT_CODE == '' || this.dataAdd.PLMONEYPAY_CODE == ''
      || this.dataAdd.PLSUBMONEYPAY_CODE == '') {

      if (this.dataAdd.PLPROJECT_NAME == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาชื่อโครงการ");
      }
      if (this.dataAdd.PLGPRODUCT_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกผลผลิต");
      }
      if (this.dataAdd.FACULTY_CODE1 == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกคณะ/หน่วยงานที่รับผิดชอบ");
      }
      if (this.dataAdd.PLMONEYPAY_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกประเภทงบ");
      }
      if (this.dataAdd.PLSUBMONEYPAY_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกหมวดรายจ่ายย่อย");
      }
    } else {

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
    this.dataAdd.opt = "viewSUBPLMONEYPAY";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataESubplmoneypay = data;
       // this.dataAdd.PLSUBMONEYPAY_CODE =''; //data[0].PLSUBMONEYPAY_CODE;
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
    this.dataAdd.FACULTY_CODE1 = '';
    this.dataAdd.PLPROJECT_TIME = '';
    this.dataAdd.PLGPRODUCT_CODE = '';
    this.dataAdd.PLPROJECTTYPE_CODE = '';
    this.dataAdd.PLMONEYPAY_CODE = '';
    this.dataAdd.PLSUBMONEYPAY_CODE = '';
    this.dataAdd.PRPLPROJECT_HEADER1 = '';
    this.dataAdd.PLPROJECT_HPHONE = '';
    this.dataAdd.PLASSET_AMOUNT = 1;
    this.dataAdd.PLPROJECT_MONEY = 0;
    this.dataAdd.PLPROJECT_ASTATUS = 0;
    this.dataAdd.PLPROJECT_STATUS = 0;
    this.dataAdd.PLPROJECT_DETAIL='';
    this.dataAdd.PLSTRATEGY_CODE = '';
    this.dataAdd.PLESTIMATEPLAN_CODE = '';
    this.dataAdd.PLSTRATEGIES_CODE = '';
    this.dataAdd.PLMEASURES_CODE = '';
    this.dataAdd.PLPLAND_CODE = '';
    this.dataAdd.PLSUBASSETTYPE_CODE='00';
    this.dataAdd.PLBUILDINGCATE_CODE='00';
    this.dataAdd.PLBUILDINGTYPE_CODE='00';
    this.dataAdd.PLASSETTYPE_CODE='00';
    this.dataAdd.FACULTY_CODE1=this.dataAdd.FACULTY_CODE;
    if(this.dataAdd.PLPROJECTTYPE=='1'){
      this.dataAdd.type=1;
      this.dataAdd.searchtype=null;
    }else{
      this.dataAdd.type=null;
      this.dataAdd.searchtype=1;
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
      this.dataAdd.PLPROJECT_RSTATUS = 3;
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
