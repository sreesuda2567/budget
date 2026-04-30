import { Component, OnInit,ElementRef, HostListener ,ViewChild} from '@angular/core';
import { ApiPdoService } from '../../../../_services/api-pui.service';
import { TokenStorageService } from '../../../../_services/token-storage.service';
import { first, map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { listLocales } from 'ngx-bootstrap/chronos';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { thBeLocale } from 'ngx-bootstrap/locale';
import Swal from 'sweetalert2';
defineLocale('th', thBeLocale);
import { auto } from '@popperjs/core';

@Component({
  selector: 'app-approveproject',
  templateUrl: './approveproject.component.html',
  styleUrls: ['./approveproject.component.scss']
})
export class ApproveprojectComponent implements OnInit {
  citizen: any;
  user: any;
  key: any;
  // param: any = { MASSAGE_CITIZEN: null }
  datarstatus: any;
  dataFac: any;
  dataIncome: any;
  dataCrpart: any;
  dataYear: any;
  dataYearp: any;
  dataUnit: any;
  dataProduct: any;
  dataAssettype: any;
  dataProvince: any;
  dataSubdistrict: any;
  dataDistrict: any;
  dataPlmoneypay: any;
  datalist: any;
  datalistresearch: any;
  dataESubplmoneypay: any;
  dataEProjecttype: any;
  dataPstrategy: any;
  dataPlan: any;
  dataPlme: any;
  dataPlansub: any;
  dataPlmeasures: any;
  dataPlandicator: any;
  dataProjectgroup: any;
  dataProjectgrouptd: any;
  dataProjecttd: any;
  dataSearchtype: any;
  dataPlm: any;
  dataPls: any;
  dataPli: any;
  dataPlp: any;
  rowpbi: any;
  rowpbu: any;
  rowpaap: any;
  rowpaapn: any;
  ptype: any;
  ptypes: any;
  loadingapp:any;
  datalistapp:any 
  datalistappr:any 
  dataCrpartregis:any;
  clickshow:any;
  datastatus:any 
  url = "/acc3d/investment/approve/applistproject.php";
  url1 = "/acc3d/investment/userpermission.php";
  locale = 'th-be';
  locales = listLocales();
  //dataAdd:any = {PRBOBJECT_NAME:[],PRBOBJECT_CODE:[],PRUSE_NAME:[],PRUSE_CODE:[]};PLPROJECTEXPENSES_CODE
  dataAdd: any = {
    PLPROJECTD_CODE: [], PLPROJECTD_RSTATUS: [], PLPROJECTD_NAME: [], PLPROJECTD_VALUE: [], PLINDICATOR_CODE: [], PLPROJECTGROUPDT_NAME: []
    , PLPROJECTGROUPDT_NUM: [], GCUNIT_CODE: [], PLPROJECTGROUPDT_NUMA: [], GCUNIT_ACODE: [], PLPROJECTGROUPDT_MONEY: [], PLPROJECTGROUPDT_MONEYA: [], PLPROJECTGROUPDT_CODE: []
    , PLPROJECTEXPENSES_CODE: []
  };
  searchTerm: any;
  searchTermd: any;
  selectedDevice: any;
  loading: any;

  page = 1;
  count = 0;
  tableSize = 20;
  tableSizes = [20, 30,30];
  number: any = [1, 2, 3, 4, 5];
  rownum: any;
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: auto,
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    /* toolbarHiddenButtons: [
       ['bold']
       ],*/
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };

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
    document.getElementById("ModalClose")?.click();
    this.fetchdata();
    this.dataAdd.PLPROJECTTYPE = 1;
    this.dataAdd.citizen = this.tokenStorage.getUser().citizen;
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
        // console.log(data);
         this.dataAdd.FACULTY_CODE = datafac[0].FACULTY_CODE;
         this.dataAdd.FFACULTY_CODE = datafac[0].FACULTY_CODE; 
         this.fetchdatalist(); 
       });
       }); 
            //รายการประเภทเงิน
           var Tablein = {
             "opt": "viewincome"
           }
           this.apiService
           .getdata(Tablein,this.url1)
           .pipe(first())
           .subscribe((data: any) => {
             this.dataIncome = data;
             this.dataAdd.PLINCOME_CODE = '';//data[0].PLINCOME_CODE;
            //console.log(data[0].PLINCOME_CODE);
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
             this.dataAdd.PRYEARASSET_CODE = data[0].PLYEARBUDGET_CODE;
             this.dataAdd.FPRYEARASSET_CODE = data[0].PLYEARBUDGET_CODE; 
             //รายการภาค
             var Table2 = {
               "opt": "viewcrpart",
               "PRYEARASSET_CODE":data[0].PLYEARBUDGET_CODE,
               "FACULTY_CODE": "",
               "PLINCOME_CODE": "01"
             }
                 this.apiService
                 .getdata(Table2,this.url1)
                 .pipe(first())
                 .subscribe((datacr: any) => {
                   //console.log(datacr);
                   this.dataCrpart = datacr;
                   this.dataAdd.CRPART_ID ='';// datacr[0].CRPART_ID;
                 }); 
           //ยุทธศาสตร์ 
        var Table = {
          "opt": "viewPLSTRATEGY",
          "PRYEARASSET_CODE": data[0].PLYEARBUDGET_CODE,
        }
        this.apiService
          .getdata(Table, this.url1)
          .pipe(first())
          .subscribe((data: any) => {
            this.dataPstrategy = data;
          });       
                      
           });   
          //รายการปี
                   var Tableyp = {
                     "opt": "viewyearp"
                   }
                   this.apiService
                   .getdata(Tableyp,this.url1)
                   .pipe(first())
                   .subscribe((data: any) => {
                     this.dataYearp = data;    
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
        
       //รายการผลิต
       var Tablepro = {
         "opt": "viewpro"
       }
       this.apiService
       .getdata(Tablepro,this.url1)
       .pipe(first())
       .subscribe((data: any) => {
         this.dataProduct  = data;
   
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
    //รายการงบ 
    var Tablepl = {
      "opt": "viewPLMONEYPAY"
    }
    this.apiService
      .getdata(Tablepl, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataPlmoneypay = data;
        this.dataAdd.PLMONEYPAY_CODE = '';
      });
    //ลักษณะโครงการ
    var Table = {
      "opt": "viewPLPROJECTTYPE"
    }
    this.apiService
      .getdata(Table, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataEProjecttype = data;
       // this.dataAdd.PLPROJECTTYPE_CODE = data[0].PLPROJECTTYPE_CODE;
        //this.fetchdataPLINDICATOR();
      }); 
//สถานะ
var Tabletar = {
  "opt": "viewstatusplan"
}
this.apiService
.getdata(Tabletar,this.url1)
.pipe(first())
.subscribe((data: any) => {
  this.datastatus = data;
  this.dataAdd.PRSTATUS_CODE = data[0].PRSTATUS_CODE;
}); 
       this.dataAdd.opt = "readAll";
       this.dataAdd.CITIZEN_ID = this.tokenStorage.getUser().citizen;
         }
 // ฟังก์ขันสำหรับการดึงข้อมูลครุภัณฑ์
 fetchdatalist() {
  this.dataAdd.opt = "readAll";
  this.loading = true;
  this.datalist = null;
  this.dataAdd.code=null;
  this.apiService
    .getdata(this.dataAdd, this.url)
    .pipe(first())
    .subscribe((data: any) => {
      if (data.status == 1) {
        this.datalist = data.data;
        this.datalistresearch = data.dataresearch;
        this.dataAdd.code=data.FACULTY_CODE;
        this.rownum = 'true';
        this.loading = null;
        // console.log('1');
      } else {
        this.datalist = data.data;
        this.loading = null;
        this.rownum = null;
        this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
      }
    });
}
editdataapp(id: any){
    this.dataProjecttd=null;
    this.dataAdd.id=id;
    this.dataAdd.PLPROJECTGROUPDT_MONEYA=[];
    this.dataAdd.PLPROJECTGROUPDT_NUMA=[];
    this.dataAdd.PLPROJECTGROUPDT_NUM=[];
    this.dataAdd.PLPROJECTGROUPDT_MONEY=[];
    this.setshowbti();
    this.fetchdatalistsubm();
    this.fetchdataPLESTIMATEPLAN();
    this.fetchdataPLSTRATEGIES();
    this.fetchdataPLMEASURES();
    this.fetchdataPLPLAND();
   // console.log(this.dataAdd.opt);
    this.dataAdd.opt='readoneapp';
    this.apiService
    .getdata(this.dataAdd,this.url)
    .pipe(first())
    .subscribe((data: any) => {
     // this.dataAdd  = data.data;
    //  console.log((data.data[0].PLPRODUCT_CODE).substring(4, 7));
    this.onChangedistrict(data.data[0].PROVINCE_ID);
    this.onChangesubdistrict(data.data[0].DISTRICT_ID);
    this.dataAdd.PROVINCE_ID = data.data[0].PROVINCE_ID;
    this.dataAdd.DISTRICT_ID = data.data[0].DISTRICT_ID;
    this.dataAdd.SUB_DISTRICT_ID = data.data[0].SUB_DISTRICT_ID;
    this.dataAdd.RPLINCOME_CODE = data.data[0].PLINCOME_CODE;
    this.onChangecrpartrister();
    this.dataAdd.RCRPART_ID = data.data[0].CRPART_ID;
      this.dataAdd.PLSTRATEGY_CODE = data.data[0].PLSTRATEGY_CODE;
      this.dataAdd.PLGPRODUCT_CODE =(data.data[0].PLGPRODUCT_CODE);//.substring(4, 7);
      this.dataAdd.PRPLPROJECT_CODE = data.data[0].PRPLPROJECT_CODE;
      this.dataAdd.PLSUBMONEYPAY_CODE1 = data.data[0].PLSUBMONEYPAY_CODE1;
      this.dataAdd.PRPLPROJECT_NAME = data.data[0].PRREGISPROJECT_NAME;
      this.dataAdd.PRPLPROJECT_TIME = data.data[0].PRPLPROJECT_TIME;
      this.dataAdd.FPLPROJECTTYPE = data.data[0].PRREGISTYPE;
    //  console.log(data.data[0].PRPLPROJECTTYPE_CODE);
      this.dataAdd.PLPROJECTTYPE_CODE = data.data[0].PLPROJECTTYPE_CODE;
      this.dataAdd.PLSUBMONEYPAY_CODE = data.data[0].PLSUBMONEYPAY_CODE;
      this.dataAdd.PRPLPROJECT_HEADER = data.data[0].PRPLPROJECT_HEADER;
      this.dataAdd.PRPLPROJECT_HCITIZEN = data.data[0].PRPLPROJECT_HCITIZEN;
      this.dataAdd.PLRESEARCHTYPE_CODE = data.data[0].PLRESEARCHTYPE_CODE;
      this.dataAdd.PRPLPROJECT_HCITIZEN = data.data[0].PRPLPROJECT_HCITIZEN;
      this.dataAdd.PLESTIMATEPLAN_CODE = data.data[0].PLESTIMATEPLAN_CODE;
      this.dataAdd.PLSTRATEGIES_CODE = data.data[0].PLSTRATEGIES_CODE;
      this.dataAdd.PLMEASURES_CODE = data.data[0].PLMEASURES_CODE;
      this.dataAdd.PLMONEYPAY_CODE = data.data[0].PLMONEYPAY_CODE;
      this.dataAdd.PLPLAND_CODE = data.data[0].PLPLAND_CODE;
      //this.dataAdd.FPLPROJECTTYPE = data.data[0].PRPLPROJECTTYPE_CODE;
      this.onFocused(data.data[0].PRPLPROJECT_HCITIZEN,data.data[0].PRPLPROJECT_HEADER);
      this.dataAdd.PRPLPROJECT_HPHONE = data.data[0].PRPLPROJECT_HPHONE;
      this.dataAdd.PRPLPROJECT_PERSONS = data.data[0].PRPLPROJECT_PERSONS;
      this.dataAdd.PRPLPROJECT_PERSONP = data.data[0].PRPLPROJECT_PERSONP;
      this.dataAdd.PRPLPROJECT_PERSONO = data.data[0].PRPLPROJECT_PERSONO;
      this.dataAdd.PRPLPROJECT_SDATE = new Date(data.data[0].PRPLPROJECT_SDATE);
      this.dataAdd.PRPLPROJECT_EDATE = new Date(data.data[0].PRPLPROJECT_EDATE);
      this.dataAdd.PLPROJECTMORE_LOCATION = data.data[0].PRPLPROJECT_LOCATION;
      this.dataAdd.PLPROJECTMORE_PRINCIPLE = data.data[0].PRPLPROJECT_PRINCIPLE;
      this.dataAdd.PLPROJECTMORE_ACTIVITY = data.data[0].PRPLPROJECT_ACTIVITY;
      this.dataAdd.PRPLPROJECT_OBJECT = data.data[0].PRPLPROJECT_OBJECT;
      this.dataAdd.PLPROJECTMORE_RESULT = data.data[0].PRPLPROJECT_RESULT;
      this.dataAdd.PLPROJECTMORE_ESTIMATE = data.data[0].PRPLPROJECT_ESTIMATE;
      this.dataAdd.PLPROJECTMORE_FOLLOW = data.data[0].PRPLPROJECT_FOLLOW;
      this.dataAdd.PLPROJECT_DETAIL = data.data[0].PRPLPROJECT_RDETAIL;
     this.dataPlandicator = data.dataPLPROJECTD;
     this.fetchdataPLMISSION();
     for (let i = 0; i < this.dataPlandicator.length; i++) {
       this.dataAdd.PLPROJECTD_NAME[i] = this.dataPlandicator[i].PLPROJECTD_NAME;
       this.dataAdd.PLPROJECTD_VALUE[i] = this.dataPlandicator[i].PLPROJECTD_VALUE;
       this.dataAdd.PLINDICATOR_CODE[i] = this.dataPlandicator[i].PLINDICATOR_CODE;
       this.dataAdd.PLPROJECTD_RSTATUS[i] = this.dataPlandicator[i].PLPROJECTD_RSTATUS;;
       this.dataAdd.PLPROJECTD_CODE[i]= this.dataPlandicator[i].PLPROJECTD_CODE;
     }
     this.dataProjecttd = data.dataEXPENSES;
     let k=0;
     for (let i = 0; i < this.dataProjecttd.length; i++) {
       //this.dataAdd.PLPROJECT_MONEYT[i] = data.dataEXPENSES[i].GCUNIT_BCODE;
       if(data.dataEXPENSES[i].PLPROJECTGROUPDT_CODE !=''){
        this.dataAdd.PLPROJECTGROUPDT_CODE[k] = data.dataEXPENSES[i].PLPROJECTGROUPDT_CODE;
        this.dataAdd.PLPROJECTGROUPDT_NAME[k] = data.dataEXPENSES[i].PLPROJECTGROUPDT_DETAIL;
        this.dataAdd.PLPROJECTGROUPDT_NUM[k] = data.dataEXPENSES[i].PLPROJECTGROUPDT_NUMA;
        this.dataAdd.PLPROJECTGROUPDT_NUMA[k] = data.dataEXPENSES[i].PLPROJECTGROUPDT_NUMB;
        this.dataAdd.PLPROJECTGROUPDT_MONEY[k] = data.dataEXPENSES[i].PLPROJECTGROUPDT_MONEY;
        this.dataAdd.PLPROJECTEXPENSES_CODE[k] = data.dataEXPENSES[i].PLPROJECTEXPENSES_CODE;
        this.dataAdd.GCUNIT_CODE[k] = data.dataEXPENSES[i].GCUNIT_ACODE;
        this.dataAdd.GCUNIT_ACODE[k] = data.dataEXPENSES[i].GCUNIT_BCODE;
       // console.log(data.dataEXPENSES[i].PLPROJECTGROUPDT_CODE);
        k++;
        }
       this.calexpenses();
     }
    }); 
    this.rowpbu=true; 
    this.rowpaap=null;
    this.rowpaapn=null;
}
  //ภาคเงิน
  fetchdatalistcr() {
    this.dataAdd.opt = "viewcrpart";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        //console.log(data);
        this.dataCrpart = data;
        this.dataAdd.CRPART_ID = data[0].CRPART_ID;

      });
  }
  onFocused(id: any,val: any){
    this.dataAdd.PRPLPROJECT_HEADER1={"id": id,"name": val};
  }
    //ภาคเงิน
    fetchdatalistcre() {
      this.dataAdd.opt = "viewcrpartp";
      this.apiService
        .getdata(this.dataAdd, this.url1)
        .pipe(first())
        .subscribe((data: any) => {
          //console.log(data);
          this.dataCrpart = data;
          this.dataAdd.CRPART_ID = data[0].CRPART_ID;
  
        });
    }
  // ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
  editdata(id: any) {
    this.dataProjecttd=null;
    this.dataAdd.PLPROJECTGROUPDT_MONEYA=[];
    this.dataAdd.PLPROJECTGROUPDT_NUMA=[];
    this.dataAdd.PLPROJECTGROUPDT_NUM=[];
    this.dataAdd.PLPROJECTGROUPDT_MONEY=[];
    this.setshowbti();
    this.fetchdatalistsubm();
    this.fetchdataPLESTIMATEPLAN();
    this.fetchdataPLSTRATEGIES();
    this.fetchdataPLMEASURES();
    this.fetchdataPLPLAND();
    this.apiService
    .getById(id,this.url)
    .pipe(first())
    .subscribe((data: any) => {
     // this.dataAdd  = data.data;
    //  console.log((data.data[0].PLPRODUCT_CODE).substring(4, 7));
     this.dataAdd.AFACULTY_CODE = data.data[0].FACULTY_CODE;
     this.dataAdd.FPLINCOME_CODE = data.data[0].PLINCOME_CODE;
     this.fetchdatalistcre();
     this.dataAdd.FCRPART_ID = data.data[0].CRPART_ID;
      this.dataAdd.PLSTRATEGY_CODE = data.data[0].PLSTRATEGY_CODE;
      this.dataAdd.PLGPRODUCT_CODE =(data.data[0].PLGPRODUCT_CODE);//.substring(4, 7);
      this.dataAdd.PRPLPROJECT_CODE = data.data[0].PRPLPROJECT_CODE;
      this.dataAdd.PLSUBMONEYPAY_CODE1 = data.data[0].PLSUBMONEYPAY_CODE1;
      this.dataAdd.PRPLPROJECT_NAME = data.data[0].PRPLPROJECT_NAME;
      this.dataAdd.PRPLPROJECT_TIME = data.data[0].PRPLPROJECT_TIME;
      this.dataAdd.FPLPROJECTTYPE = data.data[0].PRPLPROJECTTYPE_CODE;
      this.dataAdd.PLPROJECTTYPE_CODE = data.data[0].PLPROJECTTYPE_CODE;
      this.dataAdd.PLSUBMONEYPAY_CODE = data.data[0].PLSUBMONEYPAY_CODE;
      this.dataAdd.PRPLPROJECT_HEADER = data.data[0].PRPLPROJECT_HEADER;
      this.dataAdd.PRPLPROJECT_HCITIZEN = data.data[0].PRPLPROJECT_HCITIZEN;
      this.dataAdd.PLRESEARCHTYPE_CODE = data.data[0].PLRESEARCHTYPE_CODE;
      this.dataAdd.PRPLPROJECT_HCITIZEN = data.data[0].PRPLPROJECT_HCITIZEN;
      this.dataAdd.PLESTIMATEPLAN_CODE = data.data[0].PLESTIMATEPLAN_CODE;
      this.dataAdd.PLSTRATEGIES_CODE = data.data[0].PLSTRATEGIES_CODE;
      this.dataAdd.PLMEASURES_CODE = data.data[0].PLMEASURES_CODE;
      this.dataAdd.PLMONEYPAY_CODE = data.data[0].PLMONEYPAY_CODE;
      this.dataAdd.PLPLAND_CODE = data.data[0].PLPLAND_CODE;
    //  this.dataAdd.FPLPROJECTTYPE = data.data[0].PRPLPROJECTTYPE_CODE;
      this.onFocused(data.data[0].PRPLPROJECT_HCITIZEN,data.data[0].PRPLPROJECT_HEADER);
      this.dataAdd.PRPLPROJECT_HPHONE = data.data[0].PRPLPROJECT_HPHONE;
      this.dataAdd.PRPLPROJECT_PERSONS = data.data[0].PRPLPROJECT_PERSONS;
      this.dataAdd.PRPLPROJECT_PERSONP = data.data[0].PRPLPROJECT_PERSONP;
      this.dataAdd.PRPLPROJECT_PERSONO = data.data[0].PRPLPROJECT_PERSONO;
      this.dataAdd.PRPLPROJECT_SDATE = new Date(data.data[0].PRPLPROJECT_SDATE);
      this.dataAdd.PRPLPROJECT_EDATE = new Date(data.data[0].PRPLPROJECT_EDATE);
      this.dataAdd.PLPROJECTMORE_LOCATION = data.data[0].PRPLPROJECT_LOCATION;
      this.dataAdd.PLPROJECTMORE_PRINCIPLE = data.data[0].PRPLPROJECT_PRINCIPLE;
      this.dataAdd.PLPROJECTMORE_ACTIVITY = data.data[0].PRPLPROJECT_ACTIVITY;
      this.dataAdd.PLPROJECTMORE_OBJECT = data.data[0].PRPLPROJECT_OBJECT;
      this.dataAdd.PLPROJECTMORE_RESULT = data.data[0].PRPLPROJECT_RESULT;
      this.dataAdd.PLPROJECTMORE_ESTIMATE = data.data[0].PRPLPROJECT_ESTIMATE;
      this.dataAdd.PLPROJECTMORE_FOLLOW = data.data[0].PRPLPROJECT_FOLLOW;
      this.dataAdd.PLPROJECT_DETAIL = data.data[0].PRPLPROJECT_RDETAIL;
     this.dataPlandicator = data.dataPLPROJECTD;
     this.fetchdataPLMISSION();
     for (let i = 0; i < this.dataPlandicator.length; i++) {
       this.dataAdd.PLPROJECTD_NAME[i] = this.dataPlandicator[i].PLPROJECTD_NAME;
       this.dataAdd.PLPROJECTD_VALUE[i] = this.dataPlandicator[i].PLPROJECTD_VALUE;
       this.dataAdd.PLINDICATOR_CODE[i] = this.dataPlandicator[i].PLINDICATOR_CODE;
       this.dataAdd.PLPROJECTD_RSTATUS[i] = this.dataPlandicator[i].PLPROJECTD_RSTATUS;;
       this.dataAdd.PLPROJECTD_CODE[i]= this.dataPlandicator[i].PLPROJECTD_CODE;
     }
     this.dataProjecttd = data.dataEXPENSES;
     let k=0;
     for (let i = 0; i < this.dataProjecttd.length; i++) {
       //this.dataAdd.PLPROJECT_MONEYT[i] = data.dataEXPENSES[i].GCUNIT_BCODE;
       if(data.dataEXPENSES[i].PLPROJECTGROUPDT_CODE !=''){
        this.dataAdd.PLPROJECTGROUPDT_CODE[k] = data.dataEXPENSES[i].PLPROJECTGROUPDT_CODE;
        this.dataAdd.PLPROJECTGROUPDT_NAME[k] = data.dataEXPENSES[i].PLPROJECTGROUPDT_DETAIL;
        this.dataAdd.PLPROJECTGROUPDT_NUM[k] = data.dataEXPENSES[i].PLPROJECTGROUPDT_NUMA;
        this.dataAdd.PLPROJECTGROUPDT_NUMA[k] = data.dataEXPENSES[i].PLPROJECTGROUPDT_NUMB;
        this.dataAdd.PLPROJECTGROUPDT_MONEY[k] = data.dataEXPENSES[i].PLPROJECTGROUPDT_MONEY;
        this.dataAdd.PLPROJECTEXPENSES_CODE[k] = data.dataEXPENSES[i].PLPROJECTEXPENSES_CODE;
        this.dataAdd.GCUNIT_CODE[k] = data.dataEXPENSES[i].GCUNIT_ACODE;
        this.dataAdd.GCUNIT_ACODE[k] = data.dataEXPENSES[i].GCUNIT_BCODE;
       // console.log(data.dataEXPENSES[i].PLPROJECTGROUPDT_CODE);
        k++;
        }
       this.calexpenses();
     }
    }); 
    this.rowpbu=null; 
    this.rowpaap=true;
    this.rowpaapn=true;
  }  
  // เคลียร์ค่า textbox
  setshowbti() {
    this.dataAdd.PLGPRODUCT_CODE='';
    this.dataAdd.PLSUBMONEYPAY_CODE='';
    this.dataAdd.PRPLPROJECT_NAME='';
    this.dataAdd.PRPLPROJECT_TIME='';
    this.dataAdd.FPLPROJECTTYPE='';
    this.dataAdd.PLMONEYPAY_CODE='';
    this.dataAdd.PLSUBMONEYPAY_CODE='';
    this.dataAdd.PLRESEARCHTYPE_CODE='';
    this.dataAdd.PRPLPROJECT_HEADER='';
    this.dataAdd.PRPLPROJECT_HPHONE='';
    this.dataAdd.PRPLPROJECT_PERSONS=0;
    this.dataAdd.PRPLPROJECT_PERSONP=0;
    this.dataAdd.PRPLPROJECT_PERSONO=0;
    this.dataAdd.PLPROJECT_MONEYT=0;
    this.dataAdd.PLPROJECT_MONEY=0;
    this.dataAdd.PRPLPROJECT_SDATE='';
    this.dataAdd.PRPLPROJECT_EDATE='';
    this.dataAdd.PLPROJECTMORE_LOCATION='';
    this.dataAdd.PLPROJECTMORE_PRINCIPLE='';
    this.dataAdd.PLPROJECTMORE_ACTIVITY='';
    this.dataAdd.PLPROJECTMORE_OBJECT='';
    this.dataAdd.PLPROJECTMORE_RESULT='';
    this.dataAdd.PRBUILDING_REASON='';
    this.dataAdd.PLSTRATEGY_CODE='';
    this.dataAdd.PLESTIMATEPLAN_CODE='';
    this.dataAdd.PLSTRATEGIES_CODE='';
    this.dataAdd.PLMEASURES_CODE='';
    this.dataAdd.PLPLAND_CODE='';
    this.dataAdd.PLPROJECT_DETAIL='';

  }
