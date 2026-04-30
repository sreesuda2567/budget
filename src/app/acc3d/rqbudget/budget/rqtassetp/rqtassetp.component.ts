import { Component, OnInit, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ApiPdoService } from '../../../../_services/api-pui.service';
import { TokenStorageService } from '../../../../_services/token-storage.service';
import { first, map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { auto } from '@popperjs/core';
import { UploadfileserviceService } from '../../../../acc3d/_services/uploadfileservice.service';
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
  selector: 'app-rqtassetp',
  templateUrl: './rqtassetp.component.html',
  styleUrls: ['./rqtassetp.component.scss']
})
export class RqtassetpComponent implements OnInit {
 name = 'Angular';
  editor = ClassicEditor;
  editorConfig = editorConfig;

  selected: string = "";
  htmlContent = '';

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
  dataMyear: any;
  dataUnit: any;
  dataProduct: any;
  dataAssettype: any;
  dataProvince: any;
  dataSubdistrict: any;
  dataDistrict: any;
  dataTagget: any;
  dataSection: any;
  datatype: any;
  dataCourse: any;
  dataSub: any;
  dataPsub: any = [];
  datalist: any;
  dataspec: any;
  rowpbi: any;
  rowpbu: any;
  rowict: any;
  loadingapp: any;
  loadingimport: any;
  datalistapp: any;
  datalistregister: any;
  datastatus: any;
  dataFacsub: any;
  dataCam: any;
  datMyear: any;
  dataYearimport: any;
  rownumimport: any;
  url = "/acc3d/rqbudget/budget/rqassetp.php";
  url1 = "/acc3d/rqbudget/userpermission.php";
  dataAdd: any = { check: [], checkregis: [], checkimport: [], IMPORTASSET_CODE: [], PRREGISASSET_CODE: [], PRASSET_CODEA: [], SECTION_CODE: [], PRASSETSEC_CODE: [], List: [], List1: [] };
  searchTerm: any;
  selectedDevice: any;
  loading: any;
  dynamicVariable: any;
  ict: any;
  ictlink: any;
  probject: any;
  probjectot: any;
  afyear: any;
  page = 1;
  count = 0;
  number = 0;
  tableSize = 20;
  tableSizes = [20, 30, 40];
  formModal_del: any;
  tablemonth = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
  dataYearp: any;
  rownum: any;
  rownumregis: any;
  rownumspec: any;
  dataIncomeregis: any;
  dataCrpartregis: any;
  clickshow: any;
  file: any;
  fileict: any;
  filerequest: any;
  filespec: any;
  datalistimport: any;
  constructor(
    private tokenStorage: TokenStorageService,
    private apiService: ApiPdoService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private eRef: ElementRef,
    private formBuilder: FormBuilder,
    private Uploadfiles: UploadfileserviceService
  ) { }

