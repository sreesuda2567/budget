import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { ApiPdoService } from '../../../_services/api-pui.service';
import { TokenStorageService } from '../../../_services/token-storage.service';
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
      'bold', 'italic', '|', 'strikethrough', 'code', '|',
      'bulletedList', 'numberedList', '|',
      'imageUpload'    // อัปโหลดไฟล์จากเครื่อง
    ]
  }
};
@Component({
  selector: 'app-listproject',
  templateUrl: './listproject.component.html',
  styleUrls: ['./listproject.component.scss']
})
export class ListprojectComponent implements OnInit {
  public editor = ClassicEditor;
  public editorConfig = {
    toolbar: {
      items: [
        'bold', 'italic', '|', 'bulletedList', 'numberedList', '|', 'imageUpload'
      ]
    },
    // ใช้ CKFinder adapter (มีใน classic build)
    ckfinder: {
      uploadUrl: 'https://pis.rmutsv.ac.th/api/acc3d/investment/project/upload_image.php'   // <= เปลี่ยนให้ถูกกับโปรเจกต์
    },
    image: {
      toolbar: ['imageStyle:inline', 'imageStyle:block', 'imageStyle:side', '|', 'imageTextAlternative']
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
  url = "/acc3d/investment/project/listproject.php";
  url1 = "/acc3d/investment/userpermission.php";
  locale = 'th-be';
  locales = listLocales();
  //dataAdd:any = {PRBOBJECT_NAME:[],PRBOBJECT_CODE:[],PRUSE_NAME:[],PRUSE_CODE:[]};PLPROJECTEXPENSES_CODE
  dataAdd: any = {
    check: [], checkregis: [], PRREGISPROJECT_CODE: [], PRASSET_CODEA: [],
    PLPROJECTD_CODE: [], PLPROJECTD_RSTATUS: [], PLPROJECTD_NAME: [], PLPROJECTD_VALUE: [], PLINDICATOR_CODE: [], PLPROJECTGROUPDT_NAME: [], PRPLPROJECTM_YEAR: [], PRPLPROJECTM_MONEY: []
    , PRPLPROJECTACT_NAME: [], PRPLPROJECTACT_ACT: [], PRPLPROJECT_PERSONS: [], PRPLPROJECT_PERSONP: [], PRPLPROJECT_PERSONO: []
    /*, PLPROJECTGROUPDT_NUM: [], GCUNIT_CODE: [], PLPROJECTGROUPDT_NUMA: [], GCUNIT_ACODE: [], PLPROJECTGROUPDT_MONEY: [], PLPROJECTGROUPDT_MONEYA: [], PLPROJECTGROUPDT_CODE: []
    , PLPROJECTEXPENSES_CODE: []*/
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
    this.dataAdd.FPLPROJECTTYPE = 1;
    //this.dataAdd.FPLPROJECTTYPE = 1;
    this.rowpbu = null;
    this.projecttype();
    this.localeService.use(this.locale);
    this.applyLocale('thBeLocale');
    this.dataAdd.CITIZEN_ID = this.tokenStorage.getUser().citizen;
    this.dataAdd.PLINCOME_CODE = '';
    this.dataAdd.CRPART_ID = '';
    this.rowpbi = true;
    //this.setshowbti();
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
          for (let i = 0; i < this.datalistregister.length; i++) {
            this.dataAdd.PRREGISPROJECT_CODE[i] = this.datalistregister[i].PRREGISPROJECT_CODE;
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
            // this.dataAdd.FFACULTY_CODE = data[0].FACULTY_CODE;
            this.fetchdatalist();
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
      "opt": "viewyear"
    }
    this.apiService
      .getdata(Tabley, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataYear = data;
        this.dataAdd.PRYEARASSET_CODE = data[0].PLYEARBUDGET_CODE;
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
    var Tablegc = {
      "opt": "viewPLPROJECTGROUPDTT"
    }
    this.apiService
      .getdata(Tablegc, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataProjectdt = data;
        //this.dataAdd.GCUNIT_CODE= data[0].GCUNIT_CODE;
      });
    var Tablegc = {
      "opt": "viewPLPROJECTGROUPDTD"
    }
    this.apiService
      .getdata(Tablegc, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataProjecttd = data.data;
        // console.log(this.dataProjecttd.length);
        let k = 0;
        for (let i = 0; i < this.dataProjecttd.length; i++) {
          if (data.data[i].PLPROJECTGROUPDT_CODE != '') {
            this.dataAdd.PLPROJECTGROUPDT_CODE[k] = data.data[i].PLPROJECTGROUPDT_CODE;
            //console.log(data.data[i].PLPROJECTGROUPDT_CODE+' '+k);
            // console.log(k);
            k++;
          }
          /*  this.dataAdd.PLPROJECTGROUPDT_NAME[i] = '';
            this.dataAdd.PLPROJECTGROUPDT_CODE[i] = '';
            this.dataAdd.PLPROJECTGROUPDT_NUM[i] = '';
            this.dataAdd.PLPROJECTGROUPDT_NUMA[i] = '';
            this.dataAdd.PLPROJECTGROUPDT_MONEY[i] = '';
            this.dataAdd.PLPROJECTGROUPDT_MONEYA[i] = '';
            this.dataAdd.PLPROJECTEXPENSES_CODE[i] = '';
            this.dataAdd.GCUNIT_CODE[i] = '';
            this.dataAdd.GCUNIT_ACODE[i] = '';*/
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
      "opt": "viewstatusfac"
    }
    this.apiService
      .getdata(Tabletar, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.datastatus = data;
        this.dataAdd.PRSTATUS_CODE = data[0].PRSTATUS_CODE;
      });
    this.dataAdd.opt = "readAll";
    this.dataAdd.CITIZEN_ID = this.tokenStorage.getUser().citizen;

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
    this.dataAdd.PLPROJECTGROUPDTMONEY = parseFloat(this.dataAdd.PLPROJECTGROUPDT_NUMA) * parseFloat(this.dataAdd.PLPROJECTGROUPDT_NUMB) * parseFloat(this.dataAdd.PLPROJECTGROUPDT_NUMC) * parseFloat(this.dataAdd.PLPROJECTGROUPDT_MONEY);
  }
  calexpenses() {
    let sum = 0;
    for (let i = 0; i < this.dataProjectexd.length; i++) {
      //console.log(this.dataProjectexd[i].PLPROJECTGROUPDT_MONEY);
      if (this.dataProjectexd[i].PLPROJECTGROUPDT_MONEY > 0) {
        sum += parseFloat(this.dataProjectexd[i].PLPROJECTGROUPDT_MONEY);
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
        for (let i = 0; i < this.dataPlandicator.length; i++) {
          this.dataAdd.PLPROJECTD_NAME[i] = this.dataPlandicator[i].PLINDICATOR_NAME;
          this.dataAdd.PLPROJECTD_VALUE[i] = this.dataPlandicator[i].PLINDICATOR_VALUE;
          this.dataAdd.PLINDICATOR_CODE[i] = this.dataPlandicator[i].PLINDICATOR_CODE;
          this.dataAdd.PLPROJECTD_CODE[i] = '';
          this.dataAdd.PLPROJECTD_RSTATUS[i] = 3;
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
    this.dataAdd.RPLINCOME_CODE = '';
    this.dataAdd.RCRPART_ID = '';
    this.dataAdd.PLGPRODUCT_CODE = '';
    this.dataAdd.PLSUBMONEYPAY_CODE = '';
    this.dataAdd.PRPLPROJECT_NAME = '';
    this.dataAdd.PRPLPROJECT_TIME = 1;
    this.showact();
    this.dataAdd.FPLPROJECTTYPE = 1;
    this.dataAdd.PLMONEYPAY_CODE = '';
    this.dataAdd.PLSUBMONEYPAY_CODE = '';
    this.dataAdd.PLRESEARCHTYPE_CODE = '';
    this.dataAdd.PRPLPROJECT_HEADER = '';
    this.dataAdd.PRPLPROJECT_HPHONE = '';
    this.dataAdd.PRPLPROJECTHEAD_TYPE = 1;
    // this.dataAdd.PRPLPROJECT_PERSONS = 0;
    //this.dataAdd.PRPLPROJECT_PERSONP = 0;
    //this.dataAdd.PRPLPROJECT_PERSONO = 0;
    this.dataAdd.PLPROJECT_MONEYT = 0;
    this.dataAdd.PLPROJECT_MONEY = 0;
    this.dataAdd.PRPLPROJECT_SDATE = '';
    this.dataAdd.PRPLPROJECT_EDATE = '';
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
    this.dataAdd.PLPROJECTMORE_ESTIMATE = '';
    this.dataAdd.PLPROJECTMORE_FOLLOW = '';
    this.dataAdd.PRPLPROJECT_T1 = '';
    this.dataAdd.PRPLPROJECT_T2 = '';
    this.dataAdd.PRPLPROJECT_PEXCELL = '';
    this.dataAdd.PRPLPROJECT_ANOTHER = '';
    this.dataAdd.PRPLPROJECT_PDEVELOP = '';
    this.dataAdd.PRPLPROJECT_SUPPORT = '';
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
        this.dataPlm = data.dataplm;
        this.dataPls = data.datapls;
        this.dataPli = data.datapli;
        this.dataPlp = data.dataplp;
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
    if (num.keyCode < 46 || num.keyCode > 57) {
      alert('กรุณากรอกข้อมูล ที่เป็นตัวเลข');
      num.returnValue = false;
    }
  }
  // ฟังก์ขันสำหรับการดึงข้อมูลครุภัณฑ์
  fetchdatalist() {
    this.dataAdd.opt = "readAll";
    this.loading = true;
    this.datalist = null;
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
      this.dataAdd.opt = "insertdt";
      this.apiService
        .getupdate(this.dataAdd, this.url)
        .pipe(first())
        .subscribe((data: any) => {

          if (data.status == 1) {
            this.cleardat();
            this.fetchdatadt();
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
        this.dataProjecthead = data.data;

      });

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
        this.dataAdd.PLPROJECTGROUPDT_CODE = data[0].PLPROJECTGROUPDT_CODE;
        this.showestimate();
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
        //this.calexpensesdt();

      });
    this.rowpbi = null;
    this.rowpbu = true;
  }
  //แก้ไขข้อมูล
  updatedatadt() {
    this.dataAdd.opt = "updatedt";
    this.apiService
      .getupdate(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        this.toastr.success("แจ้งเตือน:แก้ไขข้อมูลเรียบร้อยแล้ว");
        this.rowpbi = true;
        this.rowpbu = null;
        this.fetchdatadt();
        this.cleardat();
      });
  }
  cleardat() {
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
  fetchdatadt() {
    //console.log(1);
    this.dataProjectexd = null;
    this.dataAdd.opt = "readdt";
    this.apiService
      .getupdate(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataProjectexd = data.data;
        let sum = 0;
        for (var j = 0; j < data.data.length; j++) {
          // console.log(1);
          if (data.data[j].PLPROJECTGROUPDT_NUM == 0) {
            sum += data.data[j].PLPROJECTGROUPDT_MONEY;
          }
        }
        this.dataAdd.PLPROJECT_MONEY = sum;
        this.dataAdd.PLPROJECT_MONEYT = sum;
        this.dataAdd.PRBUILDING_YEAR = (this.dataAdd.PRPLPROJECTM_EYEAR - this.dataAdd.PRPLPROJECTM_SYEAR) + 1;

        for (let i = 0; i < this.dataAdd.PRBUILDING_YEAR; i++) {
          console.log(this.dataAdd.PLPROJECT_MONEYT[i]);
          if (this.dataAdd.PRPLPROJECTM_YEAR[i] == this.dataAdd.PRYEARASSET_CODE) {
            this.dataAdd.PRPLPROJECTM_MONEY[i] = this.dataAdd.PLPROJECT_MONEYT;
          }
        }
      });

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
        this.dataProjectact = data.data;
        for (let i = 0; i < data.data.length; i++) {
          this.dataAdd.PRPLPROJECTACT_NAME[i] = data.data[i].PRPLPROJECTACT_NAME;
          this.dataAdd.PRPLPROJECTACT_ACT[i] = data.data[i].PRPLPROJECTACT_ACT;
          this.dataAdd.PRPLPROJECT_PERSONS[i] = data.data[i].PRPLPROJECT_PERSONS;
          this.dataAdd.PRPLPROJECT_PERSONP[i] = data.data[i].PRPLPROJECT_PERSONP;
          this.dataAdd.PRPLPROJECT_PERSONO[i] = data.data[i].PRPLPROJECT_PERSONO;
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
        this.dataProjectasset = data.data;
      });

  }
  datenow(datenow: any) {
    const yyyy = datenow.getFullYear();
    let mm = datenow.getMonth() + 1; // Months start at 0!
    let dd = datenow.getDate();
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
              this.fetchdatalist();
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
    this.dataAdd.opt = "readAllapp";
    this.loadingapp = true;
    this.datalistapp = null;
    // console.log(1);
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == 1) {
          this.datalistapp = data.data;
          this.loadingapp = null;
          for (let i = 0; i < this.datalistapp.length; i++) {
            this.dataAdd.PRASSET_CODEA[i] = this.datalistapp[i].PRPLPROJECT_CODE;

          }
        } else {
          this.datalistapp = data.data;
          this.loadingapp = null;
          this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
        }
      });
  }
  onChangecrpartrister() {
    this.dataAdd.opt = "viewcrpartregis";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataCrpartregis = data;
        this.dataAdd.RCRPART_ID = data[0].CRPART_ID;
        //console.log(this.dataSub);
      });
  }
  onChangedistrict(deviceValue: any) {
    this.dataAdd.opt = "viewdistrict";
    if (deviceValue != '') {
      this.dataAdd.PROVINCE_ID = deviceValue;
    }
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataDistrict = data;
      });
  }
  onChangesubdistrict(deviceValue: any) {
    this.dataAdd.opt = "viewsubdistrict";
    if (deviceValue != '') {
      this.dataAdd.DISTRICT_ID = deviceValue;
    }
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataSubdistrict = data;

      });
  }
  // ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
  editdata(id: any) {
    this.rowpbi = 1;
    this.rowpbu = null;
    // console.log(this.rowpbi);
    this.setshowbti();
    this.dataAdd.PRPLPROJECTM_SYEAR = this.dataAdd.PRYEARASSET_CODE;
    this.dataAdd.PRPLPROJECTM_EYEAR = this.dataAdd.PRYEARASSET_CODE;
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
    this.apiService
      .getById(id, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataProjecttd = data.dataEXPENSES;
        // this.dataAdd  = data.data;
        //  console.log((data.data[0].PLPRODUCT_CODE).substring(4, 7));
        //this.onChangedistrict(data.data[0].PROVINCE_ID);
        //this.onChangesubdistrict(data.data[0].DISTRICT_ID);
        // this.dataAdd.PROVINCE_ID = data.data[0].PROVINCE_ID;
        //   this.dataAdd.DISTRICT_ID = data.data[0].DISTRICT_ID;
        //  this.dataAdd.SUB_DISTRICT_ID = data.data[0].SUB_DISTRICT_ID;

        this.dataAdd.RPLINCOME_CODE = data.data[0].PLINCOME_CODE;
        this.onChangecrpartrister();
        this.dataAdd.RCRPART_ID = data.data[0].CRPART_ID;
        this.dataAdd.PLSTRATEGY_CODE = data.data[0].PLSTRATEGY_CODE;
        this.dataAdd.PLGPRODUCT_CODE = (data.data[0].PLGPRODUCT_CODE);//.substring(4, 7);
        this.dataAdd.PRPLPROJECT_CODE = data.data[0].PRPLPROJECT_CODE;
        this.dataAdd.PLSUBMONEYPAY_CODE1 = data.data[0].PLSUBMONEYPAY_CODE1;
        this.dataAdd.PRPLPROJECT_NAME = data.data[0].PRREGISPROJECT_NAME;
        this.dataAdd.PRPLPROJECT_TIME = data.data[0].PRPLPROJECT_TIME;
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
        this.dataAdd.PRBUILDING_YEAR = data.datam.length;

        for (let i = 0; i < data.datam.length; i++) {
          if (i == 0) {
            this.dataAdd.PRPLPROJECTM_SYEAR = data.datam[i].PRPLPROJECTM_YEAR;
          } else {
            this.dataAdd.PRPLPROJECTM_EYEAR = data.datam[i].PRPLPROJECTM_YEAR;
          }
          this.dataAdd.PRPLPROJECTM_YEAR[i] = data.datam[i].PRPLPROJECTM_YEAR;
          this.dataAdd.PRPLPROJECTM_MONEY[i] = Number(data.datam[i].PRPLPROJECTM_MONEY).toFixed(2);
        }
        this.showbuid();
        this.fetchdataPLMISSION();
        // console.log(data.data[0].PRPLPROJECT_SDATE);
        if (data.data[0].PRPLPROJECT_SDATE != null) {
          this.dataAdd.PRPLPROJECT_SDATE = new Date(data.data[0].PRPLPROJECT_SDATE);
          this.dataAdd.PRPLPROJECT_EDATE = new Date(data.data[0].PRPLPROJECT_EDATE);
        }
        this.dataAdd.PRPLPROJECT_LOCATION = data.data[0].PRPLPROJECT_LOCATION;
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
        if (this.dataPlandicator.length == 0) {
          this.fetchdataPLINDICATOR();
        }
        for (let i = 0; i < this.dataPlandicator.length; i++) {
          this.dataAdd.PLPROJECTD_NAME[i] = this.dataPlandicator[i].PLPROJECTD_NAME;
          this.dataAdd.PLPROJECTD_VALUE[i] = this.dataPlandicator[i].PLPROJECTD_VALUE;
          this.dataAdd.PLINDICATOR_CODE[i] = this.dataPlandicator[i].PLINDICATOR_CODE;
          this.dataAdd.PLPROJECTD_RSTATUS[i] = this.dataPlandicator[i].PLPROJECTD_RSTATUS;;
          this.dataAdd.PLPROJECTD_CODE[i] = this.dataPlandicator[i].PLPROJECTD_CODE;
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
    if (this.dataAdd.PRPLPROJECT_SDATE != '') {
      this.dataAdd.PRPLPROJECT_SDATE1 = this.datenow(this.dataAdd.PRPLPROJECT_SDATE);
      this.dataAdd.PRPLPROJECT_EDATE1 = this.datenow(this.dataAdd.PRPLPROJECT_EDATE);
    } else {
      this.dataAdd.PRPLPROJECT_SDATE1 = '';
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
    // console.log(this.dataAdd.PLPROJECTMORE_PRINCIPLE.length );
    this.dataAdd.opt = "update";
    this.apiService
      .getupdate(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        // console.log(12);
        if (data.status == 1) {
          this.toastr.success("แจ้งเตือน:แก้ไขข้อมูลเรียบร้อยแล้ว");
          this.fetchdatalist();
          this.editdata(this.dataAdd.PRPLPROJECT_CODE);
          //console.log(this.dataAdd.PRASSET_CODE);
          this.rowpbu = null;
          // document.getElementById("ModalClose")?.click();
        } else if (data.status == 0) {
          this.toastr.warning("แจ้งเตือน:กรุณากรอกเหตุผลความจำเป็นอย่างน้อย 1 หน้ากระดาษ");
        }
      });
    // } 
  }
  updatedata1() {

    if (this.dataAdd.PRPLPROJECT_SDATE != '') {
      this.dataAdd.PRPLPROJECT_SDATE1 = this.datenow(this.dataAdd.PRPLPROJECT_SDATE);
      this.dataAdd.PRPLPROJECT_EDATE1 = this.datenow(this.dataAdd.PRPLPROJECT_EDATE);
    } else {
      this.dataAdd.PRPLPROJECT_SDATE1 = '';
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
  }
  showstep(name: any) {
    //console.log(name);
    this.dataAdd.PRSTATUS_PSTATUS = name;
  }
  showact() {
    this.number1 = [];
    for (let i = 0; i < this.dataAdd.PRPLPROJECT_TIME; i++) {
      this.number1[i] = i;
      this.dataAdd.PRPLPROJECTACT_NAME[i] = '';
      this.dataAdd.PRPLPROJECTACT_ACT[i] = '';
      this.dataAdd.PRPLPROJECT_PERSONS[i] = 0;
      this.dataAdd.PRPLPROJECT_PERSONP[i] = 0;
      this.dataAdd.PRPLPROJECT_PERSONO[i] = 0;
    }

  }
  showestimate() {

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
      || this.dataAdd.PLPROJECTGROUPDT_CODE == '0212' || this.dataAdd.PLPROJECTGROUPDT_CODE == '0204') {
      this.dataAdd.GCUNIT_ACODE = 'Z21';
      this.dataAdd.GCUNIT_BCODE = 'V04';
      this.dataAdd.GCUNIT_CCODE = '205';
      this.dataAdd.PLPDT1 = 1;
      this.dataAdd.PLPDT2 = 1;
      this.dataAdd.PLPT1 = 'คน';
      this.dataAdd.PLPT2 = 'วัน';
      this.dataAdd.PLPT3 = 'มื้อ';
      this.dataAdd.PLPT4 = '';
      this.dataAdd.moneydt = 1;
    }
    //ค่าตอบแทน
    if (this.dataAdd.PLPROJECTGROUPDT_CODE == '0103' || this.dataAdd.PLPROJECTGROUPDT_CODE == '0102'
      || this.dataAdd.PLPROJECTGROUPDT_CODE == '0101') {
      this.dataAdd.GCUNIT_ACODE = 'Z21';
      this.dataAdd.GCUNIT_BCODE = 'V04';
      this.dataAdd.GCUNIT_CCODE = 'Z19';
      this.dataAdd.PLPDT1 = 1;
      this.dataAdd.PLPDT2 = 1;
      this.dataAdd.PLPT1 = 'คน';
      this.dataAdd.PLPT2 = 'วัน';
      this.dataAdd.PLPT3 = 'ชั่วโมง';
      this.dataAdd.PLPT4 = '';
      this.dataAdd.moneydt = 1;
    }
    //ค่าเบี้ยเลี้ยง
    if (this.dataAdd.PLPROJECTGROUPDT_CODE == '0201') {
      this.dataAdd.GCUNIT_ACODE = 'Z21';
      this.dataAdd.GCUNIT_BCODE = 'V04';
      this.dataAdd.GCUNIT_CCODE = '';
      this.dataAdd.PLPDT1 = 1;
      this.dataAdd.PLPDT2 = '';
      this.dataAdd.PLPT1 = 'คน';
      this.dataAdd.PLPT2 = 'วัน';
      this.dataAdd.PLPT3 = '';
      this.dataAdd.PLPT4 = '';
      this.dataAdd.moneydt = 1;
    }
    //ค่าที่พัก
    if (this.dataAdd.PLPROJECTGROUPDT_CODE == '0203' || this.dataAdd.PLPROJECTGROUPDT_CODE == '0202'
      || this.dataAdd.PLPROJECTGROUPDT_CODE == '0211' || this.dataAdd.PLPROJECTGROUPDT_CODE == '0210') {
      this.dataAdd.GCUNIT_ACODE = 'V04';
      this.dataAdd.GCUNIT_BCODE = 'R05';
      this.dataAdd.GCUNIT_CCODE = '';
      this.dataAdd.PLPDT1 = 1;
      this.dataAdd.PLPDT2 = '';
      this.dataAdd.PLPT1 = 'วัน';
      this.dataAdd.PLPT2 = 'ห้อง';
      this.dataAdd.PLPT3 = '';
      this.dataAdd.PLPT4 = '';
      this.dataAdd.moneydt = 1;
    }
    //ค่าพาหนะ
    if (this.dataAdd.PLPROJECTGROUPDT_CODE == '0216' || this.dataAdd.PLPROJECTGROUPDT_CODE == '0208') {
      this.dataAdd.GCUNIT_ACODE = 'Z21';
      this.dataAdd.GCUNIT_BCODE = 'T00';
      this.dataAdd.GCUNIT_CCODE = '';
      this.dataAdd.PLPDT1 = 1;
      this.dataAdd.PLPDT2 = '';
      this.dataAdd.PLPT1 = 'คน';
      this.dataAdd.PLPT2 = 'เที่ยว';
      this.dataAdd.PLPT3 = '';
      this.dataAdd.PLPT4 = 1;
      this.dataAdd.moneydt = null;
    }
    //ค่าพาหนะส่วนตัว
    if (this.dataAdd.PLPROJECTGROUPDT_CODE == '0215') {
      this.dataAdd.GCUNIT_ACODE = 'Z22';
      this.dataAdd.GCUNIT_BCODE = 'T00';
      this.dataAdd.GCUNIT_CCODE = '';
      this.dataAdd.PLPDT1 = 1;
      this.dataAdd.PLPDT2 = '';
      this.dataAdd.PLPT1 = 'กิโลเมตร';
      this.dataAdd.PLPT2 = 'เที่ยว';
      this.dataAdd.PLPT3 = '';
      this.dataAdd.PLPT4 = 1;
      this.dataAdd.moneydt = 1;
    }
    //อื่นๆ
    if (this.dataAdd.PLPROJECTGROUPDT_CODE == '0401' || this.dataAdd.PLPROJECTGROUPDT_CODE == '0206'
      || this.dataAdd.PLPROJECTGROUPDT_CODE == '0217' || this.dataAdd.PLPROJECTGROUPDT_CODE == '0209'
      || this.dataAdd.PLPROJECTGROUPDT_CODE == '0305' || this.dataAdd.PLPROJECTGROUPDT_CODE == '0304'
      || this.dataAdd.PLPROJECTGROUPDT_CODE == '0302' || this.dataAdd.PLPROJECTGROUPDT_CODE == '0303'
      || this.dataAdd.PLPROJECTGROUPDT_CODE == '0301' || this.dataAdd.PLPROJECTGROUPDT_CODE == '0306'
    ) {
      this.dataAdd.GCUNIT_ACODE = '';
      this.dataAdd.GCUNIT_BCODE = '';
      this.dataAdd.GCUNIT_CCODE = '';
      this.dataAdd.PLPDT1 = '';
      this.dataAdd.PLPDT2 = '';
      this.dataAdd.PLPT1 = '';
      this.dataAdd.PLPT2 = '';
      this.dataAdd.PLPT3 = '';
      this.dataAdd.PLPT4 = 1;
      this.dataAdd.moneydt = null;
    }
    for (let i = 0; i < this.dataProjectdt.length; i++) {
      if (this.dataProjectdt[i].PLPROJECTGROUPDT_CODE == this.dataAdd.PLPROJECTGROUPDT_CODE) {
        this.dataAdd.PLPROJECTGROUPDT_MONEY = this.dataProjectdt[i].PLPROJECTGROUPDT_MONEYE;
      }

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
}
