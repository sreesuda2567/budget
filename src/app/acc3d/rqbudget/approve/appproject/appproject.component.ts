import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { ApiPdoService } from '../../../../_services/api-pui.service';
import { TokenStorageService } from '../../../../_services/token-storage.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
const editorConfig = {
  toolbar: {
    items: [
      'bold', 'italic', '|',
      'bulletedList', 'numberedList', '|',
      'imageUpload'    // อัปโหลดไฟล์จากเครื่อง
    ]
  }
};

@Component({
  selector: 'app-appproject',
  templateUrl: './appproject.component.html',
  styleUrls: ['./appproject.component.scss']
})
export class AppprojectComponent implements OnInit {
  public editor = ClassicEditor;
  public editorConfig = {
    toolbar: {
      items: [
        'bold', 'italic', '|', 'bulletedList', 'numberedList', '|', 'imageUpload'
      ]
    },
    // ใช้ CKFinder adapter (มีใน classic build)
    ckfinder: {
      uploadUrl: 'https://budget.rmutsv.ac.th/api/acc3d/investment/project/upload_image.php'   // <= เปลี่ยนให้ถูกกับโปรเจกต์
    }
  };
  name = 'Angular';
  //editor = ClassicEditor;
  // editorConfig = editorConfig;

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
  dataDistrictList: any = [];
  dataSubdistrictList: any = [];
  dataPlmoneypay: any;
  datalist: any;
  datalistresearch: any;
  datalistresearchapp: any;
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
  dataProjectexd: any;
  dataProjectact: any;
  dataProjectdt: any;
  dataProjectasset: any;
  dataProjecthead: any;
  dataPlm: any;
  dataPls: any;
  dataPli: any;
  dataPlp: any;
  rowpbi: any;
  rowpbu: any;
  ptype: any;
  ptypes: any;
  loadingapp: any;
  datalistapp: any
  datalistregister: any
  rownumregis: any;
  dataCrpartregis: any;
  datastatus: any
  clickshow: any;
  dataYearimport: any;
  loadingimport: any;
  datalistimport: any;
  rownumimport: any;
  dataSubplmoneypay: any;
  datalistimportall: any;
  dataGtype: any;
  selectedMealTargetIds: string[] = [];
  mealDetailConfig = {
    usePrefix: true
  };
  url = "/acc3d/rqbudget/approve/appproject.php";
  url1 = "/acc3d/rqbudget/userpermission.php";
  locale = 'th-be';
  locales = listLocales();
  //dataAdd:any = {PRBOBJECT_NAME:[],PRBOBJECT_CODE:[],PRUSE_NAME:[],PRUSE_CODE:[]};PLPROJECTEXPENSES_CODE
  dataAdd: any = {
    actMode: 'activity',
    PRPLPROJECT_NUMBER: 0,
    check: [], checkregis: [], PRREGISPROJECT_CODE: [], PRASSET_CODEA: [],
    PLPROJECTD_CODE: [], PLPROJECTD_RSTATUS: [], PLPROJECTD_NAME: [], PLPROJECTD_VALUE: [], PLINDICATOR_CODE: [], PLPROJECTGROUPDT_NAME: [], PRPLPROJECTM_YEAR: [], PRPLPROJECTM_MONEY: []
    , PRPLPROJECTACT_NAME: [], PRPLPROJECTACT_ACT: [], PRPLPROJECT_PERSONS: [], PRPLPROJECT_PERSONP: [], PRPLPROJECT_PERSONO: [], checkimport: [], IMPORTASSET_CODE: []
    , PLPROJECTGROUPDT_NUM: [], GCUNIT_CODE: [], PLPROJECTGROUPDT_NUMA: [], GCUNIT_ACODE: [], PLPROJECTGROUPDT_MONEY: [], PLPROJECTGROUPDT_MONEYA: [], PLPROJECTGROUPDT_CODE: []
    , PLPROJECTEXPENSES_CODE: [], TOTAL_MONEY: [], PRPLPROJECT_SDATE: [], PRPLPROJECT_EDATE: []
    , PRPLPROJECT_AT: [], PRPLPROJECT_LOCATION: [], PROVINCE_ID: [], DISTRICT_ID: [], SUB_DISTRICT_ID: [],
    PLPROJECTMORE_PRINCIPLE: '', PLPROJECTMORE_ACTIVITY: '', PRPLPROJECT_OBJECT: '', PLPROJECTMORE_RESULT: '', PLPROJECTMORE_ESTIMATE: '', PLPROJECTMORE_FOLLOW: ''
  };
  searchTerm: any;
  selectedDevice: any;
  loading: any;