// ฟังก์ชันสำหรับการลบข้อมูล
deleteData(id: any) {
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
        console.log(id);
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
// ฟังก์ขันสำหรับการดึงข้อมูลสิ่งก่อสร้าง
fetchdatalistapp(){  
  this.dataAdd.opt = "readAllapp"; 
  this.loadingapp=true;
  this.datalistapp=null; 
  this.dataAdd.fcode=null;
   this.apiService
     .getdata(this.dataAdd,this.url)
     .pipe(first())
     .subscribe((data: any) => {
       if(data.status==1){
       this.datalistapp = data.data;
       this.dataAdd.fcode=data.FACULTY_CODE;
       this.rownum='true';
       this.loadingapp=null;
      // console.log('1');
       }else{
        this.datalistapp=data.data; 
        this.loadingapp=null;
         this.rownum=null;
         this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
       }
     });
     } 
  //แผนงาน
  fetchdataPLPLAND() {
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
    //มาตรการ
    fetchdataPLMEASURES() {
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
  //กลยุทธ์
  fetchdataPLSTRATEGIES() {
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
  //เป้าประสงค์
  fetchdataPLESTIMATEPLAN() {
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
  //เช็คตัวเลข
  CheckNum(num: any) {
    if (num.keyCode < 46 || num.keyCode > 57) {
      alert('กรุณากรอกข้อมูล ที่เป็นตัวเลข');
      num.returnValue = false;
    }
  }
  calexpenses() {
    let sum = 0;
    for (let i = 0; i < this.dataAdd.PLPROJECTGROUPDT_NAME.length; i++) {
      if (this.dataAdd.PLPROJECTGROUPDT_NUM[i] > 0 && this.dataAdd.PLPROJECTGROUPDT_MONEY[i] > 0 ){
        this.dataAdd.PLPROJECTGROUPDT_MONEYA[i] = parseFloat(this.dataAdd.PLPROJECTGROUPDT_NUMA[i]) * parseFloat(this.dataAdd.PLPROJECTGROUPDT_NUM[i]) * parseFloat(this.dataAdd.PLPROJECTGROUPDT_MONEY[i]);
        sum += parseFloat(this.dataAdd.PLPROJECTGROUPDT_NUMA[i]) * parseFloat(this.dataAdd.PLPROJECTGROUPDT_NUM[i]) * parseFloat(this.dataAdd.PLPROJECTGROUPDT_MONEY[i]);
      }
    }
    this.dataAdd.PLPROJECT_MONEY = sum;
    this.dataAdd.PLPROJECT_MONEYT = sum;
    /* this.dataAdd.List1.push(this.dataAdd.PLPROJECTGROUP_CODE,this.dataAdd.PLPROJECTGROUPDT_CODE,this.dataAdd.PLPROJECTGROUPDT_NAME,this.dataAdd.PLPROJECTGROUPDT_NUM
       ,this.dataAdd.GCUNIT_CODE,this.dataAdd.PLPROJECTGROUPDT_MONEY,this.dataAdd.PLPROJECTGROUPDT_MONEYA);*/

    /* this.dataAdd.List1.push([
       {
         "type": "home",
         "number": "212 555-1234"
       }
     ])
     console.log(this.dataAdd.List1);*/
  }
  keyword = 'name';
  datacomplete = [];
  selectEvent(item: any) {
    this.dataAdd.PRPLPROJECT_HCITIZEN = item.id; 
    this.dataAdd.PRPLPROJECT_HEADER = item.name; 
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
  //หลักสูตร
  fetchdatalistsubm() {
    this.dataAdd.opt = "viewSUBPLMONEYPAY";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataESubplmoneypay = data;
      });
  }
  projecttype(){
    if(this.dataAdd.FPLPROJECTTYPE==1){
      this.ptype=true;
      this.ptypes=null;
    }else{
      this.ptype=null;
      this.ptypes=true;
    }

  } 
//แก้ไขข้อมูล
updatedata(){ 
  if(this.dataAdd.PRPLPROJECT_NAME =='' || this.dataAdd.PLMONEYPAY_CODE =='' || this.dataAdd.PLSUBMONEYPAY_CODE ==''  
  || this.dataAdd.PRPLPROJECT_HEADER =='' || this.dataAdd.PRPLPROJECT_HPHONE =='' || this.dataAdd.PRPLPROJECT_SDATE =='' 
  || this.dataAdd.PRPLPROJECT_EDATE =='' || this.dataAdd.PLPROJECTMORE_LOCATION =='' || this.dataAdd.PLPROJECTMORE_PRINCIPLE ==''
  || this.dataAdd.PLPROJECTMORE_PRINCIPLE ==''|| this.dataAdd.PLPROJECTMORE_ACTIVITY ==''|| this.dataAdd.PRPLPROJECT_OBJECT ==''
  || this.dataAdd.PLPROJECTMORE_RESULT ==''|| this.dataAdd.PLPROJECTMORE_ESTIMATE ==''|| this.dataAdd.PLSTRATEGY_CODE ==''
  || this.dataAdd.PLESTIMATEPLAN_CODE ==''|| this.dataAdd.PLSTRATEGIES_CODE ==''|| this.dataAdd.PLMEASURES_CODE ==''
  || this.dataAdd.PLPLAND_CODE =='' ){
     if(this.dataAdd.PRPLPROJECT_NAME ==''){
      this.toastr.warning("แจ้งเตือน:กรุณากรอกชื่อโครงการ");
     }
     if(this.dataAdd.PLMONEYPAY_CODE ==''){
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกประเภทงบ");
     }
     if(this.dataAdd.PLSUBMONEYPAY_CODE ==''){
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกหมวดรายจ่าย");
     }
     if(this.dataAdd.PRPLPROJECT_HEADER ==''){
      this.toastr.warning("แจ้งเตือน:กรุณากรอกชื่อผู้รับผิดชอบโครงการ");
     }
     if(this.dataAdd.PRPLPROJECT_HPHONE ==''){
      this.toastr.warning("แจ้งเตือน:กรุณากรอกเบอร์โทรผู้รับผิดชอบโครงการ");
     }
     if(this.dataAdd.PRPLPROJECT_SDATE =='' || this.dataAdd.PRPLPROJECT_EDATE ==''){
      this.toastr.warning("แจ้งเตือน:กรุณากรอกวันที่ดำเนินโครงการ");
     }
     if(this.dataAdd.PLPROJECTMORE_LOCATION ==''){
      this.toastr.warning("แจ้งเตือน:กรุณากรอกสถานที่ดำเนินโครงการ");
     }
     if(this.dataAdd.PLPROJECTMORE_PRINCIPLE ==''){
      this.toastr.warning("แจ้งเตือน:กรุณากรอกแนวทาง/กิจกรรมในการดำเนินโครงการ");
     }
     if(this.dataAdd.PRPLPROJECT_OBJECT ==''){
      this.toastr.warning("แจ้งเตือน:กรุณากรอกวัตถุประสงค์");
     }
     if(this.dataAdd.PLPROJECTMORE_RESULT ==''){
      this.toastr.warning("แจ้งเตือน:กรุณากรอกผลที่คาดว่าจะได้รับ");
     }
     if(this.dataAdd.PLPROJECTMORE_ESTIMATE ==''){
      this.toastr.warning("แจ้งเตือน:กรุณากรอกการประเมินผลโครงการ");
     }
     if(this.dataAdd.PLSTRATEGY_CODE =='' || this.dataAdd.PLESTIMATEPLAN_CODE =='' || this.dataAdd.PLSTRATEGIES_CODE ==''
     || this.dataAdd.PLMEASURES_CODE =='' || this.dataAdd.PLPLAND_CODE ==''){
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกความเชื่อมโยงโครงการกับแผนยุทธศาสตร์");
     } 
  }else{
    this.dataAdd.PRPLPROJECT_SDATE1=this.datenow(this.dataAdd.PRPLPROJECT_SDATE);
    this.dataAdd.PRPLPROJECT_EDATE1=this.datenow(this.dataAdd.PRPLPROJECT_EDATE);
    this.dataAdd.PLPROJECTMORE_PRINCIPLE = this.dataAdd.PLPROJECTMORE_PRINCIPLE.replaceAll("<br>", "<br/>"); 
    this.dataAdd.PLPROJECTMORE_PRINCIPLE = this.dataAdd.PLPROJECTMORE_PRINCIPLE.replaceAll("<p>", "<br/>"); 
    this.dataAdd.PLPROJECTMORE_PRINCIPLE = this.dataAdd.PLPROJECTMORE_PRINCIPLE.replaceAll("</p>", "");
    this.dataAdd.PLPROJECTMORE_ACTIVITY = this.dataAdd.PLPROJECTMORE_ACTIVITY.replaceAll("<br>", "<br/>"); 
    this.dataAdd.PLPROJECTMORE_ACTIVITY = this.dataAdd.PLPROJECTMORE_ACTIVITY.replaceAll("<p>", "<br/>"); 
    this.dataAdd.PLPROJECTMORE_ACTIVITY = this.dataAdd.PLPROJECTMORE_ACTIVITY.replaceAll("</p>", "");
    this.dataAdd.PLPROJECTMORE_OBJECT = this.dataAdd.PLPROJECTMORE_OBJECT.replaceAll("<br>", "<br/>"); 
    this.dataAdd.PLPROJECTMORE_OBJECT = this.dataAdd.PLPROJECTMORE_OBJECT.replaceAll("<p>", "<br/>"); 
    this.dataAdd.PLPROJECTMORE_OBJECT = this.dataAdd.PLPROJECTMORE_OBJECT.replaceAll("</p>", "");
    this.dataAdd.PLPROJECTMORE_RESULT = this.dataAdd.PLPROJECTMORE_RESULT.replaceAll("<br>", "<br/>"); 
    this.dataAdd.PLPROJECTMORE_RESULT = this.dataAdd.PLPROJECTMORE_RESULT.replaceAll("<p>", "<br/>"); 
    this.dataAdd.PLPROJECTMORE_RESULT = this.dataAdd.PLPROJECTMORE_RESULT.replaceAll("</p>", "");
    this.dataAdd.PLPROJECTMORE_ESTIMATE = this.dataAdd.PLPROJECTMORE_ESTIMATE.replaceAll("<br>", "<br/>"); 
    this.dataAdd.PLPROJECTMORE_ESTIMATE = this.dataAdd.PLPROJECTMORE_ESTIMATE.replaceAll("<p>", "<br/>"); 
    this.dataAdd.PLPROJECTMORE_ESTIMATE = this.dataAdd.PLPROJECTMORE_ESTIMATE.replaceAll("</p>", "");
    this.dataAdd.PLPROJECTMORE_FOLLOW = this.dataAdd.PLPROJECTMORE_FOLLOW.replaceAll("<br>", "<br/>"); 
    this.dataAdd.PLPROJECTMORE_FOLLOW = this.dataAdd.PLPROJECTMORE_FOLLOW.replaceAll("<p>", "<br/>"); 
    this.dataAdd.PLPROJECTMORE_FOLLOW = this.dataAdd.PLPROJECTMORE_FOLLOW.replaceAll("</p>", "");
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
// ฟังก์ขันสำหรับการเพิ่มข้อมูล/และแก้ไขข้อมูล
insertdata(id: any){    
  this.dataAdd.PRPLPROJECT_ASTATUS=id; 
  //console.log(this.dataAdd);
  if(this.dataAdd.PRPLPROJECT_NAME =='' || this.dataAdd.PLMONEYPAY_CODE =='' || this.dataAdd.PLSUBMONEYPAY_CODE ==''  
  || this.dataAdd.PRPLPROJECT_HEADER =='' || this.dataAdd.PRPLPROJECT_HPHONE =='' || this.dataAdd.PRPLPROJECT_SDATE =='' 
  || this.dataAdd.PRPLPROJECT_EDATE =='' || this.dataAdd.PLPROJECTMORE_LOCATION =='' || this.dataAdd.PLPROJECTMORE_PRINCIPLE ==''
  || this.dataAdd.PLPROJECTMORE_PRINCIPLE ==''|| this.dataAdd.PLPROJECTMORE_ACTIVITY ==''|| this.dataAdd.PLPROJECTMORE_OBJECT ==''
  || this.dataAdd.PLPROJECTMORE_RESULT ==''|| this.dataAdd.PLPROJECTMORE_ESTIMATE ==''|| this.dataAdd.PLSTRATEGY_CODE ==''
  || this.dataAdd.PLESTIMATEPLAN_CODE ==''|| this.dataAdd.PLSTRATEGIES_CODE ==''|| this.dataAdd.PLMEASURES_CODE ==''
  || this.dataAdd.PLPLAND_CODE =='' ){
     if(this.dataAdd.PRPLPROJECT_NAME ==''){
      this.toastr.warning("แจ้งเตือน:กรุณากรอกชื่อโครงการ");
     }
     if(this.dataAdd.PLMONEYPAY_CODE ==''){
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกประเภทงบ");
     }
     if(this.dataAdd.PLSUBMONEYPAY_CODE ==''){
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกหมวดรายจ่าย");
     }
     if(this.dataAdd.PRPLPROJECT_HEADER ==''){
      this.toastr.warning("แจ้งเตือน:กรุณากรอกชื่อผู้รับผิดชอบโครงการ");
     }
     if(this.dataAdd.PRPLPROJECT_HPHONE ==''){
      this.toastr.warning("แจ้งเตือน:กรุณากรอกเบอร์โทรผู้รับผิดชอบโครงการ");
     }
     if(this.dataAdd.PRPLPROJECT_SDATE =='' || this.dataAdd.PRPLPROJECT_EDATE ==''){
      this.toastr.warning("แจ้งเตือน:กรุณากรอกวันที่ดำเนินโครงการ");
     }
     if(this.dataAdd.PLPROJECTMORE_LOCATION ==''){
      this.toastr.warning("แจ้งเตือน:กรุณากรอกสถานที่ดำเนินโครงการ");
     }
     if(this.dataAdd.PLPROJECTMORE_PRINCIPLE ==''){
      this.toastr.warning("แจ้งเตือน:กรุณากรอกแนวทาง/กิจกรรมในการดำเนินโครงการ");
     }
     if(this.dataAdd.PLPROJECTMORE_OBJECT ==''){
      this.toastr.warning("แจ้งเตือน:กรุณากรอกวัตถุประสงค์");
     }
     if(this.dataAdd.PLPROJECTMORE_RESULT ==''){
      this.toastr.warning("แจ้งเตือน:กรุณากรอกผลที่คาดว่าจะได้รับ");
     }
     if(this.dataAdd.PLPROJECTMORE_ESTIMATE ==''){
      this.toastr.warning("แจ้งเตือน:กรุณากรอกการประเมินผลโครงการ");
     }
     if(this.dataAdd.PLSTRATEGY_CODE =='' || this.dataAdd.PLESTIMATEPLAN_CODE =='' || this.dataAdd.PLSTRATEGIES_CODE ==''
     || this.dataAdd.PLMEASURES_CODE =='' || this.dataAdd.PLPLAND_CODE ==''){
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกความเชื่อมโยงโครงการกับแผนยุทธศาสตร์");
     } 
  }else{
    this.dataAdd.PRPLPROJECT_SDATE1=this.datenow(this.dataAdd.PRPLPROJECT_SDATE);
    this.dataAdd.PRPLPROJECT_EDATE1=this.datenow(this.dataAdd.PRPLPROJECT_EDATE);
    this.dataAdd.PLPROJECTMORE_PRINCIPLE = this.dataAdd.PLPROJECTMORE_PRINCIPLE.replaceAll("<br>", "<br/>"); 
    this.dataAdd.PLPROJECTMORE_PRINCIPLE = this.dataAdd.PLPROJECTMORE_PRINCIPLE.replaceAll("<p>", "<br/>"); 
    this.dataAdd.PLPROJECTMORE_PRINCIPLE = this.dataAdd.PLPROJECTMORE_PRINCIPLE.replaceAll("</p>", "");
    this.dataAdd.PLPROJECTMORE_ACTIVITY = this.dataAdd.PLPROJECTMORE_ACTIVITY.replaceAll("<br>", "<br/>"); 
    this.dataAdd.PLPROJECTMORE_ACTIVITY = this.dataAdd.PLPROJECTMORE_ACTIVITY.replaceAll("<p>", "<br/>"); 
    this.dataAdd.PLPROJECTMORE_ACTIVITY = this.dataAdd.PLPROJECTMORE_ACTIVITY.replaceAll("</p>", "");
    this.dataAdd.PLPROJECTMORE_OBJECT = this.dataAdd.PLPROJECTMORE_OBJECT.replaceAll("<br>", "<br/>"); 
    this.dataAdd.PLPROJECTMORE_OBJECT = this.dataAdd.PLPROJECTMORE_OBJECT.replaceAll("<p>", "<br/>"); 
    this.dataAdd.PLPROJECTMORE_OBJECT = this.dataAdd.PLPROJECTMORE_OBJECT.replaceAll("</p>", "");
    this.dataAdd.PLPROJECTMORE_RESULT = this.dataAdd.PLPROJECTMORE_RESULT.replaceAll("<br>", "<br/>"); 
    this.dataAdd.PLPROJECTMORE_RESULT = this.dataAdd.PLPROJECTMORE_RESULT.replaceAll("<p>", "<br/>"); 
    this.dataAdd.PLPROJECTMORE_RESULT = this.dataAdd.PLPROJECTMORE_RESULT.replaceAll("</p>", "");
    this.dataAdd.PLPROJECTMORE_ESTIMATE = this.dataAdd.PLPROJECTMORE_ESTIMATE.replaceAll("<br>", "<br/>"); 
    this.dataAdd.PLPROJECTMORE_ESTIMATE = this.dataAdd.PLPROJECTMORE_ESTIMATE.replaceAll("<p>", "<br/>"); 
    this.dataAdd.PLPROJECTMORE_ESTIMATE = this.dataAdd.PLPROJECTMORE_ESTIMATE.replaceAll("</p>", "");
    this.dataAdd.PLPROJECTMORE_FOLLOW = this.dataAdd.PLPROJECTMORE_FOLLOW.replaceAll("<br>", "<br/>"); 
    this.dataAdd.PLPROJECTMORE_FOLLOW = this.dataAdd.PLPROJECTMORE_FOLLOW.replaceAll("<p>", "<br/>"); 
    this.dataAdd.PLPROJECTMORE_FOLLOW = this.dataAdd.PLPROJECTMORE_FOLLOW.replaceAll("</p>", "");
    this.dataAdd.opt = "insert"; 
    //console.log(this.dataAdd.opt); 
    this.apiService
     .getupdate(this.dataAdd,this.url)
     .pipe(first())
     .subscribe((data: any) => {
            
     if (data.status == 1) {
       this.toastr.success("แจ้งเตือน::อนุมัติข้อมูลเรียบร้อยแล้ว ");
       this.fetchdatalistapp();
      // document.getElementById("ModalClose")?.click();
     } else {
      this.toastr.warning("แจ้งเตือน:ไม่สามารถเพิ่มข้อมูลได้");

     }
     });
   }
  }
datenow(datenow:any){
  const yyyy = datenow.getFullYear();
  let mm = datenow.getMonth() + 1; // Months start at 0!
  let dd = datenow.getDate();
  return  yyyy+'-'+mm+'-'+dd;
  }
  onChangedistrict(deviceValue: any) {
    this.dataAdd.opt = "viewdistrict"; 
    if(deviceValue !=''){
      this.dataAdd.PROVINCE_ID=deviceValue;
    }
    this.apiService
    .getdata(this.dataAdd,this.url1)
    .pipe(first())
    .subscribe((data: any) => {
      this.dataDistrict  = data;
    });         
  } 
  onChangesubdistrict(deviceValue: any) {
    this.dataAdd.opt = "viewsubdistrict"; 
    if(deviceValue !=''){
      this.dataAdd.DISTRICT_ID=deviceValue;
    }
    this.apiService
    .getdata(this.dataAdd,this.url1)
    .pipe(first())
    .subscribe((data: any) => {
      this.dataSubdistrict  = data;
      
    }); 
  } 
  onChangecrpartrister() {
    this.dataAdd.opt = "viewcrpartregis"; 
    this.apiService
    .getdata(this.dataAdd,this.url1)
    .pipe(first())
    .subscribe((data: any) => {
      this.dataCrpartregis = data;
      //console.log(this.dataSub);
    });
  } 
  showapp(code:any,name:any){
    this.clickshow=true;
    this.dataAdd.PRASSETAPP_CODE = code; 
    this.dataAdd.htmlStringd = name; 
    this.dataAdd.PRASSETFAC_NOTE = '';
    this.dataAdd.PRASSET_PSTATUS = 0;
  } 
  insertappfac(){ 
    this.dataAdd.opt = "approvefac";  
    this.apiService
       .getupdate(this.dataAdd,this.url)
       .pipe(first())
       .subscribe((data: any) => {
         //console.log(data.status);       
       if (data.status == 1) {
        this.clickshow=null;
        this.fetchdatalistapp();
        this.fetchdatalist();
         this.toastr.success("แจ้งเตือน:อนุมัติข้อมูลเรียบร้อยแล้ว");
       } 
       });
  }  
  fetchclose(){
    this.clickshow=null;  
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