  ngOnInit(): void {
      document.getElementById("ModalClose")?.click();
    this.fetchdata();
    this.rowpbi = null;
    this.rowict = '';
    this.ict = false;
    this.ictlink = true;
    this.probject = true;
    this.probjectot = true;
    this.dataAdd.CITIZEN_ID = this.tokenStorage.getUser().citizen;
    this.dataAdd.campusid = '43';
    this.dataAdd.g_search = 'coursename';
    this.fetchdataCam();  
  }
showHide() {
    if (this.dataAdd.RPLINCOME_CODE == '02') {
      this.dataAdd.PRASSET_TYPE = '3';
      this.rowict = true;
      // this.afyear=true;
    } else {
      this.ictlink = false;
      this.rowict = null;
      //this.afyear=null;
    }
  }
  //ภาคเงิน
  fetchdatalistcr() {
    this.dataAdd.opt = "viewcrpart";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        //  console.log(data);
        this.dataCrpart = data;
        this.dataAdd.CRPART_ID = data[0].CRPART_ID;

      });
  }

  keyword = 'name';
  datacomplete = [];

  selectEvent(item: any, num: any) {
    if (num == 1) {
      this.dataAdd.CITIZEN_IDA = item.id;
    } else if (num == 2) {
      this.dataAdd.CITIZEN_IDB = item.id;
    } else if (num == 3) {
      this.dataAdd.CITIZEN_IDC = item.id;
    } else {
      this.dataAdd.CRSUBJECT_CODE = item.id;
      this.dataAdd.CRSUBJECT_NAME = item.name;
    }
  }
  onChangeSearch(val: string) {
    var varP = {
      "opt": "viewperson",
      "search": val
    }
    this.apiService
      .getdata(varP, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.datacomplete = data;
        // console.log(data);
      });
  }
  onChangeSearchas(val: string) {
    var varP = {
      "opt": "viewsub",
      "search": val,
      "CITIZEN_ID": this.tokenStorage.getUser().citizen,
      "g_faculty": this.dataAdd.g_faculty,
      "campusid": this.dataAdd.campusid,
      "g_search": this.dataAdd.g_search
    }
    this.apiService
      .getdata(varP, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.datacomplete = data;
        // console.log(data);
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
          .subscribe((datafac: any) => {
            this.dataFac = datafac;
            // console.log(data[0].FACULTY_CODE);
            this.dataAdd.FACULTY_CODE = datafac[0].FACULTY_CODE;
            this.dataAdd.FFACULTY_CODE = datafac[0].FACULTY_CODE;
            this.fetchdatalist();
            //รายการหลักสูตร
            var Tablesec = {
              "opt": "viewsection",
              "fac": datafac[0].FACULTY_CODE
            }
            //console.log(Tablesec);
            this.apiService
              .getdata(Tablesec, this.url1)
              .pipe(first())
              .subscribe((data: any) => {
                this.dataSection = data;
                for (let i = 0; i < this.dataSection.length; i++) {
                  this.dataAdd.SECTION_CODE[i] = this.dataSection[i].SECTION_CODE;
                  this.dataAdd.PRASSETSEC_CODE[i] = 0;
                  this.dataAdd.check[i] = 0;
                }
              });
            //รายการวิชา
            var Tablesub = {
              "opt": "viewsubject",
              "PRASSET_SEARCH": "",
              "FACULTY_CODE": datafac[0].FACULTY_CODE
            }
            // console.log(Tablesub);
            this.apiService
              .getdata(Tablesub, this.url1)
              .pipe(first())
              .subscribe((data: any) => {
                this.dataSub = data;
                //console.log(this.dataSub);
              });

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
        this.dataAdd.PLINCOME_CODE = ''; //data[0].PLINCOME_CODE;
        // this.showHide('dataAdd.type',this.dataAdd.PLINCOME_CODE);
        // console.log(data[0].PLINCOME_CODE);
      });

    //รายการปี
    var Tabley = {
      "opt": "viewyear"
    }
    this.apiService
      .getdata(Tabley, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        //  console.log(data);
        // this.dataYear = data;
        this.dataAdd.PRYEARASSET_CODE = data[0].PLYEARBUDGET_CODE;
        this.dataAdd.FPRYEARASSET_CODE = data[0].PLYEARBUDGET_CODE;
        //รายการภาค
        var Table2 = {
          "opt": "viewcrpart",
          "PRYEARASSET_CODE": data[0].PLYEARBUDGET_CODE,
          "FACULTY_CODE": "",
          "PLINCOME_CODE": "01"
        }
        //  console.log(Table2);
        this.apiService
          .getdata(Table2, this.url1)
          .pipe(first())
          .subscribe((datacr: any) => {
            console.log(datacr);
            this.dataCrpart = datacr;
            this.dataAdd.CRPART_ID = '';//datacr[0].CRPART_ID;
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
    //ความสอดคล้องกับเป้าหมายประเทศ
    var Tabletar = {
      "opt": "viewtarget"
    }
    this.apiService
      .getdata(Tabletar, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataTagget = data;
      });
    //ระดับ
    var Tabletar = {
      "opt": "viewtcourse"
    }
    this.apiService
      .getdata(Tabletar, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataCourse = data;
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
      });
    this.dataAdd.PRTARGET_CODE = "";
    this.dataAdd.PLASSETTYPE_CODE = "";
  }

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
            this.dataAdd.PRASSET_CODEA[i] = this.datalistapp[i].PRASSET_CODE;

          }
        } else {
          this.datalistapp = data.data;
          this.loadingapp = null;
          this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
        }
      });
  }

  mission(value: any) {
    //console.log
    if (value == 1) {
      this.dynamicVariable = true;
    } else {
      this.dynamicVariable = false;
    }
  }
  dataict(value: any) {
    //console.log
    if (value == '01') {
      this.ict = false;
    } else {
      this.ict = true;
    }
  }
  dataictlink(value: any) {
    //console.log
    if (value.target.value == '1') {
      this.ictlink = false;
    } else {
      this.ictlink = true;
    }
  }
  dataictprobject(value: any) {
    //console.log
    if (value == '04') {
      this.probject = false;
    } else if (value == '05') {
      this.probjectot = false;
    } else {
      this.probject = true;
      this.probjectot = true;
    }
  }
  CheckNum(num: any) {
    //console.log(num.keyCode); 
    if (num.keyCode < 46 || num.keyCode > 57) {
      alert('กรุณากรอกข้อมูล ที่เป็นตัวเลข');
      num.returnValue = false;
    }
  }
  /* addItem() {
     var Tablesec = {
       "opt": "viewTable",
        "Table":"CRSUBJECT where CRSUBJECT_CODE="+this.dataAdd.SelectList
     }
     this.apiService
     .getdata(Tablesec,this.url1)
     .pipe(first())
     .subscribe((data: any) => {
       //this.dataPsub=data;
       this.dataPsub.push({"CRSUBJECT_CODE": data[0].CRSUBJECT_CODE,"CRSUBJECT_TNAME": data[0].CRSUBJECT_TNAME});
     }); 
     for(let i=0; i<this.dataAdd.SelectList.length;i++){
       this.dataAdd.List.push(this.dataAdd.SelectList[i]);
       this.dataAdd.List1.push(this.dataAdd.SelectList[i]);
       } 
     console.log(this.dataAdd.List); 
   }*/

  addIt() {
    var Tablesec = {
      "opt": "viewTable",
      "Table": "CRSUBJECT where CRSUBJECT_CODE=" + this.dataAdd.SelectList
    }
    this.apiService
      .getdata(Tablesec, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        //this.dataPsub=data;
        // console.log(data);
        this.dataPsub.push({ "CRSUBJECT_CODE": data[0].CRSUBJECT_CODE, "CRSUBJECT_TNAME": data[0].CRSUBJECT_TNAME });
      });

    //let num=this.dataAdd.List.length;
    for (let i = 0; i < this.dataAdd.SelectList.length; i++) {
      this.dataAdd.List.push(this.dataAdd.SelectList[i]);
      this.dataAdd.List1.push(this.dataAdd.SelectList[i]);
    }
    // console.log(this.dataAdd.SelectList); 
    //  console.log(this.dataPsub); 
    console.log(this.dataAdd.SelectList);
  }
  delIt() {
    var Tablesec = {
      "opt": "viewTable",
      "Table": "CRSUBJECT where CRSUBJECT_CODE=" + this.dataAdd.PickList
    }
    this.apiService
      .getdata(Tablesec, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        //this.dataPsub=data;
        this.dataPsub.splice(this.dataPsub.indexOf(data[0].CRSUBJECT_CODE), 1);
        //this.dataPsub.push({"CRSUBJECT_CODE": data[0].CRSUBJECT_CODE,"CRSUBJECT_TNAME": data[0].CRSUBJECT_TNAME});
      });
    // let num=this.dataAdd.List.length;
    let name = (this.dataAdd.showde.substring(2).split("'"));
    for (let i = 0; i < this.dataAdd.List.length; i++) {

      if ((parseFloat(this.dataAdd.List[i]) == parseFloat(name[1]))) {
        this.dataAdd.List[i] = 0;
        // console.log(parseFloat(this.dataAdd.List[i])+' '+parseFloat(name[1]));
        // console.log( this.dataAdd.List[i]);
      }
      //console.log(parseFloat(this.dataAdd.List[i])); 
    }
    // console.log(this.dataAdd.showde);
    // var res = this.dataAdd.PickList.split("'");
    //  console.log( this.dataPsub);
    //  console.log(this.dataAdd.List);
  }
  showadd(id: any) {
    this.dataAdd.showde = id.target.value;
    //console.log(id.target.value);
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
  Passetsearch() {
    //รายการวิชา
    this.dataAdd.opt = "viewsubject";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataSub = data;
        //console.log(this.dataSub);
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
            this.dataAdd.PRREGISASSET_CODE[i] = this.datalistregister[i].PRREGISASSET_CODE;
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
    this.dataAdd.code
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == 1) {
          // console.log(data); 
          this.dataAdd.turnoff = data.turnoff;
          this.datalist = data.data;
          this.dataAdd.code = data.PLINCOMECODE;
          this.rownum = 'true';
          this.loading = null;
        } else {
          this.dataAdd.turnoff = data.turnoff;
          this.datalist = data.data;
          this.rownum = null;
          this.loading = null;
          this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
        }
        //this.rownum=this.datalist.length;

      });
  }

  // ฟังก์ขันสำหรับการเพิ่มข้อมูล/และแก้ไขข้อมูล
  insertspec() {
    this.dataAdd.opt = "insertspec";
    this.apiService
      .getupdate(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        //console.log(data.status);       
        if (data.status == 1) {
          // this.toastr.success("แจ้งเตือน:เพิ่มข้อมูลเรียบร้อยแล้ว");
          this.dataAdd.CRSUBJECT_NAME1 = '';
          this.dataAdd.CRSUBJECT_CODE = '';
          this.dataAdd.CRSUBJECT_NAME = '';
          this.fetchspec();
        }
      })

  }
  //
  fetchspec() {
    this.dataPsub = null;
    this.dataAdd.opt = "readspec";
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        // console.log(data);
        if (data.length > 0) {
          this.dataPsub = data;
          this.rownumspec = null;
        } else {
          this.rownumspec = 1;
          //console.log(data.length); 
        }

      });
  }
  // ฟังก์ขันสำหรับการเพิ่มข้อมูล/และแก้ไขข้อมูล
  updatespec() {
    //console.log(this.dataAdd.PRASSETSPEC_NAME); 
    if (this.dataAdd.PRASSETSPEC_NAME == '') {
      if (this.dataAdd.PRASSETSPEC_NAME == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกรายละเอียดครุภัณฑ์");
      }
    } else {
      this.dataAdd.opt = "updatespec";
      this.dataAdd.PRASSETSPEC_DETAIL = this.dataAdd.PRASSETSPEC_DETAIL.replaceAll("<br>", "<br/>");
      this.dataAdd.PRASSETSPEC_DETAIL = this.dataAdd.PRASSETSPEC_DETAIL.replaceAll("<p>", "");
      this.dataAdd.PRASSETSPEC_DETAIL = this.dataAdd.PRASSETSPEC_DETAIL.replaceAll("</p>", "<br/>");
      // console.log(this.dataAdd.PRASSETSPEC_DETAIL.replaceAll("<br>", "<br/>"));
      this.apiService
        .getupdate(this.dataAdd, this.url)
        .pipe(first())
        .subscribe((data: any) => {
          //console.log(data.status);       
          if (data.status == 1) {
            this.toastr.success("แจ้งเตือน:แก้ไขข้อมูลเรียบร้อยแล้ว");
            this.dataAdd.PRASSETSPEC_NAME = '';
            this.dataAdd.PRASSETSPEC_NUM = '';
            this.dataAdd.PRASSETSPEC_MONEY = '';
            this.dataAdd.PRASSETSPEC_DETAIL = '';
            this.dataAdd.PRASSETSPEC_NOTE = '';
            this.dataAdd.CITIZEN_IDA1 = '';
            this.dataAdd.CITIZEN_IDB1 = '';
            this.dataAdd.CITIZEN_IDC1 = '';
            this.fetchspec();
          }
        })
    }
  }
  deletespec(id: any) {
    this.dataAdd.opt = "deletespec";
    this.dataAdd.PRASSET_RSTATUSA = id;
    this.apiService
      .getdata(this.dataAdd, this.url)
      .subscribe((data: any) => {
        this.fetchspec();
      });

  }
  // ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
  editspec(id: any) {
    this.dataAdd.opt = "readspecid";
    this.dataAdd.PRASSETSPEC_CODE = id;
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataAdd.PRASSETSPEC_CODE = data[0].PRASSETSPEC_CODE;
        this.dataAdd.PRASSETSPEC_NAME = data[0].PRASSETSPEC_NAME;
        this.dataAdd.PRASSETSPEC_NUM = data[0].PRASSETSPEC_NUM;
        this.dataAdd.PRASSETSPEC_MONEY = this.numberWithCommas(parseFloat(data[0].PRASSETSPEC_MONEY).toFixed(2));
        this.dataAdd.PRASSETSPEC_DETAIL = data[0].PRASSETSPEC_DETAIL;
        this.dataAdd.SGCUNIT_CODE = data[0].GCUNIT_CODE;
        this.dataAdd.PRASSETSPEC_NOTE = data[0].PRASSETSPEC_NOTE;
        this.dataAdd.CITIZEN_IDA = data[0].CITIZEN_IDA;
        this.dataAdd.CITIZEN_IDB = data[0].CITIZEN_IDB;
        this.dataAdd.CITIZEN_IDC = data[0].CITIZEN_IDC;
        this.dataAdd.CITIZEN_IDA1 = data[0].STF_FNAME1;
        this.dataAdd.CITIZEN_IDB1 = data[0].STF_FNAME2;
        this.dataAdd.CITIZEN_IDC1 = data[0].STF_FNAME3;
      });
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

  // ฟังก์ขันสำหรับการเพิ่มข้อมูล/และแก้ไขข้อมูล
  insertdata() {
    //console.log(this.dataAdd.PRASSET_COURSET );
    if (this.dataAdd.checkregis.length == 0) {
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกทะเบียนครุภัณฑ์");
    } else {
      this.dataAdd.opt = "insert";
      /*  this.dataAdd.PRASSET_COURSET = this.dataAdd.PRASSET_COURSET.replaceAll("<br>", "<br/>"); 
        this.dataAdd.PRASSET_COURSET = this.dataAdd.PRASSET_COURSET.replaceAll("<p>", "<br/>"); 
        this.dataAdd.PRASSET_COURSET = this.dataAdd.PRASSET_COURSET.replaceAll("</p>", "");
        this.dataAdd.PRASSET_TARGET = this.dataAdd.PRASSET_TARGET.replaceAll("<br>", "<br/>"); 
        this.dataAdd.PRASSET_TARGET = this.dataAdd.PRASSET_TARGET.replaceAll("<p>", "<br/>"); 
        this.dataAdd.PRASSET_TARGET = this.dataAdd.PRASSET_TARGET.replaceAll("</p>", "");
        this.dataAdd.PRASSET_REASON = this.dataAdd.PRASSET_REASON.replaceAll("<br>", "<br/>"); 
        this.dataAdd.PRASSET_REASON = this.dataAdd.PRASSET_REASON.replaceAll("<p>", "<br/>"); 
        this.dataAdd.PRASSET_REASON = this.dataAdd.PRASSET_REASON.replaceAll("</p>", "");
        this.dataAdd.PRASSET_INSIDE = this.dataAdd.PRASSET_INSIDE.replaceAll("<br>", "<br/>"); 
        this.dataAdd.PRASSET_INSIDE = this.dataAdd.PRASSET_INSIDE.replaceAll("<p>", "<br/>"); 
        this.dataAdd.PRASSET_INSIDE = this.dataAdd.PRASSET_INSIDE.replaceAll("</p>", "");
        this.dataAdd.PRASSET_EXTERNAL = this.dataAdd.PRASSET_EXTERNAL.replaceAll("<br>", "<br/>"); 
        this.dataAdd.PRASSET_EXTERNAL = this.dataAdd.PRASSET_EXTERNAL.replaceAll("<p>", "<br/>"); 
        this.dataAdd.PRASSET_EXTERNAL = this.dataAdd.PRASSET_EXTERNAL.replaceAll("</p>", "");
        this.dataAdd.PRASSET_RESEARCH = this.dataAdd.PRASSET_RESEARCH.replaceAll("<br>", "<br/>"); 
        this.dataAdd.PRASSET_RESEARCH = this.dataAdd.PRASSET_RESEARCH.replaceAll("<p>", "<br/>"); 
        this.dataAdd.PRASSET_RESEARCH = this.dataAdd.PRASSET_RESEARCH.replaceAll("</p>", "");*/
      this.apiService
        .getupdate(this.dataAdd, this.url)
        .pipe(first())
        .subscribe((data: any) => {
          //console.log(data.status);       
          if (data.status == 1) {
            this.toastr.success("แจ้งเตือน:เพิ่มข้อมูลเรียบร้อยแล้ว");
            this.onChangerister();
            this.fetchdatalist();
            document.getElementById("ModalClose")?.click();
          }
        });
    }
  }
  // ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
  showspec(id: any, name: any, num: any, mon: any) {
    this.dataAdd.PRASSETSPEC_NAME = '';
    this.dataAdd.PRASSETSPEC_NOTE = '';
    this.dataAdd.opt = "readspec";
    this.dataAdd.PRASSET_CODE = id;
    this.dataAdd.PRASSETSPEC_NAME = name;
    this.dataAdd.PRASSETSPEC_NUM = num;
    this.dataAdd.PRASSETSPEC_MONEY = this.numberWithCommas(parseFloat(mon).toFixed(2));;
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {

        if (data.length > 0) {
          this.dataspec = data;
          this.rownumspec = null;
        } else {
          this.rownumspec = 1;
          //console.log(data.length); 
        }

      });
    this.rowpbi = 1;
    this.rowpbu = '';
  }

  // ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
  editdata(id: any) {
    var Tablesec = {
      "opt": "viewsection",
      "fac": this.dataAdd.FACULTY_CODE
    }
    this.apiService
      .getdata(Tablesec, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataSection = data;
        for (let i = 0; i < this.dataSection.length; i++) {
          this.dataAdd.SECTION_CODE[i] = this.dataSection[i].SECTION_CODE;
          this.dataAdd.PRASSETSEC_CODE[i] = 0;
          this.dataAdd.check[i] = 0;
        }
      });
    this.setshowbti();
    /* this.apiService
     .getById(id,this.url)
     .pipe(first())
     .subscribe((data: any) => {
       this.onChangedistrict(data[0].PROVINCE_ID);
       this.onChangesubdistrict(data[0].DISTRICT_ID);
     }); */

    //console.log(d.getFullYear());
    this.apiService
      .getById(id, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        // this.dataAdd  = data;
        //this.onChangedistrict(data[0].PROVINCE_ID);
        // this.onChangesubdistrict(data[0].DISTRICT_ID);
        var gyear = new Date();
        let atf = (data[0].PRYEARASSET_CODE - 543) - gyear.getFullYear();
        //console.log(this.afyear);

        if (data[0].TYPEFACULTY_CODE == 1) {
          this.dataAdd.TYPEFACULTY = "หลักสูตร/ฝ่าย";
        } else {
          this.dataAdd.TYPEFACULTY = "งาน";
        }
        this.dataAdd.PRASSET_CODE = data[0].PRASSET_CODE;
        this.dataAdd.PRASSET_NAME = data[0].PRREGISASSET_NAME + ' ตำบล' + data[0].SUB_DISTRICT_NAME_TH + ' อำเภอ' + data[0].DISTRICT_NAME_TH + ' จังหวัด' + data[0].PROVINCE_TNAME;
        this.dataAdd.PRASSET_NUMBER = data[0].PRASSET_NUMBER;
        this.dataAdd.RPLINCOME_CODE = data[0].PLINCOME_CODE;
        this.onChangecrpartrister();
        //console.log(atf);
        if (atf > 2) {
          this.afyear = true;
        } else {
          this.showHide();
          this.afyear = null;
        }
        this.dataAdd.RCRPART_ID = data[0].CRPART_ID;
        this.dataAdd.GCUNIT_CODE = data[0].GCUNIT_CODE;
        this.dataAdd.PRYEARASSET_CODEA = data[0].PRYEARASSET_CODE;
        this.dataAdd.PRASSET_MONEY = this.numberWithCommas(parseFloat(data[0].PRASSET_MONEY).toFixed(2));
        this.dataAdd.sum = data[0].PRASSET_NUMBER * data[0].PRASSET_MONEY;
        this.dataAdd.PLASSETTYPE_CODE = data[0].PLASSETTYPE_CODE;
        this.dataictprobject(data[0].PROBJECT_CODE);
        if (data[0].PRASSET_REASON != null) {
          this.dataAdd.PRASSET_REASON = data[0].PRASSET_REASON;
        }
        this.dataAdd.PRASSET_MINIMUM = data[0].PRASSET_MINIMUM;
        this.dataAdd.PRASSET_AE = data[0].PRASSET_AE;
        this.dataAdd.PRASSET_AV = data[0].PRASSET_AV;
        this.dataAdd.PRASSET_DM = data[0].PRASSET_DM;
        this.dataAdd.PRASSET_PDEVELOP = data[0].PRASSET_PDEVELOP;
        this.dataAdd.PRASSET_PEXCELL = data[0].PRASSET_PEXCELL;
        this.dataAdd.PRASSET_ANOTHER = data[0].PRASSET_ANOTHER;
        this.dataAdd.PRASSET_SUPPORT = data[0].PRASSET_SUPPORT;
        this.dataAdd.PRASSET_FU = data[0].PRASSET_FU;
        this.dataAdd.PRASSET_T2 = data[0].PRASSET_T2;
        this.dataAdd.PRASSET_T1 = data[0].PRASSET_T1;
        //this.dataAdd.PRASSET_UF = data[0].PRASSET_UF;
        //  this.dataAdd.PRASSET_COURSE = data[0].PRASSET_COURSE;
        // this.dataAdd.PRASSET_DEGREE = data[0].PRASSET_DEGREE;
        this.dataAdd.PRASSET_NS = data[0].PRASSET_NS;
        if (data[0].PRASSET_TARGET != null) {
          this.dataAdd.PRASSET_TARGET = data[0].PRASSET_TARGET;
        }
        this.dataAdd.PRASSET_FRE = data[0].PRASSET_FRE;
        this.dataAdd.PRASSET_SMONTH = data[0].PRASSET_SMONTH;
        this.dataAdd.PRASSET_SYEAR = data[0].PRASSET_SYEAR;
        this.dataAdd.PRASSET_DMONTH = data[0].PRASSET_DMONTH;
        this.dataAdd.PRASSET_DYEAR = data[0].PRASSET_DYEAR;
        this.dataAdd.PLGPRODUCT_CODE = data[0].PLGPRODUCT_CODE;
        this.setshowid(data[0].PLGPRODUCT_CODE);
        // this.dataAdd.PROVINCE_ID = data[0].PROVINCE_ID;
        // this.dataAdd.DISTRICT_ID = data[0].DISTRICT_ID;
        // this.dataAdd.SUB_DISTRICT_ID = data[0].SUB_DISTRICT_ID;
        //  console.log(data[0].SUB_DISTRICT_ID);
        this.dataAdd.PRASSET_STATE = data[0].PRASSET_STATE;
        this.dataAdd.PRASSET_STORE1 = data[0].PRASSET_STORE1;
        if (data[0].PRASSET_SMONEY1 != null) {
          this.dataAdd.PRASSET_SMONEY1 = this.numberWithCommas(parseFloat(data[0].PRASSET_SMONEY1).toFixed(2));
        }
        this.dataAdd.SLINK1 = data[0].PRASSET_SLINK1;
        this.dataAdd.SLINK2 = data[0].PRASSET_SLINK2;
        this.dataAdd.SLINK3 = data[0].PRASSET_SLINK3;
        this.dataAdd.SLINK4 = data[0].PRASSET_SLINK4;
        this.dataAdd.PRASSET_STORE2 = data[0].PRASSET_STORE2;
        this.dataAdd.PRASSETSPEC_DETAIL = data[0].PRASSETSPEC_DETAIL;
        if (data[0].PRASSET_SMONEY2 != null) {
          this.dataAdd.PRASSET_SMONEY2 = this.numberWithCommas(parseFloat(data[0].PRASSET_SMONEY2).toFixed(2));
        }
        this.dataAdd.PRASSET_STORE3 = data[0].PRASSET_STORE3;
        if (data[0].PRASSET_SMONEY3 != null) {
          this.dataAdd.PRASSET_SMONEY3 = this.numberWithCommas(parseFloat(data[0].PRASSET_SMONEY3).toFixed(2));
        }
        this.dataAdd.PRASSET_BNAME = data[0].PRASSET_BNAME;
        this.dataAdd.PRASSET_BYEAR = data[0].PRASSET_BYEAR;
        this.dataAdd.PRASSET_OTHER = data[0].PRASSET_OTHER;
        this.dataAdd.PLSUBMONEYPAY_CODE = data[0].PLSUBMONEYPAY_CODE;
        this.dataAdd.PLGPRODUCT_CODE = data[0].PLGPRODUCT_CODE
        this.dataAdd.PLSUBMONEYPAY_CODE = data[0].PLSUBMONEYPAY_CODE
        this.dataAdd.PRMISSION_CODE = data[0].PRMISSION_CODE
        if (data[0].PRMISSION_CODE == '01') {
          this.mission(1);
        } else {
          this.mission(0);
        }
        if (data[0].PRASSET_TYPE == '1') {
          this.ictlink = false;
        } else {
          this.ictlink = true;
        }
        this.dataAdd.PRTARGET_CODE = data[0].PRTARGET_CODE
        if (data[0].PRASSET_INSIDE != null) {
          this.dataAdd.PRASSET_INSIDE = data[0].PRASSET_INSIDE
        }
        if (data[0].PRASSET_EXTERNAL != null) {
          this.dataAdd.PRASSET_EXTERNAL = data[0].PRASSET_EXTERNAL
        }
        if (data[0].PRASSET_RESEARCH != null) {
          this.dataAdd.PRASSET_RESEARCH = data[0].PRASSET_RESEARCH
        }
        if (data[0].PRASSET_COURSET != null) {
          this.dataAdd.PRASSET_COURSET = data[0].PRASSET_COURSET
        }
        // this.dataictlink(data[0].PRASSET_TYPE);
        // this.dataAdd.PRASSET_CYEAR =data[0].PRASSET_CYEAR
        this.dataAdd.PROBJECT_CODE = data[0].PROBJECT_CODE
        this.dataAdd.PRASSET_TYPE = data[0].PRASSET_TYPE
        /* if(data[0].PRASSETSPEC_DETAIL !=null){
         this.dataAdd.PRASSETSPEC_DETAIL=data[0].PRASSETSPEC_DETAIL;
         }*/
        // this.dataAdd.PRASSETSPEC_NOTE=data[0].PRASSETSPEC_NOTE;
        this.dataAdd.CITIZEN_IDA = data[0].CITIZEN_IDA;
        this.dataAdd.CITIZEN_IDB = data[0].CITIZEN_IDB;
        this.dataAdd.CITIZEN_IDC = data[0].CITIZEN_IDC;

        this.dataAdd.CITIZEN_IDA1 = data[0].STF_FNAME1;
        this.dataAdd.CITIZEN_IDB1 = data[0].STF_FNAME2;
        this.dataAdd.CITIZEN_IDC1 = data[0].STF_FNAME3;
        // console.log(data[0].PRASSET_TYPE);
        //รายการวิชา
        var Tablesub = {
          "opt": "viewpsubject",
          "PRASSET_CODE": data[0].PRASSET_CODE
        }
        //console.log(Tablesub);
        this.dataPsub = [];
        this.dataAdd.List = [];
        this.dataAdd.List1 = [];
        this.apiService
          .getdata(Tablesub, this.url1)
          .pipe(first())
          .subscribe((datassub: any) => {

            if (datassub.length > 0) {
              this.dataPsub = datassub;
              for (let i = 0; i < this.dataPsub.length; i++) {
                this.dataAdd.List.push(this.dataPsub[i].CRSUBJECT_CODE);
                this.dataAdd.List1.push(this.dataPsub[i].CRSUBJECT_CODE);
                // console.log(this.dataPsub[i].CRSUBJECT_CODE);
              }
            }

          });

        var Table = {
          "opt": "viewTable",
          "Table": "PRASSETSEC where  PRASSET_CODE='" + data[0].PRASSET_CODE + "'"
        }
        this.apiService
          .getdata(Table, this.url1)
          .pipe(first())
          .subscribe((data: any) => {
            this.datatype = data;
            for (let i = 0; i < this.dataSection.length; i++) {
              this.dataAdd.PRASSETSEC_CODE[i] = 0;
              for (var j = 0; j < data.length; j++) {
                if (this.dataSection[i].SECTION_CODE == data[j].SECTION_CODE) {
                  this.dataAdd.check[i] = data[j].SECTION_CODE;
                  this.dataAdd.PRASSETSEC_CODE[i] = data[j].PRASSETSEC_CODE;
                }
                //this.dataAdd.check[i] = data[i].SECTION_CODE;
              }
            }

          });
      });

  }
  numberWithCommas(x: any) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
  calexpenses() {
    this.dataAdd.sum = this.dataAdd.PRASSET_NUMBER * this.dataAdd.PRASSET_MONEY.replace(/,/g, "");
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
  onChangespec(event: any) {
    this.filespec = event.target.files[0];
  }
  showsec() {
    this.clickshow = true;
  }
  fetchdataCam() {
    this.dataFacsub = null
    this.dataAdd.opt = "viewfaculty";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataFacsub = data;
      });
  }
  //แก้ไขข้อมูลfilespec
  updatedata() {
    //this.Uploadfiles.upload(this.file,'111111')
    //let id=this.dataAdd.FACULTY_CODE+this.dataAdd.PRYEARASSET_CODE;
    //console.log(this.file);


    this.dataAdd.opt = "update";
    if (this.dataAdd.PRASSET_COURSET != '') {
      this.dataAdd.PRASSET_COURSET = this.dataAdd.PRASSET_COURSET.replaceAll("<br>", "<br/>");
      this.dataAdd.PRASSET_COURSET = this.dataAdd.PRASSET_COURSET.replaceAll("<p>", "");
      this.dataAdd.PRASSET_COURSET = this.dataAdd.PRASSET_COURSET.replaceAll("</p>", "<br/>");
      this.dataAdd.PRASSET_COURSET = this.dataAdd.PRASSET_COURSET.replaceAll("&nbsp;", "");
    }
    if (this.dataAdd.PRASSET_TARGET != '') {
      this.dataAdd.PRASSET_TARGET = this.dataAdd.PRASSET_TARGET.replaceAll("<br>", "<br/>");
      this.dataAdd.PRASSET_TARGET = this.dataAdd.PRASSET_TARGET.replaceAll("<p>", "");
      this.dataAdd.PRASSET_TARGET = this.dataAdd.PRASSET_TARGET.replaceAll("</p>", "<br/>");
      this.dataAdd.PRASSET_TARGET = this.dataAdd.PRASSET_TARGET.replaceAll("&nbsp;", "");
    }
    if (this.dataAdd.PRASSET_REASON != '') {
      this.dataAdd.PRASSET_REASON = this.dataAdd.PRASSET_REASON.replaceAll("<br>", "<br/>");
      this.dataAdd.PRASSET_REASON = this.dataAdd.PRASSET_REASON.replaceAll("<p>", "");
      this.dataAdd.PRASSET_REASON = this.dataAdd.PRASSET_REASON.replaceAll("</p>", "<br/>");
      this.dataAdd.PRASSET_REASON = this.dataAdd.PRASSET_REASON.replaceAll("&nbsp;", "");
    }
    if (this.dataAdd.PRASSET_INSIDE != '') {
      this.dataAdd.PRASSET_INSIDE = this.dataAdd.PRASSET_INSIDE.replaceAll("<br>", "<br/>");
      this.dataAdd.PRASSET_INSIDE = this.dataAdd.PRASSET_INSIDE.replaceAll("<p>", "");
      this.dataAdd.PRASSET_INSIDE = this.dataAdd.PRASSET_INSIDE.replaceAll("</p>", "<br/>");
      this.dataAdd.PRASSET_INSIDE = this.dataAdd.PRASSET_INSIDE.replaceAll("&nbsp;", "");
    }
    if (this.dataAdd.PRASSET_EXTERNAL != '') {
      this.dataAdd.PRASSET_EXTERNAL = this.dataAdd.PRASSET_EXTERNAL.replaceAll("<br>", "<br/>");
      this.dataAdd.PRASSET_EXTERNAL = this.dataAdd.PRASSET_EXTERNAL.replaceAll("<p>", "");
      this.dataAdd.PRASSET_EXTERNAL = this.dataAdd.PRASSET_EXTERNAL.replaceAll("</p>", "<br/>");
      this.dataAdd.PRASSET_EXTERNAL = this.dataAdd.PRASSET_EXTERNAL.replaceAll("&nbsp;", "");
    }
    if (this.dataAdd.PRASSET_RESEARCH != '') {
      this.dataAdd.PRASSET_RESEARCH = this.dataAdd.PRASSET_RESEARCH.replaceAll("<br>", "<br/>");
      this.dataAdd.PRASSET_RESEARCH = this.dataAdd.PRASSET_RESEARCH.replaceAll("<p>", "");
      this.dataAdd.PRASSET_RESEARCH = this.dataAdd.PRASSET_RESEARCH.replaceAll("</p>", "<br/>");
      this.dataAdd.PRASSET_RESEARCH = this.dataAdd.PRASSET_RESEARCH.replaceAll("&nbsp;", "");
    }
    /* if(this.dataAdd.PRASSETSPEC_DETAIL !=''){
     this.dataAdd.PRASSETSPEC_DETAIL = this.dataAdd.PRASSETSPEC_DETAIL.replaceAll("<br>", "<br/>"); 
     this.dataAdd.PRASSETSPEC_DETAIL = this.dataAdd.PRASSETSPEC_DETAIL.replaceAll("<p>", "<br/>"); 
     this.dataAdd.PRASSETSPEC_DETAIL = this.dataAdd.PRASSETSPEC_DETAIL.replaceAll("</p>", "");
     }*/
    this.apiService
      .getupdate(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == 1) {
          this.toastr.success("แจ้งเตือน:แก้ไขข้อมูลเรียบร้อยแล้ว");
          this.Uploadfiles.uploadassetrq(this.file, this.fileict, this.filerequest, this.filespec, this.dataAdd.PLYEARBUDGET_CODE, this.dataAdd.FACULTY_CODE, this.dataAdd.PRASSET_CODE)
            .subscribe((event: any) => {
            }
            );
          this.fetchdatalist();
          this.editdata(this.dataAdd.PRASSET_CODE);


          this.rowpbi = null;
          // document.getElementById("ModalClose")?.click();
        } else if (data.status == 0) {
          this.toastr.warning("แจ้งเตือน:กรุณากรอกเหตุผลความจำเป็นอย่างน้อย 1 หน้ากระดาษ");
        }
      });
    //}      
  }
  //แก้ไขข้อมูล
  updatedata1() {
    //this.Uploadfiles.upload(this.file,'111111')
    //let id=this.dataAdd.FACULTY_CODE+this.dataAdd.PRYEARASSET_CODE;
    //console.log(this.file);



    this.dataAdd.opt = "update";
    if (this.dataAdd.PRASSET_COURSET != '') {
      this.dataAdd.PRASSET_COURSET = this.dataAdd.PRASSET_COURSET.replaceAll("<br>", "<br/>");
      this.dataAdd.PRASSET_COURSET = this.dataAdd.PRASSET_COURSET.replaceAll("<p>", "<br/>");
      this.dataAdd.PRASSET_COURSET = this.dataAdd.PRASSET_COURSET.replaceAll("</p>", "");
    }
    if (this.dataAdd.PRASSET_TARGET != '') {
      this.dataAdd.PRASSET_TARGET = this.dataAdd.PRASSET_TARGET.replaceAll("<br>", "<br/>");
      this.dataAdd.PRASSET_TARGET = this.dataAdd.PRASSET_TARGET.replaceAll("<p>", "<br/>");
      this.dataAdd.PRASSET_TARGET = this.dataAdd.PRASSET_TARGET.replaceAll("</p>", "");
    }
    if (this.dataAdd.PRASSET_REASON != '') {
      this.dataAdd.PRASSET_REASON = this.dataAdd.PRASSET_REASON.replaceAll("<br>", "<br/>");
      this.dataAdd.PRASSET_REASON = this.dataAdd.PRASSET_REASON.replaceAll("<p>", "<br/>");
      this.dataAdd.PRASSET_REASON = this.dataAdd.PRASSET_REASON.replaceAll("</p>", "");
    }
    if (this.dataAdd.PRASSET_INSIDE != '') {
      this.dataAdd.PRASSET_INSIDE = this.dataAdd.PRASSET_INSIDE.replaceAll("<br>", "<br/>");
      this.dataAdd.PRASSET_INSIDE = this.dataAdd.PRASSET_INSIDE.replaceAll("<p>", "<br/>");
      this.dataAdd.PRASSET_INSIDE = this.dataAdd.PRASSET_INSIDE.replaceAll("</p>", "");
    }
    if (this.dataAdd.PRASSET_EXTERNAL != '') {
      this.dataAdd.PRASSET_EXTERNAL = this.dataAdd.PRASSET_EXTERNAL.replaceAll("<br>", "<br/>");
      this.dataAdd.PRASSET_EXTERNAL = this.dataAdd.PRASSET_EXTERNAL.replaceAll("<p>", "<br/>");
      this.dataAdd.PRASSET_EXTERNAL = this.dataAdd.PRASSET_EXTERNAL.replaceAll("</p>", "");
    }
    if (this.dataAdd.PRASSET_RESEARCH != '') {
      this.dataAdd.PRASSET_RESEARCH = this.dataAdd.PRASSET_RESEARCH.replaceAll("<br>", "<br/>");
      this.dataAdd.PRASSET_RESEARCH = this.dataAdd.PRASSET_RESEARCH.replaceAll("<p>", "<br/>");
      this.dataAdd.PRASSET_RESEARCH = this.dataAdd.PRASSET_RESEARCH.replaceAll("</p>", "");
    }
    /* if(this.dataAdd.PRASSETSPEC_DETAIL !=''){
     this.dataAdd.PRASSETSPEC_DETAIL = this.dataAdd.PRASSETSPEC_DETAIL.replaceAll("<br>", "<br/>"); 
     this.dataAdd.PRASSETSPEC_DETAIL = this.dataAdd.PRASSETSPEC_DETAIL.replaceAll("<p>", "<br/>"); 
     this.dataAdd.PRASSETSPEC_DETAIL = this.dataAdd.PRASSETSPEC_DETAIL.replaceAll("</p>", "");
     }*/
    this.apiService
      .getupdate(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == 1) {
          // this.toastr.success("แจ้งเตือน:แก้ไขข้อมูลเรียบร้อยแล้ว");
          this.Uploadfiles.upload(this.file, this.fileict, this.dataAdd.PRYEARASSET_CODE, this.dataAdd.FACULTY_CODE, this.dataAdd.PRASSET_CODE)
            .subscribe((event: any) => {
            }
            );
          this.fetchdatalist();
          this.editdata(this.dataAdd.PRASSET_CODE);
          this.rowpbi = null;
          // document.getElementById("ModalClose")?.click();
        } else if (data.status == 0) {
          this.toastr.warning("แจ้งเตือน:กรุณากรอกเหตุผลความจำเป็นอย่างน้อย 1 หน้ากระดาษ");
        }
      });
    //}      
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
    this.dataAdd.SLINK4 = '';
    this.apiService
      .getById(id, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataAdd.SLINK1 = data[0].PRASSET_SLINK1;
        this.dataAdd.SLINK2 = data[0].PRASSET_SLINK2;
        this.dataAdd.SLINK3 = data[0].PRASSET_SLINK3;
        this.dataAdd.SLINK4 = data[0].PRASSET_SLINK4;
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
    this.dataAdd.CITIZEN_ID = this.tokenStorage.getUser().citizen;
    /*if(window.confirm('คุณแน่ใจว่าต้องการลบข้อมูล ?')){
      this.apiService
      .delete(id, this.url)
      .subscribe((data: any) => {       
        this.fetchdata();
      });
   }*/
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
    this.ictlink = false;
    this.dataAdd.PRASSET_CODE = '';
    this.dataAdd.PRASSET_NAME = '';
    this.dataAdd.PRASSET_NUMBER = '';
    this.dataAdd.GCUNIT_CODE = '';
    this.dataAdd.PRASSET_MONEY = '';
    this.dataAdd.PLASSETTYPE_CODE = '';
    this.dataAdd.PRASSET_REASON = '';
    this.dataAdd.PRASSET_MINIMUM = '';
    this.dataAdd.PRASSET_AE = '';
    this.dataAdd.PRASSET_AV = '';
    this.dataAdd.PRASSET_DM = '';
    this.dataAdd.PRASSET_OTHER = '';
    this.dataAdd.PRASSETSPEC_DETAIL = '';
    this.dataAdd.searchregis = '';
    this.dataAdd.PRASSET_NS = '';
    this.dataAdd.PRASSET_FRE = '';
    this.dataAdd.PRASSET_SMONTH = '';
    this.dataAdd.PRASSET_SYEAR = '';
    this.dataAdd.PRASSET_DMONTH = '';
    this.dataAdd.PRASSET_DYEAR = '';
    this.dataAdd.PLGPRODUCT_CODE = '';
    this.dataAdd.PROVINCE_ID = '';
    this.dataAdd.DISTRICT_ID = '';
    this.dataAdd.SUB_DISTRICT_ID = '';
    this.dataAdd.PRASSET_STATE = '';
    this.dataAdd.PRASSET_STORE1 = '';
    this.dataAdd.PRASSET_SMONEY1 = '';
    this.dataAdd.PRASSET_SLINK1 = '';
    this.dataAdd.PRASSET_STORE2 = '';
    this.dataAdd.PRASSET_SMONEY2 = '';
    this.dataAdd.PRASSET_SLINK2 = '';
    this.dataAdd.PRASSET_SLINK3 = '';
    this.dataAdd.PRASSET_SLINK4 = '';
    this.dataAdd.SLINK1 = '';
    this.dataAdd.SLINK2 = '';
    this.dataAdd.SLINK3 = '';
    this.dataAdd.SLINK4 = '';
    this.dataAdd.g_faculty = '';
    this.dataAdd.PRASSET_STORE3 = '';
    this.dataAdd.PRASSET_SMONEY3 = '';
    this.dataAdd.PRASSET_TARGET = '';
    this.dataAdd.PRASSET_BNAME = '';
    this.dataAdd.PRASSET_BYEAR = '';
    this.dataAdd.PLSUBMONEYPAY_CODE = '';
    this.dataAdd.PRMISSION_CODE = '';
    this.dataAdd.PROBJECT_CODE = '';
    this.dataAdd.PRASSET_INSIDE = '';
    this.dataAdd.PRASSET_EXTERNAL = '';
    this.dataAdd.PRASSET_RESEARCH = '';
    this.dataAdd.PRASSET_COURSET = '';
    this.dataAdd.PRASSET_CYEAR = '';
    this.dataAdd.PRASSET_PDEVELOP = '';
    this.dataAdd.PRASSET_PEXCELL = '';
    this.dataAdd.PRASSET_ANOTHER = '';
    this.dataAdd.PRASSET_SUPPORT = '';
    this.dataAdd.RPLINCOME_CODE = '';
    this.dataAdd.RCRPART_ID = '';
    this.dataAdd.PRASSET_T1 = '';
    this.dataAdd.PRASSET_T2 = '';
    this.dataAdd.PRASSET_FU = 'ชั่วโมง/สัปดาห์';
    this.dataAdd.PRASSET_TYPE = '';
    this.dataAdd.searchimport = '';
    this.dataAdd.List = [];
    this.dataAdd.List1 = [];

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
    //console.log(Value);    
  }

  setshowid(deviceValue: any) {

    /*  if(deviceValue=='133'){
      //alert(deviceValue);
      document. getElementById('pro1').style.display = '';
      document. getElementById('pro2').style.display = '';
      document. getElementById('pro3').style.display = '';
      }else  {
        document. getElementById('pro1').style.display = 'none';
        document. getElementById('pro2').style.display = 'none';
        document. getElementById('pro3').style.display = 'none';
      } */
  }




  // ฟังก์ชัน โชว์ปุ่ม
  showinputin() {
    this.rowpbi = 1;
  }
  // ฟังก์ชัน โชว์ปุ่ม
  showinputinnull() {
    this.rowpbi = null;
    //this.updatedata1();
  }
  fetchclose() {
    this.clickshow = null;
  }
  showapp(code: any, name: any) {
    this.clickshow = true;
    this.dataAdd.PRASSET_CODE = code;
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
    this.dataAdd.IMPORTASSET_CODE = [];
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
  showstep(name: any) {
    //console.log(name);
    this.dataAdd.PRSTATUS_PSTATUS = name;
  }
  // ฟังก์ชัน การแสดงข้อมูลตามต้องการ
  onTableDataChange(event: any) {
    this.page = event;
    this.fetchdatalist();
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
}