  page = 1;
  count = 0;
  tableSize = 10;
  tableSizes = [10, 20, 30];
  number: any = [1, 2, 3, 4, 5];
  number1: any = [];
  rownum: any;
  rownum1: any;
  activeTab = 2;
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: auto,
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['fontSize',
        'textColor',
        'backgroundColor',
        'customClasses',
        'link',
        'unlink',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'toggleEditorMode'/*,
      'subscript',
      'superscript',
      'strikeThrough',
      'justifyLeft',
      'justifyCenter',
      'justifyRight',
      'justifyFull',
      'indent',
      'outdent',
      'heading',
    'fontName' */  ]
    ],
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
  previewPdfUrl: string = '';
  safePdfUrl: SafeResourceUrl = '';

  constructor(
    private tokenStorage: TokenStorageService,
    private apiService: ApiPdoService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private eRef: ElementRef,
    private formBuilder: FormBuilder,
    private localeService: BsLocaleService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    document.getElementById("ModalClose")?.click();
    this.dataAdd.RPLINCOME_CODE1 = '';
    this.dataAdd.RCRPART_ID1 = '';
    this.fetchdata();
    this.dataAdd.PLPROJECTTYPE = 1;
    this.dataAdd.FPLPROJECTTYPE = 1;
    //this.dataAdd.FPLPROJECTTYPE = 1;
    this.rowpbu = null;
    this.projecttype();
    this.localeService.use(this.locale);
    this.applyLocale('thBeLocale');
    this.dataAdd.CITIZEN_ID = this.tokenStorage.getUser().citizen;
    this.dataAdd.PLINCOME_CODE = '';
    this.dataAdd.CRPART_ID = '';
    this.dataAdd.searchimport = '';
    this.rowpbi = true;
  }
  applyLocale(pop: any) {
    this.localeService.use(this.locale);
  }
  keyword = 'name';
  datacomplete = [];
  selectEvent(item: any) {
    this.dataAdd.PRPLPROJECT_HCITIZEN = item.id;
    this.dataAdd.PRPLPROJECT_HEADER = item.name;
    this.dataAdd.PRPLPROJECT_HPHONE = item.phone;
    //console.log(item);
  }
  onChangeSearch(val: string) {
    var varP = {
      "opt": "viewperson",
      "search": val,
      "FACULTY_CODE": this.dataAdd.FACULTY_CODE
    }
    this.apiService
      .getdata(varP, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.datacomplete = data;
        this.dataAdd.PRPLPROJECT_HPHONE = data[0].TELEPHONE;
        // console.log(data);
      });
  }
  // ฟังก์ขันสำหรับการดึงข้อมูลทะเบียนครุภัณฑ์     
  onChangerister() {
    // this.dataAdd.checkregis =Array;
    this.datalistregister = null;
    this.dataAdd.opt = "readregis";
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == 1) {
          this.datalistregister = data.data;
          this.rownumregis = true;
          if (Array.isArray(this.dataAdd.PRREGISPROJECT_CODE)) {
            for (let i = 0; i < this.datalistregister.length; i++) {
              this.dataAdd.PRREGISPROJECT_CODE[i] = this.datalistregister[i].PRREGISPROJECT_CODE;
            }
          }
        } else {
          this.datalistregister = data.data;
          this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูลทะเบียนครุภัณฑ์");
          this.rownumregis = null;
        }
      });
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
        // console.log(data);
        var varN = {
          "opt": "viewfac",
          "citizen": this.tokenStorage.getUser().citizen,
          "PRIVILEGERSTATUS": data[0].PRIVILEGE_RSTATUS
        }
        this.apiService
          .getdata(varN, this.url1)
          .pipe(first())
          .subscribe((data: any) => {
            this.dataFac = data;
            // console.log(data);
            this.dataAdd.FACULTY_CODE = data[0].FACULTY_CODE;
            this.dataAdd.FACULTY_CODE1 = data[0].FACULTY_CODE;
            this.fetchdatalistapp();
          });
      });
    //รายการประเภทเงิน
    var Tablein = {
      "opt": "viewincome"
    }
    this.apiService
      .getdata(Tablein, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataIncome = data;
        this.dataAdd.PLINCOME_CODE = '';// data[0].PLINCOME_CODE;
        //console.log(data[0].PLINCOME_CODE);
      });
    //รายการปี
    var Tabley = {
      "opt": "viewmyear"
    }
    this.apiService
      .getdata(Tabley, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataYear = data;
        this.dataAdd.PLYEARBUDGET_CODE = data[0].PLYEARBUDGET_CODE;
        // this.dataAdd.FPRYEARASSET_CODE = data[0].PLYEARBUDGET_CODE;
        //รายการภาค
        var Table2 = {
          "opt": "viewcrpart",
          "PRYEARASSET_CODE": data[0].PLYEARBUDGET_CODE,
          "FACULTY_CODE": "",
          "PLINCOME_CODE": "01"
        }
        this.apiService
          .getdata(Table2, this.url1)
          .pipe(first())
          .subscribe((datacr: any) => {
            //console.log(datacr);
            this.dataCrpart = datacr;
            this.dataAdd.CRPART_ID = '';//datacr[0].CRPART_ID;
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
    var Tabley = {
      "opt": "viewyearpy"
    }
    this.apiService
      .getdata(Tabley, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataYearp = data;
      });
    //รายการหน่วยนับ
    var Tablegc = {
      "opt": "viewgcunit"
    }
    this.apiService
      .getdata(Tablegc, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataUnit = data;

      });

    //รายการผลิต
    var Tablepro = {
      "opt": "viewprop"
    }
    this.apiService
      .getdata(Tablepro, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataProduct = data;

      });
    //รายการประเภทครุภัณฑ์
    var Tablest = {
      "opt": "viewtstype"
    }
    this.apiService
      .getdata(Tablest, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataAssettype = data;

      });
    //รายการจังหวัด
    var Tableprovince = {
      "opt": "viewprovince"
    }
    this.apiService
      .getdata(Tableprovince, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataProvince = data;
      });
    //รายการงบ 
    var Table = {
      "opt": "viewPLMONEYPAY"
    }
    this.apiService
      .getdata(Table, this.url1)
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
    //ประเภทรายจ่าย
    var Table = {
      "opt": "viewPLPROJECTGROUP"
    }
    this.apiService
      .getdata(Table, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataProjectgroup = data;
      });
    //รายการหน่วยนับ
    var Tablegc = {
      "opt": "viewgcunit"
    }
    this.apiService
      .getdata(Tablegc, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataUnit = data;
        //this.dataAdd.GCUNIT_CODE= data[0].GCUNIT_CODE;
      });

    var Tablegt = {
      "opt": "viewPLPROJECTGTYPE"
    }
    this.apiService
      .getdata(Tablegt, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataGtype = data;
        this.dataAdd.PRPLPROJECTACT_CODE = 1;
        this.dataAdd.PLPROJECTGTYPE_CODE = '';// data[0].PLPROJECTGTYPE_CODE;
        //this.fetchdataPLPROJECTGROUPDTT();
      });
    var Tablegc = {
      "opt": "viewPLPROJECTGROUPDTD"
    }
    this.apiService
      .getdata(Tablegc, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataProjecttd = data ? data.data : [];
        if (!Array.isArray(this.dataAdd.PLPROJECTGROUPDT_CODE)) {
          this.dataAdd.PLPROJECTGROUPDT_CODE = [];
        }
        let k = 0;
        if (this.dataProjecttd && Array.isArray(this.dataProjecttd)) {
          for (let i = 0; i < this.dataProjecttd.length; i++) {
            if (this.dataProjecttd[i].PLPROJECTGROUPDT_CODE != '') {
              this.dataAdd.PLPROJECTGROUPDT_CODE[k] = this.dataProjecttd[i].PLPROJECTGROUPDT_CODE;
              k++;
            }
          }
        }

      });
    //รายการหน่วยนับ
    var Tablegc = {
      "opt": "viewPLRESEARCHTYPE"
    }
    this.apiService
      .getdata(Tablegc, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataSearchtype = data;
      });
    //สถานะ
    var Tabletar = {
      "opt": "viewstatusplan"
    }
    this.apiService
      .getdata(Tabletar, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.datastatus = data;
        this.dataAdd.PRSTATUS_CODE = data[1].PRSTATUS_CODE;
      });
    this.dataAdd.opt = "readAll";
    this.dataAdd.CITIZEN_ID = this.tokenStorage.getUser().citizen;

  }
  //ประเภทรายจ่าย
  fetchdataPLPROJECTGROUPDTT(locationType?: any) {
    if (!this.dataAdd || !this.dataAdd.PLPROJECTGTYPE_CODE) {
      this.dataProjectdt = [];
      return;
    }
    if (!this.isEconomyRateAvailable) {
      this.dataAdd.PLPROJECTESTTYPE_CODE = 1;
    }
    this.dataProjectdt = [];
    const loc = (locationType !== undefined && locationType !== null && locationType !== '') ? String(locationType) : this.getCurrentLocationType();
    const payload = {
      ...this.dataAdd,
      opt: "viewPLPROJECTGROUPDTT",
      PRPLPROJECT_AT: loc,
      PRPLPROJECT_AT_CURR: loc
    };
    this.apiService
      .getdata(payload, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataProjectdt = data || [];
        if (this.dataAdd.PLPROJECTGROUPDT_CODE && this.dataProjectdt.length > 0) {
          const exists = this.dataProjectdt.some((item: any) => item.PLPROJECTGROUPDT_CODE == this.dataAdd.PLPROJECTGROUPDT_CODE);
          if (!exists) {
            this.dataAdd.PLPROJECTGROUPDT_CODE = '';
          }
        }
        if (this.isTargetGroupItem(this.dataAdd.PLPROJECTGROUPDT_CODE)) {
          this.syncMealTargetsFromDetail();
        } else {
          this.selectedMealTargetIds = [];
        }
      }, (err: any) => {
        this.dataProjectdt = [];
      });
  }
  fetchDataByTab() {
    if (this.activeTab === 1) {
      this.fetchdatalist();
    } else {
      this.fetchdatalistapp();
    }
  }

  projecttype() {
    if (this.dataAdd.FPLPROJECTTYPE == 1) {
      this.ptype = true;
      this.ptypes = null;
    } else {
      this.ptype = null;
      this.ptypes = true;
    }

  }
  calexpensesdt() {
    this.dataAdd.PLPROJECTGROUPDTMONEY = parseFloat(this.dataAdd.PRASSET_MONEY);
  }
  calexpenses() {
    this.dataAdd.sum = this.dataAdd.PRASSET_MONEY.replace(/,/g, "");
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
  //ตัวชี้วัดโครงการ
  fetchdataPLINDICATOR() {
    for (let i = 0; i < 5; i++) {
      this.dataAdd.PLPROJECTD_NAME[i] = '';
      this.dataAdd.PLPROJECTD_VALUE[i] = '';
      this.dataAdd.PLINDICATOR_CODE[i] = '';
      this.dataAdd.PLPROJECTD_CODE[i] = '';
      this.dataAdd.PLPROJECTD_RSTATUS[i] = '';
    }
    this.dataPlandicator = null;
    this.dataAdd.opt = "viewPLINDICATOR";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataPlandicator = data;
        if (this.dataPlandicator && Array.isArray(this.dataPlandicator)) {
          for (let i = 0; i < this.dataPlandicator.length; i++) {
            this.dataAdd.PLPROJECTD_NAME[i] = this.dataPlandicator[i].PLINDICATOR_NAME;
            this.dataAdd.PLPROJECTD_VALUE[i] = this.dataPlandicator[i].PLINDICATOR_VALUE;
            this.dataAdd.PLINDICATOR_CODE[i] = this.dataPlandicator[i].PLINDICATOR_CODE;
            this.dataAdd.PLPROJECTD_CODE[i] = '';
            this.dataAdd.PLPROJECTD_RSTATUS[i] = 3;
          }
        }
      });
  }
  //รายจ่ายย่อย
  fetchdataPLPROJECTGROUPDT() {
    this.dataAdd.opt = "viewPLPROJECTGROUPDT";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataProjectgrouptd = data;
        //this.dataAdd.PLPLAND_CODE = data[0].PLPLAND_CODE;
      });
  }
  // ฟังก์ชัน โชว์ปุ่ม
  showinputin() {
    this.rowpbi = 1;
  }
  // ฟังก์ชัน โชว์ปุ่ม
  showinputinnull() {
    this.rowpbi = null;
  }
  deliver(id: any) {
    this.dataAdd.opt = "deliver";
    this.dataAdd.id = id;
    Swal.fire({
      title: 'ต้องการนำส่งข้อมูล?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.value) {
        this.apiService
          .getdata(this.dataAdd, this.url)
          .pipe(first())
          .subscribe((data: any) => {
            if (data.status == 1) {
              Swal.fire('นำส่งข้อมูล!', 'นำส่งข้อมูลเรียบร้อยแล้ว', 'success');
              this.fetchdatalist();
            }
          });
      }
    });
  }
  // เคลียร์ค่า textbox
  setshowbti() {
    this.dataAdd.PRPLPROJECTACT_NAME = [];
    this.dataAdd.PRPLPROJECTACT_ACT = [];
    this.dataAdd.PRPLPROJECT_PERSONS = [];
    this.dataAdd.PRPLPROJECT_PERSONP = [];
    this.dataAdd.PRPLPROJECT_PERSONO = [];
    this.dataAdd.PRPLPROJECT_AT = [];
    this.dataAdd.PRPLPROJECT_LOCATION = [];
    this.dataAdd.PROVINCE_ID = [];
    this.dataAdd.DISTRICT_ID = [];
    this.dataAdd.SUB_DISTRICT_ID = [];
    this.dataDistrictList = [];
    this.dataSubdistrictList = [];
    this.dataAdd.RPLINCOME_CODE = '';
    this.dataAdd.PRPLPROJECT_CODE = '';
    this.dataAdd.RCRPART_ID = '';
    this.dataAdd.PLGPRODUCT_CODE = '';
    this.dataAdd.PLSUBMONEYPAY_CODE = '';
    this.dataAdd.PRPLPROJECT_NAME = '';
    this.dataAdd.PRPLPROJECT_TIME = 1;
    this.showact();
    this.dataAdd.FPLPROJECTTYPE = 1;
    this.dataAdd.PLMONEYPAY_CODE = '';
    this.dataAdd.PLSUBMONEYPAY_CODE1 = '';
    this.dataAdd.PLRESEARCHTYPE_CODE = '';
    this.dataAdd.PRPLPROJECT_HEADER = '';
    this.dataAdd.PRPLPROJECT_HPHONE = '';
    this.dataAdd.PRPLPROJECTHEAD_TYPE = 1;
    // this.dataAdd.PRPLPROJECT_PERSONS = 0;
    //this.dataAdd.PRPLPROJECT_PERSONP = 0;
    //this.dataAdd.PRPLPROJECT_PERSONO = 0;
    this.dataAdd.PLPROJECT_MONEYT = 0;
    this.dataAdd.PLPROJECT_MONEY = 0;
    this.dataAdd.PRPLPROJECT_SDATE = [];
    this.dataAdd.PRPLPROJECT_EDATE = [];
    this.dataAdd.PLPROJECTMORE_LOCATION = '';
    this.dataAdd.PLPROJECTMORE_PRINCIPLE = '';
    this.dataAdd.PLPROJECTMORE_ACTIVITY = '';
    this.dataAdd.PRPLPROJECT_OBJECT = '';
    this.dataAdd.PLPROJECTMORE_RESULT = '';
    this.dataAdd.PRBUILDING_REASON = '';
    this.dataAdd.PLSTRATEGY_CODE = '';
    this.dataAdd.PLESTIMATEPLAN_CODE = '';
    this.dataAdd.PLSTRATEGIES_CODE = '';
    this.dataAdd.PLMEASURES_CODE = '';
    this.dataAdd.PLPLAND_CODE = '';
    this.dataAdd.PLPROJECT_DETAIL = '';
    this.dataAdd.searchregis = '';
    this.dataAdd.PRREGISPROJECT_CODE = [];
    this.dataAdd.PLPROJECTMORE_ESTIMATE = '';
    this.dataAdd.PLPROJECTMORE_FOLLOW = '';
    this.dataAdd.PRPLPROJECT_T1 = '';
    this.dataAdd.PRPLPROJECT_T2 = '';
    this.dataAdd.PRPLPROJECT_PEXCELL = '';
    this.dataAdd.PRPLPROJECT_ANOTHER = '';
    this.dataAdd.PRPLPROJECT_PDEVELOP = '';
    this.dataAdd.PRPLPROJECT_SUPPORT = '';
    this.dataAdd.PLPROJECTESTTYPE_CODE = 1;
    this.dataAdd.PLPROJECTGTYPE_CODE = '01';
    this.dataAdd.money1 = 1;
    this.dataAdd.money2 = 1;
    this.dataAdd.money3 = 1;
    this.dataAdd.money4 = 1;
    this.dataAdd.money5 = 1;
    //this.dataAdd.PRBUILDING_YEAR='1';
    this.showbuid();
    for (let i = 0; i < 5; i++) {
      this.dataAdd.PRPLPROJECTM_YEAR[i] = '';
      this.dataAdd.PRPLPROJECTM_MONEY[i] = '';
    }

  }
  fetchdataPLMISSION() {
    this.dataPlm = null;
    this.dataPls = null;
    this.dataPli = null;
    this.dataPlp = null;
    this.dataAdd.opt = "viewPLMISSION";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        if (data) {
          this.dataPlm = data.dataplm;
          this.dataPls = data.datapls;
          this.dataPli = data.datapli;
          this.dataPlp = data.dataplp;
        }
      });
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
  //เช็คตัวเลข
  CheckNum(num: any) {
    if (num.keyCode !== 44 && (num.keyCode < 46 || num.keyCode > 57)) {
      alert('กรุณากรอกข้อมูล ที่เป็นตัวเลข');
      num.returnValue = false;
    }
  }
  // ฟังก์ขันสำหรับการดึงข้อมูลครุภัณฑ์
  fetchdatalist() {
    this.activeTab = 1;
    this.dataAdd.opt = "readAll";
    this.loading = true;
    this.datalist = null;
    this.datalistapp = null;
    this.datalistresearch = null;
    this.datalistresearchapp = null;
    this.rownum = null;
    this.rownum1 = null;
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == 1) {
          this.datalist = data.data;
          this.dataAdd.turnoff = data.turnoff;
          this.datalistresearch = data.dataresearch;
          this.rownum = 'true';
          this.loading = null;
          // console.log('1');
        } else {
          this.datalist = data.data;
          this.dataAdd.turnoff = data.turnoff;
          this.loading = null;
          this.rownum = null;
          this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
        }
      });
  }
  // ฟังก์ขันสำหรับการเพิ่มข้อมูล/และแก้ไขข้อมูล
  insertdata() {

    this.dataAdd.opt = "insert";
    this.apiService
      .getupdate(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {

        if (data.status == 1) {
          this.toastr.success("แจ้งเตือน::เพิ่มข้อมูลเรียบร้อยแล้ว ");
          this.fetchdatalist();
          this.fetchdatalistapp();
          document.getElementById("ModalClose")?.click();
        } else {
          this.toastr.warning("แจ้งเตือน:ไม่สามารถเพิ่มข้อมูลได้");

        }
      });

  }
  // ฟังก์ขันสำหรับการเพิ่มข้อมูลประมาณการ
  insertdatadt() {
    if (this.dataAdd.PLPROJECTGROUPDT_CODE == '' || this.dataAdd.PLPROJECTGROUPDT_NUMA == '' || this.dataAdd.PLPROJECTGROUPDT_MONEY == '') {

      this.toastr.warning("แจ้งเตือน:กรุณากรอกข้อมูลประมาณการให้ครบถ้วน");

    } else {
      const isMaterial = this.isMaterialItem(this.dataAdd.PLPROJECTGROUPDT_CODE);
      const isMeal = this.isMealItem(this.dataAdd.PLPROJECTGROUPDT_CODE);
      this.dataAdd.opt = "insertdt";
      this.apiService
        .getupdate(this.dataAdd, this.url)
        .pipe(first())
        .subscribe((data: any) => {

          if (data.status == 1) {
            this.cleardat();
            this.fetchdatadt(isMaterial, isMeal);
          } else {
            this.toastr.warning("แจ้งเตือน:ไม่สามารถเพิ่มข้อมูลได้");
          }
        });
    }
  }
  // ฟังก์ขันสำหรับการเพิ่มข้อมูลประมาณการ
  insertdatahead() {
    if (this.dataAdd.PRPLPROJECT_HEADER1 == '' || this.dataAdd.PRPLPROJECT_HPHONE == '') {

      this.toastr.warning("แจ้งเตือน:กรุณากรอกข้อมูลประมาณการให้ครบถ้วน");

    } else {
      this.dataAdd.opt = "inserthead";
      this.apiService
        .getupdate(this.dataAdd, this.url)
        .pipe(first())
        .subscribe((data: any) => {

          if (data.status == 1) {
            this.cleardahead();
            this.fetchdatahead();
          } else {
            this.toastr.warning("แจ้งเตือน:ไม่สามารถเพิ่มข้อมูลได้");
          }
        });
    }
  }
  cleardahead() {
    this.dataAdd.PRPLPROJECT_HEADER1 = '';
    this.dataAdd.PRPLPROJECT_HPHONE = '';
    this.dataAdd.PRPLPROJECT_HCITIZEN = '';
    this.dataAdd.PRPLPROJECT_HEADER = '';

  }
  // ฟังก์ขันสำหรับการดึงข้อมูลประมาณการ
  fetchdatahead() {
    //console.log(1);
    this.dataProjecthead = null;
    this.dataAdd.opt = "readhead";
    this.apiService
      .getupdate(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data) {
          this.dataProjecthead = data.data;
        }
      });

  }
  editdataapp(id: any) {
    this.setshowbti();
    this.onChangerister();
    this.dataAdd.opt = "readoneapp";
    this.dataAdd.id = id;
    /*  this.apiService
        .getdata(this.dataAdd, this.url)
        .pipe(first())
        .subscribe((data: any) => {
          //console.log(data);
          this.onChangedistrict(data[0].PROVINCE_ID);
          this.onChangesubdistrict(data[0].DISTRICT_ID);
        });*/
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataAdd.PRYEARASSET_CODEA = data[0].PRYEARASSET_CODE;
        if (data[0].PRREGISPROJECT_CODEA != null) {
          this.dataAdd.PRREGISASSET_CODEA = data[0].PRREGISPROJECT_CODEA;
        } else {
          this.dataAdd.PRREGISASSET_CODEA = data[0].PRREGISPROJECT_CODE;
        }
        this.dataAdd.PRREGISPROJECT_CODE = data[0].PRREGISPROJECT_CODE;

        // this.dataAdd.PRBUILDING_MONEY = this.numberWithCommas(Number(data[0].PRBUILDING_MONEY).toFixed(2));
        if (data[0].PRPLPROJECT_MONEYA != null) {
          this.dataAdd.PRASSET_MONEY = this.numberWithCommas(Number(data[0].PRPLPROJECT_MONEYA).toFixed(2));
        } else {
          this.dataAdd.PRASSET_MONEY = this.numberWithCommas(Number(data[0].PRPLPROJECT_MONEY).toFixed(2));
        }
        this.calexpenses();

      });
  }
  numberWithCommas(x: any) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
  // ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
  editdatadt(id: any) {
    this.cleardat();
    this.dataAdd.opt = "readonedt";
    this.dataAdd.id = id;
    this.apiService
      .getupdate(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataAdd.PLPROJECTGTYPE_CODE = data[0].PLPROJECTGTYPE_CODE;
        this.fetchdataPLPROJECTGROUPDTT();
        this.showestimate();
        this.dataAdd.PLPROJECTGROUPDT_CODE = data[0].PLPROJECTGROUPDT_CODE;
        this.dataAdd.PLPROJECTESTTYPE_CODE = (data[0].PLPROJECTGTYPE_CODE === '05' || data[0].PLPROJECTGTYPE_CODE === '5') ? data[0].PLPROJECTESTTYPE_CODE : 1;
        this.dataAdd.GCUNIT_ACODE = data[0].GCUNIT_ACODE;
        this.dataAdd.GCUNIT_BCODE = data[0].GCUNIT_BCODE;
        this.dataAdd.GCUNIT_CCODE = data[0].GCUNIT_CCODE;
        this.dataAdd.PLPROJECTGROUPDT_NUMB = data[0].PLPROJECTGROUPDT_NUMB;
        this.dataAdd.PLPROJECTGROUPDT_NUMA = data[0].PLPROJECTGROUPDT_NUMA;
        this.dataAdd.PLPROJECTGROUPDT_NUMC = data[0].PLPROJECTGROUPDT_NUMC;
        this.dataAdd.PLPROJECTGROUPDT_DETAIL = data[0].PLPROJECTGROUPDT_DETAIL;
        this.dataAdd.PLPROJECTEXPENSES_CODE = data[0].PLPROJECTEXPENSES_CODE;
        this.dataAdd.PLPROJECTGROUPDT_MONEY = (parseFloat(data[0].PLPROJECTGROUPDT_MONEY).toFixed(2));
        this.dataAdd.PRASSET_CODE = data[0].PRASSET_CODE;
        this.dataAdd.PRPLPROJECTACT_CODE = data[0].PLPROJECTEXPENSES_NUM;
        if (this.isTargetGroupItem(this.dataAdd.PLPROJECTGROUPDT_CODE)) {
          this.dataAdd.PLPT4 = 1;
          this.syncMealTargetsFromDetail();
        }
        //this.calexpensesdt();

      });
    this.rowpbi = null;
    this.rowpbu = true;
  }
  //แก้ไขข้อมูล
  updatedatadt() {
    const isMaterial = this.isMaterialItem(this.dataAdd.PLPROJECTGROUPDT_CODE);
    const isMeal = this.isMealItem(this.dataAdd.PLPROJECTGROUPDT_CODE);
    this.dataAdd.opt = "updatedt";
    this.apiService
      .getupdate(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        this.toastr.success("แจ้งเตือน:แก้ไขข้อมูลเรียบร้อยแล้ว");
        this.rowpbi = true;
        this.rowpbu = null;
        this.fetchdatadt(isMaterial, isMeal);
        this.cleardat();
      });
  }
  cleardat() {
    this.selectedMealTargetIds = [];
    this.dataAdd.GCUNIT_ACODE = '';
    this.dataAdd.GCUNIT_BCODE = '';
    this.dataAdd.GCUNIT_CCODE = '';
    this.dataAdd.PLPROJECTGROUPDT_NUMB = '';
    this.dataAdd.PLPROJECTGROUPDT_NUMA = '';
    this.dataAdd.PLPROJECTGROUPDT_NUMC = '';
    this.dataAdd.PLPROJECTGROUPDT_DETAIL = '';
    this.dataAdd.PLPROJECTEXPENSES_CODE = '';
    this.dataAdd.PRASSET_CODE = '';
    this.dataAdd.PLPROJECTGROUPDT_MONEY = '';
  }
  // ฟังก์ขันสำหรับการดึงข้อมูลประมาณการ
  fetchdatadt(isSaveAction: boolean = false, isMealAction: boolean = false) {
    //console.log(1);
    this.dataProjectexd = null;
    this.dataAdd.opt = "readdt";
    this.apiService
      .getupdate(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data) {
          this.dataProjectexd = data.data;
          this.processDataProjectexd();
          let sum = 0;
          let materialSum = 0;
          if (data.data) {
            for (var j = 0; j < data.data.length; j++) {
              // console.log(1);
              if (data.data[j].PLPROJECTGROUPDT_NUM == 0) {
                const money = parseFloat(data.data[j].PLPROJECTGROUPDT_MONEY) || 0;
                sum += money;
                const code = String(data.data[j].PLPROJECTGROUPDT_CODE || '');
                const groupName = String(data.data[j].PLPROJECTGROUP_NAME || '');
                if (this.isMaterialItem(code) || groupName === 'ค่าวัสดุ') {
                  materialSum += money;
                }
              }
            }
          }
          this.dataAdd.PLPROJECT_MONEY = sum;
          this.dataAdd.PLPROJECT_MONEYT = sum;
          this.dataAdd.PRBUILDING_YEAR = (this.dataAdd.PRPLPROJECTM_EYEAR - this.dataAdd.PRPLPROJECTM_SYEAR) + 1;

          if (!this.dataAdd.PRPLPROJECTM_MONEY) {
            this.dataAdd.PRPLPROJECTM_MONEY = [];
          }
          if (isSaveAction || sum > 0) {
            this.dataAdd.PRPLPROJECTM_MONEY[0] = this.formatNumberWithComma(this.dataAdd.PLPROJECT_MONEYT);
          }

          if (isSaveAction) {
            this.checkMaterialLimitAfterSave(materialSum, sum);
          }
          if (isMealAction) {
            this.checkMealLimitAfterSave();
          }
        }
      });

  }

  processDataProjectexd() {
    if (this.dataProjectexd && Array.isArray(this.dataProjectexd)) {
      let lastAct = '';
      let lastGtype = '';
      let lastGroup = '';
      let currentActNum = '1';
      for (let i = 0; i < this.dataProjectexd.length; i++) {
        const p = this.dataProjectexd[i];
        p._showAct = false;
        p._showGtype = false;
        p._showGroup = false;

        if (p.PRPLPROJECTM_NUMBER && this.dataAdd && this.dataAdd.PRPLPROJECT_TIME > 1 && p.PRPLPROJECTM_NUMBER !== lastAct) {
          p._showAct = true;
          lastAct = p.PRPLPROJECTM_NUMBER;
          lastGtype = '';
          lastGroup = '';
        }
        if (p.PLPROJECTEXPENSES_NUM) {
          currentActNum = String(p.PLPROJECTEXPENSES_NUM);
        } else if (p.PRPLPROJECTM_NUMBER) {
          currentActNum = String(p.PRPLPROJECTM_NUMBER);
        }
        p._actNum = p.PLPROJECTEXPENSES_NUM ? String(p.PLPROJECTEXPENSES_NUM) : currentActNum;

        if (p.PLPROJECTGROUPDT_NUM == 0 && p.PLPROJECTGROUPDT_MONEY) {
          if (p.PLPROJECTGTYPE_NAME && p.PLPROJECTGTYPE_NAME.trim() && p.PLPROJECTGTYPE_NAME !== lastGtype) {
            p._showGtype = true;
            lastGtype = p.PLPROJECTGTYPE_NAME;
            lastGroup = '';
          }
          if (p.PLPROJECTGROUP_NAME && p.PLPROJECTGROUP_NAME.trim() && p.PLPROJECTGROUP_NAME !== lastGroup) {
            p._showGroup = true;
            lastGroup = p.PLPROJECTGROUP_NAME;
          }
        }
      }
    }
  }

  shouldShowAct(p: any, i: number): boolean {
    if (p && p._showAct !== undefined) return p._showAct;
    if (!p || !p.PRPLPROJECTM_NUMBER || !this.dataAdd || this.dataAdd.PRPLPROJECT_TIME <= 1) return false;
    if (i === 0) return true;
    for (let prev = i - 1; prev >= 0; prev--) {
      const prevRow = this.dataProjectexd[prev];
      if (prevRow && prevRow.PRPLPROJECTM_NUMBER) {
        return prevRow.PRPLPROJECTM_NUMBER !== p.PRPLPROJECTM_NUMBER;
      }
    }
    return true;
  }

  shouldShowGtype(p: any, i: number): boolean {
    if (p && p._showGtype !== undefined) return p._showGtype;
    if (!p || !p.PLPROJECTGTYPE_NAME || !p.PLPROJECTGTYPE_NAME.trim() || p.PLPROJECTGROUPDT_NUM == 1) return false;
    if (!p.PLPROJECTGROUPDT_MONEY && p.PLPROJECTGROUPDT_NUM != 0) return false;
    for (let prev = i - 1; prev >= 0; prev--) {
      const prevRow = this.dataProjectexd[prev];
      if (prevRow && prevRow.PLPROJECTGROUPDT_NUM == 0 && prevRow.PLPROJECTGROUPDT_MONEY) {
        if (this.dataAdd && this.dataAdd.PRPLPROJECT_TIME > 1 && prevRow.PRPLPROJECTM_NUMBER !== p.PRPLPROJECTM_NUMBER) {
          return true;
        }
        return prevRow.PLPROJECTGTYPE_NAME !== p.PLPROJECTGTYPE_NAME;
      }
    }
    return true;
  }

  shouldShowGroup(p: any, i: number): boolean {
    if (p && p._showGroup !== undefined) return p._showGroup;
    if (!p || !p.PLPROJECTGROUP_NAME || !p.PLPROJECTGROUP_NAME.trim() || p.PLPROJECTGROUPDT_NUM == 1) return false;
    if (!p.PLPROJECTGROUPDT_MONEY && p.PLPROJECTGROUPDT_NUM != 0) return false;
    for (let prev = i - 1; prev >= 0; prev--) {
      const prevRow = this.dataProjectexd[prev];
      if (prevRow && prevRow.PLPROJECTGROUPDT_NUM == 0 && prevRow.PLPROJECTGROUPDT_MONEY) {
        if (this.dataAdd && this.dataAdd.PRPLPROJECT_TIME > 1 && prevRow.PRPLPROJECTM_NUMBER !== p.PRPLPROJECTM_NUMBER) {
          return true;
        }
        if (prevRow.PLPROJECTGTYPE_NAME !== p.PLPROJECTGTYPE_NAME) {
          return true;
        }
        return prevRow.PLPROJECTGROUP_NAME !== p.PLPROJECTGROUP_NAME;
      }
    }
    return true;
  }

  // ฟังก์ขันสำหรับการดึงกิจกรรม
  fetchdataact() {
    //console.log(1);
    this.dataProjectact = null;
    this.dataAdd.opt = "readact";
    this.apiService
      .getupdate(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data) {
          this.dataProjectact = data.data;
          if (data.data) {
            let detectedMode = 'activity';
            if (Array.isArray(data.data)) {
              for (let i = 0; i < data.data.length; i++) {
                const actNameStr = String(data.data[i].PRPLPROJECTACT_NAME || '');
                if (actNameStr.includes('ครั้ง')) {
                  detectedMode = 'time';
                  break;
                }
              }
            }
            const timeCount = parseInt(this.dataAdd?.PRPLPROJECT_TIME, 10) || 1;
            if (timeCount <= 1) {
              this.dataAdd.PRPLPROJECT_NUMBER = 0; // โครงการหลัก
              this.dataAdd.actMode = 'activity';
            } else {
              if (this.dataAdd.PRPLPROJECT_NUMBER === 0 || this.dataAdd.PRPLPROJECT_NUMBER === '0') {
                this.dataAdd.actMode = 'time';
                this.dataAdd.PRPLPROJECT_NUMBER = 0;
              } else if (this.dataAdd.PRPLPROJECT_NUMBER === 1 || this.dataAdd.PRPLPROJECT_NUMBER === '1') {
                this.dataAdd.actMode = 'activity';
                this.dataAdd.PRPLPROJECT_NUMBER = 1;
              } else {
                this.dataAdd.actMode = detectedMode;
                this.dataAdd.PRPLPROJECT_NUMBER = detectedMode === 'time' ? 0 : 1;
              }
            }
            if (!Array.isArray(this.dataAdd.PRPLPROJECT_SDATE)) this.dataAdd.PRPLPROJECT_SDATE = [];
            if (!Array.isArray(this.dataAdd.PRPLPROJECT_EDATE)) this.dataAdd.PRPLPROJECT_EDATE = [];
            for (let i = 0; i < data.data.length; i++) {
              this.dataAdd.PRPLPROJECTACT_NAME[i] = data.data[i].PRPLPROJECTACT_NAME || '';
              this.dataAdd.PRPLPROJECTACT_ACT[i] = data.data[i].PRPLPROJECTACT_ACT || '';
              this.dataAdd.PRPLPROJECT_PERSONS[i] = data.data[i].PRPLPROJECT_PERSONS || '';
              this.dataAdd.PRPLPROJECT_PERSONP[i] = data.data[i].PRPLPROJECT_PERSONP || '';
              this.dataAdd.PRPLPROJECT_PERSONO[i] = data.data[i].PRPLPROJECT_PERSONO || '';
              this.dataAdd.PRPLPROJECT_SDATE[i] = data.data[i].PRPLPROJECT_SDATE ? new Date(data.data[i].PRPLPROJECT_SDATE) : '';
              this.dataAdd.PRPLPROJECT_EDATE[i] = data.data[i].PRPLPROJECT_EDATE ? new Date(data.data[i].PRPLPROJECT_EDATE) : '';
              if (data.data[i].PRPLPROJECT_AT !== undefined && data.data[i].PRPLPROJECT_AT !== null) {
                this.dataAdd.PRPLPROJECT_AT[i] = data.data[i].PRPLPROJECT_AT;
              }
              if (data.data[i].PRPLPROJECT_LOCATION) {
                this.dataAdd.PRPLPROJECT_LOCATION[i] = data.data[i].PRPLPROJECT_LOCATION;
              }
              if (data.data[i].PROVINCE_ID) {
                this.dataAdd.PROVINCE_ID[i] = data.data[i].PROVINCE_ID;
                this.onChangedistrict(i, data.data[i].PROVINCE_ID);
              }
              if (data.data[i].DISTRICT_ID) {
                this.dataAdd.DISTRICT_ID[i] = data.data[i].DISTRICT_ID;
                this.onChangesubdistrict(i, data.data[i].DISTRICT_ID);
              }
              if (data.data[i].SUB_DISTRICT_ID) {
                this.dataAdd.SUB_DISTRICT_ID[i] = data.data[i].SUB_DISTRICT_ID;
              }
            }
            this.updateProjectActList();
          }
        }

      });

  }
  // ฟังก์ขันสำหรับการดึงครุภัณฑ์
  fetchdatasset() {
    //console.log(1);
    this.dataProjectasset = null;
    this.dataAdd.opt = "readasset";
    this.apiService
      .getupdate(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data) {
          this.dataProjectasset = data.data;
        }
      });

  }
  datenow(datenow: any) {
    if (!datenow) return '';
    const d = datenow instanceof Date ? datenow : new Date(datenow);
    if (isNaN(d.getTime())) return '';
    const yyyy = d.getFullYear();
    let mm = d.getMonth() + 1; // Months start at 0!
    let dd = d.getDate();
    return yyyy + '-' + mm + '-' + dd;
  }
  // ฟังก์ชัน การแสดงข้อมูลตามต้องการ
  onTableDataChange(event: any) {
    this.page = event;
    this.fetchdata();
  }


  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.fetchdata();
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
          .delete(id, this.url)
          .pipe(first())
          .subscribe((data: any) => {
            if (data.status == 1) {
              Swal.fire('ลบข้อมูล!', 'ลบข้อมูลเรียบร้อยแล้ว', 'success');
              this.fetchdatalistapp();
            }
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('ยกเลิก', 'ยกเลิกการลบข้อมูล', 'error');
      }
    });
  }
  // ฟังก์ชันสำหรับการลบข้อมูล
  deleteDatadt(id: any) {
    Swal.fire({
      title: 'ต้องการลบข้อมูล?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.value) {
        this.dataAdd.opt = "deletedt";
        this.dataAdd.id = id;
        this.apiService
          .getdata(this.dataAdd, this.url)
          .pipe(first())
          .subscribe((data: any) => {
            if (data.status == 1) {
              Swal.fire('ลบข้อมูล!', 'ลบข้อมูลเรียบร้อยแล้ว', 'success');
              this.fetchdatadt();
            }
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('ยกเลิก', 'ยกเลิกการลบข้อมูล', 'error');
      }
    });
  }
  deleteDatahead(id: any) {
    Swal.fire({
      title: 'ต้องการลบข้อมูล?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.value) {
        this.dataAdd.opt = "deletehead";
        this.dataAdd.id = id;
        this.apiService
          .getdata(this.dataAdd, this.url)
          .pipe(first())
          .subscribe((data: any) => {
            if (data.status == 1) {
              Swal.fire('ลบข้อมูล!', 'ลบข้อมูลเรียบร้อยแล้ว', 'success');
              this.fetchdatahead();
            }
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('ยกเลิก', 'ยกเลิกการลบข้อมูล', 'error');
      }
    });
  }
  onFocused(id: any, val: any) {
    this.dataAdd.PRPLPROJECT_HEADER1 = { "id": id, "name": val };
  }
  insertdataapp(id: any) {
    this.dataAdd.PRASSET_RSTATUSA = id;
    this.dataAdd.opt = "approve";
    this.apiService
      .getupdate(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        //console.log(data.status);       
        if (data.status == 1) {
          this.fetchdatalistapp();
          this.fetchdatalist();
          this.toastr.success("แจ้งเตือน:อนุมัติข้อมูลเรียบร้อยแล้ว");
        }
      });
  }
  // ฟังก์ขันสำหรับการดึงข้อมูลสิ่งก่อสร้าง
  fetchdatalistapp() {
    this.activeTab = 2;
    this.dataAdd.opt = "readAllapp";
    this.loading = true;
    this.datalistapp = null;
    this.datalistresearch = null;
    this.datalistresearchapp = null;
    this.datalist = null;
    this.rownum = null;
    this.rownum1 = null;
    // console.log(1);
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == 1) {
          this.datalistapp = data.data;
          this.datalistresearchapp = data.dataresearch;
          this.loading = null;
          this.rownum1 = 'true';
        } else {
          this.datalistapp = data.data;
          this.datalistresearchapp = data.dataresearch;
          this.loading = null;
          this.rownum1 = null;
          this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
        }
      });
  }
  editdataimport(id: any, type: any) {
    this.onChangePlmoney();
    this.dataAdd.typeimport = type;
    this.dataAdd.PRPLPROJECTACT_NAME = [];
    this.dataAdd.PRPLPROJECT_PERSONS = [];
    this.dataAdd.PRPLPROJECT_PERSONP = [];
    this.dataAdd.PRPLPROJECT_PERSONO = [];
    this.dataAdd.PRPLPROJECT_AT = [];
    this.dataAdd.PRPLPROJECT_LOCATION = [];
    this.dataAdd.PROVINCE_ID = [];
    this.dataAdd.DISTRICT_ID = [];
    this.dataAdd.SUB_DISTRICT_ID = [];
    this.dataDistrictList = [];
    this.dataSubdistrictList = [];
    this.dataAdd.TOTAL_MONEY = [];
    this.dataAdd.PLPROJECTD_NAME = [];
    this.dataAdd.PLPROJECTD_VALUE = [];
    this.dataAdd.PLINDICATOR_CODE = [];
    this.dataAdd.PLPROJECTD_RSTATUS = [];
    this.dataAdd.PLPROJECTD_CODE = [];
    this.dataAdd.PRPLPROJECT_SDATE = [];
    this.dataAdd.PRPLPROJECT_EDATE = [];
    this.apiService
      .getById(id, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataAdd.RPLINCOME_CODE = data.data[0].PLINCOME_CODE;
        this.dataAdd.PRPLPROJECT_CODE = data.data[0].PRPLPROJECT_CODE;
        this.onChangecrpartrister();
        this.fetchdatalistimportall();
        this.dataAdd.RCRPART_ID = data.data[0].CRPART_ID;
        this.dataAdd.FACULTY_CODE1 = data.data[0].FACULTY_CODE;
        this.dataAdd.PLGPRODUCT_CODE = data.data[0].PLGPRODUCT_CODE;
        this.dataAdd.PLSTRATEGY_CODE = data.data[0].PLSTRATEGY_CODE;
        this.dataAdd.PLESTIMATEPLAN_CODE = data.data[0].PLESTIMATEPLAN_CODE;
        this.dataAdd.PLSTRATEGIES_CODE = data.data[0].PLSTRATEGIES_CODE;
        this.dataAdd.PLMEASURES_CODE = data.data[0].PLMEASURES_CODE;
        this.dataAdd.PLPLAND_CODE = data.data[0].PLPLAND_CODE;
        this.dataAdd.PLPROJECT_TIME = data.data[0].PRPLPROJECT_TIME;
        this.dataAdd.PLPROJECTTYPE_CODE = data.data[0].PLPROJECTTYPE_CODE;
        this.dataAdd.PRPLPROJECT_TYPE = data.data[0].PRPLPROJECT_TYPE;
        if (!Array.isArray(this.dataAdd.PRPLPROJECT_SDATE)) {
          this.dataAdd.PRPLPROJECT_SDATE = [];
          this.dataAdd.PRPLPROJECT_EDATE = [];
        }
        if (data.data[0].PRPLPROJECT_SDATE != null && !this.dataAdd.PRPLPROJECT_SDATE[0]) {
          this.dataAdd.PRPLPROJECT_SDATE[0] = new Date(data.data[0].PRPLPROJECT_SDATE);
        }
        if (data.data[0].PRPLPROJECT_EDATE != null && !this.dataAdd.PRPLPROJECT_EDATE[0]) {
          this.dataAdd.PRPLPROJECT_EDATE[0] = new Date(data.data[0].PRPLPROJECT_EDATE);
        }
        // console.log(data.data[0].PRPLPROJECT_SDATE);


        this.dataAdd.PLMONEYPAY_CODE = '2M';
        this.onChangeSubplmoney();
        for (let i = 0; i < data.dataexp.length; i++) {
          this.dataAdd.PRPLPROJECTACT_NAME[i] = data.dataexp[i].PRREGISPROJECT_NAME + (data.dataexp[i].PRPLPROJECTACT_NAME ? ' กิจกรรม :' + data.dataexp[i].PRPLPROJECTACT_NAME : '');
          this.dataAdd.PRPLPROJECT_PERSONS[i] = data.dataexp[i].PRPLPROJECT_PERSONS;
          this.dataAdd.PRPLPROJECT_PERSONP[i] = data.dataexp[i].PRPLPROJECT_PERSONP;
          this.dataAdd.PRPLPROJECT_PERSONO[i] = data.dataexp[i].PRPLPROJECT_PERSONO;
          this.dataAdd.PRPLPROJECT_SDATE[i] = data.dataexp[i].PRPLPROJECT_SDATE ? new Date(data.dataexp[i].PRPLPROJECT_SDATE) : '';
          this.dataAdd.PRPLPROJECT_EDATE[i] = data.dataexp[i].PRPLPROJECT_EDATE ? new Date(data.dataexp[i].PRPLPROJECT_EDATE) : '';
          this.dataAdd.TOTAL_MONEY[i] = this.numberWithCommas(parseFloat(data.dataexp[i].TOTAL_MONEY).toFixed(2));
        }
        for (let i = 0; i < data.datahead.length; i++) {
          this.dataAdd.PLPROJECT_HEADER = data.datahead[i].PRPLPROJECTHEAD_NAME;
          this.dataAdd.PLPROJECT_HPHONE = data.datahead[i].PRPLPROJECTHEAD_PHONE;
          this.dataAdd.PLPROJECT_HCITIZEN = data.datahead[i].CITIZEN_ID;
        }
        for (let i = 0; i < data.dataPLPROJECTD.length; i++) {
          this.dataAdd.PLPROJECTD_NAME[i] = data.dataPLPROJECTD[i].PLPROJECTD_NAME;
          this.dataAdd.PLPROJECTD_VALUE[i] = data.dataPLPROJECTD[i].PLPROJECTD_VALUE;
          this.dataAdd.PLINDICATOR_CODE[i] = data.dataPLPROJECTD[i].PLINDICATOR_CODE;
          this.dataAdd.PLPROJECTD_RSTATUS[i] = data.dataPLPROJECTD[i].PLPROJECTD_RSTATUS;;
          this.dataAdd.PLPROJECTD_CODE[i] = data.dataPLPROJECTD[i].PLPROJECTD_CODE;
        }
      });
  }
  onChangePlmoney() {
    this.dataPlmoneypay = null;
    this.dataAdd.opt = "viewPLMONEYPAY";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataPlmoneypay = data;
      });
  }
  // ฟังก์ขันสำหรับการเพิ่มข้อมูล/และแก้ไขข้อมูล
  insertdataimportall() {
    if (!this.dataAdd.PLSUBMONEYPAY_CODE || this.dataAdd.PLSUBMONEYPAY_CODE == "") {
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกหมวดรายจ่ายย่อย");
    } else if (!this.dataAdd.PLSTRATEGY_CODE || this.dataAdd.PLSTRATEGY_CODE == "") {
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกยุทธศาสตร์");
    } else if (!this.dataAdd.PLESTIMATEPLAN_CODE || this.dataAdd.PLESTIMATEPLAN_CODE == "") {
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกเป้าประสงค์");
    } else if (!this.dataAdd.PLSTRATEGIES_CODE || this.dataAdd.PLSTRATEGIES_CODE == "") {
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกกลยุทธ์");
    } else if (!this.dataAdd.PLMEASURES_CODE || this.dataAdd.PLMEASURES_CODE == "") {
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกมาตรการ");
    } else if (!this.dataAdd.PLPLAND_CODE || this.dataAdd.PLPLAND_CODE == "") {
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกแผนงาน");
    } else {
      this.dataAdd.opt = "insertdataimportall";
      if (this.dataAdd.PRPLPROJECT_SDATE && Array.isArray(this.dataAdd.PRPLPROJECT_SDATE)) {
        this.dataAdd.PRPLPROJECT_SDATE1 = [];
        this.dataAdd.PRPLPROJECT_EDATE1 = [];
        const count = this.dataAdd.PRPLPROJECTACT_NAME?.length || this.dataAdd.PRPLPROJECT_TIME || this.dataAdd.PLPROJECT_TIME || 0;
        for (let i = 0; i < count; i++) {
          const s = this.dataAdd.PRPLPROJECT_SDATE[i];
          const e = this.dataAdd.PRPLPROJECT_EDATE[i];
          this.dataAdd.PRPLPROJECT_SDATE1[i] = s ? this.datenow(s) : '';
          this.dataAdd.PRPLPROJECT_EDATE1[i] = e ? this.datenow(e) : '';
        }
      } else if (this.dataAdd.PRPLPROJECT_SDATE != '') {
        this.dataAdd.PRPLPROJECT_SDATE1 = this.datenow(this.dataAdd.PRPLPROJECT_SDATE);
        this.dataAdd.PRPLPROJECT_EDATE1 = this.datenow(this.dataAdd.PRPLPROJECT_EDATE);
      } else {
        this.dataAdd.PRPLPROJECT_SDATE1 = '';
        this.dataAdd.PRPLPROJECT_EDATE1 = '';
      }
      this.apiService
        .getupdate(this.dataAdd, this.url)
        .pipe(first())
        .subscribe((data: any) => {
          //console.log(data.status);       
          if (data.status == 1) {
            this.toastr.success("แจ้งเตือน:เพิ่มข้อมูลเรียบร้อยแล้ว");
            this.fetchdatalistimportall();
          }
        });
    }
  }
  // ฟังก์ชันสำหรับการลบข้อมูล
  deleteDataimportall(id: any) {
    this.dataAdd.opt = "deleteimportall";
    this.dataAdd.id = id;
    this.dataAdd.CITIZEN_ID = this.tokenStorage.getUser().citizen;
    if (!this.dataAdd.PLSUBMONEYPAY_CODE || this.dataAdd.PLSUBMONEYPAY_CODE == "") {
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกหมวดรายจ่ายย่อย");
    } else {
      Swal.fire({
        title: 'ต้องการลบข้อมูล?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ยกเลิก',
      }).then((result) => {
        if (result.value) {
          this.apiService
            .getdata(this.dataAdd, this.url)
            .pipe(first())
            .subscribe((data: any) => {
              if (data.status == 1) {
                Swal.fire('ลบข้อมูล!', 'ลบข้อมูลเรียบร้อยแล้ว', 'success');
                this.fetchdatalistimportall();
              }
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('ยกเลิก', 'ยกเลิกการลบข้อมูล', 'error');
        }
      });
    }
  }
  fetchdatalistimportall() {
    this.dataAdd.opt = "readAllassetimportall";
    this.datalistimportall = null;
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == 1) {
          this.datalistimportall = data.data;
          this.loading = null;
        } else {
          this.datalistimportall = data.data;
          this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
        }
      });
  }
  onChangeSubplmoney() {
    this.dataSubplmoneypay = null;
    this.dataAdd.opt = "viewSUBPLMONEYPAY";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataSubplmoneypay = data;
      });
  }
  onChangecrpartrister() {
    if (this.dataAdd.RPLINCOME_CODE1 != '') {
      this.dataAdd.RPLINCOME_CODE = this.dataAdd.RPLINCOME_CODE1;
    }
    this.dataCrpartregis = null;
    this.dataAdd.opt = "viewcrpartregis";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataCrpartregis = data;
        // this.dataAdd.RCRPART_ID = data[0].CRPART_ID;
        //console.log(this.dataSub);
      });
    if (this.dataAdd.PLGPRODUCT_CODE) {
      const allowed = this.filteredProductList.map((p: any) => String(p.PLGPRODUCT_CODE).trim());
      if (allowed.length > 0 && !allowed.includes(String(this.dataAdd.PLGPRODUCT_CODE).trim())) {
        this.dataAdd.PLGPRODUCT_CODE = '';
      }
    }
  }

 get filteredProductList(): any[] {
    if (!this.dataProduct || !Array.isArray(this.dataProduct)) {
      return [];
    }
    const incCode = String(this.dataAdd?.RPLINCOME_CODE || '').trim();
    const incItem = this.dataIncome && Array.isArray(this.dataIncome)
      ? this.dataIncome.find((inc: any) => String(inc.PLINCOME_CODE).trim() === incCode)
      : null;
    const incName = incItem ? String(incItem.PLINCOME_NAME || '').trim() : '';



    // 3. งบประมาณภายนอก / งบประมาณจากภายนอก (11) - ตรวจสอบก่อนเพื่อไม่ให้ทับซ้อนกับ "งบประมาณ"
    if (incCode === '11' || incCode === '13' || incCode === '10' || incName.includes('ภายนอก') || incName.includes('สะสม')) {
      const allowedCodes = [ '145'];
      this.dataAdd.PRPLPROJECT_ANOTHER='';
      if(incCode === '10'){
      this.dataAdd.PRPLPROJECT_ANOTHER='เงินรายได้สะสม';
      }
      if(incCode === '13'){
      this.dataAdd.PRPLPROJECT_ANOTHER='ไม่ใช้งบประมาณ';
      }
      return this.sortProductsByCodes(
        this.dataProduct.filter((p: any) => allowedCodes.includes(String(p.PLGPRODUCT_CODE).trim())),
        allowedCodes
      );
    }

    // 1. งบประมาณแผ่นดิน / งบประมาณ (01)
    if (incCode === '01' || incCode === '1' || incName === 'งบประมาณ' || incName.includes('งบประมาณแผ่นดิน')) {
      const allowedCodes = ['103', '101', '146', '127'];
      return this.sortProductsByCodes(
        this.dataProduct.filter((p: any) => allowedCodes.includes(String(p.PLGPRODUCT_CODE).trim())),
        allowedCodes
      );
    }

    // 2. งบประมาณเงินรายได้ / งบเงินรายได้ (02, 14)
    if (
      incCode === '02' || incCode === '2' || incCode === '14' ||
      incName === 'งบเงินรายได้' || incName.includes('งบประมาณเงินรายได้') || incName.includes('เงินรายได้ (ก่อให้เกิดรายได้)') ||
      (incName.includes('เงินรายได้') && !incName.includes('สะสม'))
    ) {
      const allowedCodes = ['103', '101', '104', '107', '137'];
      let list = this.dataProduct.filter((p: any) => allowedCodes.includes(String(p.PLGPRODUCT_CODE).trim()));
      if (!list.some((p: any) => String(p.PLGPRODUCT_CODE).trim() === '137')) {
        list.push({ PLGPRODUCT_CODE: '137', PLGPRODUCT_NAME: 'วิจัยและนวัตกรรม' });
      }
      return this.sortProductsByCodes(list, allowedCodes);
    }

    // กรณีอื่นๆ หรือยังไม่ได้เลือกแหล่งเงิน ให้แสดงรายการทั้งหมด
    return this.dataProduct;
  }

  sortProductsByCodes(products: any[], codeOrder: string[]): any[] {
    return products.slice().sort((a: any, b: any) => {
      const idxA = codeOrder.indexOf(String(a.PLGPRODUCT_CODE).trim());
      const idxB = codeOrder.indexOf(String(b.PLGPRODUCT_CODE).trim());
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0;
    });
  }
  onChangedistrict(indexOrValue: any = '', deviceValue: any = '') {
    if (typeof indexOrValue === 'number') {
      const i = indexOrValue;
      const provId = deviceValue || (this.dataAdd.PROVINCE_ID && this.dataAdd.PROVINCE_ID[i]);
      if (!this.dataDistrictList) this.dataDistrictList = [];
      if (!this.dataSubdistrictList) this.dataSubdistrictList = [];

      if (!provId) {
        this.dataDistrictList[i] = [];
        this.dataSubdistrictList[i] = [];
        if (this.dataAdd.DISTRICT_ID) this.dataAdd.DISTRICT_ID[i] = '';
        if (this.dataAdd.SUB_DISTRICT_ID) this.dataAdd.SUB_DISTRICT_ID[i] = '';
        return;
      }

      const req = { ...this.dataAdd, opt: "viewdistrict", PROVINCE_ID: provId };
      this.apiService
        .getdata(req, this.url1)
        .pipe(first())
        .subscribe((data: any) => {
          this.dataDistrictList[i] = data;
        });
    } else {
      this.dataAdd.opt = "viewdistrict";
      if (indexOrValue != '') {
        this.dataAdd.PROVINCE_ID = indexOrValue;
      }
      this.apiService
        .getdata(this.dataAdd, this.url1)
        .pipe(first())
        .subscribe((data: any) => {
          this.dataDistrict = data;
        });
    }
  }
  onChangesubdistrict(indexOrValue: any = '', deviceValue: any = '') {
    if (typeof indexOrValue === 'number') {
      const i = indexOrValue;
      const distId = deviceValue || (this.dataAdd.DISTRICT_ID && this.dataAdd.DISTRICT_ID[i]);
      if (!this.dataSubdistrictList) this.dataSubdistrictList = [];

      if (!distId) {
        this.dataSubdistrictList[i] = [];
        if (this.dataAdd.SUB_DISTRICT_ID) this.dataAdd.SUB_DISTRICT_ID[i] = '';
        return;
      }

      const req = { ...this.dataAdd, opt: "viewsubdistrict", DISTRICT_ID: distId };
      this.apiService
        .getdata(req, this.url1)
        .pipe(first())
        .subscribe((data: any) => {
          this.dataSubdistrictList[i] = data;
        });
    } else {
      this.dataAdd.opt = "viewsubdistrict";
      if (indexOrValue != '') {
        this.dataAdd.DISTRICT_ID = indexOrValue;
      }
      this.apiService
        .getdata(this.dataAdd, this.url1)
        .pipe(first())
        .subscribe((data: any) => {
          this.dataSubdistrict = data;

        });
    }
  }
  // ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
  editdata(id: any) {

    this.rowpbi = 1;
    this.rowpbu = null;
    // console.log(this.rowpbi);
    this.setshowbti();
    this.dataAdd.PRPLPROJECT_CODE = id;
    // this.dataAdd.PRPLPROJECTM_SYEAR = this.dataAdd.PRYEARASSET_CODE;
    //  this.dataAdd.PRPLPROJECTM_EYEAR = this.dataAdd.PRYEARASSET_CODE;
    this.cleardat();
    this.dataProjecttd = null;
    /* this.dataAdd.PLPROJECTGROUPDT_MONEYA = [];
     this.dataAdd.PLPROJECTGROUPDT_NUMA = [];
     this.dataAdd.PLPROJECTGROUPDT_NUM = [];
     this.dataAdd.PLPROJECTGROUPDT_MONEY = [];*/
    //this.setshowbti();
    /* this.apiService
     .getById(id,this.url)
     .pipe(first())
     .subscribe((dataedp: any) => {
      this.dataAdd.PLMONEYPAY_CODE = dataedp.data[0].PLMONEYPAY_CODE;
      this.dataAdd.PLSTRATEGY_CODE = dataedp.data[0].PLSTRATEGY_CODE;
      this.fetchdatalistsubm();
      this.fetchdataPLESTIMATEPLAN();
     this.dataAdd.PLESTIMATEPLAN_CODE = dataedp.data[0].PLESTIMATEPLAN_CODE;
     this.fetchdataPLSTRATEGIES();
     this.dataAdd.PLSTRATEGIES_CODE = dataedp.data[0].PLSTRATEGIES_CODE;
     this.fetchdataPLMEASURES();
     this.dataAdd.PLMEASURES_CODE = dataedp.data[0].PLMEASURES_CODE;
     this.fetchdataPLPLAND();
     this.dataAdd.PLPLAND_CODE = dataedp.data[0].PLPLAND_CODE;
     this.fetchdataPLMISSION();
     //console.log( dataedp.data[0].PLSTRATEGY_CODE);
     });*/
    this.fetchdatalistsubm();
    this.fetchdataPLESTIMATEPLAN();
    this.fetchdataPLSTRATEGIES();
    this.fetchdataPLMEASURES();
    this.fetchdataPLPLAND();
    this.fetchdataPLMISSION();
    this.onChangerister();
    this.apiService
      .getById(id, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (!data || !data.data || !Array.isArray(data.data) || data.data.length === 0) {
          return;
        }
        this.dataProjecttd = data.dataEXPENSES;
        // this.dataAdd  = data.data;
        //  console.log((data.data[0].PLPRODUCT_CODE).substring(4, 7));
        //this.onChangedistrict(data.data[0].PROVINCE_ID);
        //this.onChangesubdistrict(data.data[0].DISTRICT_ID);
        // this.dataAdd.PROVINCE_ID = data.data[0].PROVINCE_ID;
        //   this.dataAdd.DISTRICT_ID = data.data[0].DISTRICT_ID;
        //  this.dataAdd.SUB_DISTRICT_ID = data.data[0].SUB_DISTRICT_ID;
        //  this.dataAdd.PRPLPROJECT_CODE = data.data[0].PRPLPROJECT_CODE;

        this.dataAdd.PRREGISPROJECT_CODE = data.data[0].PRREGISPROJECT_CODE;
        this.dataAdd.RPLINCOME_CODE = data.data[0].PLINCOME_CODE;
        this.onChangecrpartrister();
        this.dataAdd.RCRPART_ID = data.data[0].CRPART_ID;
        // this.dataAdd.PRPLPROJECTM_SYEAR = this.dataAdd.PRYEARASSET_CODE;
        this.dataAdd.PRPLPROJECTM_SYEAR = data.data[0].PRPLPROJECTM_SYEAR;
        this.dataAdd.PRPLPROJECTM_EYEAR = data.data[0].PRPLPROJECTM_EYEAR;
        this.dataAdd.PLSTRATEGY_CODE = data.data[0].PLSTRATEGY_CODE;
        this.dataAdd.PLGPRODUCT_CODE = (data.data[0].PLGPRODUCT_CODE);//.substring(4, 7);
        // this.dataAdd.PRPLPROJECT_CODE = data.data[0].PRPLPROJECT_CODE;
        this.dataAdd.PLSUBMONEYPAY_CODE1 = data.data[0].PLSUBMONEYPAY_CODE1;
        this.dataAdd.PRPLPROJECT_NAME = data.data[0].PRREGISPROJECT_NAME;
        this.dataAdd.PRPLPROJECT_TIME = data.data[0].PRPLPROJECT_TIME ? parseInt(data.data[0].PRPLPROJECT_TIME, 10) : 1;
        if (!this.dataAdd.PRPLPROJECT_TIME || this.dataAdd.PRPLPROJECT_TIME < 1) {
          this.dataAdd.PRPLPROJECT_TIME = 1;
        }
        if (this.dataAdd.PRPLPROJECT_TIME <= 1) {
          this.dataAdd.PRPLPROJECT_NUMBER = 0; // โครงการหลัก
          this.dataAdd.actMode = 'activity';
        } else if (data.data[0].PRPLPROJECT_NUMBER !== undefined && data.data[0].PRPLPROJECT_NUMBER !== null && String(data.data[0].PRPLPROJECT_NUMBER).trim() !== '') {
          this.dataAdd.PRPLPROJECT_NUMBER = parseInt(data.data[0].PRPLPROJECT_NUMBER, 10);
          this.dataAdd.actMode = this.dataAdd.PRPLPROJECT_NUMBER === 0 ? 'time' : 'activity';
        } else {
          this.dataAdd.PRPLPROJECT_NUMBER = 1;
          this.dataAdd.actMode = 'activity';
        }
        this.dataAdd.PRPLPROJECTACT_CODE = 1;
        this.showact();
        this.dataAdd.RPLPROJECTACT_CODE = 1;
        this.dataAdd.PLPROJECTGROUPDT_CODE = '0207';
        this.showestimate();
        this.dataAdd.FPLPROJECTTYPE = data.data[0].PRREGISTYPE;
        this.dataAdd.PLPROJECTTYPE_CODE = data.data[0].PLPROJECTTYPE_CODE;
        this.dataAdd.PLSUBMONEYPAY_CODE = data.data[0].PLSUBMONEYPAY_CODE;
        //  this.dataAdd.PRPLPROJECT_HEADER = data.data[0].PRPLPROJECT_HEADER;
        //  this.dataAdd.PRPLPROJECT_HCITIZEN = data.data[0].PRPLPROJECT_HCITIZEN;
        this.dataAdd.PLRESEARCHTYPE_CODE = data.data[0].PLRESEARCHTYPE_CODE;
        //  this.dataAdd.PRPLPROJECT_HCITIZEN = data.data[0].PRPLPROJECT_HCITIZEN;
        this.dataAdd.PLESTIMATEPLAN_CODE = data.data[0].PLESTIMATEPLAN_CODE;
        this.dataAdd.PLSTRATEGIES_CODE = data.data[0].PLSTRATEGIES_CODE;
        this.dataAdd.PLMEASURES_CODE = data.data[0].PLMEASURES_CODE;
        this.dataAdd.PLMONEYPAY_CODE = data.data[0].PLMONEYPAY_CODE;
        this.dataAdd.PLPLAND_CODE = data.data[0].PLPLAND_CODE;
        this.dataAdd.PRPLPROJECT_T1 = data.data[0].PRPLPROJECT_T1;
        this.dataAdd.PRPLPROJECT_T2 = data.data[0].PRPLPROJECT_T2;
        this.dataAdd.PRPLPROJECT_PEXCELL = data.data[0].PRPLPROJECT_PEXCELL;
        this.dataAdd.PRPLPROJECT_ANOTHER = data.data[0].PRPLPROJECT_ANOTHER;
        this.dataAdd.PRPLPROJECT_SUPPORT = data.data[0].PRPLPROJECT_SUPPORT;
        this.dataAdd.PRPLPROJECT_PDEVELOP = data.data[0].PRPLPROJECT_PDEVELOP;
        this.fetchdatadt();
        this.fetchdataact();
        this.fetchdatasset();
        this.fetchdatahead();
        this.onFocused(data.data[0].PRPLPROJECT_HCITIZEN, data.data[0].PRPLPROJECT_HEADER);
        this.dataAdd.PRPLPROJECT_HPHONE = data.data[0].PRPLPROJECT_HPHONE;
        // this.dataAdd.PRPLPROJECT_PERSONS = data.data[0].PRPLPROJECT_PERSONS;
        //  this.dataAdd.PRPLPROJECT_PERSONP = data.data[0].PRPLPROJECT_PERSONP;
        //  this.dataAdd.PRPLPROJECT_PERSONO = data.data[0].PRPLPROJECT_PERSONO;
        if (data.datam && Array.isArray(data.datam)) {
          this.dataAdd.PRBUILDING_YEAR = data.datam.length;

          for (let i = 0; i < data.datam.length; i++) {
            if (i == 0) {
              this.dataAdd.PRPLPROJECTM_SYEAR = data.datam[i].PRPLPROJECTM_YEAR;
            }
            if (data.datam.length - 1 == i) {
              this.dataAdd.PRPLPROJECTM_EYEAR = data.datam[i].PRPLPROJECTM_YEAR;
            }
            this.dataAdd.PRPLPROJECTM_YEAR[i] = data.datam[i].PRPLPROJECTM_YEAR;
            this.dataAdd.PRPLPROJECTM_MONEY[i] = this.formatNumberWithComma(data.datam[i].PRPLPROJECTM_MONEY);
          }
        } else {
          this.dataAdd.PRBUILDING_YEAR = 0;
        }
        this.showbuid();
        this.fetchdataPLMISSION();
        // console.log(data.data[0].PRPLPROJECT_SDATE);
        if (!Array.isArray(this.dataAdd.PRPLPROJECT_SDATE)) {
          this.dataAdd.PRPLPROJECT_SDATE = [];
          this.dataAdd.PRPLPROJECT_EDATE = [];
        }
        if (data.data[0].PRPLPROJECT_SDATE != null && !this.dataAdd.PRPLPROJECT_SDATE[0]) {
          this.dataAdd.PRPLPROJECT_SDATE[0] = new Date(data.data[0].PRPLPROJECT_SDATE);
        }
        if (data.data[0].PRPLPROJECT_EDATE != null && !this.dataAdd.PRPLPROJECT_EDATE[0]) {
          this.dataAdd.PRPLPROJECT_EDATE[0] = new Date(data.data[0].PRPLPROJECT_EDATE);
        }
        if (!Array.isArray(this.dataAdd.PRPLPROJECT_LOCATION)) {
          this.dataAdd.PRPLPROJECT_LOCATION = data.data[0].PRPLPROJECT_LOCATION ? [data.data[0].PRPLPROJECT_LOCATION] : [];
        } else if (data.data[0].PRPLPROJECT_LOCATION && !this.dataAdd.PRPLPROJECT_LOCATION[0]) {
          this.dataAdd.PRPLPROJECT_LOCATION[0] = data.data[0].PRPLPROJECT_LOCATION;
        }
        if (data.data[0].PRPLPROJECT_AT !== undefined && data.data[0].PRPLPROJECT_AT !== null) {
          if (!Array.isArray(this.dataAdd.PRPLPROJECT_AT)) this.dataAdd.PRPLPROJECT_AT = [];
          if (!this.dataAdd.PRPLPROJECT_AT[0]) this.dataAdd.PRPLPROJECT_AT[0] = data.data[0].PRPLPROJECT_AT;
        }
        if (data.data[0].PROVINCE_ID) {
          if (!Array.isArray(this.dataAdd.PROVINCE_ID)) this.dataAdd.PROVINCE_ID = [];
          if (!this.dataAdd.PROVINCE_ID[0]) {
            this.dataAdd.PROVINCE_ID[0] = data.data[0].PROVINCE_ID;
            this.onChangedistrict(0, data.data[0].PROVINCE_ID);
          }
        }
        if (data.data[0].DISTRICT_ID) {
          if (!Array.isArray(this.dataAdd.DISTRICT_ID)) this.dataAdd.DISTRICT_ID = [];
          if (!this.dataAdd.DISTRICT_ID[0]) {
            this.dataAdd.DISTRICT_ID[0] = data.data[0].DISTRICT_ID;
            this.onChangesubdistrict(0, data.data[0].DISTRICT_ID);
          }
        }
        if (data.data[0].SUB_DISTRICT_ID) {
          if (!Array.isArray(this.dataAdd.SUB_DISTRICT_ID)) this.dataAdd.SUB_DISTRICT_ID = [];
          if (!this.dataAdd.SUB_DISTRICT_ID[0]) {
            this.dataAdd.SUB_DISTRICT_ID[0] = data.data[0].SUB_DISTRICT_ID;
          }
        }
        if (data.data[0].PRPLPROJECT_PRINCIPLE != null) {
          this.dataAdd.PLPROJECTMORE_PRINCIPLE = data.data[0].PRPLPROJECT_PRINCIPLE;
        }
        if (data.data[0].PRPLPROJECT_ACTIVITY != null) {
          this.dataAdd.PLPROJECTMORE_ACTIVITY = data.data[0].PRPLPROJECT_ACTIVITY;
        }
        if (data.data[0].PRPLPROJECT_OBJECT != null) {
          this.dataAdd.PRPLPROJECT_OBJECT = data.data[0].PRPLPROJECT_OBJECT;
        }
        if (data.data[0].PRPLPROJECT_RESULT != null) {
          this.dataAdd.PLPROJECTMORE_RESULT = data.data[0].PRPLPROJECT_RESULT;
        }
        if (data.data[0].PRPLPROJECT_ESTIMATE != null) {
          this.dataAdd.PLPROJECTMORE_ESTIMATE = data.data[0].PRPLPROJECT_ESTIMATE;
        }
        if (data.data[0].PRPLPROJECT_FOLLOW != null) {
          this.dataAdd.PLPROJECTMORE_FOLLOW = data.data[0].PRPLPROJECT_FOLLOW;
        }
        this.dataAdd.PLPROJECT_DETAIL = data.data[0].PRPLPROJECT_RDETAIL;
        this.dataPlandicator = data.dataPLPROJECTD;
        if (!this.dataPlandicator || this.dataPlandicator.length == 0) {
          this.fetchdataPLINDICATOR();
        }
        if (this.dataPlandicator) {
          for (let i = 0; i < this.dataPlandicator.length; i++) {
            this.dataAdd.PLPROJECTD_NAME[i] = this.dataPlandicator[i].PLPROJECTD_NAME;
            this.dataAdd.PLPROJECTD_VALUE[i] = this.dataPlandicator[i].PLPROJECTD_VALUE;
            this.dataAdd.PLINDICATOR_CODE[i] = this.dataPlandicator[i].PLINDICATOR_CODE;
            this.dataAdd.PLPROJECTD_RSTATUS[i] = this.dataPlandicator[i].PLPROJECTD_RSTATUS;;
            this.dataAdd.PLPROJECTD_CODE[i] = this.dataPlandicator[i].PLPROJECTD_CODE;
          }
        }

        let k = 0;
        /* for (let i = 0; i < this.dataProjecttd.length; i++) {
           if (data.dataEXPENSES[i].PLPROJECTGROUPDT_CODE != '') {
             this.dataAdd.PLPROJECTGROUPDT_CODE[k] = data.dataEXPENSES[i].PLPROJECTGROUPDT_CODE;
             this.dataAdd.PLPROJECTGROUPDT_NAME[k] = data.dataEXPENSES[i].PLPROJECTGROUPDT_DETAIL;
             this.dataAdd.PLPROJECTGROUPDT_NUM[k] = data.dataEXPENSES[i].PLPROJECTGROUPDT_NUMA;
             this.dataAdd.PLPROJECTGROUPDT_NUMA[k] = data.dataEXPENSES[i].PLPROJECTGROUPDT_NUMB;
             this.dataAdd.PLPROJECTGROUPDT_MONEY[k] = data.dataEXPENSES[i].PLPROJECTGROUPDT_MONEY;
             this.dataAdd.PLPROJECTEXPENSES_CODE[k] = data.dataEXPENSES[i].PLPROJECTEXPENSES_CODE;
             this.dataAdd.GCUNIT_CODE[k] = data.dataEXPENSES[i].GCUNIT_ACODE;
             this.dataAdd.GCUNIT_ACODE[k] = data.dataEXPENSES[i].GCUNIT_BCODE;
             k++;
           }
           this.calexpenses();
         }*/

      });

  }

  //แก้ไขข้อมูล
  updatedata() {
    /*if(/*this.dataAdd.RPLINCOME_CODE =='' || this.dataAdd.RCRPART_ID =='' || this.dataAdd.PLGPRODUCT_CODE =='' 
      || this.dataAdd.PRPLPROJECT_HEADER =='' || this.dataAdd.PRPLPROJECT_PERSONS =='' || this.dataAdd.PRPLPROJECT_PERSONP ==''
      || this.dataAdd.PRPLPROJECT_PERSONO ==''|| this.dataAdd.PRPLPROJECT_SDATE ==''|| this.dataAdd.PRPLPROJECT_EDATE ==''
     /* || this.dataAdd.PLPROJECTMORE_PRINCIPLE =='' || this.dataAdd.PLPROJECTMORE_ACTIVITY ==''|| this.dataAdd.PRPLPROJECT_OBJECT ==''
      || this.dataAdd.PLPROJECTMORE_RESULT ==''|| this.dataAdd.PLPROJECTMORE_ESTIMATE ==''*/
    /*||this.dataAdd.PLSTRATEGY_CODE ==''|| this.dataAdd.PLESTIMATEPLAN_CODE ==''|| this.dataAdd.PLSTRATEGIES_CODE ==''
    || this.dataAdd.PLMEASURES_CODE ==''|| this.dataAdd.PLPLAND_CODE =='' || this.dataAdd.PLPROJECT_MONEYT==0 
    /*|| *///this.dataAdd.PLPROJECTMORE_PRINCIPLE.length <10000){
    // console.log(this.dataAdd.PLPROJECTMORE_PRINCIPLE.length );
    /* if(this.dataAdd.RPLINCOME_CODE ==''){
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกแหล่งเงิน");
       }
       if(this.dataAdd.RCRPART_ID ==''){
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกภาคเงิน");
       }
       if(this.dataAdd.PLGPRODUCT_CODE ==''){
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกผลผลิต/โครงการ");
       } 
       if(this.dataAdd.PRPLPROJECT_HEADER ==''){
        this.toastr.warning("แจ้งเตือน:กรุณากรอกผู้รับผิดชอบโครงการ");
       }
      if(this.dataAdd.PRPLPROJECT_PERSONS =='' ){
        this.toastr.warning("แจ้งเตือน:กรุณากรอกจำนวนผู้เข้าร่วม นักศึกษา");
       } 
       if(this.dataAdd.PRPLPROJECT_PERSONP ==''){
        this.toastr.warning("แจ้งเตือน:กรุณากรอกจำนวนผู้เข้าร่วม บุคลากร");
       } 
       if(this.dataAdd.PRPLPROJECT_PERSONO ==''){
        this.toastr.warning("แจ้งเตือน:กรุณากรอกจำนวนผู้เข้าร่วม บุคคลภายนอก");
       } 
       if(this.dataAdd.PRPLPROJECT_SDATE ==''|| this.dataAdd.PRPLPROJECT_EDATE ==''){
        this.toastr.warning("แจ้งเตือน:กรุณากรอกระยะเวลาดำเนินโครงการ");
       } 
    /*   if(this.dataAdd.PLPROJECTMORE_PRINCIPLE ==''){
        this.toastr.warning("แจ้งเตือน:กรุณากรอกหลักการและเหตุผล");
       }
       if(this.dataAdd.PLPROJECTMORE_ACTIVITY ==''){
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
       }*/
    /*if(this.dataAdd.PLSTRATEGY_CODE ==''){
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกยุทธศาสตร์");
     }
     if(this.dataAdd.PLESTIMATEPLAN_CODE ==''){
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกเป้าประสงค์");
     }
     if(this.dataAdd.PLSTRATEGIES_CODE ==''){
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกกลยุทธ์");
     }
     if(this.dataAdd.PLMEASURES_CODE ==''){
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกมาตรการ");
     }
     if(this.dataAdd.PLPLAND_CODE ==''){
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกแผนงาน");
     }*/
    /*  if(this.dataAdd.PLPROJECT_MONEYT ==0 ){
        this.toastr.warning("แจ้งเตือน:กรุณากรอกประมาณการค่าใช้จ่าย");
       } */
    /* if(this.dataAdd.PLPROJECTMORE_PRINCIPLE.length <10000 ){
      this.toastr.warning("แจ้งเตือน:กรุณากรอกหลักการและเหตุผล(ความยาวอย่างน้อย 1 หน้ากระดาษ)");
     }  

    }else{*/
    // console.log(1);
    if (this.dataAdd.PRPLPROJECT_SDATE && Array.isArray(this.dataAdd.PRPLPROJECT_SDATE)) {
      this.dataAdd.PRPLPROJECT_SDATE1 = [];
      this.dataAdd.PRPLPROJECT_EDATE1 = [];
      for (let i = 0; i < this.dataAdd.PRPLPROJECT_TIME; i++) {
        const s = this.dataAdd.PRPLPROJECT_SDATE[i];
        const e = this.dataAdd.PRPLPROJECT_EDATE[i];
        this.dataAdd.PRPLPROJECT_SDATE1[i] = s ? this.datenow(s) : '';
        this.dataAdd.PRPLPROJECT_EDATE1[i] = e ? this.datenow(e) : '';
      }
    } else if (this.dataAdd.PRPLPROJECT_SDATE != '') {
      this.dataAdd.PRPLPROJECT_SDATE1 = this.datenow(this.dataAdd.PRPLPROJECT_SDATE);
      this.dataAdd.PRPLPROJECT_EDATE1 = this.datenow(this.dataAdd.PRPLPROJECT_EDATE);
    } else {
      this.dataAdd.PRPLPROJECT_SDATE1 = '';
      this.dataAdd.PRPLPROJECT_EDATE1 = '';
    }
    if (this.dataAdd.PLPROJECTMORE_PRINCIPLE != '') {
      this.dataAdd.PLPROJECTMORE_PRINCIPLE = this.dataAdd.PLPROJECTMORE_PRINCIPLE.replaceAll("<br>", "<br/>");
      this.dataAdd.PLPROJECTMORE_PRINCIPLE = this.dataAdd.PLPROJECTMORE_PRINCIPLE.replaceAll("<p>", "");
      this.dataAdd.PLPROJECTMORE_PRINCIPLE = this.dataAdd.PLPROJECTMORE_PRINCIPLE.replaceAll("</p>", "<br/>");
      this.dataAdd.PLPROJECTMORE_PRINCIPLE = this.dataAdd.PLPROJECTMORE_PRINCIPLE.replaceAll("&nbsp;", "");
    }
    if (this.dataAdd.PLPROJECTMORE_ACTIVITY != '') {
      this.dataAdd.PLPROJECTMORE_ACTIVITY = this.dataAdd.PLPROJECTMORE_ACTIVITY.replaceAll("<br>", "<br/>");
      this.dataAdd.PLPROJECTMORE_ACTIVITY = this.dataAdd.PLPROJECTMORE_ACTIVITY.replaceAll("<p>", "");
      this.dataAdd.PLPROJECTMORE_ACTIVITY = this.dataAdd.PLPROJECTMORE_ACTIVITY.replaceAll("</p>", "<br/>");
      this.dataAdd.PLPROJECTMORE_ACTIVITY = this.dataAdd.PLPROJECTMORE_ACTIVITY.replaceAll("&nbsp;", "");
    }
    if (this.dataAdd.PRPLPROJECT_OBJECT != '') {
      this.dataAdd.PRPLPROJECT_OBJECT = this.dataAdd.PRPLPROJECT_OBJECT.replaceAll("<br>", "<br/>");
      this.dataAdd.PRPLPROJECT_OBJECT = this.dataAdd.PRPLPROJECT_OBJECT.replaceAll("<p>", "");
      this.dataAdd.PRPLPROJECT_OBJECT = this.dataAdd.PRPLPROJECT_OBJECT.replaceAll("</p>", "<br/>");
      this.dataAdd.PRPLPROJECT_OBJECT = this.dataAdd.PRPLPROJECT_OBJECT.replaceAll("&nbsp;", "");
    }
    if (this.dataAdd.PLPROJECTMORE_RESULT != '') {
      this.dataAdd.PLPROJECTMORE_RESULT = this.dataAdd.PLPROJECTMORE_RESULT.replaceAll("<br>", "<br/>");
      this.dataAdd.PLPROJECTMORE_RESULT = this.dataAdd.PLPROJECTMORE_RESULT.replaceAll("<p>", "<br/>");
      this.dataAdd.PLPROJECTMORE_RESULT = this.dataAdd.PLPROJECTMORE_RESULT.replaceAll("</p>", "");
      this.dataAdd.PLPROJECTMORE_RESULT = this.dataAdd.PLPROJECTMORE_RESULT.replaceAll("&nbsp;", "");
    }
    if (this.dataAdd.PLPROJECTMORE_ESTIMATE != '') {
      this.dataAdd.PLPROJECTMORE_ESTIMATE = this.dataAdd.PLPROJECTMORE_ESTIMATE.replaceAll("<br>", "<br/>");
      this.dataAdd.PLPROJECTMORE_ESTIMATE = this.dataAdd.PLPROJECTMORE_ESTIMATE.replaceAll("<p>", "");
      this.dataAdd.PLPROJECTMORE_ESTIMATE = this.dataAdd.PLPROJECTMORE_ESTIMATE.replaceAll("</p>", "<br/>");
      this.dataAdd.PLPROJECTMORE_ESTIMATE = this.dataAdd.PLPROJECTMORE_ESTIMATE.replaceAll("&nbsp;", "");
    }
    if (this.dataAdd.PLPROJECTMORE_FOLLOW != '') {
      this.dataAdd.PLPROJECTMORE_FOLLOW = this.dataAdd.PLPROJECTMORE_FOLLOW.replaceAll("<br>", "<br/>");
      this.dataAdd.PLPROJECTMORE_FOLLOW = this.dataAdd.PLPROJECTMORE_FOLLOW.replaceAll("<p>", "");
      this.dataAdd.PLPROJECTMORE_FOLLOW = this.dataAdd.PLPROJECTMORE_FOLLOW.replaceAll("</p>", "<br/>");
      this.dataAdd.PLPROJECTMORE_FOLLOW = this.dataAdd.PLPROJECTMORE_FOLLOW.replaceAll("&nbsp;", "");
    }
    for (let i = 0; i < this.dataAdd.PRPLPROJECT_TIME; i++) {
      console.log(this.dataAdd.PRPLPROJECTACT_ACT[i]);
      this.dataAdd.PRPLPROJECTACT_ACT[i] = this.dataAdd.PRPLPROJECTACT_ACT[i].replaceAll("<br>", "<br/>");
      this.dataAdd.PRPLPROJECTACT_ACT[i] = this.dataAdd.PRPLPROJECTACT_ACT[i].replaceAll("<p>", "");
      this.dataAdd.PRPLPROJECTACT_ACT[i] = this.dataAdd.PRPLPROJECTACT_ACT[i].replaceAll("</p>", "<br/>");
      this.dataAdd.PRPLPROJECTACT_ACT[i] = this.dataAdd.PRPLPROJECTACT_ACT[i].replaceAll("&nbsp;", "");
    }
    if (this.dataAdd.PRPLPROJECT_TIME > 1 && Array.isArray(this.dataAdd.PRPLPROJECTACT_NAME)) {
      const isTime = this.dataAdd.actMode === 'time';
      const prefix = isTime ? 'ครั้งที่' : 'กิจกรรมที่';
      for (let i = 0; i < this.dataAdd.PRPLPROJECT_TIME; i++) {
        if (!this.dataAdd.PRPLPROJECTACT_NAME[i] || !String(this.dataAdd.PRPLPROJECTACT_NAME[i]).trim()) {
          this.dataAdd.PRPLPROJECTACT_NAME[i] = `${prefix} ${i + 1}`;
        }
      }
    }
    this.dataAdd.PRPLPROJECT_NUMBER = this.getProjectNumber();
    // console.log(this.dataAdd.PLPROJECTMORE_PRINCIPLE.length );
    this.dataAdd.opt = "update";
    this.apiService
      .getupdate(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        // console.log(12);
        if (data.status == 1) {
          this.toastr.success("แจ้งเตือน:แก้ไขข้อมูลเรียบร้อยแล้ว");
          this.fetchdatalistapp();
          this.editdata(this.dataAdd.PRPLPROJECT_CODE);
          console.log(this.dataAdd.PRPLPROJECT_CODE);
          this.rowpbu = null;
          document.getElementById("ModalCloseupdate")?.click();
        }
      });
    // } 
  }
  updatedata1() {

    if (this.dataAdd.PRPLPROJECT_SDATE && Array.isArray(this.dataAdd.PRPLPROJECT_SDATE)) {
      this.dataAdd.PRPLPROJECT_SDATE1 = [];
      this.dataAdd.PRPLPROJECT_EDATE1 = [];
      for (let i = 0; i < this.dataAdd.PRPLPROJECT_TIME; i++) {
        const s = this.dataAdd.PRPLPROJECT_SDATE[i];
        const e = this.dataAdd.PRPLPROJECT_EDATE[i];
        this.dataAdd.PRPLPROJECT_SDATE1[i] = s ? this.datenow(s) : '';
        this.dataAdd.PRPLPROJECT_EDATE1[i] = e ? this.datenow(e) : '';
      }
    } else if (this.dataAdd.PRPLPROJECT_SDATE != '') {
      this.dataAdd.PRPLPROJECT_SDATE1 = this.datenow(this.dataAdd.PRPLPROJECT_SDATE);
      this.dataAdd.PRPLPROJECT_EDATE1 = this.datenow(this.dataAdd.PRPLPROJECT_EDATE);
    } else {
      this.dataAdd.PRPLPROJECT_SDATE1 = '';
      this.dataAdd.PRPLPROJECT_EDATE1 = '';
    }
    if (this.dataAdd.PLPROJECTMORE_PRINCIPLE != '') {
      this.dataAdd.PLPROJECTMORE_PRINCIPLE = this.dataAdd.PLPROJECTMORE_PRINCIPLE.replaceAll("<br>", "<br/>");
      this.dataAdd.PLPROJECTMORE_PRINCIPLE = this.dataAdd.PLPROJECTMORE_PRINCIPLE.replaceAll("<p>", "<br/>");
      this.dataAdd.PLPROJECTMORE_PRINCIPLE = this.dataAdd.PLPROJECTMORE_PRINCIPLE.replaceAll("</p>", "");
    }
    if (this.dataAdd.PLPROJECTMORE_ACTIVITY != '') {
      this.dataAdd.PLPROJECTMORE_ACTIVITY = this.dataAdd.PLPROJECTMORE_ACTIVITY.replaceAll("<br>", "<br/>");
      this.dataAdd.PLPROJECTMORE_ACTIVITY = this.dataAdd.PLPROJECTMORE_ACTIVITY.replaceAll("<p>", "<br/>");
      this.dataAdd.PLPROJECTMORE_ACTIVITY = this.dataAdd.PLPROJECTMORE_ACTIVITY.replaceAll("</p>", "");
    }
    if (this.dataAdd.PRPLPROJECT_OBJECT != '') {
      this.dataAdd.PRPLPROJECT_OBJECT = this.dataAdd.PRPLPROJECT_OBJECT.replaceAll("<br>", "<br/>");
      this.dataAdd.PRPLPROJECT_OBJECT = this.dataAdd.PRPLPROJECT_OBJECT.replaceAll("<p>", "<br/>");
      this.dataAdd.PRPLPROJECT_OBJECT = this.dataAdd.PRPLPROJECT_OBJECT.replaceAll("</p>", "");
    }
    if (this.dataAdd.PLPROJECTMORE_RESULT != '') {
      this.dataAdd.PLPROJECTMORE_RESULT = this.dataAdd.PLPROJECTMORE_RESULT.replaceAll("<br>", "<br/>");
      this.dataAdd.PLPROJECTMORE_RESULT = this.dataAdd.PLPROJECTMORE_RESULT.replaceAll("<p>", "<br/>");
      this.dataAdd.PLPROJECTMORE_RESULT = this.dataAdd.PLPROJECTMORE_RESULT.replaceAll("</p>", "");
    }
    if (this.dataAdd.PLPROJECTMORE_ESTIMATE != '') {
      this.dataAdd.PLPROJECTMORE_ESTIMATE = this.dataAdd.PLPROJECTMORE_ESTIMATE.replaceAll("<br>", "<br/>");
      this.dataAdd.PLPROJECTMORE_ESTIMATE = this.dataAdd.PLPROJECTMORE_ESTIMATE.replaceAll("<p>", "<br/>");
      this.dataAdd.PLPROJECTMORE_ESTIMATE = this.dataAdd.PLPROJECTMORE_ESTIMATE.replaceAll("</p>", "");
    }
    if (this.dataAdd.PLPROJECTMORE_FOLLOW != '') {
      this.dataAdd.PLPROJECTMORE_FOLLOW = this.dataAdd.PLPROJECTMORE_FOLLOW.replaceAll("<br>", "<br/>");
      this.dataAdd.PLPROJECTMORE_FOLLOW = this.dataAdd.PLPROJECTMORE_FOLLOW.replaceAll("<p>", "<br/>");
      this.dataAdd.PLPROJECTMORE_FOLLOW = this.dataAdd.PLPROJECTMORE_FOLLOW.replaceAll("</p>", "");
    }
    // console.log(this.dataAdd.PLPROJECTMORE_PRINCIPLE.length );
    this.dataAdd.opt = "update";
    this.apiService
      .getupdate(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        // console.log(12);
        if (data.status == 1) {
          //  this.toastr.success("แจ้งเตือน:แก้ไขข้อมูลเรียบร้อยแล้ว");
          this.fetchdatalist();
          //this.fetchdataact();
          this.editdata(this.dataAdd.PRPLPROJECT_CODE);

          this.rowpbu = null;
          // document.getElementById("ModalClose")?.click();
        } else if (data.status == 0) {
          this.toastr.warning("แจ้งเตือน:กรุณากรอกเหตุผลความจำเป็นอย่างน้อย 1 หน้ากระดาษ");
        }
      });
    // } 

  }
  fetchclose() {
    this.clickshow = null;
  }
  showapp(code: any, name: any) {
    this.clickshow = true;
    this.dataAdd.PRPLPROJECT_CODE = code;
    this.dataAdd.htmlStringd = name;
    this.dataAdd.PRASSETFAC_NOTE = '';
    this.dataAdd.PRASSET_PSTATUS = '0';
  }
  showstep(name: any) {
    //console.log(name);
    this.dataAdd.PRSTATUS_PSTATUS = name;
  }
  showact() {
    this.number1 = [];
    if (!Array.isArray(this.dataAdd.PRPLPROJECTACT_NAME)) this.dataAdd.PRPLPROJECTACT_NAME = [];
    if (!Array.isArray(this.dataAdd.PRPLPROJECTACT_ACT)) this.dataAdd.PRPLPROJECTACT_ACT = [];
    if (!Array.isArray(this.dataAdd.PRPLPROJECT_PERSONS)) this.dataAdd.PRPLPROJECT_PERSONS = [];
    if (!Array.isArray(this.dataAdd.PRPLPROJECT_PERSONP)) this.dataAdd.PRPLPROJECT_PERSONP = [];
    if (!Array.isArray(this.dataAdd.PRPLPROJECT_PERSONO)) this.dataAdd.PRPLPROJECT_PERSONO = [];
    if (!Array.isArray(this.dataAdd.PRPLPROJECT_SDATE)) this.dataAdd.PRPLPROJECT_SDATE = [];
    if (!Array.isArray(this.dataAdd.PRPLPROJECT_EDATE)) this.dataAdd.PRPLPROJECT_EDATE = [];
    if (!Array.isArray(this.dataAdd.PRPLPROJECT_AT)) {
      const prev = this.dataAdd.PRPLPROJECT_AT;
      this.dataAdd.PRPLPROJECT_AT = prev !== undefined && prev !== null && prev !== '' ? [prev] : [];
    }
    if (!Array.isArray(this.dataAdd.PRPLPROJECT_LOCATION)) {
      const prev = this.dataAdd.PRPLPROJECT_LOCATION;
      this.dataAdd.PRPLPROJECT_LOCATION = prev !== undefined && prev !== null && prev !== '' ? [prev] : [];
    }
    if (!Array.isArray(this.dataAdd.PROVINCE_ID)) {
      const prev = this.dataAdd.PROVINCE_ID;
      this.dataAdd.PROVINCE_ID = prev !== undefined && prev !== null && prev !== '' ? [prev] : [];
    }
    if (!Array.isArray(this.dataAdd.DISTRICT_ID)) {
      const prev = this.dataAdd.DISTRICT_ID;
      this.dataAdd.DISTRICT_ID = prev !== undefined && prev !== null && prev !== '' ? [prev] : [];
    }
    if (!Array.isArray(this.dataAdd.SUB_DISTRICT_ID)) {
      const prev = this.dataAdd.SUB_DISTRICT_ID;
      this.dataAdd.SUB_DISTRICT_ID = prev !== undefined && prev !== null && prev !== '' ? [prev] : [];
    }
    for (let i = 0; i < this.dataAdd.PRPLPROJECT_TIME; i++) {
      this.number1[i] = i;
      this.dataAdd.PRPLPROJECTACT_NAME[i] = this.dataAdd.PRPLPROJECTACT_NAME[i] !== undefined ? this.dataAdd.PRPLPROJECTACT_NAME[i] : '';
      this.dataAdd.PRPLPROJECTACT_ACT[i] = this.dataAdd.PRPLPROJECTACT_ACT[i] !== undefined ? this.dataAdd.PRPLPROJECTACT_ACT[i] : '';
      this.dataAdd.PRPLPROJECT_PERSONS[i] = this.dataAdd.PRPLPROJECT_PERSONS[i] !== undefined ? this.dataAdd.PRPLPROJECT_PERSONS[i] : 0;
      this.dataAdd.PRPLPROJECT_PERSONP[i] = this.dataAdd.PRPLPROJECT_PERSONP[i] !== undefined ? this.dataAdd.PRPLPROJECT_PERSONP[i] : 0;
      this.dataAdd.PRPLPROJECT_PERSONO[i] = this.dataAdd.PRPLPROJECT_PERSONO[i] !== undefined ? this.dataAdd.PRPLPROJECT_PERSONO[i] : 0;
      this.dataAdd.PRPLPROJECT_SDATE[i] = this.dataAdd.PRPLPROJECT_SDATE[i] !== undefined ? this.dataAdd.PRPLPROJECT_SDATE[i] : '';
      this.dataAdd.PRPLPROJECT_EDATE[i] = this.dataAdd.PRPLPROJECT_EDATE[i] !== undefined ? this.dataAdd.PRPLPROJECT_EDATE[i] : '';
      this.dataAdd.PRPLPROJECT_AT[i] = this.dataAdd.PRPLPROJECT_AT[i] !== undefined ? this.dataAdd.PRPLPROJECT_AT[i] : '1';
      this.dataAdd.PRPLPROJECT_LOCATION[i] = this.dataAdd.PRPLPROJECT_LOCATION[i] !== undefined ? this.dataAdd.PRPLPROJECT_LOCATION[i] : '';
      this.dataAdd.PROVINCE_ID[i] = this.dataAdd.PROVINCE_ID[i] !== undefined ? this.dataAdd.PROVINCE_ID[i] : '';
      this.dataAdd.DISTRICT_ID[i] = this.dataAdd.DISTRICT_ID[i] !== undefined ? this.dataAdd.DISTRICT_ID[i] : '';
      this.dataAdd.SUB_DISTRICT_ID[i] = this.dataAdd.SUB_DISTRICT_ID[i] !== undefined ? this.dataAdd.SUB_DISTRICT_ID[i] : '';

      if (this.dataAdd.PROVINCE_ID[i]) {
        this.onChangedistrict(i, this.dataAdd.PROVINCE_ID[i]);
      }
      if (this.dataAdd.DISTRICT_ID[i]) {
        this.onChangesubdistrict(i, this.dataAdd.DISTRICT_ID[i]);
      }
    }
    this.dataAdd.PRPLPROJECT_NUMBER = this.getProjectNumber();
    this.updateProjectActList();
  }

  getProjectNumber(): number {
    const time = parseInt(this.dataAdd?.PRPLPROJECT_TIME, 10) || 1;
    if (time <= 1) {
      return 0; // ถ้าเป็นโครงการหลัก ก็ให้ PRPLPROJECT_NUMBER=0
    }
    return this.dataAdd?.actMode === 'time' ? 0 : 1;
  }

  updateProjectActList() {
    if (!this.dataAdd || !this.dataAdd.PRPLPROJECT_TIME || this.dataAdd.PRPLPROJECT_TIME <= 1) {
      this.dataProjectact = [];
      return;
    }

    const isTime = this.dataAdd.actMode === 'time';
    const prefix = isTime ? 'ครั้งที่' : 'กิจกรรมที่';

    const list: any[] = [];
    const count = parseInt(this.dataAdd.PRPLPROJECT_TIME, 10) || 0;
    for (let i = 0; i < count; i++) {
      const actNum = i + 1;
      const rawName = this.dataAdd.PRPLPROJECTACT_NAME && this.dataAdd.PRPLPROJECTACT_NAME[i]
        ? String(this.dataAdd.PRPLPROJECTACT_NAME[i]).trim()
        : '';
      const cleanName = rawName.replace(/^(กิจกรรมที่|ครั้งที่)\s*\d+\s*(:|\-)?\s*/, '').trim();
      const actName = cleanName
        ? `${prefix} ${actNum} : ${cleanName}`
        : `${prefix} ${actNum}`;

      list.push({
        PRPLPROJECTM_NUMBER: actNum,
        PRPLPROJECTACT_NAME: actName
      });
    }
    this.dataProjectact = list;

    if (!this.dataAdd.PRPLPROJECTACT_CODE || !list.some(x => x.PRPLPROJECTM_NUMBER == this.dataAdd.PRPLPROJECTACT_CODE)) {
      if (list.length > 0) {
        this.dataAdd.PRPLPROJECTACT_CODE = list[0].PRPLPROJECTM_NUMBER;
      }
    }
  }

  getActivityDisplayName(actNum: any): string {
    if (!actNum) return '';
    const num = parseInt(actNum, 10);
    const idx = !isNaN(num) ? num - 1 : -1;
    const isTime = this.dataAdd?.actMode === 'time';
    const prefix = isTime ? 'ครั้งที่' : 'กิจกรรมที่';

    if (idx >= 0 && this.dataAdd?.PRPLPROJECTACT_NAME && this.dataAdd.PRPLPROJECTACT_NAME[idx]) {
      const rawName = String(this.dataAdd.PRPLPROJECTACT_NAME[idx]).trim();
      const cleanName = rawName.replace(/^(กิจกรรมที่|ครั้งที่)\s*\d+\s*(:|\-)?\s*/, '').trim();
      if (cleanName) {
        return `${prefix} ${actNum} : ${cleanName}`;
      }
      return `${prefix} ${actNum}`;
    }
    if (this.dataProjectact && Array.isArray(this.dataProjectact)) {
      const found = this.dataProjectact.find((x: any) => x.PRPLPROJECTM_NUMBER == actNum);
      if (found && found.PRPLPROJECTACT_NAME) return found.PRPLPROJECTACT_NAME;
    }
    if (!isNaN(num)) return `${prefix} ${actNum}`;
    return String(actNum);
  }

  onActModeChange() {
    this.dataAdd.PRPLPROJECT_NUMBER = this.getProjectNumber();
    const isTime = this.dataAdd?.actMode === 'time';
    const oldPrefix = isTime ? 'กิจกรรมที่' : 'ครั้งที่';
    const newPrefix = isTime ? 'ครั้งที่' : 'กิจกรรมที่';

    if (this.dataAdd?.PRPLPROJECTACT_NAME && Array.isArray(this.dataAdd.PRPLPROJECTACT_NAME)) {
      for (let i = 0; i < this.dataAdd.PRPLPROJECTACT_NAME.length; i++) {
        const val = this.dataAdd.PRPLPROJECTACT_NAME[i];
        if (typeof val === 'string' && val.trim()) {
          const actNum = i + 1;
          if (val.trim() === `${oldPrefix} ${actNum}`) {
            this.dataAdd.PRPLPROJECTACT_NAME[i] = `${newPrefix} ${actNum}`;
          } else if (val.trim().startsWith(`${oldPrefix} ${actNum} :`)) {
            const rest = val.trim().substring(`${oldPrefix} ${actNum} :`.length).trim();
            this.dataAdd.PRPLPROJECTACT_NAME[i] = `${newPrefix} ${actNum} : ${rest}`;
          } else if (val.trim().startsWith(`${oldPrefix} ${actNum}`)) {
            const rest = val.trim().substring(`${oldPrefix} ${actNum}`.length).trim();
            this.dataAdd.PRPLPROJECTACT_NAME[i] = `${newPrefix} ${actNum} ${rest}`;
          }
        }
      }
    }
    this.updateProjectActList();
  }

  addActivity() {
    const current = parseInt(this.dataAdd?.PRPLPROJECT_TIME, 10) || 1;
    if (current <= 1) {
      this.dataAdd.PRPLPROJECT_TIME = 2;
    } else {
      this.dataAdd.PRPLPROJECT_TIME = current + 1;
    }
    this.showact();
  }

  removeActivity() {
    const current = parseInt(this.dataAdd?.PRPLPROJECT_TIME, 10) || 1;
    if (current <= 2) {
      this.resetActivity();
    } else {
      this.dataAdd.PRPLPROJECT_TIME = current - 1;
      this.showact();
    }
  }

  resetActivity() {
    this.dataAdd.PRPLPROJECT_TIME = 1;
    if (Array.isArray(this.dataAdd.PRPLPROJECTACT_NAME)) this.dataAdd.PRPLPROJECTACT_NAME = [];
    if (Array.isArray(this.dataAdd.PRPLPROJECTACT_ACT)) this.dataAdd.PRPLPROJECTACT_ACT = [];
    this.showact();
  }

  removeActivityAt(index: number) {
    const current = parseInt(this.dataAdd?.PRPLPROJECT_TIME, 10) || 1;
    if (current <= 1) return;

    const spliceIfArray = (arr: any) => {
      if (Array.isArray(arr) && index >= 0 && index < arr.length) {
        arr.splice(index, 1);
      }
    };

    spliceIfArray(this.dataAdd.PRPLPROJECTACT_NAME);
    spliceIfArray(this.dataAdd.PRPLPROJECTACT_ACT);
    spliceIfArray(this.dataAdd.PRPLPROJECT_PERSONS);
    spliceIfArray(this.dataAdd.PRPLPROJECT_PERSONP);
    spliceIfArray(this.dataAdd.PRPLPROJECT_PERSONO);
    spliceIfArray(this.dataAdd.PRPLPROJECT_SDATE);
    spliceIfArray(this.dataAdd.PRPLPROJECT_EDATE);
    spliceIfArray(this.dataAdd.PRPLPROJECT_AT);
    spliceIfArray(this.dataAdd.PRPLPROJECT_LOCATION);
    spliceIfArray(this.dataAdd.PROVINCE_ID);
    spliceIfArray(this.dataAdd.DISTRICT_ID);
    spliceIfArray(this.dataAdd.SUB_DISTRICT_ID);

    if (current <= 2) {
      this.resetActivity();
    } else {
      this.dataAdd.PRPLPROJECT_TIME = current - 1;
      this.showact();
    }
  }

  copyLocationToAll() {
    if (!this.dataAdd?.PRPLPROJECT_TIME || this.dataAdd.PRPLPROJECT_TIME <= 1) return;
    const at = this.dataAdd.PRPLPROJECT_AT ? this.dataAdd.PRPLPROJECT_AT[0] : '1';
    const loc = this.dataAdd.PRPLPROJECT_LOCATION ? this.dataAdd.PRPLPROJECT_LOCATION[0] : '';
    const prov = this.dataAdd.PROVINCE_ID ? this.dataAdd.PROVINCE_ID[0] : '';
    const dist = this.dataAdd.DISTRICT_ID ? this.dataAdd.DISTRICT_ID[0] : '';
    const subdist = this.dataAdd.SUB_DISTRICT_ID ? this.dataAdd.SUB_DISTRICT_ID[0] : '';

    for (let i = 1; i < this.dataAdd.PRPLPROJECT_TIME; i++) {
      this.dataAdd.PRPLPROJECT_AT[i] = at;
      this.dataAdd.PRPLPROJECT_LOCATION[i] = loc;
      this.dataAdd.PROVINCE_ID[i] = prov;
      this.dataAdd.DISTRICT_ID[i] = dist;
      this.dataAdd.SUB_DISTRICT_ID[i] = subdist;

      if (prov) {
        this.onChangedistrict(i, prov);
      }
      if (dist) {
        this.onChangesubdistrict(i, dist);
      }
    }
    this.toastr.info("คัดลอกสถานที่จากกิจกรรมที่ 1 ไปยังทุกกิจกรรมเรียบร้อยแล้ว");
  }

  getTotalPersons(): number {
    const val = this.dataAdd?.PRPLPROJECT_PERSONS;
    if (!val) return 0;
    if (Array.isArray(val)) {
      return val.reduce((sum: number, v: any) => sum + (Number(v) || 0), 0);
    }
    return Number(val) || 0;
  }

  getTotalPersonp(): number {
    const val = this.dataAdd?.PRPLPROJECT_PERSONP;
    if (!val) return 0;
    if (Array.isArray(val)) {
      return val.reduce((sum: number, v: any) => sum + (Number(v) || 0), 0);
    }
    return Number(val) || 0;
  }

  getTotalPersono(): number {
    const val = this.dataAdd?.PRPLPROJECT_PERSONO;
    if (!val) return 0;
    if (Array.isArray(val)) {
      return val.reduce((sum: number, v: any) => sum + (Number(v) || 0), 0);
    }
    return Number(val) || 0;
  }

  getTotalAllParticipants(): number {
    return this.getTotalPersons() + this.getTotalPersonp() + this.getTotalPersono();
  }
  isMealOrSnackItem(code?: any): boolean {
    const c = String(code !== undefined && code !== null ? code : (this.dataAdd ? this.dataAdd.PLPROJECTGROUPDT_CODE : '')).trim();
    const mealSnackCodes = [
      '0204', '0205', '0207', '0212', '0213', '0214', '0218', '0243',
      '0246', '0247', '0248', '0249', '0250', '0251', '0252', '0253'
    ];
    if (mealSnackCodes.includes(c)) {
      return true;
    }
    if (this.dataProjectdt && Array.isArray(this.dataProjectdt)) {
      const item = this.dataProjectdt.find((d: any) => String(d.PLPROJECTGROUPDT_CODE).trim() === c);
      if (item && item.PLPROJECTGROUPDT_NAME) {
        const name = item.PLPROJECTGROUPDT_NAME;
        if (name.includes('อาหาร') || name.includes('อาหารเช้า') || name.includes('อาหารกลาง') ||
          name.includes('อาหารเย็น') || name.includes('อาหารว่าง')) {
          return true;
        }
      }
    }
    return false;
  }

  isAccommodationItem(code?: any): boolean {
    const c = String(code !== undefined && code !== null ? code : (this.dataAdd ? this.dataAdd.PLPROJECTGROUPDT_CODE : '')).trim();
    const accomCodes = ['0202', '0203', '0210', '0211'];
    if (accomCodes.includes(c)) {
      return true;
    }
    if (this.dataProjectdt && Array.isArray(this.dataProjectdt)) {
      const item = this.dataProjectdt.find((d: any) => String(d.PLPROJECTGROUPDT_CODE).trim() === c);
      if (item && item.PLPROJECTGROUPDT_NAME) {
        const name = item.PLPROJECTGROUPDT_NAME;
        if (name.includes('ที่พัก') || name.includes('พักเดี่ยว') || name.includes('พักคู่') || name.includes('ห้องพัก')) {
          return true;
        }
      }
    }
    return false;
  }

  get isEconomyRateAvailable(): boolean {
    const gtype = String(this.dataAdd?.PLPROJECTGTYPE_CODE || '').trim();
    return gtype === '05' || gtype === '5';
  }

  isTargetGroupItem(code?: any): boolean {
    const gtype = String(this.dataAdd?.PLPROJECTGTYPE_CODE || '').trim();
    // กรณี PLPROJECTGTYPE_CODE = 09 (ค่าใช้จ่ายในการจัดงาน): ไม่ต้องแสดงกลุ่มเป้าหมาย
    if (gtype === '09' || gtype === '9') {
      return false;
    }
    // กรณี PLPROJECTGTYPE_CODE = 06 หรือ 08: ค่าเช่าที่พักไม่ต้องแสดงกลุ่มเป้าหมาย
    if ((gtype === '06' || gtype === '6' || gtype === '08' || gtype === '8') && this.isAccommodationItem(code)) {
      return false;
    }
    // กรณี PLPROJECTGTYPE_CODE = 05: ค่าเบี้ยเลี้ยงมีกลุ่มเป้าหมายด้วย
    if (this.isAllowanceItem(code)) {
      return (gtype === '05' || gtype === '5');
    }
    return this.isMealOrSnackItem(code) || this.isAccommodationItem(code);
  }

  get mealTargetOptions(): Array<{ id: string; title: string; text: string }> {
    return this.targetGroupOptions;
  }

  get targetGroupOptions(): Array<{ id: string; title: string; text: string }> {
    const gtype = String(this.dataAdd?.PLPROJECTGTYPE_CODE || '').trim();
    const isAccom = this.isAccommodationItem(this.dataAdd?.PLPROJECTGROUPDT_CODE);
    const isAllow = this.isAllowanceItem(this.dataAdd?.PLPROJECTGROUPDT_CODE);

    // กรณี PLPROJECTGTYPE_CODE = 09 (ค่าใช้จ่ายในการจัดงาน): ไม่ต้องแสดงกลุ่มเป้าหมาย
    if (gtype === '09' || gtype === '9') {
      return [];
    }

    // กรณี PLPROJECTGTYPE_CODE = 06 หรือ 08: ค่าเช่าที่พักไม่ต้องแสดงกลุ่มเป้าหมาย
    if ((gtype === '06' || gtype === '6' || gtype === '08' || gtype === '8') && isAccom) {
      return [];
    }

    // กรณี PLPROJECTGTYPE_CODE = 05: ค่าเบี้ยเลี้ยง (มีปุ่มให้ติ๊ก 5.1 - 5.6)
    if ((gtype === '05' || gtype === '5') && isAllow) {
      return [
        { id: '5.1', title: 'ประธานในพิธีเปิดหรือพิธีปิดการฝึกอบรม', text: 'ประธานในพิธีเปิดหรือพิธีปิดการฝึกอบรม' },
        { id: '5.2', title: 'แขกผู้มีเกียรติและผู้ติดตาม', text: 'แขกผู้มีเกียรติและผู้ติดตาม' },
        { id: '5.3', title: 'วิทยากร', text: 'วิทยากร' },
        { id: '5.4', title: 'เจ้าหน้าที่', text: 'เจ้าหน้าที่' },
        { id: '5.5', title: 'ผู้เข้ารับการฝึกอบรม', text: 'ผู้เข้ารับการฝึกอบรม' },
        { id: '5.6', title: 'ผู้สังเกตการณ์', text: 'ผู้สังเกตการณ์' },
      ];
    }

    // กรณี PLPROJECTGTYPE_CODE = 07 (ดูงานที่กำหนดไว้ในโครงการหรือหลักสูตรการฝึกอบรม...)
    if (gtype === '07' || gtype === '7') {
      if (isAccom) {
        // ค่าเช่าที่พัก (พักคู่/พักเดี่ยว) ตามรูป 3: 7.1, 7.2, 7.3
        return [
          { id: '7.1', title: 'เจ้าหน้าที่', text: 'เจ้าหน้าที่' },
          { id: '7.2', title: 'ผู้เข้ารับการฝึกอบรม', text: 'ผู้เข้ารับการฝึกอบรม' },
          { id: '7.3', title: 'ผู้สังเกตการณ์', text: 'ผู้สังเกตการณ์' },
        ];
      }
      // ค่าอาหาร (เช้า, กลางวัน, เย็น, อาหารว่าง) ตามรูป 2: 1.1 - 1.5 (ไม่มีวิทยากร)
      return [
        { id: '1.1', title: 'ประธานในพิธีเปิดหรือพิธีปิดการฝึกอบรม', text: 'ประธานในพิธีเปิดหรือพิธีปิดการฝึกอบรม' },
        { id: '1.2', title: 'แขกผู้มีเกียรติและผู้ติดตาม', text: 'แขกผู้มีเกียรติและผู้ติดตาม' },
        { id: '1.3', title: 'เจ้าหน้าที่', text: 'เจ้าหน้าที่' },
        { id: '1.4', title: 'ผู้เข้ารับการฝึกอบรม', text: 'ผู้เข้ารับการฝึกอบรม' },
        { id: '1.5', title: 'ผู้สังเกตการณ์', text: 'ผู้สังเกตการณ์' },
      ];
    }

    // กรณีโครงการประเภทอื่นๆ (เช่น 04 การฝึกอบรมประเภท ก, 05 ประเภท ข, ฯลฯ)
    if (isAccom) {
      const isSingle = this.isSingleRoomAccommodation(this.dataAdd?.PLPROJECTGROUPDT_CODE);
      const prefix = isSingle ? '6' : '7';
      return [
        { id: prefix + '.1', title: 'ประธานในพิธีเปิดหรือพิธีปิดการฝึกอบรม', text: 'ประธานในพิธีเปิดหรือพิธีปิดการฝึกอบรม' },
        { id: prefix + '.2', title: 'แขกผู้มีเกียรติและผู้ติดตาม', text: 'แขกผู้มีเกียรติและผู้ติดตาม' },
        { id: prefix + '.3', title: 'วิทยากร', text: 'วิทยากร' },
        { id: prefix + '.4', title: 'เจ้าหน้าที่', text: 'เจ้าหน้าที่' },
        { id: prefix + '.5', title: 'ผู้เข้ารับการฝึกอบรม', text: 'ผู้เข้ารับการฝึกอบรม' },
        { id: prefix + '.6', title: 'ผู้สังเกตการณ์', text: 'ผู้สังเกตการณ์' },
      ];
    }

    // ค่าอาหารสำหรับโครงการประเภทอื่นๆ ทั่วไป (มีวิทยากร)
    return [
      { id: '4.1', title: 'ประธานในพิธีเปิดหรือพิธีปิดการฝึกอบรม', text: 'ประธานในพิธีเปิดหรือพิธีปิดการฝึกอบรม' },
      { id: '4.2', title: 'แขกผู้มีเกียรติและผู้ติดตาม', text: 'แขกผู้มีเกียรติและผู้ติดตาม' },
      { id: '4.3', title: 'วิทยากร', text: 'วิทยากร' },
      { id: '4.4', title: 'เจ้าหน้าที่', text: 'เจ้าหน้าที่' },
      { id: '4.5', title: 'ผู้เข้ารับการฝึกอบรม', text: 'ผู้เข้ารับการฝึกอบรม' },
      { id: '4.6', title: 'ผู้สังเกตการณ์', text: 'ผู้สังเกตการณ์' },
    ];
  }

  trackByTargetOption(index: number, opt: any): string {
    return opt ? opt.id : String(index);
  }

  isMealTargetSelected(id: string): boolean {
    return this.selectedMealTargetIds.includes(id);
  }

  toggleMealTarget(id: string, event?: any) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (this.selectedMealTargetIds.includes(id)) {
      this.selectedMealTargetIds = this.selectedMealTargetIds.filter(x => x !== id);
    } else {
      this.selectedMealTargetIds.push(id);
    }
    this.onMealTargetChange();
  }

  onMealTargetChange() {
    if (this.selectedMealTargetIds.length === 0) {
      this.dataAdd.PLPROJECTGROUPDT_DETAIL = '';
      return;
    }

    const currentOptions = this.targetGroupOptions;
    const selectedTexts = currentOptions
      .filter(opt => this.selectedMealTargetIds.includes(opt.id))
      .map(opt => opt.text);

    if (selectedTexts.length === 0) {
      this.dataAdd.PLPROJECTGROUPDT_DETAIL = '';
      return;
    }

    const joined = selectedTexts.join(', ');
    if (this.mealDetailConfig.usePrefix) {
      this.dataAdd.PLPROJECTGROUPDT_DETAIL = 'สำหรับ' + joined;
    } else {
      this.dataAdd.PLPROJECTGROUPDT_DETAIL = joined;
    }
  }

  clearMealTargets() {
    this.selectedMealTargetIds = [];
    this.dataAdd.PLPROJECTGROUPDT_DETAIL = '';
  }

  syncMealTargetsFromDetail() {
    const detail = this.dataAdd && this.dataAdd.PLPROJECTGROUPDT_DETAIL ? String(this.dataAdd.PLPROJECTGROUPDT_DETAIL) : '';
    this.selectedMealTargetIds = [];
    if (!detail) return;
    for (const opt of this.targetGroupOptions) {
      if (detail.includes(opt.text)) {
        this.selectedMealTargetIds.push(opt.id);
      }
    }
  }

  isMealItem(code: any): boolean {
    const mealCodes = ['0207', '0213', '0214', '0205', '0218', '0243', '0246', '0247', '0248', '0249', '0250', '0251'];
    return mealCodes.includes(String(code));
  }

  isFoodExpenseItem(code?: any): boolean {
    const sCode = String(code !== undefined && code !== null ? code : (this.dataAdd ? this.dataAdd.PLPROJECTGROUPDT_CODE : '')).trim();
    if (!sCode) return false;
    if (sCode === '0256') return true;
    if (this.dataProjectdt && Array.isArray(this.dataProjectdt)) {
      const item = this.dataProjectdt.find((d: any) => String(d.PLPROJECTGROUPDT_CODE).trim() === sCode);
      if (item && item.PLPROJECTGROUPDT_NAME) {
        return item.PLPROJECTGROUPDT_NAME.trim() === 'ค่าอาหาร';
      }
    }
    return false;
  }

  isSingleRoomAccommodation(code?: any): boolean {
    const c = String(code !== undefined && code !== null ? code : (this.dataAdd ? this.dataAdd.PLPROJECTGROUPDT_CODE : '')).trim();
    if (!c) return false;
    if (this.dataProjectdt && Array.isArray(this.dataProjectdt)) {
      const item = this.dataProjectdt.find((d: any) => String(d.PLPROJECTGROUPDT_CODE).trim() === c);
      if (item && item.PLPROJECTGROUPDT_NAME) {
        return item.PLPROJECTGROUPDT_NAME.includes('พักเดี่ยว');
      }
    }
    return c === '0203' || c === '0211' || c === '0255';
  }

  isDoubleRoomAccommodation(code?: any): boolean {
    const c = String(code !== undefined && code !== null ? code : (this.dataAdd ? this.dataAdd.PLPROJECTGROUPDT_CODE : '')).trim();
    if (!c) return false;
    if (this.dataProjectdt && Array.isArray(this.dataProjectdt)) {
      const item = this.dataProjectdt.find((d: any) => String(d.PLPROJECTGROUPDT_CODE).trim() === c);
      if (item && item.PLPROJECTGROUPDT_NAME) {
        return item.PLPROJECTGROUPDT_NAME.includes('พักคู่');
      }
    }
    return c === '0202' || c === '0210' || c === '0254';
  }

  isRegularEstimateRate(): boolean {
    const est = String(this.dataAdd?.PLPROJECTESTTYPE_CODE || '').trim();
    return est === '1' || est === '01' || !est;
  }

  isAllowanceItem(code?: any): boolean {
    const sCode = String(code !== undefined && code !== null ? code : (this.dataAdd ? this.dataAdd.PLPROJECTGROUPDT_CODE : '')).trim();
    if (!sCode) return false;
    if (this.dataProjectdt && Array.isArray(this.dataProjectdt)) {
      const item = this.dataProjectdt.find((d: any) => String(d.PLPROJECTGROUPDT_CODE).trim() === sCode);
      if (item && item.PLPROJECTGROUPDT_NAME) {
        return item.PLPROJECTGROUPDT_NAME.includes('เบี้ยเลี้ยง');
      }
    }
    return sCode === '0201';
  }

  getMealBadge(code: any): { label: string; class: string } | null {
    const sCode = String(code || '');
    if (['0218', '0243', '0246', '0247'].includes(sCode)) {
      return { label: 'มื้อเช้า', class: 'bg-info text-dark' };
    } else if (['0207', '0213', '0248', '0249'].includes(sCode)) {
      return { label: 'มื้อกลางวัน', class: 'bg-warning text-dark' };
    } else if (['0205', '0214', '0250', '0251'].includes(sCode)) {
      return { label: 'มื้อเย็น', class: 'bg-primary text-white' };
    }
    return null;
  }

  getCurrentLocationType(): string {
    if (!this.dataAdd) return '1';
    if (this.dataAdd.PRPLPROJECT_TIME > 1 && this.dataAdd.PRPLPROJECTACT_CODE) {
      const actIdx = Math.max(0, parseInt(this.dataAdd.PRPLPROJECTACT_CODE) - 1);
      if (Array.isArray(this.dataAdd.PRPLPROJECT_AT)) {
        return this.dataAdd.PRPLPROJECT_AT[actIdx] || this.dataAdd.PRPLPROJECT_AT[0] || '1';
      }
    }
    if (Array.isArray(this.dataAdd.PRPLPROJECT_AT)) {
      return this.dataAdd.PRPLPROJECT_AT[0] || '1';
    }
    return String(this.dataAdd.PRPLPROJECT_AT || '1');
  }

  getMealSummaryForAct(actNum: any): any | null {
    if (!this.dataProjectexd || !Array.isArray(this.dataProjectexd)) return null;

    const mealGovCodes = ['0205', '0207', '0218', '0246', '0248', '0250'];
    const mealPrivCodes = ['0213', '0214', '0243', '0247', '0249', '0251'];
    const allMealCodes = [...mealGovCodes, ...mealPrivCodes];

    const targetAct = String(actNum || '1');
    const isMultiAct = this.dataAdd && parseInt(this.dataAdd.PRPLPROJECT_TIME, 10) > 1;

    const isActMatch = (val: any) => {
      if (val === undefined || val === null || val === '') return false;
      const sVal = String(val).trim();
      const sTarget = String(targetAct).trim();
      if (sVal === sTarget) return true;
      const nVal = parseInt(sVal, 10);
      const nTarget = parseInt(sTarget, 10);
      return !isNaN(nVal) && !isNaN(nTarget) && nVal === nTarget;
    };

    // Filter all items belonging to this activity
    const actRows = this.dataProjectexd.filter((p: any) => {
      if (isMultiAct) {
        return isActMatch(p.PLPROJECTEXPENSES_NUM) || isActMatch(p.PRPLPROJECTM_NUMBER) || isActMatch(p._actNum);
      }
      return true;
    });

    // Filter meal items for this activity
    const mealRows = actRows.filter((p: any) => {
      if (p.PLPROJECTGROUPDT_NUM != 0 || !p.PLPROJECTGROUPDT_MONEY) return false;
      const code = String(p.PLPROJECTGROUPDT_CODE || '');
      return allMealCodes.includes(code);
    });

    if (mealRows.length === 0) return null;

    // เช็ครหัสประเภทโครงการจากรายการที่เพิ่มไปแล้วในกิจกรรมนี้
    let actGtypeCode = '';
    let actGtypeName = '';

    // 1. ตรวจสอบจากรายการค่าอาหารในกิจกรรมนี้ก่อน
    const mealWithGtype = mealRows.find((p: any) => p.PLPROJECTGTYPE_CODE && String(p.PLPROJECTGTYPE_CODE).trim() !== '');
    if (mealWithGtype) {
      actGtypeCode = String(mealWithGtype.PLPROJECTGTYPE_CODE).trim();
      actGtypeName = mealWithGtype.PLPROJECTGTYPE_NAME || '';
    }

    // 2. ถ้าในรายการอาหารไม่มี ให้ตรวจสอบจากรายการอื่นในกิจกรรมนี้ที่เพิ่มไปแล้ว
    if (!actGtypeCode) {
      const anyRowWithGtype = actRows.find((p: any) => p.PLPROJECTGTYPE_CODE && String(p.PLPROJECTGTYPE_CODE).trim() !== '');
      if (anyRowWithGtype) {
        actGtypeCode = String(anyRowWithGtype.PLPROJECTGTYPE_CODE).trim();
        actGtypeName = anyRowWithGtype.PLPROJECTGTYPE_NAME || '';
      }
    }

    // 3. Fallback: ถ้ายังไม่มีในรายการที่เพิ่ม ให้ใช้ค่าจากฟอร์ม dataAdd
    if (!actGtypeCode && this.dataAdd && this.dataAdd.PLPROJECTGTYPE_CODE) {
      actGtypeCode = String(this.dataAdd.PLPROJECTGTYPE_CODE).trim();
    }

    // 4. ถ้ายังไม่ได้ชื่อประเภทโครงการ ให้ค้นหาจาก this.dataGtype
    if (!actGtypeName && actGtypeCode && this.dataGtype && Array.isArray(this.dataGtype)) {
      const foundGtype = this.dataGtype.find((g: any) => String(g.PLPROJECTGTYPE_CODE).trim() === actGtypeCode);
      if (foundGtype) {
        actGtypeName = foundGtype.PLPROJECTGTYPE_NAME || '';
      }
    }

    const isTypeA = (actGtypeCode === '04' || actGtypeCode === '4');

    let gtypeBadge = '';
    let gtypeBadgeClass = 'bg-primary';

    if (isTypeA) {
      gtypeBadge = 'การฝึกอบรมประเภท ก';
      gtypeBadgeClass = 'bg-primary';
    } else if (actGtypeCode === '05' || actGtypeCode === '5') {
      gtypeBadge = 'การฝึกอบรมประเภท ข';
      gtypeBadgeClass = 'bg-info text-dark';
    } else if (actGtypeCode === '06' || actGtypeCode === '6') {
      gtypeBadge = 'การฝึกอบรมบุคคลภายนอก';
      gtypeBadgeClass = 'bg-info text-dark';
    } else if (actGtypeCode === '07' || actGtypeCode === '7') {
      gtypeBadge = 'การดูงานตามโครงการ/หลักสูตร';
      gtypeBadgeClass = 'bg-secondary';
    } else if (actGtypeCode === '08' || actGtypeCode === '8') {
      gtypeBadge = 'การดูงานภายในประเทศ';
      gtypeBadgeClass = 'bg-secondary';
    } else if (actGtypeCode === '09' || actGtypeCode === '9') {
      gtypeBadge = 'การจัดงาน';
      gtypeBadgeClass = 'bg-secondary';
    } else if (actGtypeName) {
      gtypeBadge = actGtypeName;
      gtypeBadgeClass = 'bg-secondary';
    }

    // Determine location for this activity from meal items or PRPLPROJECT_AT
    let locationType = '1';
    const hasPrivMeal = mealRows.some((p: any) => mealPrivCodes.includes(String(p.PLPROJECTGROUPDT_CODE || '')));
    const hasGovMeal = mealRows.some((p: any) => mealGovCodes.includes(String(p.PLPROJECTGROUPDT_CODE || '')));

    if (hasPrivMeal && !hasGovMeal) {
      locationType = '2';
    } else if (hasGovMeal && !hasPrivMeal) {
      locationType = '1';
    } else {
      const actIdx = Math.max(0, parseInt(targetAct, 10) - 1);
      if (this.dataAdd && this.dataAdd.PRPLPROJECT_AT) {
        if (Array.isArray(this.dataAdd.PRPLPROJECT_AT)) {
          locationType = this.dataAdd.PRPLPROJECT_AT[actIdx] || this.dataAdd.PRPLPROJECT_AT[0] || '1';
        } else {
          locationType = String(this.dataAdd.PRPLPROJECT_AT || '1');
        }
      }
    }

    const isGov = (locationType !== '2');
    const locationName = isGov ? 'สถานที่ราชการ/รัฐวิสาหกิจ' : 'สถานที่เอกชน';

    let hasBreakfast = false;
    let hasLunch = false;
    let hasDinner = false;
    let totalRate = 0;
    let totalMoney = 0;
    const mealsDetail: any[] = [];

    mealRows.forEach((p: any) => {
      const code = String(p.PLPROJECTGROUPDT_CODE || '');
      let rate = parseFloat(p.PLPROJECTGROUPDT_TMONEY) || 0;
      if (!rate) {
        const persons = parseFloat(p.PLPROJECTGROUPDT_NUMA) || 1;
        const days = parseFloat(p.PLPROJECTGROUPDT_NUMB) || 1;
        const rowMoney = parseFloat(p.PLPROJECTGROUPDT_MONEY) || 0;
        rate = (persons * days > 0) ? (rowMoney / (persons * days)) : rowMoney;
      }
      const mealsPerDay = parseFloat(p.PLPROJECTGROUPDT_NUMC) || 1;
      const itemDailyRate = rate * mealsPerDay;
      totalRate += itemDailyRate;
      totalMoney += parseFloat(p.PLPROJECTGROUPDT_MONEY) || 0;

      let name = '';
      if (['0218', '0243', '0246', '0247'].includes(code)) {
        hasBreakfast = true;
        name = 'มื้อเช้า';
      } else if (['0207', '0213', '0248', '0249'].includes(code)) {
        hasLunch = true;
        name = 'มื้อกลางวัน';
      } else if (['0205', '0214', '0250', '0251'].includes(code)) {
        hasDinner = true;
        name = 'มื้อเย็น';
      } else {
        name = p.PLPROJECTGROUPDT_NAME || 'ค่าอาหาร';
      }
      mealsDetail.push({ name, rate: itemDailyRate, code });
    });

    const mealNames: string[] = [];
    if (hasBreakfast) mealNames.push('เช้า');
    if (hasLunch) mealNames.push('กลางวัน');
    if (hasDinner) mealNames.push('เย็น');
    const mealCount = mealNames.length;
    const isFull = (mealCount === 3);

    let maxLimit = 0;
    if (isTypeA) {
      if (isGov) {
        maxLimit = isFull ? 1100 : 750;
      } else {
        maxLimit = isFull ? 1500 : 1100;
      }
    } else {
      if (isGov) {
        maxLimit = isFull ? 750 : 500;
      } else {
        maxLimit = isFull ? 1200 : 900;
      }
    }

    const isOver = totalRate > maxLimit;
    const overAmount = isOver ? (totalRate - maxLimit) : 0;

    let actName = '';
    if (isMultiAct) {
      actName = this.getActivityDisplayName(targetAct);
    }

    return {
      actKey: targetAct,
      actName,
      actGtypeCode,
      actGtypeName,
      gtypeBadge,
      gtypeBadgeClass,
      isTypeA,
      locationType,
      locationName,
      hasBreakfast,
      hasLunch,
      hasDinner,
      mealNames,
      mealCount,
      isFull,
      maxLimit,
      totalRate,
      totalMoney,
      isOver,
      overAmount,
      mealsDetail
    };
  }

  getMealSummaryList(): any[] {
    if (!this.dataProjectexd || !Array.isArray(this.dataProjectexd)) return [];
    const isMultiAct = this.dataAdd && parseInt(this.dataAdd.PRPLPROJECT_TIME, 10) > 1;
    const list: any[] = [];
    if (isMultiAct) {
      const actSet = new Set<string>();
      const actCount = parseInt(this.dataAdd.PRPLPROJECT_TIME, 10) || 1;
      for (let a = 1; a <= actCount; a++) {
        actSet.add(String(a));
      }
      this.dataProjectexd.forEach((p: any) => {
        const itemAct = String(p.PLPROJECTEXPENSES_NUM || p.PRPLPROJECTM_NUMBER || p._actNum || '').trim();
        if (itemAct) actSet.add(itemAct);
      });
      actSet.forEach((actKey) => {
        const ms = this.getMealSummaryForAct(actKey);
        if (ms) list.push(ms);
      });
    } else {
      const ms = this.getMealSummaryForAct('1');
      if (ms) list.push(ms);
    }
    return list;
  }

  checkMealLimitAfterSave() {
    const list = this.getMealSummaryList();
    if (!list || list.length === 0) return;
    const overItem = list.find((ms: any) => ms.isOver);
    if (overItem) {
      this.alertMealOverLimit(overItem);
    }
  }

  alertMealOverLimit(ms: any) {
    const mealListHtml = ms.mealsDetail.map((m: any) => `<li>${m.name}: <b>${m.rate.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</b> บาท/คน/วัน</li>`).join('');
    Swal.fire({
      icon: 'warning',
      title: '<span style="font-size: 20px; font-weight: bold; color: #d9534f;">แจ้งเตือนอัตราค่าอาหารเกินเกณฑ์</span>',
      html: `
        <div style="font-size: 15px; text-align: left; line-height: 1.8; color: #212529;">
          <div style="background-color: #f8d7da; border: 1px solid #f5c2c7; border-radius: 6px; padding: 10px 14px; margin-bottom: 12px; color: #842029;">
            <strong><i class="fa-solid fa-triangle-exclamation me-1"></i>อัตราค่าอาหารเกินเกณฑ์ที่กำหนด</strong>
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 8px;">
            ${ms.actName ? `<tr><td style="padding: 6px 0; color: #555;">กิจกรรม:</td><td style="padding: 6px 0; text-align: right; font-weight: bold; color: #212529;">${ms.actName}</td></tr>` : ''}
            ${ms.gtypeBadge ? `<tr><td style="padding: 6px 0; color: #555;">ประเภทโครงการ:</td><td style="padding: 6px 0; text-align: right; font-weight: bold; color: #212529;">${ms.gtypeBadge}</td></tr>` : ''}
            <tr>
              <td style="padding: 6px 0; color: #555;">สถานที่จัดโครงการ:</td>
              <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #212529;">${ms.locationName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #555;">สถานะการจัดมื้อ:</td>
              <td style="padding: 6px 0; text-align: right; font-weight: bold; color: ${ms.isFull ? '#198754' : '#fd7e14'};">
                ${ms.isFull ? 'จัดครบทุกมื้อ (3 มื้อ)' : `จัดไม่ครบทุกมื้อ (${ms.mealCount} มื้อ)`}
              </td>
            </tr>
            <tr style="border-top: 1px dashed #dee2e6;">
              <td style="padding: 6px 0; color: #555;">อัตราค่าอาหารที่ระบุรวม:</td>
              <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #dc3545;">${ms.totalRate.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท/คน/วัน</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #555;">เกณฑ์อัตราที่กำหนด:</td>
              <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #198754;">ไม่เกิน ${ms.maxLimit.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท/คน/วัน</td>
            </tr>
            <tr style="border-top: 1px dashed #dee2e6;">
              <td style="padding: 6px 0; color: #555;">เกินอัตราที่กำหนด:</td>
              <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #dc3545;">+${ms.overAmount.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท/คน/วัน</td>
            </tr>
          </table>
          <div style="font-size: 13px; color: #6c757d; margin-top: 6px;">
            <u>รายการมื้อที่ระบุ:</u>
            <ul style="margin: 4px 0 0 16px; padding: 0;">${mealListHtml}</ul>
          </div>
        </div>
      `,
      confirmButtonText: 'รับทราบ',
      confirmButtonColor: '#0d6efd'
    });
  }

  alertMealLimit(ms?: any) {
    const isTypeA = ms ? ms.isTypeA : (this.dataAdd && (String(this.dataAdd.PLPROJECTGTYPE_CODE) === '04' || String(this.dataAdd.PLPROJECTGTYPE_CODE) === '4'));
    const titleType = ms?.gtypeBadge ? ` (${ms.gtypeBadge})` : (isTypeA ? ' (ประเภท ก)' : '');
    Swal.fire({
      title: '<span style="font-size: 20px; font-weight: bold; color: #212529;">ข้อกำหนดอัตราค่าอาหารสำหรับผู้เข้าร่วมโครงการ' + titleType + '</span>',
      html: isTypeA ? `
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 15px; border: 1px solid #c0c0c0; margin-top: 10px;">
          <tbody>
            <tr style="background-color: #fce5cd; font-weight: bold; border-bottom: 1px solid #c0c0c0;">
              <td style="padding: 8px 14px; color: #000;">สถานที่ราชการ/รัฐวิสาหกิจ/หน่วยงานอื่นภาครัฐ</td>
            </tr>
            <tr style="background-color: #ffffff; border-bottom: 1px solid #c0c0c0;">
              <td style="padding: 10px 14px; line-height: 1.8; color: #000;">
                <div>กำหนด 1. จัดครบทุกมื้อ ไม่เกิน 1,100 บาท</div>
                <div style="padding-left: 45px;">2. จัดไม่ครบทุกมื้อ ไม่เกิน 750 บาท</div>
              </td>
            </tr>
            <tr style="background-color: #fce5cd; font-weight: bold; border-bottom: 1px solid #c0c0c0;">
              <td style="padding: 8px 14px; color: #000;">สถานที่เอกชน</td>
            </tr>
            <tr style="background-color: #ffffff;">
              <td style="padding: 10px 14px; line-height: 1.8; color: #000;">
                <div>กำหนด 1. จัดครบทุกมื้อ ไม่เกิน 1,500 บาท</div>
                <div style="padding-left: 45px;">2. จัดไม่ครบทุกมื้อ ไม่เกิน 1,100 บาท</div>
              </td>
            </tr>
          </tbody>
        </table>
      ` : `
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 15px; border: 1px solid #c0c0c0; margin-top: 10px;">
          <tbody>
            <tr style="background-color: #fce5cd; font-weight: bold; border-bottom: 1px solid #c0c0c0;">
              <td style="padding: 8px 14px; color: #000;">สถานที่ราชการ/รัฐวิสาหกิจ/หน่วยงานอื่นของรัฐ</td>
            </tr>
            <tr style="background-color: #ffffff; border-bottom: 1px solid #c0c0c0;">
              <td style="padding: 10px 14px; line-height: 1.8; color: #000;">
                <div>กำหนด 1. จัดครบทุกมื้อ ไม่เกิน 750 บาท</div>
                <div style="padding-left: 45px;">2. จัดไม่ครบทุกมื้อ ไม่เกิน 500 บาท</div>
              </td>
            </tr>
            <tr style="background-color: #fce5cd; font-weight: bold; border-bottom: 1px solid #c0c0c0;">
              <td style="padding: 8px 14px; color: #000;">สถานที่เอกชน</td>
            </tr>
            <tr style="background-color: #ffffff;">
              <td style="padding: 10px 14px; line-height: 1.8; color: #000;">
                <div>กำหนด 1. จัดครบทุกมื้อ ไม่เกิน 1,200 บาท</div>
                <div style="padding-left: 45px;">2. จัดไม่ครบทุกมื้อ ไม่เกิน 900 บาท</div>
              </td>
            </tr>
          </tbody>
        </table>
      `,
      icon: 'info',
      confirmButtonText: 'รับทราบ',
      confirmButtonColor: '#0d6efd'
    });
  }

  isMaterialItem(code: any): boolean {
    const sCode = String(code || '').trim();
    return sCode.startsWith('03');
  }

  getMaterialTotal(): number {
    if (!this.dataProjectexd || !Array.isArray(this.dataProjectexd)) return 0;
    let sum = 0;
    for (let i = 0; i < this.dataProjectexd.length; i++) {
      const p = this.dataProjectexd[i];
      if (p.PLPROJECTGROUPDT_NUM == 0) {
        const code = String(p.PLPROJECTGROUPDT_CODE || '');
        const groupName = String(p.PLPROJECTGROUP_NAME || '');
        if (this.isMaterialItem(code) || groupName === 'ค่าวัสดุ') {
          sum += parseFloat(p.PLPROJECTGROUPDT_MONEY) || 0;
        }
      }
    }
    return sum;
  }

  formatMoney(index: number) {
    if (this.dataAdd?.PRPLPROJECTM_MONEY && this.dataAdd.PRPLPROJECTM_MONEY[index] !== undefined && this.dataAdd.PRPLPROJECTM_MONEY[index] !== '') {
      this.dataAdd.PRPLPROJECTM_MONEY[index] = this.formatNumberWithComma(this.dataAdd.PRPLPROJECTM_MONEY[index]);
    }
  }

  formatAllMoney() {
    if (this.dataAdd?.PRPLPROJECTM_MONEY && Array.isArray(this.dataAdd.PRPLPROJECTM_MONEY)) {
      for (let i = 0; i < this.dataAdd.PRPLPROJECTM_MONEY.length; i++) {
        if (this.dataAdd.PRPLPROJECTM_MONEY[i] !== '' && this.dataAdd.PRPLPROJECTM_MONEY[i] !== null && this.dataAdd.PRPLPROJECTM_MONEY[i] !== undefined) {
          this.dataAdd.PRPLPROJECTM_MONEY[i] = this.formatNumberWithComma(this.dataAdd.PRPLPROJECTM_MONEY[i]);
        }
      }
    }
  }

  formatNumberWithComma(val: any): string {
    if (val === null || val === undefined || val === '') return '';
    const cleanStr = String(val).replace(/,/g, '').trim();
    if (cleanStr === '') return '';
    const num = parseFloat(cleanStr);
    if (isNaN(num)) return String(val);
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  getTotalProjectBudget(): number {
    let mSum = 0;
    if (this.dataAdd?.PRPLPROJECTM_MONEY && Array.isArray(this.dataAdd.PRPLPROJECTM_MONEY)) {
      mSum = this.dataAdd.PRPLPROJECTM_MONEY.reduce((s: number, v: any) => s + (parseFloat(String(v || '').replace(/,/g, '')) || 0), 0);
    }
    const expSum = parseFloat(String(this.dataAdd?.PLPROJECT_MONEYT || '').replace(/,/g, '')) || parseFloat(String(this.dataAdd?.PLPROJECT_MONEY || '').replace(/,/g, '')) || 0;
    return Math.max(mSum, expSum);
  }

  getMaterialPercent(): number {
    const total = this.getTotalProjectBudget();
    if (total <= 0) return 0;
    return (this.getMaterialTotal() / total) * 100;
  }

  getMaxMaterialAllowed(): number {
    return this.getTotalProjectBudget() * 0.20;
  }

  checkMaterialLimitAfterSave(materialSum: number, sum: number) {
    let frameworkBudget = 0;
    if (this.dataAdd?.PRPLPROJECTM_MONEY && Array.isArray(this.dataAdd.PRPLPROJECTM_MONEY)) {
      frameworkBudget = this.dataAdd.PRPLPROJECTM_MONEY.reduce((s: number, v: any) => s + (parseFloat(String(v || '').replace(/,/g, '')) || 0), 0);
    }
    const totalBudget = Math.max(frameworkBudget, sum);
    if (totalBudget > 0) {
      const percent = (materialSum / totalBudget) * 100;
      if (percent > 20) {
        this.alertMaterialLimit(materialSum, totalBudget, percent);
      }
    }
  }

  alertMaterialLimit(materialSum: number, totalBudget: number, percent: number) {
    const maxAllowed = totalBudget * 0.20;
    Swal.fire({
      icon: 'warning',
      title: '<span style="font-size: 20px; font-weight: bold; color: #d9534f;">แจ้งเตือนงบประมาณค่าวัสดุ</span>',
      html: `
        <div style="font-size: 15px; text-align: left; line-height: 1.8; color: #212529;">
          <div style="background-color: #fff3cd; border: 1px solid #ffeeba; border-radius: 6px; padding: 10px 14px; margin-bottom: 12px; color: #856404;">
            <strong><i class="fa-solid fa-triangle-exclamation me-1"></i>ค่าวัสดุเกินร้อยละ 20 ของงบประมาณโครงการ</strong>
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 8px;">
            <tr>
              <td style="padding: 6px 0; color: #555;">รวมค่าวัสดุทั้งหมด:</td>
              <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #dc3545;">${materialSum.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #555;">งบประมาณโครงการ:</td>
              <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #212529;">${totalBudget.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท</td>
            </tr>
            <tr style="border-top: 1px dashed #dee2e6;">
              <td style="padding: 6px 0; color: #555;">สัดส่วนค่าวัสดุ:</td>
              <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #dc3545;">${percent.toFixed(2)}%</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #555;">เกณฑ์ที่กำหนด (ไม่เกิน 20%):</td>
              <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #28a745;">ไม่เกิน ${maxAllowed.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} บาท</td>
            </tr>
          </table>
          <div style="font-size: 13px; color: #6c757d; border-top: 1px solid #dee2e6; padding-top: 8px; margin-top: 8px;">
            * ข้อกำหนด: งบประมาณค่าวัสดุต้องไม่เกินร้อยละ 20 ของงบประมาณโครงการทั้งหมด
          </div>
        </div>
      `,
      confirmButtonText: 'รับทราบ',
      confirmButtonColor: '#d9534f'
    });
  }

  showestimate(showAlert: boolean = false) {
    if (!this.isEconomyRateAvailable) {
      this.dataAdd.PLPROJECTESTTYPE_CODE = 1;
    }

    this.dataAdd.PLPT1 = '';
    this.dataAdd.PLPT2 = '';
    this.dataAdd.PLPT3 = '';
    this.dataAdd.PLPT4 = '';
    this.dataAdd.PLPDT1 = '';
    this.dataAdd.PLPDT2 = '';
    this.dataAdd.moneydt = null;
    this.dataAdd.GCUNIT_ACODE = '';
    this.dataAdd.GCUNIT_BCODE = '';
    this.dataAdd.GCUNIT_CCODE = '';
    //ค่าอาหาร
    if (this.dataAdd.PLPROJECTGROUPDT_CODE == '0207' || this.dataAdd.PLPROJECTGROUPDT_CODE == '0213'
      || this.dataAdd.PLPROJECTGROUPDT_CODE == '0214' || this.dataAdd.PLPROJECTGROUPDT_CODE == '0205'
      || this.dataAdd.PLPROJECTGROUPDT_CODE == '0212' || this.dataAdd.PLPROJECTGROUPDT_CODE == '0204'
      || this.dataAdd.PLPROJECTGROUPDT_CODE == '0218' || this.dataAdd.PLPROJECTGROUPDT_CODE == '0243'
      || this.dataAdd.PLPROJECTGROUPDT_CODE == '0246' || this.dataAdd.PLPROJECTGROUPDT_CODE == '0247'
      || this.dataAdd.PLPROJECTGROUPDT_CODE == '0248' || this.dataAdd.PLPROJECTGROUPDT_CODE == '0249'
      || this.dataAdd.PLPROJECTGROUPDT_CODE == '0250' || this.dataAdd.PLPROJECTGROUPDT_CODE == '0251'
      || this.dataAdd.PLPROJECTGROUPDT_CODE == '0252' || this.dataAdd.PLPROJECTGROUPDT_CODE == '0253'
    ) {
      this.dataAdd.GCUNIT_ACODE = 'Z21';
      this.dataAdd.GCUNIT_BCODE = 'V04';
      this.dataAdd.GCUNIT_CCODE = '205';
      this.dataAdd.PLPDT1 = 1;
      this.dataAdd.PLPDT2 = 1;
      this.dataAdd.PLPDT3 = 1;
      this.dataAdd.PLPT1 = 'คน';
      this.dataAdd.PLPT2 = 'วัน';
      this.dataAdd.PLPT3 = 'มื้อ';
      this.dataAdd.PLPT4 = 1;
      this.dataAdd.moneydt = 1;
    } else//ค่าตอบแทน
      if (this.dataAdd.PLPROJECTGROUPDT_CODE == '0103' || this.dataAdd.PLPROJECTGROUPDT_CODE == '0102'
        || this.dataAdd.PLPROJECTGROUPDT_CODE == '0101' || this.dataAdd.PLPROJECTGROUPDT_CODE == '0105'
        || this.dataAdd.PLPROJECTGROUPDT_CODE == '0106' || this.dataAdd.PLPROJECTGROUPDT_CODE == '0104'
        || this.dataAdd.PLPROJECTGROUPDT_CODE == '0107'
      ) {
        this.dataAdd.GCUNIT_ACODE = 'Z21';
        this.dataAdd.GCUNIT_BCODE = 'V04';
        this.dataAdd.GCUNIT_CCODE = 'Z19';
        this.dataAdd.PLPDT1 = 1;
        this.dataAdd.PLPDT2 = 1;
        this.dataAdd.PLPDT3 = 1;
        this.dataAdd.PLPT1 = 'คน';
        this.dataAdd.PLPT2 = 'วัน';
        this.dataAdd.PLPT3 = 'ชั่วโมง';
        this.dataAdd.PLPT4 = '';
        this.dataAdd.moneydt = 1;
      } else//ค่าตอบแทน
        if (this.dataAdd.PLPROJECTGROUPDT_CODE == '0109' || this.dataAdd.PLPROJECTGROUPDT_CODE == '0110'
          || this.dataAdd.PLPROJECTGROUPDT_CODE == '0111' || this.dataAdd.PLPROJECTGROUPDT_CODE == '0112'
          || this.dataAdd.PLPROJECTGROUPDT_CODE == '0111' || this.dataAdd.PLPROJECTGROUPDT_CODE == '0113') {
          this.dataAdd.GCUNIT_ACODE = 'Z21';
          this.dataAdd.GCUNIT_BCODE = 'Z19';
          this.dataAdd.GCUNIT_CCODE = '';
          this.dataAdd.PLPDT3 = 1;
          this.dataAdd.PLPDT1 = 1;
          this.dataAdd.PLPDT2 = '';
          this.dataAdd.PLPT1 = 'คน';
          this.dataAdd.PLPT2 = 'ชั่วโมง';
          this.dataAdd.PLPT3 = '';
          this.dataAdd.PLPT4 = '';
          this.dataAdd.moneydt = 1;
        } else
          //ค่าเบี้ยเลี้ยง
          if (this.dataAdd.PLPROJECTGROUPDT_CODE == '0201' || this.dataAdd.PLPROJECTGROUPDT_CODE == '0257') {
            this.dataAdd.GCUNIT_ACODE = 'Z21';
            this.dataAdd.GCUNIT_BCODE = 'V04';
            this.dataAdd.GCUNIT_CCODE = '';
            this.dataAdd.PLPDT3 = 1;
            this.dataAdd.PLPDT1 = 1;
            this.dataAdd.PLPDT2 = '';
            this.dataAdd.PLPT1 = 'คน';
            this.dataAdd.PLPT2 = 'วัน';
            this.dataAdd.PLPT3 = '';
            const gtype = String(this.dataAdd?.PLPROJECTGTYPE_CODE || '').trim();
            this.dataAdd.PLPT4 = (gtype === '05' || gtype === '5') ? 1 : '';
            this.dataAdd.moneydt = 1;
          } else
            //สมนาคุณ
            if (this.dataAdd.PLPROJECTGROUPDT_CODE == '0312') {
              this.dataAdd.GCUNIT_ACODE = 'Z29';
              this.dataAdd.GCUNIT_BCODE = '';
              this.dataAdd.GCUNIT_CCODE = '';
              this.dataAdd.PLPDT3 = 1;
              this.dataAdd.PLPDT1 = '';
              this.dataAdd.PLPDT2 = '';
              this.dataAdd.PLPT1 = 'แห่ง';
              this.dataAdd.PLPT2 = '';
              this.dataAdd.PLPT3 = '';
              this.dataAdd.PLPT4 = '';
              this.dataAdd.moneydt = 1;
            } else
              //ค่าที่พัก
              if (this.dataAdd.PLPROJECTGROUPDT_CODE == '0203' || this.dataAdd.PLPROJECTGROUPDT_CODE == '0202'
                || this.dataAdd.PLPROJECTGROUPDT_CODE == '0211' || this.dataAdd.PLPROJECTGROUPDT_CODE == '0210'
                || this.dataAdd.PLPROJECTGROUPDT_CODE == '0254' || this.dataAdd.PLPROJECTGROUPDT_CODE == '0255'
                || this.dataAdd.PLPROJECTGROUPDT_CODE == '0260' || this.dataAdd.PLPROJECTGROUPDT_CODE == '0261') {
                this.dataAdd.GCUNIT_ACODE = 'V04';
                this.dataAdd.GCUNIT_BCODE = 'R05';
                this.dataAdd.GCUNIT_CCODE = '';
                this.dataAdd.PLPDT3 = 1;
                this.dataAdd.PLPDT1 = 1;
                this.dataAdd.PLPDT2 = '';
                this.dataAdd.PLPT1 = 'วัน';
                this.dataAdd.PLPT2 = 'ห้อง';
                this.dataAdd.PLPT3 = '';
                const gtype = String(this.dataAdd?.PLPROJECTGTYPE_CODE || '').trim();
                this.dataAdd.PLPT4 = (gtype === '06' || gtype === '6' || gtype === '08' || gtype === '8' || gtype === '09' || gtype === '9') ? '' : 1;
                this.dataAdd.moneydt = 1;
              } else
                //ค่าพาหนะ
                if (this.dataAdd.PLPROJECTGROUPDT_CODE == '0216' || this.dataAdd.PLPROJECTGROUPDT_CODE == '0208'
                  || this.dataAdd.PLPROJECTGROUPDT_CODE == '0223' || this.dataAdd.PLPROJECTGROUPDT_CODE == '0219'
                  || this.dataAdd.PLPROJECTGROUPDT_CODE == '0258' || this.dataAdd.PLPROJECTGROUPDT_CODE == '0220'
                ) {
                  this.dataAdd.GCUNIT_ACODE = 'Z21';
                  this.dataAdd.GCUNIT_BCODE = 'T00';
                  this.dataAdd.GCUNIT_CCODE = '';
                  this.dataAdd.PLPDT3 = 1;
                  this.dataAdd.PLPDT1 = 1;
                  this.dataAdd.PLPDT2 = '';
                  this.dataAdd.PLPT1 = 'คน';
                  this.dataAdd.PLPT2 = 'เที่ยว';
                  this.dataAdd.PLPT3 = '';
                  this.dataAdd.PLPT4 = '';
                  this.dataAdd.moneydt = null;
                } else
                  //ค่าเช่าเหมายานพาหนะ
                  if (this.dataAdd.PLPROJECTGROUPDT_CODE == '0225'
                  ) {
                    this.dataAdd.GCUNIT_ACODE = 'C07';
                    this.dataAdd.GCUNIT_BCODE = 'V04';
                    this.dataAdd.GCUNIT_CCODE = '';
                    this.dataAdd.PLPDT3 = 1;
                    this.dataAdd.PLPDT1 = 1;
                    this.dataAdd.PLPDT2 = '';
                    this.dataAdd.PLPT1 = 'คัน';
                    this.dataAdd.PLPT2 = 'วัน';
                    this.dataAdd.PLPT3 = '';
                    this.dataAdd.PLPT4 = '';
                    this.dataAdd.moneydt = null;
                  } else
                    //ค่าพาหนะส่วนตัว
                    if (this.dataAdd.PLPROJECTGROUPDT_CODE == '0215' || this.dataAdd.PLPROJECTGROUPDT_CODE == '0224' || this.dataAdd.PLPROJECTGROUPDT_CODE == '0259') {
                      this.dataAdd.GCUNIT_ACODE = 'Z22';
                      this.dataAdd.GCUNIT_BCODE = 'T00';
                      this.dataAdd.GCUNIT_CCODE = '';
                      this.dataAdd.PLPDT3 = 1;
                      this.dataAdd.PLPDT1 = 1;
                      this.dataAdd.PLPDT2 = '';
                      this.dataAdd.PLPT1 = 'กิโลเมตร';
                      this.dataAdd.PLPT2 = 'เที่ยว';
                      this.dataAdd.PLPT3 = '';
                      this.dataAdd.PLPT4 = '';
                      this.dataAdd.moneydt = 1;
                    } else if (this.dataAdd.PLPROJECTGROUPDT_CODE == '0228' || this.dataAdd.PLPROJECTGROUPDT_CODE == '0114') {//ค่าลงทะเบียน
                      this.dataAdd.GCUNIT_ACODE = 'Z21';
                      this.dataAdd.GCUNIT_BCODE = '';
                      this.dataAdd.GCUNIT_CCODE = '';
                      this.dataAdd.PLPDT3 = 1;
                      this.dataAdd.PLPDT1 = '';
                      this.dataAdd.PLPDT2 = '';
                      this.dataAdd.PLPT1 = 'คน';
                      this.dataAdd.PLPT2 = '';
                      this.dataAdd.PLPT3 = '';
                      this.dataAdd.PLPT4 = '';
                      this.dataAdd.moneydt = 1;
                    } else if (this.dataAdd.PLPROJECTGROUPDT_CODE == '0217') {//ค่าเช่า
                      this.dataAdd.GCUNIT_ACODE = 'V04';
                      this.dataAdd.GCUNIT_BCODE = '';
                      this.dataAdd.GCUNIT_CCODE = '';
                      this.dataAdd.PLPDT3 = 1;
                      this.dataAdd.PLPDT1 = '';
                      this.dataAdd.PLPDT2 = '';
                      this.dataAdd.PLPT1 = 'วัน';
                      this.dataAdd.PLPT2 = '';
                      this.dataAdd.PLPT3 = '';
                      this.dataAdd.PLPT4 = 1;
                      this.dataAdd.moneydt = 1;
                    } else if (this.dataAdd.PLPROJECTGROUPDT_CODE == '0234') {//เงินรางวัล
                      this.dataAdd.GCUNIT_ACODE = 'Z27';
                      this.dataAdd.GCUNIT_BCODE = '';
                      this.dataAdd.GCUNIT_CCODE = '';
                      this.dataAdd.PLPDT3 = 1;
                      this.dataAdd.PLPDT1 = '';
                      this.dataAdd.PLPDT2 = '';
                      this.dataAdd.PLPT1 = 'รางวัล';
                      this.dataAdd.PLPT2 = '';
                      this.dataAdd.PLPT3 = '';
                      this.dataAdd.PLPT4 = 1;
                      this.dataAdd.moneydt = 1;
                    } else {
                      //อื่นๆ
                      this.dataAdd.GCUNIT_ACODE = '';
                      this.dataAdd.GCUNIT_BCODE = '';
                      this.dataAdd.GCUNIT_CCODE = '';
                      this.dataAdd.PLPDT1 = '';
                      this.dataAdd.PLPDT2 = '';
                      this.dataAdd.PLPDT3 = '';
                      this.dataAdd.PLPT1 = '';
                      this.dataAdd.PLPT2 = '';
                      this.dataAdd.PLPT3 = '';
                      this.dataAdd.PLPT4 = 1;
                      this.dataAdd.moneydt = null;
                    }
    if (this.dataProjectdt && this.dataProjectdt.length) {
      for (let i = 0; i < this.dataProjectdt.length; i++) {
        if (this.dataProjectdt[i].PLPROJECTGROUPDT_CODE == this.dataAdd.PLPROJECTGROUPDT_CODE) {
          if (this.dataAdd.PLPROJECTESTTYPE_CODE == '1') {
            this.dataAdd.PLPROJECTGROUPDT_MONEY = this.dataProjectdt[i].PLPROJECTGROUPDT_MONEYE;
          } else {
            this.dataAdd.PLPROJECTGROUPDT_MONEY = this.dataProjectdt[i].PLPROJECTGROUPDT_MONEYO;
          }
        }
      }
    }
    if (this.isTargetGroupItem(this.dataAdd.PLPROJECTGROUPDT_CODE)) {
      this.dataAdd.PLPT4 = 1;
      this.syncMealTargetsFromDetail();
    } else {
      this.selectedMealTargetIds = [];
    }
    if (showAlert && this.isMealItem(this.dataAdd.PLPROJECTGROUPDT_CODE)) {
      this.alertMealLimit();
    }
  }
  showasset() {
    for (let i = 0; i < this.dataProjectasset.length; i++) {
      if (this.dataProjectasset[i].PRASSET_CODE == this.dataAdd.PRASSET_CODE) {
        this.dataAdd.PLPROJECTGROUPDT_DETAIL = this.dataProjectasset[i].PRREGISASSET_NAME;
        this.dataAdd.PLPROJECTGROUPDT_MONEY = (parseFloat(this.dataProjectasset[i].PRASSET_MONEY).toFixed(2));//this.dataProjectasset[i].PRASSET_MONEY;
        this.dataAdd.PLPROJECTGROUPDT_NUMA = this.dataProjectasset[i].PRASSET_NUMBER;
        this.dataAdd.GCUNIT_ACODE = this.dataProjectasset[i].GCUNIT_CODE;
      }

    }
  }
  insertappfac() {
    this.dataAdd.opt = "approvefac";
    this.apiService
      .getupdate(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        //console.log(data.status);       
        if (data.status == 1) {
          this.clickshow = null;
          this.fetchdatalistapp();
          this.fetchdatalist();
          this.toastr.success("แจ้งเตือน:อนุมัติข้อมูลเรียบร้อยแล้ว");
        }
      });
  }

  showbuid() {
    this.dataAdd.PRBUILDING_YEAR = (this.dataAdd.PRPLPROJECTM_EYEAR - this.dataAdd.PRPLPROJECTM_SYEAR) + 1;
    //console.log(this.dataAdd.PRPLPROJECTM_EYEAR);
    if (this.dataAdd.PRBUILDING_YEAR == '1') {
      this.dataAdd.PRPLPROJECTM_YEAR[0] = this.dataAdd.PRPLPROJECTM_SYEAR;
      this.dataAdd.PRPLPROJECTM_MONEY[1] = '';
      this.dataAdd.PRPLPROJECTM_MONEY[2] = '';
      this.dataAdd.PRPLPROJECTM_MONEY[3] = '';
      this.dataAdd.PRPLPROJECTM_MONEY[4] = '';
      this.dataAdd.money1 = null;
      this.dataAdd.money2 = 1;
      this.dataAdd.money3 = 1;
      this.dataAdd.money4 = 1;
      this.dataAdd.money5 = 1;
    }
    if (this.dataAdd.PRBUILDING_YEAR == '2') {

      this.dataAdd.PRPLPROJECTM_YEAR[0] = this.dataAdd.PRPLPROJECTM_SYEAR;
      this.dataAdd.PRPLPROJECTM_YEAR[1] = Number(this.dataAdd.PRPLPROJECTM_SYEAR) + 1;
      this.dataAdd.PRPLPROJECTM_MONEY[2] = '';
      this.dataAdd.PRPLPROJECTM_MONEY[3] = '';
      this.dataAdd.PRPLPROJECTM_MONEY[4] = '';

      this.dataAdd.money1 = null;
      this.dataAdd.money2 = null;
      this.dataAdd.money3 = 1;
      this.dataAdd.money4 = 1;
      this.dataAdd.money5 = 1;
    }
    if (this.dataAdd.PRBUILDING_YEAR == '3') {
      this.dataAdd.PRPLPROJECTM_YEAR[0] = this.dataAdd.PRPLPROJECTM_SYEAR;
      this.dataAdd.PRPLPROJECTM_YEAR[1] = Number(this.dataAdd.PRPLPROJECTM_SYEAR) + 1;
      this.dataAdd.PRPLPROJECTM_YEAR[2] = Number(this.dataAdd.PRPLPROJECTM_SYEAR) + 2;
      this.dataAdd.PRPLPROJECTM_MONEY[3] = '';
      this.dataAdd.PRPLPROJECTM_MONEY[4] = '';
      this.dataAdd.money1 = null;
      this.dataAdd.money2 = null;
      this.dataAdd.money3 = null;
      this.dataAdd.money4 = 1;
      this.dataAdd.money5 = 1;
    }
    if (this.dataAdd.PRBUILDING_YEAR == '4') {
      this.dataAdd.PRPLPROJECTM_YEAR[0] = this.dataAdd.PRPLPROJECTM_SYEAR;
      this.dataAdd.PRPLPROJECTM_YEAR[1] = Number(this.dataAdd.PRPLPROJECTM_SYEAR) + 1;
      this.dataAdd.PRPLPROJECTM_YEAR[2] = Number(this.dataAdd.PRPLPROJECTM_SYEAR) + 2;
      this.dataAdd.PRPLPROJECTM_YEAR[3] = Number(this.dataAdd.PRPLPROJECTM_SYEAR) + 3;
      this.dataAdd.PRPLPROJECTM_MONEY[4] = '';
      this.dataAdd.money1 = null;
      this.dataAdd.money2 = null;
      this.dataAdd.money3 = null;
      this.dataAdd.money4 = null;
      this.dataAdd.money5 = 1;
    }
    if (this.dataAdd.PRBUILDING_YEAR == '5') {
      this.dataAdd.PRPLPROJECTM_YEAR[0] = this.dataAdd.PRPLPROJECTM_SYEAR;
      this.dataAdd.PRPLPROJECTM_YEAR[1] = Number(this.dataAdd.PRPLPROJECTM_SYEAR) + 1;
      this.dataAdd.PRPLPROJECTM_YEAR[2] = Number(this.dataAdd.PRPLPROJECTM_SYEAR) + 2;
      this.dataAdd.PRPLPROJECTM_YEAR[3] = Number(this.dataAdd.PRPLPROJECTM_SYEAR) + 3;
      this.dataAdd.PRPLPROJECTM_YEAR[4] = Number(this.dataAdd.PRPLPROJECTM_SYEAR) + 4;
      this.dataAdd.money1 = null;
      this.dataAdd.money2 = null;
      this.dataAdd.money3 = null;
      this.dataAdd.money4 = null;
      this.dataAdd.money5 = null;
    }
  }


  fetchdatalistimport() {
    this.dataAdd.opt = "readAllimport";
    this.loadingimport = true;
    this.datalistimport = null;
    this.rownumimport = null;
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == 1) {
          this.datalistimport = data.data;
          this.loadingimport = null;
          this.rownumimport = true;
          for (let i = 0; i < this.datalistimport.length; i++) {
            this.dataAdd.IMPORTASSET_CODE[i] = this.datalistimport[i].PRASSET_CODE;
            this.dataAdd.checkimport[i] = false;
          }
        } else {
          this.datalistimport = data.data;
          this.loadingimport = null;
          this.rownumimport = null;
          this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
        }
      });
  }
  insertdataimport() {
    //console.log(this.dataAdd.PRASSET_COURSET );
    this.loadingimport = true;
    if (this.dataAdd.checkimport.length == 0) {
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกรายการครุภัณฑ์");
    } else {

      this.dataAdd.opt = "insertimport";
      this.apiService
        .getupdate(this.dataAdd, this.url)
        .pipe(first())
        .subscribe((data: any) => {
          //console.log(data.status);       
          if (data.status == 1) {
            this.loadingimport = null;
            this.toastr.success("แจ้งเตือน:เพิ่มข้อมูลเรียบร้อยแล้ว");
            this.fetchdatalist();
            document.getElementById("ModalClose")?.click();
          }
        });
    }
  }

  getTotalMoneySum(): number {
    if (!this.dataAdd?.TOTAL_MONEY) return 0;
    return this.dataAdd.TOTAL_MONEY.reduce((sum: number, val: any) => {
      if (!val) return sum;
      const num = typeof val === 'string' ? parseFloat(val.replace(/,/g, '')) : val;
      return sum + (isNaN(num) ? 0 : num);
    }, 0);
  }

  getImportTotalSum(): number {
    if (!this.datalistimportall) return 0;
    return this.datalistimportall.reduce((sum: number, item: any) => {
      const val = item.PRASSET_MONEY;
      if (!val) return sum;
      const num = typeof val === 'string' ? parseFloat(val.replace(/,/g, '')) : val;
      return sum + (isNaN(num) ? 0 : num);
    }, 0);
  }

  previewPdf(url: string) {
    this.previewPdfUrl = url;
    this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url + '#navpanes=0');
  }

  closePdfPreview() {
    this.previewPdfUrl = '';
    this.safePdfUrl = '';
  }
}
