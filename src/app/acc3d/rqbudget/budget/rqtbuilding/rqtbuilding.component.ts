import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { ApiPdoService } from '../../../../_services/api-pui.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TokenStorageService } from '../../../../_services/token-storage.service';
import { first, map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
//import { Editor, Toolbar } from 'ngx-editor';
//import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { UploadfileserviceService } from '../../../../acc3d/_services/uploadfileservice.service';
import Swal from 'sweetalert2';
import { auto } from '@popperjs/core';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
const editorConfig = {
  // ui: 'pt',
  // language: 'pt',
  toolbar: {
    items: [
      'bold',
      'italic',
      '|',
      'strikethrough',
      'code',
      '|', // Não tem ainda
      'bulletedList',
      'numberedList',
    ],
  },
};

@Component({
  selector: 'app-rqtbuilding',
  templateUrl: './rqtbuilding.component.html',
  styleUrls: ['./rqtbuilding.component.scss']
})
export class RqtbuildingComponent implements OnInit {
  name = 'Angular';
  editor = ClassicEditor;
  editorConfig = editorConfig;
  /*title = 'angular';
  public Editor = ClassicEditor;
*/
  // editor:any= Editor;
  /* toolbar: Toolbar = [
     ['bold'],
     ['underline', 'strike'],
     ['code', 'blockquote'],
     ['ordered_list', 'bullet_list'],
     [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
     ['link', 'image'],
     ['text_color', 'background_color'],
     ['align_left', 'align_center', 'align_right', 'align_justify'],
     
   ];*/
  //html = ""; 

  //htmlContent = '';

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
        'toggleEditorMode',
        'heading'/*,
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
    'fontName' */ ]
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
  datalist: any;
  rowpbi: any;
  rowpbu: any;
  loadingapp: any;
  datalistapp: any
  datalistregister: any
  dataCrpartregis: any;
  loadingimport: any;
  rownumregis: any;
  datastatus: any
  clickshow: any;
  afyear: any;
  filerequest: any;
  dataMyear: any;
  datalistimport: any;
  dataYearimport: any;
  rownumimport: any;
  url = "/acc3d/rqbudget/budget/rqbuilding.php";
  url1 = "/acc3d/rqbudget/userpermission.php";
  //dataAdd:any = {PRBOBJECT_NAME:[],PRBOBJECT_CODE:[],PRUSE_NAME:[],PRUSE_CODE:[]};
  dataAdd: any = { check: [], checkimport: [], IMPORTASSET_CODE: [], PRASSET_CODEA: [], checkregis: [], PRREGISBUILDING_CODE: [] };
  searchTerm: any;
  selectedDevice: any;
  loading: any;
  file: any;
  fileict: any;
  page = 1;
  count = 0;
  tableSize = 20;
  tableSizes = [20, 30, 40];
  tablemonth = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

  rownum: any;
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
    private Uploadfiles: UploadfileserviceService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    document.getElementById("ModalClose")?.click();
    this.fetchdata();
    this.rowpbi = null;
  }
  fetchdatalistcr() {
    this.dataAdd.opt = "viewcrpart";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        console.log(data);
        this.dataCrpart = data;
        this.dataAdd.CRPART_ID = '';// data[0].CRPART_ID;

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
            this.dataAdd.FFACULTY_CODE = data[0].FACULTY_CODE;
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
        this.dataAdd.PLINCOME_CODE = '';//data[0].PLINCOME_CODE;
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
        this.dataAdd.FPRYEARASSET_CODE = data[0].PLYEARBUDGET_CODE;
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
            this.dataAdd.CRPART_ID = datacr[0].CRPART_ID;
          });

      });
    //รายการปี
    var Tabley = {
      "opt": "viewyear"
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
    //ปีงบประมาณ
    var Tabletar = {
      "opt": "viewmyear"
    }
    this.apiService
      .getdata(Tabletar, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataMyear = data;
        this.dataAdd.PLYEARBUDGET_CODE = data[0].PLYEARBUDGET_CODE;
        this.onChangeyear();
      });
    this.dataAdd.opt = "readAll";
    this.dataAdd.CITIZEN_ID = this.tokenStorage.getUser().citizen;
  }
  // ฟังก์ขันสำหรับการดึงปีตามแผน
  onChangeyear() {
    //รายการปี
    this.dataAdd.opt = "viewyearduring";
    this.dataYear = null;
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataYear = data;
        this.fetchdatalist();
        //this.dataAdd.PRYEARASSET_CODE = data[0].PRYEARASSET_CODE;
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
            this.dataAdd.PRREGISBUILDING_CODE[i] = this.datalistregister[i].PRREGISBUILDING_CODE;
          }
        } else {
          this.datalistregister = data.data;
          this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูลทะเบียนครุภัณฑ์");
          this.rownumregis = null;
        }
      });
  }
  // ฟังก์ขันสำหรับการดึงข้อมูลครุภัณฑ์
  fetchdatalist() {
    this.dataAdd.opt = "readAll";
    this.loading = true;
    this.datalist = null;
    this.dataAdd.code
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == 1) {
          this.dataAdd.turnoff = data.turnoff;
          this.datalist = data.data;
          this.dataAdd.code = data.PLINCOMECODE;
          this.rownum = 'true';
          this.loading = null;
          // console.log('1');
        } else {
          this.dataAdd.turnoff = data.turnoff;
          this.datalist = data.data;
          this.loading = null;
          this.rownum = null;
          this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
        }
      });
  }
  insertdataapp(id: any) {
    this.dataAdd.PRBUILDING_RSTATUSA = id;
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
            this.dataAdd.PRASSET_CODEA[i] = this.datalistapp[i].PRBUILDING_CODE;

          }
        } else {
          this.datalistapp = data.data;
          this.loadingapp = null;
          this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
        }
      });
  }
  onChangecrpartrister() {
    //รายการวิชา
    this.dataAdd.opt = "viewcrpartregis";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataCrpartregis = data;
        //console.log(this.dataSub);
      });
  }
  // ฟังก์ขันสำหรับการเพิ่มข้อมูล/และแก้ไขข้อมูล
  insertdata() {
    // console.log(1);
    this.dataAdd.opt = "insert";
    /*  this.dataAdd.PRBUILDING_REASON = this.dataAdd.PRBUILDING_REASON.replaceAll("<br>", "<br/>"); 
      this.dataAdd.PRBUILDING_REASON = this.dataAdd.PRBUILDING_REASON.replaceAll("<p>", "<br/>"); 
      this.dataAdd.PRBUILDING_REASON = this.dataAdd.PRBUILDING_REASON.replaceAll("</p>", "");
      this.dataAdd.PRBUILDING_OBJECT = this.dataAdd.PRBUILDING_OBJECT.replaceAll("<br>", "<br/>"); 
      this.dataAdd.PRBUILDING_OBJECT = this.dataAdd.PRBUILDING_OBJECT.replaceAll("<p>", "<br/>"); 
      this.dataAdd.PRBUILDING_OBJECT = this.dataAdd.PRBUILDING_OBJECT.replaceAll("</p>", "");
      this.dataAdd.PRBUILDING_USE = this.dataAdd.PRBUILDING_USE.replaceAll("<br>", "<br/>"); 
      this.dataAdd.PRBUILDING_USE = this.dataAdd.PRBUILDING_USE.replaceAll("<p>", "<br/>"); 
      this.dataAdd.PRBUILDING_USE = this.dataAdd.PRBUILDING_USE.replaceAll("</p>", "");
      this.dataAdd.PRBUILDING_PDEVELOP = this.dataAdd.PRBUILDING_PDEVELOP.replaceAll("<br>", "<br/>"); 
      this.dataAdd.PRBUILDING_PDEVELOP = this.dataAdd.PRBUILDING_PDEVELOP.replaceAll("<p>", "<br/>"); 
      this.dataAdd.PRBUILDING_PDEVELOP = this.dataAdd.PRBUILDING_PDEVELOP.replaceAll("</p>", "");
      this.dataAdd.PRBUILDING_PEXCELL = this.dataAdd.PRBUILDING_PEXCELL.replaceAll("<br>", "<br/>"); 
      this.dataAdd.PRBUILDING_PEXCELL = this.dataAdd.PRBUILDING_PEXCELL.replaceAll("<p>", "<br/>"); 
      this.dataAdd.PRBUILDING_PEXCELL = this.dataAdd.PRBUILDING_PEXCELL.replaceAll("</p>", "");
      this.dataAdd.PRBUILDING_ANOTHER = this.dataAdd.PRBUILDING_ANOTHER.replaceAll("<br>", "<br/>"); 
      this.dataAdd.PRBUILDING_ANOTHER = this.dataAdd.PRBUILDING_ANOTHER.replaceAll("<p>", "<br/>"); 
      this.dataAdd.PRBUILDING_ANOTHER = this.dataAdd.PRBUILDING_ANOTHER.replaceAll("</p>", "");*/
    this.apiService
      .getupdate(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        //console.log(data);       
        if (data.status == 1) {
          this.toastr.success("แจ้งเตือน::เพิ่มข้อมูลเรียบร้อยแล้ว ");
          this.fetchdatalist();
          this.onChangerister();
          document.getElementById("ModalClose")?.click();
        } else {
          this.toastr.warning("แจ้งเตือน:ไม่สามารถเพิ่มข้อมูลได้");

        }
      });

  }

  // ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
  editdata(id: any) {
    this.setshowbti();
    /* this.setshowbti();
     this.apiService
     .getById(id,this.url)
     .pipe(first())
     .subscribe((data: any) => {
       //console.log(data);
       this.onChangedistrict(data[0].PROVINCE_ID);
       this.onChangesubdistrict(data[0].DISTRICT_ID);
     }); */
    this.apiService
      .getById(id, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        //this.onChangedistrict(data[0].PROVINCE_ID);
        //this.onChangesubdistrict(data[0].DISTRICT_ID);
        this.dataAdd.PRBUILDING_CODE = data[0].PRBUILDING_CODE;
        this.dataAdd.PRBUILDING_NAME = data[0].PRREGISBUILDING_NAME + ' ตำบล' + data[0].SUB_DISTRICT_NAME_TH + ' อำเภอ' + data[0].DISTRICT_NAME_TH + ' จังหวัด' + data[0].PROVINCE_TNAME;
        this.dataAdd.RPLINCOME_CODE = data[0].PLINCOME_CODE;
        this.onChangecrpartrister();
        this.dataAdd.RCRPART_ID = data[0].CRPART_ID;
        this.dataAdd.PRBUILDING_NUMBER = data[0].PRBUILDING_NUMBER;
        this.dataAdd.GCUNIT_CODE = data[0].GCUNIT_CODE;
        this.dataAdd.PRBUILDING_MONEY = this.numberWithCommas(Number(data[0].PRBUILDING_MONEY).toFixed(2));
        if (data[0].PRBUILDING_REASON != null) {
          this.dataAdd.PRBUILDING_REASON = data[0].PRBUILDING_REASON;
        }
        if (data[0].PRBUILDING_OBJECT != null) {
          this.dataAdd.PRBUILDING_OBJECT = data[0].PRBUILDING_OBJECT;
        }
        //this.dataAdd.PRBUILDING_PAT = data[0].PRBUILDING_PAT;
        //this.dataAdd.PRBUILDING_PRICE = data[0].PRBUILDING_PRICE;
        this.dataAdd.SLINK1 = data[0].PRBUILDING_PAT;
        this.dataAdd.SLINK2 = data[0].PRBUILDING_PRICE;
        this.dataAdd.SLINK3 = data[0].PRBUILDING_SLINK;
        if (data[0].PRBUILDING_USE != null) {
          this.dataAdd.PRBUILDING_USE = data[0].PRBUILDING_USE;
        }
        this.dataAdd.PLGPRODUCT_CODE = data[0].PLGPRODUCT_CODE;
        var gyear = new Date();
        let atf = (data[0].PRYEARASSET_CODE - 543) - gyear.getFullYear();
        if (atf > 2) {
          this.afyear = true;
        } else {
          this.afyear = null;
        }
        //this.dataAdd.PROVINCE_ID = data[0].PROVINCE_ID;
        // this.dataAdd.DISTRICT_ID = data[0].DISTRICT_ID;
        // this.dataAdd.SUB_DISTRICT_ID = data[0].SUB_DISTRICT_ID;
        //console.log(data[0].PLBUILDINGTYPE_CODE);
        this.dataAdd.PRBUILDING_TYPE = data[0].PLBUILDINGTYPE_CODE;
        this.dataAdd.PRBUILDING_YEAR = data[0].PRBUILDING_YEAR;
        this.dataAdd.PRBUILDING_SYEAR = data[0].PRBUILDING_SYEAR;
        if (data[0].PRBUILDING_SYEAR != null) {
          this.showbuid();
        }
        this.dataAdd.PRBUILDING_EYEAR = data[0].PRBUILDING_EYEAR;
        this.dataAdd.PRBUILDING_LOOK = data[0].PRBUILDING_LOOK;
        this.dataAdd.PRBUILDING_HEIGHT = data[0].PRBUILDING_HEIGHT;
        this.dataAdd.PRBUILDING_AREA = data[0].PRBUILDING_AREA;
        this.dataAdd.PRBUILDING_APRICE = this.numberWithCommas(Number(data[0].PRBUILDING_APRICE).toFixed(2));
        this.dataAdd.PRBUILDING_APRICET = data[0].PRBUILDING_APRICET;
        this.dataAdd.PRBUILDING_PMONTH = data[0].PRBUILDING_PMONTH;
        this.dataAdd.PRBUILDING_PYEAR = data[0].PRBUILDING_PYEAR;
        this.dataAdd.PRBUILDING_PSTEP = data[0].PRBUILDING_PSTEP;
        this.dataAdd.PRBUILDING_EPRICE = this.numberWithCommas(Number(data[0].PRBUILDING_EPRICE).toFixed(2));
        this.dataAdd.PRBUILDING_ESTIMATE = data[0].PRBUILDING_ESTIMATE;
        this.dataAdd.PRBUILDING_EMONTH = data[0].PRBUILDING_EMONTH;
        this.dataAdd.PRBUILDING_EAYEAR = data[0].PRBUILDING_EAYEAR;
        this.dataAdd.PRBUILDING_ESTEP = data[0].PRBUILDING_ESTEP;
        this.dataAdd.PRBUILDING_SMONTH = data[0].PRBUILDING_SMONTH;
        this.dataAdd.PRBUILDING_SAYEAR = data[0].PRBUILDING_SAYEAR;
        this.dataAdd.PRBUILDING_METHOD = data[0].PRBUILDING_METHOD;
        this.dataAdd.PRBUILDING_PATTERN = data[0].PRBUILDING_PATTERN;
        this.dataAdd.PRBUILDING_ESTIMATE = data[0].PRBUILDING_ESTIMATE;
        this.dataAdd.PRBUILDING_PDEVELOP = data[0].PRBUILDING_PDEVELOP;
        this.dataAdd.PRBUILDING_PEXCELL = data[0].PRBUILDING_PEXCELL;
        this.dataAdd.PRBUILDING_ANOTHER = data[0].PRBUILDING_ANOTHER;
        this.dataAdd.PRBUILDING_SUPPORT = data[0].PRBUILDING_SUPPORT;
        this.dataAdd.PRBUILDING_T1 = data[0].PRBUILDING_T1;
        this.dataAdd.PRBUILDING_T2 = data[0].PRBUILDING_T2;
        this.dataAdd.PRBUILDING_SMONEY = this.numberWithCommas(Number(data[0].PRBUILDING_SMONEY).toFixed(2));
        let deviceValue = data[0].PRBUILDING_MONEY;
        let devicenum = data[0].PRBUILDING_NUMBER;
        if (data[0].PRBUILDING_TYPE == '2') {
          this.setshowmoney(data[0].PRBUILDING_MONEY, data[0].PRBUILDING_NUMBER);
          if (data[0].PRBUILDING_YEAR == '3') {
            this.dataAdd.PRBUILDING_SYEAR1 = data[0].PRBUILDING_SYEAR;
            this.dataAdd.PRBUILDING_SYEAR2 = Number(data[0].PRBUILDING_SYEAR) + 1;
            this.dataAdd.PRBUILDING_SYEAR3 = Number(data[0].PRBUILDING_SYEAR) + 2;
            this.dataAdd.PRBUILDING_MONEY1 = this.numberWithCommas(Number((deviceValue * devicenum) - (deviceValue * devicenum) * 5 / 100) * 20 / 100);
            this.dataAdd.PRBUILDING_MONEY2 = this.numberWithCommas(Number(((deviceValue * devicenum) - (deviceValue * devicenum) * 5 / 100) - ((deviceValue * devicenum) - (deviceValue * devicenum) * 5 / 100) * 20 / 100) / 2);
            this.dataAdd.PRBUILDING_MONEY3 = this.numberWithCommas(Number(((deviceValue * devicenum) - (deviceValue * devicenum) * 5 / 100) - ((deviceValue * devicenum) - (deviceValue * devicenum) * 5 / 100) * 20 / 100) / 2);
          }
          if (data[0].PRBUILDING_YEAR == '2') {
            this.dataAdd.PRBUILDING_SYEAR1 = data[0].PRBUILDING_SYEAR;
            this.dataAdd.PRBUILDING_SYEAR2 = Number(data[0].PRBUILDING_SYEAR) + 1;
            this.dataAdd.PRBUILDING_MONEY1 = this.numberWithCommas(Number((deviceValue * devicenum) - (deviceValue * devicenum) * 5 / 100) * 20 / 100);
            this.dataAdd.PRBUILDING_MONEY2 = this.numberWithCommas(Number((deviceValue * devicenum) - (deviceValue * devicenum) * 5 / 100) - ((deviceValue * devicenum) - (deviceValue * devicenum) * 5 / 100) * 20 / 100);
          }
        }

        // console.log(this.rowpbu);
        /* //รายการวัตถุประสงค์
         var Table = {
           "opt": "viewTable",
           "Table":"PRBOBJECT where  PRBUILDING_CODE='"+data[0].PRBUILDING_CODE+"'"
         }
         this.apiService
         .getdata(Table,this.url1)
         .pipe(first())
         .subscribe((data: any) => {
           for(var i=0;i<3;i++)
           {
            
           this.dataAdd.PRBOBJECT_CODE[i] = 0;
           }
           if(data.length >0){
          for(var i=0;i<data.length;i++)
          {
           this.dataAdd.PRBOBJECT_NAME[i] = data[i].PRBOBJECT_NAME;
           this.dataAdd.PRBOBJECT_CODE[i] = data[i].PRBOBJECT_CODE;
          }
         }   
          });  
         */
        /*  //รายการประโยชน์ใช้สอย
          var Table = {
           "opt": "viewTable",
           "Table":"PRUSE where  PRBUILDING_CODE='"+data[0].PRBUILDING_CODE+"'"
         }
         this.apiService
         .getdata(Table,this.url1)
         .pipe(first())
         .subscribe((data: any) => {
           for(var i=0;i<3;i++)
           {
            
           this.dataAdd.PRUSE_CODE[i] = 0;
           }
         if(data.length >0){
         for(var i=0;i<data.length;i++)
          {
           
          this.dataAdd.PRUSE_NAME[i] = data[i].PRUSE_NAME;
          this.dataAdd.PRUSE_CODE[i] = data[i].PRUSE_CODE;
          }
         }
             
         }); */


      });
  }
  //เช็คตัวเลข
  CheckNum(num: any) {
    if (num.keyCode < 46 || num.keyCode > 57) {
      alert('กรุณากรอกข้อมูล ที่เป็นตัวเลข');
      num.returnValue = false;
    }
  }
  keymon() {
    this.dataAdd.PRBUILDING_SMONEY = this.dataAdd.PRBUILDING_MONEY;
  }
  // ฟังก์ชันสิ่งก่อสร้างผูกพันใหม่
  showbuid() {
    let deviceValue = this.dataAdd.PRBUILDING_MONEY.replace(/,/g, "");
    let devicenum = this.dataAdd.PRBUILDING_NUMBER.replace(/,/g, "");
    this.dataAdd.PRBUILDING_SMONEY = this.numberWithCommas(deviceValue * devicenum);
    if (this.dataAdd.PRBUILDING_YEAR == '2') {
      this.dataAdd.PRBUILDING_EYEAR = Number(this.dataAdd.PRBUILDING_SYEAR) + 1;
      this.setshowmoney(deviceValue, devicenum);
      this.dataAdd.PRBUILDING_SYEAR1 = this.dataAdd.PRBUILDING_SYEAR;
      this.dataAdd.PRBUILDING_SYEAR2 = Number(this.dataAdd.PRBUILDING_SYEAR) + 1;
      this.dataAdd.PRBUILDING_MONEY1 = this.numberWithCommas(Number((deviceValue * devicenum) - (deviceValue * devicenum) * 5 / 100) * 20 / 100);
      this.dataAdd.PRBUILDING_MONEY2 = this.numberWithCommas(Number((deviceValue * devicenum) - (deviceValue * devicenum) * 5 / 100) - ((deviceValue * devicenum) - (deviceValue * devicenum) * 5 / 100) * 20 / 100);
      this.dataAdd.PRBUILDING_SYEAR3 = '';
      this.dataAdd.PRBUILDING_MONEY3 = '';
    }
    if (this.dataAdd.PRBUILDING_YEAR == '3') {
      this.dataAdd.PRBUILDING_EYEAR = Number(this.dataAdd.PRBUILDING_SYEAR) + 2;
      this.setshowmoney(deviceValue, devicenum);
      this.dataAdd.PRBUILDING_SYEAR1 = this.dataAdd.PRBUILDING_SYEAR;
      this.dataAdd.PRBUILDING_SYEAR2 = Number(this.dataAdd.PRBUILDING_SYEAR) + 1;
      this.dataAdd.PRBUILDING_SYEAR3 = Number(this.dataAdd.PRBUILDING_SYEAR) + 2;
      this.dataAdd.PRBUILDING_MONEY1 = this.numberWithCommas(Number((deviceValue * devicenum) - (deviceValue * devicenum) * 5 / 100) * 20 / 100);
      this.dataAdd.PRBUILDING_MONEY2 = this.numberWithCommas(Number(((deviceValue * devicenum) - (deviceValue * devicenum) * 5 / 100) - ((deviceValue * devicenum) - (deviceValue * devicenum) * 5 / 100) * 20 / 100) / 2);
      this.dataAdd.PRBUILDING_MONEY3 = this.numberWithCommas(Number(((deviceValue * devicenum) - (deviceValue * devicenum) * 5 / 100) - ((deviceValue * devicenum) - (deviceValue * devicenum) * 5 / 100) * 20 / 100) / 2);
    }
  }
  setshowmoney(deviceValue: any, devicenum: any) {
    this.dataAdd.PRBUILDING_MONEYT = this.numberWithCommas(deviceValue * devicenum);
    this.dataAdd.PRBUILDING_MONEYD = this.numberWithCommas((deviceValue * devicenum) - (deviceValue * devicenum) * 5 / 100);
    this.dataAdd.PRBUILDING_MONEYP = this.numberWithCommas((deviceValue * devicenum) * 5 / 100);

  }

  // ฟังก์ชัน โชว์ปุ่ม
  showinputin() {
    this.rowpbi = 1;
    this.updatedata1();
  }
  // ฟังก์ชัน โชว์ปุ่ม
  showinputinnull() {
    this.rowpbi = null;
    this.updatedata1();
  }

  numberWithCommas(x: any) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
  onChange(event: any) {
    this.file = event.target.files[0];
  }
  onChangeict(event: any) {
    this.fileict = event.target.files[0];
  }
  onChangerequest(event: any) {
    this.filerequest = event.target.files[0];
  }
  //แก้ไขข้อมูล
  updatedata() {

    /*if(this.dataAdd.RPLINCOME_CODE =='' || this.dataAdd.RCRPART_ID =='' || this.dataAdd.PLGPRODUCT_CODE =='' 
     || this.dataAdd.PRBUILDING_NUMBER =='' || this.dataAdd.PRBUILDING_MONEY ==''
    || this.dataAdd.PRBUILDING_REASON ==''|| this.dataAdd.PRBUILDING_OBJECT ==''|| this.dataAdd.PRBUILDING_USE ==''
    || this.dataAdd.PRBUILDING_LOOK =='' || this.dataAdd.PRBUILDING_HEIGHT ==''|| this.dataAdd.PRBUILDING_AREA ==''|| this.dataAdd.PRBUILDING_APRICE =='' 
    || this.dataAdd.PRBUILDING_METHOD ==''|| this.dataAdd.PRBUILDING_PATTERN ==''|| this.dataAdd.PRBUILDING_ESTIMATE ==''
    || this.dataAdd.PRBUILDING_SMONTH ==''|| this.dataAdd.PRBUILDING_SAYEAR ==''
    || this.dataAdd.PRBUILDING_PAT ==''|| this.dataAdd.PRBUILDING_PRICE ==''){*/
    /*  if(this.dataAdd.RPLINCOME_CODE ==''){
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกแหล่งเงิน");
       }
       if(this.dataAdd.RCRPART_ID ==''){
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกภาคเงิน");
       }
       if(this.dataAdd.PLGPRODUCT_CODE ==''){
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกผลผลิต/โครงการ");
       } 
       if(this.dataAdd.PRBUILDING_NUMBER ==''){
        this.toastr.warning("แจ้งเตือน:กรุณากรอกจำนวนสิ่งก่อสร้าง");
       } 
       if(this.dataAdd.PRBUILDING_MONEY ==''){
        this.toastr.warning("แจ้งเตือน:กรุณากรอกจำนวนเงิน");
       } 
       if(this.dataAdd.PRBUILDING_REASON ==''){
        this.toastr.warning("แจ้งเตือน:กรุณากรอกเหตุผลความจำเป็น ");
       } 
       if(this.dataAdd.PRBUILDING_OBJECT ==''){
        this.toastr.warning("แจ้งเตือน:กรุณากรอกวัตถุประสงค์");
       }
       if(this.dataAdd.PRBUILDING_USE ==''){
        this.toastr.warning("แจ้งเตือน:กรุณากรอกประโยชน์ใช้สอย");
       }
       if(this.dataAdd.PRBUILDING_LOOK ==''){
        this.toastr.warning("แจ้งเตือน:กรุณากรอกลักษณะอาคาร");
       } 
       if(this.dataAdd.PRBUILDING_HEIGHT ==''){
        this.toastr.warning("แจ้งเตือน:กรุณากรอกความสูงของอาคาร");
       } 
       if(this.dataAdd.PRBUILDING_AREA ==''){
        this.toastr.warning("แจ้งเตือน:กรุณากรอกพื้นที่ของอาคาร");
       }
       if(this.dataAdd.PRBUILDING_APRICE ==''){
        this.toastr.warning("แจ้งเตือน:กรุณากรอกตร.ม.ราคาประเมินต่อตารางเมตร");
       }
       if(this.dataAdd.PRBUILDING_METHOD ==''){
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกวิธีการจัดทำแบบรูปรายการ");
       }
       if(this.dataAdd.PRBUILDING_PATTERN ==''){
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกแบบรูปรายการ");
       }
       if(this.dataAdd.PRBUILDING_ESTIMATE ==''){
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกราคาประมาณการ(ฺBOQ)");
       }
       if(this.dataAdd.PRBUILDING_SMONTH ==''){
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกเดือนที่ทำสัญญา");
       }
       if(this.dataAdd.PRBUILDING_SAYEAR ==''){
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกเลือกปีที่ทำสัญญา");
       }
       if(this.dataAdd.PRBUILDING_PAT ==''|| this.dataAdd.PRBUILDING_PRICE ==''){
        this.toastr.warning("แจ้งเตือน:กรุณาแนบ link");
       }*/
    // }else{
    // console.log(1);
    this.dataAdd.opt = "update";
    if (this.dataAdd.PRBUILDING_REASON != '') {
      this.dataAdd.PRBUILDING_REASON = this.dataAdd.PRBUILDING_REASON.replaceAll("<br>", "<br/>");
      this.dataAdd.PRBUILDING_REASON = this.dataAdd.PRBUILDING_REASON.replaceAll("<p>", "");
      this.dataAdd.PRBUILDING_REASON = this.dataAdd.PRBUILDING_REASON.replaceAll("</p>", "<br/>");
      this.dataAdd.PRBUILDING_REASON = this.dataAdd.PRBUILDING_REASON.replaceAll("&nbsp;", "");
    }
    if (this.dataAdd.PRBUILDING_OBJECT != '') {
      this.dataAdd.PRBUILDING_OBJECT = this.dataAdd.PRBUILDING_OBJECT.replaceAll("<br>", "<br/>");
      this.dataAdd.PRBUILDING_OBJECT = this.dataAdd.PRBUILDING_OBJECT.replaceAll("<p>", "");
      this.dataAdd.PRBUILDING_OBJECT = this.dataAdd.PRBUILDING_OBJECT.replaceAll("</p>", "<br/>");
      this.dataAdd.PRBUILDING_OBJECT = this.dataAdd.PRBUILDING_OBJECT.replaceAll("&nbsp;", "");
    }
    if (this.dataAdd.PRBUILDING_USE != '') {
      this.dataAdd.PRBUILDING_USE = this.dataAdd.PRBUILDING_USE.replaceAll("<br>", "<br/>");
      this.dataAdd.PRBUILDING_USE = this.dataAdd.PRBUILDING_USE.replaceAll("<p>", "");
      this.dataAdd.PRBUILDING_USE = this.dataAdd.PRBUILDING_USE.replaceAll("</p>", "<br/>");
      this.dataAdd.PRBUILDING_USE = this.dataAdd.PRBUILDING_USE.replaceAll("&nbsp;", "");
    }


    //console.log(this.dataAdd.PRBOBJECT_NAME); 
    this.apiService
      .getupdate(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == 1) {
          this.toastr.success("แจ้งเตือน:แก้ไขข้อมูลเรียบร้อยแล้ว");
          this.Uploadfiles.uploadbuilrq(this.file, this.fileict, this.filerequest, this.dataAdd.PLYEARBUDGET_CODE, this.dataAdd.FACULTY_CODE, this.dataAdd.PRBUILDING_CODE)
            .subscribe((event: any) => {

              //console.log(event.type);
            }
            );
          this.fetchdatalist();
          this.editdata(this.dataAdd.PRBUILDING_CODE);
          this.rowpbi = null;
          //document.getElementById("ModalClose")?.click();
        } else if (data.status == 0) {
          this.toastr.warning("แจ้งเตือน:กรุณากรอกเหตุผลความจำเป็นอย่างน้อย 1 หน้ากระดาษ");
        }
      });
    // }
  }
  //แก้ไขข้อมูล
  updatedata1() {
    this.Uploadfiles.upload(this.file, this.fileict, this.dataAdd.PRYEARASSET_CODE, this.dataAdd.FACULTY_CODE, this.dataAdd.PRBUILDING_CODE)
      .subscribe((event: any) => {

        //console.log(event.type);
      }
      );

    this.dataAdd.opt = "update";
    if (this.dataAdd.PRBUILDING_REASON != '') {
      this.dataAdd.PRBUILDING_REASON = this.dataAdd.PRBUILDING_REASON.replaceAll("<br>", "<br/>");
      this.dataAdd.PRBUILDING_REASON = this.dataAdd.PRBUILDING_REASON.replaceAll("<p>", "<br/>");
      this.dataAdd.PRBUILDING_REASON = this.dataAdd.PRBUILDING_REASON.replaceAll("</p>", "");
    }
    if (this.dataAdd.PRBUILDING_OBJECT != '') {
      this.dataAdd.PRBUILDING_OBJECT = this.dataAdd.PRBUILDING_OBJECT.replaceAll("<br>", "<br/>");
      this.dataAdd.PRBUILDING_OBJECT = this.dataAdd.PRBUILDING_OBJECT.replaceAll("<p>", "<br/>");
      this.dataAdd.PRBUILDING_OBJECT = this.dataAdd.PRBUILDING_OBJECT.replaceAll("</p>", "");
    }
    if (this.dataAdd.PRBUILDING_USE != '') {
      this.dataAdd.PRBUILDING_USE = this.dataAdd.PRBUILDING_USE.replaceAll("<br>", "<br/>");
      this.dataAdd.PRBUILDING_USE = this.dataAdd.PRBUILDING_USE.replaceAll("<p>", "<br/>");
      this.dataAdd.PRBUILDING_USE = this.dataAdd.PRBUILDING_USE.replaceAll("</p>", "");
    }


    //console.log(this.dataAdd.PRBOBJECT_NAME); 
    this.apiService
      .getupdate(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == 1) {
          // this.toastr.success("แจ้งเตือน:แก้ไขข้อมูลเรียบร้อยแล้ว");
          this.fetchdatalist();
          this.rowpbi = null;
          //document.getElementById("ModalClose")?.click();
        } else if (data.status == 0) {
          this.toastr.warning("แจ้งเตือน:กรุณากรอกเหตุผลความจำเป็นอย่างน้อย 1 หน้ากระดาษ");
        }
      });
    // }
  }
  //แก้ไขข้อมูล
  updatefile(id: any, value: any) {
    this.dataAdd.id = id;
    this.dataAdd.file = value;
    this.dataAdd.opt = "updatefile";
    this.apiService
      .getupdate(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == 1) {
          this.toastr.success("แจ้งเตือน:ลบไฟล์เรียบร้อยแล้ว");
          this.editdata(id);
          this.fetchdatalist();
          // document.getElementById("ModalClose")?.click();
        }
      });
    //}      
  }
  editdatafile(id: any) {
    this.dataAdd.SLINK1 = '';
    this.dataAdd.SLINK2 = '';
    this.dataAdd.SLINK3 = '';
    this.apiService
      .getById(id, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataAdd.SLINK1 = data[0].PRBUILDING_PAT;
        this.dataAdd.SLINK2 = data[0].PRBUILDING_PRICE;
        this.dataAdd.SLINK3 = data[0].PRBUILDING_SLINK;
      });
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

  // ฟังก์ชันสำหรับการลบข้อมูล
  deleteData(id: any) {
    this.dataAdd.opt = "delete";
    this.dataAdd.id = id;
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
              this.fetchdatalist();
            }
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('ยกเลิก', 'ยกเลิกการลบข้อมูล', 'error');
      }
    });
  }

  setshowbti() {
    this.dataAdd.PLGPRODUCT_CODE = '';
    this.dataAdd.PROVINCE_ID = '';
    this.dataAdd.DISTRICT_ID = '';
    this.dataAdd.SUB_DISTRICT_ID = '';
    this.dataAdd.PLSUBMONEYPAY_CODE = '';
    this.dataAdd.PRBUILDING_NAME = '';
    this.dataAdd.PRBUILDING_NUMBER = '';
    this.dataAdd.GCUNIT_CODE = '';
    this.dataAdd.PRBUILDING_MONEY = '';
    this.dataAdd.PRBUILDING_TYPE = '';
    this.dataAdd.PRBUILDING_YEAR = '';
    this.dataAdd.PRBUILDING_SYEAR = '';
    this.dataAdd.PRBUILDING_EYEAR = '';
    this.dataAdd.PRBUILDING_REASON = '';
    this.dataAdd.PRBUILDING_OBJECT = '';
    this.dataAdd.PRBUILDING_USE = '';
    this.dataAdd.PRBUILDING_PDEVELOP = '';
    this.dataAdd.PRBUILDING_PEXCELL = '';
    this.dataAdd.PRBUILDING_ANOTHER = '';
    this.dataAdd.PRBUILDING_SUPPORT = '';
    this.dataAdd.PRBUILDING_SLINK = '';
    this.dataAdd.PRBUILDING_PAT = '';
    this.dataAdd.PRBUILDING_PRICE = '';
    this.dataAdd.PRBUILDING_APRICET = 'ตารางเมตร';
    this.dataAdd.SLINK1 = '';
    this.dataAdd.SLINK2 = '';
    this.dataAdd.SLINK3 = '';
    /*this.dataAdd.PRBOBJECT_NAME[0] = '';PRBUILDING_PDEVELOP
    this.dataAdd.PRBOBJECT_NAME[1] = '';
    this.dataAdd.PRBOBJECT_NAME[2] = '';
    this.dataAdd.PRBOBJECT_CODE[0] = '';
    this.dataAdd.PRBOBJECT_CODE[1] = '';
    this.dataAdd.PRBOBJECT_CODE[2] = '';
    this.dataAdd.PRUSE_NAME[0] = '';
    this.dataAdd.PRUSE_NAME[1] = '';
    this.dataAdd.PRUSE_NAME[2] = '';
    this.dataAdd.PRUSE_CODE[0] = '';
    this.dataAdd.PRUSE_CODE[1] = '';
    this.dataAdd.PRUSE_CODE[2] = '';*/
    this.dataAdd.PRBUILDING_LOOK = '';
    this.dataAdd.PRBUILDING_HEIGHT = '';
    this.dataAdd.PRBUILDING_AREA = '';
    this.dataAdd.PRBUILDING_APRICE = '';
    this.dataAdd.PRBUILDING_METHOD = '';
    this.dataAdd.PRBUILDING_PATTERN = '';
    this.dataAdd.PRBUILDING_PMONTH = '';
    this.dataAdd.PRBUILDING_PYEAR = '';
    this.dataAdd.PRBUILDING_PSTEP = '';
    this.dataAdd.PRBUILDING_ESTIMATE = '';
    this.dataAdd.PRBUILDING_EMONTH = '';
    this.dataAdd.PRBUILDING_EAYEAR = '';
    this.dataAdd.PRBUILDING_ESTEP = '';
    this.dataAdd.PRBUILDING_SMONTH = '';
    this.dataAdd.PRBUILDING_SAYEAR = '';
    this.dataAdd.PRBUILDING_MONEYT = '';
    this.dataAdd.PRBUILDING_MONEYD = '';
    this.dataAdd.PRBUILDING_MONEYP = '';
    this.dataAdd.PRBUILDING_SYEAR1 = '';
    this.dataAdd.PRBUILDING_MONEY1 = '';
    this.dataAdd.PRBUILDING_SYEAR2 = '';
    this.dataAdd.PRBUILDING_MONEY2 = '';
    this.dataAdd.PRBUILDING_SYEAR3 = '';
    this.dataAdd.PRBUILDING_MONEY3 = '';
    this.dataAdd.PRBUILDING_EPRICE = '';
    this.dataAdd.PRBUILDING_T1 = '';
    this.dataAdd.PRBUILDING_T2 = '';
    this.dataAdd.searchregis = '';

  }
  cleartextbox() {
    this.dataAdd.PRBUILDING_YEAR = '';
    this.dataAdd.PRBUILDING_SYEAR = '';
    this.dataAdd.PRBUILDING_EYEAR = '';
    this.dataAdd.PRBUILDING_MONEYT = '';
    this.dataAdd.PRBUILDING_MONEYD = '';
    this.dataAdd.PRBUILDING_MONEYP = '';
    this.dataAdd.PRBUILDING_SYEAR1 = '';
    this.dataAdd.PRBUILDING_MONEY1 = '';
    this.dataAdd.PRBUILDING_SYEAR2 = '';
    this.dataAdd.PRBUILDING_MONEY2 = '';
    this.dataAdd.PRBUILDING_SYEAR3 = '';
    this.dataAdd.PRBUILDING_MONEY3 = '';
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
        // this.dataAdd.DISTRICT_ID  = data[0];
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
        // this.dataAdd.SUB_DISTRICT_ID  = data[0];

      });
    //console.log(Value);    
  }


  // ฟังก์ชัน cnk
  setcnk(i: any, ev: any, val: any) {

    if (ev.target.checked) {
      this.dataAdd.PROBJECT_CODE[i] = val;
    } else {
      this.dataAdd.PROBJECT_CODE[i] = '';
    }
  }
  fetchclose() {
    this.clickshow = null;
  }
  showapp(code: any, name: any) {
    this.clickshow = true;
    this.dataAdd.PRBUILDING_CODE = code;
    this.dataAdd.htmlStringd = name;
    this.dataAdd.PRASSETFAC_NOTE = '';
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
  insertdataimport() {
    //console.log(this.dataAdd.PRASSET_COURSET );
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
            this.toastr.success("แจ้งเตือน:เพิ่มข้อมูลเรียบร้อยแล้ว");
            this.fetchdatalist();
            document.getElementById("ModalClose")?.click();
          }
        });
    }
  }
  // ฟังก์ขันสำหรับการดึงปีการนำเข้า
  onChangeyearimport() {
    this.dataAdd.searchimport = '';
    //รายการปี
    this.dataAdd.opt = "viewyearduringimport";
    this.dataYearimport = null;
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataYearimport = data;
        this.dataAdd.IMPRYEARASSET_CODE = data[0].PLYEARBUDGET_CODE;
        this.fetchdatalistimport();
      });
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
  // ฟังก์ชัน การแสดงข้อมูลตามต้องการ
  onTableDataChange(event: any) {
    this.page = event;
    this.fetchdatalist();
  }
  showstep(name: any) {
    //console.log(name);
    this.dataAdd.PRSTATUS_PSTATUS = name;
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.fetchdatalist();
  }
  fixedEncode(str: any) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
      return '%' + c.charCodeAt(0).toString(16).toUpperCase();
    });
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
