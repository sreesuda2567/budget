import { Component, OnInit, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ApiPdoService } from '../../../../_services/api-pui.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TokenStorageService } from '../../../../_services/token-storage.service';
import { first, map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { auto } from '@popperjs/core';

@Component({
  selector: 'app-approveasset',
  templateUrl: './approveasset.component.html',
  styleUrls: ['./approveasset.component.scss']
})
export class ApproveassetComponent implements OnInit {
  selected: string = "";
  htmlContent = '';
  stbtn: any;
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: auto,
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    /*toolbarHiddenButtons: [
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

  citizen: any;
  user: any;
  key: any;
  // param: any = { MASSAGE_CITIZEN: null }
  datarstatus: any;
  dataFac: any;
  dataIncome: any;
  dataCrpart: any;
  dataYear: any;
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
  dataPsub: any;
  datalist: any;
  datalistapp: any;
  loadingapp: any;
  dataspec: any;
  rowpbi: any;
  rowpbu: any;
  rowict: any;
  rowpaap: any;
  rowpaapn: any;
  datastatus: any
  dataCrpartregis: any;
  url = "/acc3d/investment/approve/applistasset.php";
  url1 = "/acc3d/investment/userpermission.php";
  dataAdd: any = { check: [], SECTION_CODE: [], PRASSETSEC_CODE: [], List: [], List1: [] };
  searchTerm: any;
  searchTermd: any;
  selectedDevice: any;
  loading: any;
  dynamicVariable: any;
  ict: any;
  ictlink: any;
  page = 1;
  count = 0;
  number = 0;
  clickshow: any;
  tableSize = 20;
  tableSizes = [20, 30, 40];
  formModal_del: any;
  tablemonth = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
  dataYearp: any;
  rownum: any;
  rownumspec: any;
  dataMyear: any;
  datalistregister:any;
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
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    document.getElementById("ModalClose")?.click();
    this.fetchdata();
    this.dataAdd.PRASSETAPP_CODE = '';
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
                //  this.fetchdatalist();
              });
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
        this.dataAdd.PLINCOME_CODE = '';//data[0].PLINCOME_CODE;
        // this.showHide('dataAdd.type',this.dataAdd.PLINCOME_CODE);
        // console.log(data[0].PLINCOME_CODE);
      });

    /*  //รายการปี
       var Tabley = {
         "opt": "viewyear"
       }
       this.apiService
         .getdata(Tabley, this.url1)
         .pipe(first())
         .subscribe((data: any) => {
           //  console.log(data);
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
           //  console.log(Table2);
           this.apiService
             .getdata(Table2, this.url1)
             .pipe(first())
             .subscribe((datacr: any) => {
               console.log(datacr);
               this.dataCrpart = datacr;
               this.dataAdd.CRPART_ID = '';//datacr[0].CRPART_ID;
             });
   
         });*/
    //ปีงบประมาณ

    //รายการปี
    var Tabley = {
      "opt": "viewyearp"
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
      "opt": "viewpro"
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
      "opt": "viewstatusplan"
    }
    this.apiService
      .getdata(Tabletar, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.datastatus = data;
        this.dataAdd.PRSTATUS_CODE = data[1].PRSTATUS_CODE;
      });
    this.dataAdd.PRTARGET_CODE = "";
    this.dataAdd.PLASSETTYPE_CODE = "";
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
        this.dataAdd.PRYEARASSET_CODE = data[0].PLYEARBUDGET_CODE;
        this.fetchdatalist();
      });
  }
  keyword = 'name';
  datacomplete = [];

  selectEvent(item: any, num: any) {
    if (num == 1) {
      this.dataAdd.CITIZEN_IDA = item.id;
    } else if (num == 2) {
      this.dataAdd.CITIZEN_IDB = item.id;
    } else {
      this.dataAdd.CITIZEN_IDC = item.id;
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
  // ฟังก์ขันสำหรับการดึงข้อมูลครุภัณฑ์
  fetchdatalist() {
    var Tablesec = {
      "opt": "viewsection",
      "fac": this.dataAdd.FFACULTY_CODE
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
    this.dataAdd.opt = "readAll";
    this.loading = true;
    this.dataAdd.code = null;
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == 1) {
          // console.log(data); 
          this.datalist = data.data;
          this.dataAdd.code = data.FACULTY_CODE;
          this.rownum = 'true';
          this.loading = null;
        } else {
          this.datalist = data.data;
          this.rownum = null;
          this.loading = null;
          this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
        }
        //this.rownum=this.datalist.length;

      });
  }
  // ฟังก์ขันสำหรับการดึงข้อมูลครุภัณฑ์
  fetchdatalistapp() {
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
    this.dataAdd.opt = "readAllapp";
    this.loadingapp = true;
    this.datalistapp = null;
    this.dataAdd.fcode = null;
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == 1) {
          // console.log(data); 
          this.datalistapp = data.data;
          this.dataAdd.fcode = data.FACULTY_CODE;
          this.rownum = 'true';
          this.loadingapp = null;
        } else {
          this.datalistapp = data.data;
          this.rownum = null;
          this.loadingapp = null;
          this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
        }
        //this.rownum=this.datalist.length;

      });
  }
  numberWithCommas(x: any) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
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
  //ภาคเงิน
  fetchdatalistcrp() {
    this.dataAdd.opt = "viewcrpartp";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        //  console.log(data);
        this.dataCrpart = data;
        this.dataAdd.FCRPART_ID = data[0].CRPART_ID;

      });
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
  editdata(id: any) {
    //this.clickshow=true; 
    this.setshowbti();
    this.apiService
      .getById(id, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        this.onChangedistrict(data[0].PROVINCE_ID);
        this.onChangesubdistrict(data[0].DISTRICT_ID);
      });
    this.apiService
      .getById(id, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        // this.dataAdd  = data;
        this.dataAdd.AFACULTY_CODE = data[0].FACULTY_CODE;
        this.dataAdd.FPLINCOME_CODE = data[0].PLINCOME_CODE;
        this.fetchdatalistcre();
        this.dataAdd.FCRPART_ID = data[0].CRPART_ID;
        this.dataAdd.PRASSET_CODE = data[0].PRASSET_CODE;
        this.dataAdd.FPLINCOME_CODE = data[0].PLINCOME_CODE;
        this.dataAdd.PRASSET_RSTATUS = 0;
        this.dataAdd.FCRPART_ID = data[0].CRPART_ID;
        this.dataAdd.PRASSET_CODE = data[0].PRASSET_CODE;
        this.dataAdd.PRASSET_NAME = data[0].PRASSET_NAME + ' ตำบล' + data[0].SUB_DISTRICT_NAME_TH + ' อำเภอ' + data[0].DISTRICT_NAME_TH + ' จังหวัด' + data[0].PROVINCE_TNAME;
        this.dataAdd.PRASSET_NUMBER = data[0].PRASSET_NUMBER;
        this.dataAdd.GCUNIT_CODE = data[0].GCUNIT_CODE;
        this.dataAdd.PRASSET_MONEY = this.numberWithCommas(parseFloat(data[0].PRASSET_MONEY).toFixed(2));
        this.dataAdd.sum = data[0].PRASSET_NUMBER * data[0].PRASSET_MONEY;
        this.dataAdd.PLASSETTYPE_CODE = data[0].PLASSETTYPE_CODE;
        this.dataAdd.PRASSET_REASON = data[0].PRASSET_REASON;
        this.dataAdd.PRASSET_MINIMUM = data[0].PRASSET_MINIMUM;
        this.dataAdd.PRASSET_AE = data[0].PRASSET_AE;
        this.dataAdd.PRASSET_AV = data[0].PRASSET_AV;
        this.dataAdd.PRASSET_DM = this.numberWithCommas(parseFloat(data[0].PRASSET_DM).toFixed(2));
        //this.dataAdd.PRASSET_UF = data[0].PRASSET_UF;
        //  this.dataAdd.PRASSET_COURSE = data[0].PRASSET_COURSE;
        // this.dataAdd.PRASSET_DEGREE = data[0].PRASSET_DEGREE;
        this.dataAdd.PRASSET_NS = data[0].PRASSET_NS;
        this.dataAdd.PRASSET_TARGET = data[0].PRASSET_TARGET;
        this.dataAdd.PRASSET_FRE = data[0].PRASSET_FRE;
        this.dataAdd.PRASSET_SMONTH = data[0].PRASSET_SMONTH;
        this.dataAdd.PRASSET_SYEAR = data[0].PRASSET_SYEAR;
        this.dataAdd.PRASSET_DMONTH = data[0].PRASSET_DMONTH;
        this.dataAdd.PRASSET_DYEAR = data[0].PRASSET_DYEAR;
        this.dataAdd.PLGPRODUCT_CODE = data[0].PLGPRODUCT_CODE;
        this.dataAdd.PRASSET_FU = data[0].PRASSET_FU;
        if (data[0].PRASSET_TYPE == '1') {
          this.ictlink = false;
        } else {
          this.ictlink = true;
        }
        // this.setshowid(data[0].PLGPRODUCT_CODE);
        this.dataAdd.PROVINCE_ID = data[0].PROVINCE_ID;
        this.dataAdd.DISTRICT_ID = data[0].DISTRICT_ID;
        this.dataAdd.SUB_DISTRICT_ID = data[0].SUB_DISTRICT_ID;
        //  console.log(data[0].SUB_DISTRICT_ID);
        this.dataAdd.PRASSET_REASON = data[0].PRASSET_REASON;
        this.dataAdd.PRASSET_STATE = data[0].PRASSET_STATE;
        this.dataAdd.PRASSET_STORE1 = data[0].PRASSET_STORE1;
        this.dataAdd.PRASSET_SMONEY1 = this.numberWithCommas(parseFloat(data[0].PRASSET_SMONEY1).toFixed(2));
        this.dataAdd.PRASSET_SLINK1 = data[0].PRASSET_SLINK1;
        this.dataAdd.PRASSET_SLINK2 = data[0].PRASSET_SLINK2;
        this.dataAdd.PRASSET_STORE2 = data[0].PRASSET_STORE2;
        this.dataAdd.PRASSET_SMONEY2 = this.numberWithCommas(parseFloat(data[0].PRASSET_SMONEY2).toFixed(2));
        this.dataAdd.PRASSET_STORE3 = data[0].PRASSET_STORE3;
        this.dataAdd.PRASSET_SMONEY3 = this.numberWithCommas(parseFloat(data[0].PRASSET_SMONEY3).toFixed(2));
        this.dataAdd.PRASSET_BNAME = data[0].PRASSET_BNAME;
        this.dataAdd.PRASSET_BYEAR = data[0].PRASSET_BYEAR;
        this.dataAdd.PRASSET_OTHER = data[0].PRASSET_OTHER;
        this.dataAdd.PLSUBMONEYPAY_CODE = data[0].PLSUBMONEYPAY_CODE;
        this.dataAdd.PLGPRODUCT_CODE = data[0].PLGPRODUCT_CODE
        this.dataAdd.PLSUBMONEYPAY_CODE = data[0].PLSUBMONEYPAY_CODE
        this.dataAdd.PRMISSION_CODE = data[0].PRMISSION_CODE
        this.dataAdd.PRTARGET_CODE = data[0].PRTARGET_CODE
        this.dataAdd.PRASSET_INSIDE = data[0].PRASSET_INSIDE
        this.dataAdd.PRASSET_EXTERNAL = data[0].PRASSET_EXTERNAL
        this.dataAdd.PRASSET_RESEARCH = data[0].PRASSET_RESEARCH
        this.dataAdd.PRASSET_COURSET = data[0].PRASSET_COURSET
        this.dataAdd.PRASSET_PDEVELOP = data[0].PRASSET_PDEVELOP;
        this.dataAdd.PRASSET_PEXCELL = data[0].PRASSET_PEXCELL;
        this.dataAdd.PRASSET_ANOTHER = data[0].PRASSET_ANOTHER;
        // this.dataictlink(data[0].PRASSET_TYPE);
        // this.dataAdd.PRASSET_CYEAR =data[0].PRASSET_CYEAR
        this.dataAdd.PROBJECT_CODE = data[0].PROBJECT_CODE
        this.dataAdd.PRASSET_TYPE = data[0].PRASSET_TYPE
        // console.log(data[0].PRASSET_TYPE);
        //รายการวิชา
        var Tablesub = {
          "opt": "viewpsubject",
          "PRASSET_CODE": data[0].PRASSET_CODE
        }
        //console.log(Tablesub);
        this.dataPsub = null;
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
        this.rowpbu = null;
        this.rowpaap = true;
        this.rowpaapn = true;
      });
  }
  setshowbti() {
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
    this.dataAdd.PRASSET_COURSE = '';
    // this.dataAdd.PRASSET_DEGREE = '';
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
    this.dataAdd.PRASSET_REASON = '';
    this.dataAdd.PRASSET_STATE = '';
    this.dataAdd.PRASSET_STORE1 = '';
    this.dataAdd.PRASSET_SMONEY1 = '';
    this.dataAdd.PRASSET_SLINK1 = '';
    this.dataAdd.PRASSET_STORE2 = '';
    this.dataAdd.PRASSET_SMONEY2 = '';
    this.dataAdd.PRASSET_SLINK2 = '';
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
    this.dataAdd.List = [];
    this.dataAdd.List1 = [];

  }
  editdataapp(id: any) {
    this.setshowbti();
    this.onChangerister();
    this.dataAdd.opt = "readoneapp";
    //console.log(1);
    this.dataAdd.id = id;
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        this.onChangedistrict(data[0].PROVINCE_ID);
        this.onChangesubdistrict(data[0].DISTRICT_ID);
      });
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        // this.dataAdd  = data;
        this.dataAdd.RPLINCOME_CODE = data[0].PLINCOME_CODE;
        this.onChangecrpartrister();
        this.dataAdd.RCRPART_ID = data[0].CRPART_ID;
        this.dataAdd.PRASSET_CODE = data[0].PRASSET_CODE;
        this.dataAdd.FPLINCOME_CODE = data[0].PLINCOME_CODE;
        this.dataAdd.PRASSET_RSTATUS = 0;
        this.dataAdd.FCRPART_ID = data[0].CRPART_ID;
        this.dataAdd.PRASSET_CODE = data[0].PRASSET_CODE;
        if (data[0].TYPEFACULTY_CODE == 1) {
          this.dataAdd.TYPEFACULTY = "หลักสูตร/ฝ่าย";
        } else {
          this.dataAdd.TYPEFACULTY = "งาน";
        }
        this.dataAdd.PRASSET_NAME = data[0].PRREGISASSET_NAME + ' ตำบล' + data[0].SUB_DISTRICT_NAME_TH + ' อำเภอ' + data[0].DISTRICT_NAME_TH + ' จังหวัด' + data[0].PROVINCE_TNAME;
       
        this.dataAdd.PRYEARASSET_CODEA = data[0].PRYEARASSET_CODE;
        //this.dataAdd.PRREGISASSET_CODE = data[0].PRREGISASSET_CODE;
       // this.dataAdd.PRASSET_NUMBER = data[0].PRASSET_NUMBER;
        if(data[0].PRREGISASSET_CODE !=data[0].PRREGISASSET_CODEA){
         this.dataAdd.PRREGISASSET_CODEA = data[0].PRREGISASSET_CODEA;
        }else{
        this.dataAdd.PRREGISASSET_CODEA = data[0].PRREGISASSET_CODE;
        }
       if(data[0].PRASSET_NUMBER !=data[0].PRASSET_NUMBERA){
         this.dataAdd.PRASSET_NUMBER = data[0].PRASSET_NUMBERA; 
        }else{
        this.dataAdd.PRASSET_NUMBER = data[0].PRASSET_NUMBER;
        }
        this.dataAdd.GCUNIT_CODE = data[0].GCUNIT_CODE;
         if(data[0].PRASSET_MONEY !=data[0].PRASSET_MONEYA){
         this.dataAdd.sum = data[0].PRASSET_NUMBERA * data[0].PRASSET_MONEYA;   
        this.dataAdd.PRASSET_MONEY = this.numberWithCommas(parseFloat(data[0].PRASSET_MONEYA).toFixed(2));  
        }else{
        this.dataAdd.sum = data[0].PRASSET_NUMBER * data[0].PRASSET_MONEY;  
        this.dataAdd.PRASSET_MONEY = this.numberWithCommas(parseFloat(data[0].PRASSET_MONEY).toFixed(2));
        }
       // this.dataAdd.PRASSET_MONEY = this.numberWithCommas(parseFloat(data[0].PRASSET_MONEY).toFixed(2));
        this.dataAdd.PLASSETTYPE_CODE = data[0].PLASSETTYPE_CODE;
        this.dataAdd.PRASSET_REASON = data[0].PRASSET_REASON;
        this.dataAdd.PRASSET_MINIMUM = data[0].PRASSET_MINIMUM;
        this.dataAdd.PRASSET_AE = data[0].PRASSET_AE;
        this.dataAdd.PRASSET_AV = data[0].PRASSET_AV;
        this.dataAdd.PRASSET_DM = this.numberWithCommas(parseFloat(data[0].PRASSET_DM).toFixed(2));
        //this.dataAdd.PRASSET_UF = data[0].PRASSET_UF;
        //  this.dataAdd.PRASSET_COURSE = data[0].PRASSET_COURSE;
        // this.dataAdd.PRASSET_DEGREE = data[0].PRASSET_DEGREE;
        this.dataAdd.PRASSET_NS = data[0].PRASSET_NS;
        this.dataAdd.PRASSET_TARGET = data[0].PRASSET_TARGET;
        this.dataAdd.PRASSET_FRE = data[0].PRASSET_FRE;
        this.dataAdd.PRASSET_SMONTH = data[0].PRASSET_SMONTH;
        this.dataAdd.PRASSET_SYEAR = data[0].PRASSET_SYEAR;
        this.dataAdd.PRASSET_DMONTH = data[0].PRASSET_DMONTH;
        this.dataAdd.PRASSET_DYEAR = data[0].PRASSET_DYEAR;
        this.dataAdd.PLGPRODUCT_CODE = data[0].PLGPRODUCT_CODE;
        // this.setshowid(data[0].PLGPRODUCT_CODE);
        this.dataAdd.PROVINCE_ID = data[0].PROVINCE_ID;
        this.dataAdd.DISTRICT_ID = data[0].DISTRICT_ID;
        this.dataAdd.SUB_DISTRICT_ID = data[0].SUB_DISTRICT_ID;
        //  console.log(data[0].SUB_DISTRICT_ID);
        this.dataAdd.PRASSET_REASON = data[0].PRASSET_REASON;
        this.dataAdd.PRASSET_STATE = data[0].PRASSET_STATE;
        this.dataAdd.PRASSET_STORE1 = data[0].PRASSET_STORE1;
        this.dataAdd.PRASSET_SMONEY1 = this.numberWithCommas(parseFloat(data[0].PRASSET_SMONEY1).toFixed(2));
        this.dataAdd.PRASSET_SLINK1 = data[0].PRASSET_SLINK1;
        this.dataAdd.PRASSET_SLINK2 = data[0].PRASSET_SLINK2;
        this.dataAdd.PRASSET_STORE2 = data[0].PRASSET_STORE2;
        this.dataAdd.PRASSET_SMONEY2 = this.numberWithCommas(parseFloat(data[0].PRASSET_SMONEY2).toFixed(2));
        this.dataAdd.PRASSET_STORE3 = data[0].PRASSET_STORE3;
        this.dataAdd.PRASSET_SMONEY3 = this.numberWithCommas(parseFloat(data[0].PRASSET_SMONEY3).toFixed(2));
        this.dataAdd.PRASSET_BNAME = data[0].PRASSET_BNAME;
        this.dataAdd.PRASSET_BYEAR = data[0].PRASSET_BYEAR;
        this.dataAdd.PRASSET_OTHER = data[0].PRASSET_OTHER;
        this.dataAdd.PRASSET_PDEVELOP = data[0].PRASSET_PDEVELOP;
        this.dataAdd.PRASSET_PEXCELL = data[0].PRASSET_PEXCELL;
        this.dataAdd.PRASSET_ANOTHER = data[0].PRASSET_ANOTHER;
        this.dataAdd.PLSUBMONEYPAY_CODE = data[0].PLSUBMONEYPAY_CODE;
        this.dataAdd.PLGPRODUCT_CODE = data[0].PLGPRODUCT_CODE
        this.dataAdd.PLSUBMONEYPAY_CODE = data[0].PLSUBMONEYPAY_CODE
        this.dataAdd.PRMISSION_CODE = data[0].PRMISSION_CODE
        this.dataAdd.PRTARGET_CODE = data[0].PRTARGET_CODE
        this.dataAdd.PRASSET_INSIDE = data[0].PRASSET_INSIDE
        this.dataAdd.PRASSET_EXTERNAL = data[0].PRASSET_EXTERNAL
        this.dataAdd.PRASSET_RESEARCH = data[0].PRASSET_RESEARCH
        this.dataAdd.PRASSET_COURSET = data[0].PRASSET_COURSET
        this.dataAdd.PRASSET_FU = data[0].PRASSET_FU;
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
        this.dataAdd.PRASSETSPEC_DETAIL = data[0].PRASSETSPEC_DETAIL;
        this.dataAdd.PRASSETSPEC_NOTE = data[0].PRASSETSPEC_NOTE;
        this.dataAdd.CITIZEN_IDA = data[0].CITIZEN_IDA;
        this.dataAdd.CITIZEN_IDB = data[0].CITIZEN_IDB;
        this.dataAdd.CITIZEN_IDC = data[0].CITIZEN_IDC;
        this.dataAdd.CITIZEN_IDA1 = data[0].STF_FNAME1;
        this.dataAdd.CITIZEN_IDB1 = data[0].STF_FNAME2;
        this.dataAdd.CITIZEN_IDC1 = data[0].STF_FNAME3;
        // this.dataictlink(data[0].PRASSET_TYPE);
        // this.dataAdd.PRASSET_CYEAR =data[0].PRASSET_CYEAR
        this.dataAdd.PROBJECT_CODE = data[0].PROBJECT_CODE
        this.dataAdd.PRASSET_TYPE = data[0].PRASSET_TYPE
        // console.log(data[0].PRASSET_TYPE);
        //รายการวิชา
        var Tablesub = {
          "opt": "viewpsubject",
          "PRASSET_CODE": data[0].PRASSET_CODE
        }
        //console.log(Tablesub);
        this.dataPsub = null;
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

        this.rowpbu = true;
        this.rowpaap = null;
        this.rowpaapn = null;
      });
  }
  fetchclose() {
    this.clickshow = null;
  }
  CheckNum(num: any) {
    //console.log(num.keyCode); 
    if (num.keyCode < 46 || num.keyCode > 57) {
      alert('กรุณากรอกข้อมูล ที่เป็นตัวเลข');
      num.returnValue = false;
    }
  }
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
        this.dataPsub.push({ "CRSUBJECT_CODE": data[0].CRSUBJECT_CODE, "CRSUBJECT_TNAME": data[0].CRSUBJECT_TNAME });
      });

    //let num=this.dataAdd.List.length;
    for (let i = 0; i < this.dataAdd.SelectList.length; i++) {
      this.dataAdd.List.push(this.dataAdd.SelectList[i]);
      this.dataAdd.List1.push(this.dataAdd.SelectList[i]);
    }
    // console.log(this.dataAdd.SelectList); 
    //  console.log(this.dataPsub); 
    //   console.log(this.dataAdd.List1); 
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
  // ฟังก์ชันสำหรับการลบข้อมูล
  deleteData(id: any) {
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
  //แก้ไขข้อมูล
  updatedata() {
    if (this.dataAdd.PRASSET_NUMBER == '' || this.dataAdd.PRASSET_MONEY == '') {

      if (this.dataAdd.PRASSET_NUMBER == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกจำนวน");
      }
      if (this.dataAdd.PRASSET_MONEY == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกราคาต่อหน่วย");
      }
     
    } else {
      // console.log(this.dataAdd.List);  
      //console.log(this.dataAdd.SECTION_CODE); 
      this.dataAdd.opt = "update";

      this.apiService
        .getupdate(this.dataAdd, this.url)
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
  mission(value: any) {
    //console.log
    if (value == 1) {
      this.dynamicVariable = true;
    } else {
      this.dynamicVariable = false;
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
  // ฟังก์ขันสำหรับการเพิ่มข้อมูล/และแก้ไขข้อมูล
  insertdata(id: any) {
    this.dataAdd.PRASSET_ASTATUS = id;
    //console.log(this.dataAdd.PRASSET_COURSET );
    if (this.dataAdd.PRASSET_NAME == '' || this.dataAdd.PRASSET_NUMBER == '' || this.dataAdd.PRASSET_MONEY == ''
      || this.dataAdd.PRASSET_MINIMUM == '' || this.dataAdd.PRASSET_AE == '' || this.dataAdd.PRASSET_AV == '' || this.dataAdd.PRASSET_DM == ''
      || this.dataAdd.SUB_DISTRICT_ID == '' || this.dataAdd.PRASSET_SMONTH == '' || this.dataAdd.PRASSET_SYEAR == ''
      || this.dataAdd.PRASSET_DMONTH == '' || this.dataAdd.PRASSET_DYEAR == '') {
      if (this.dataAdd.PRASSET_NAME == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกชื่อรายการครุภัณฑ์");
      }
      if (this.dataAdd.PRASSET_NUMBER == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกจำนวน");
      }
      if (this.dataAdd.PRASSET_MONEY == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกราคาต่อหน่วย");
      }
      if (this.dataAdd.PRASSET_MINIMUM == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกมาตรฐานขั้นต่ำที่ควรมี");
      }
      if (this.dataAdd.PRASSET_AE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกจำนวนที่มีอยู่แล้ว");
      }
      if (this.dataAdd.PRASSET_AV == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกจำนวนที่ใช้การได้");
      }
      if (this.dataAdd.PRASSET_DM == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกจำนวนชำรุด");
      }
      if (this.dataAdd.SUB_DISTRICT_ID == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกตำบล");
      }
      if (this.dataAdd.PRASSET_COURSE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกหลักสูตร");
      }
      if (this.dataAdd.PRASSET_SMONTH == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกลงนามสัญญา(เดือน)");
      }
      if (this.dataAdd.PRASSET_DMONTH == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกเบิกจ่าย(เดือน)");
      }
      if (this.dataAdd.PRASSET_DYEAR == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกเบิกจ่าย(ปี)");
      }
    } else {
      this.dataAdd.opt = "insert";
      this.dataAdd.PRASSET_COURSET = this.dataAdd.PRASSET_COURSET.replaceAll("<br>", "<br/>");
      this.dataAdd.PRASSET_COURSET = this.dataAdd.PRASSET_COURSET.replaceAll("<p>", "<br/>");
      this.dataAdd.PRASSET_COURSET = this.dataAdd.PRASSET_COURSET.replaceAll("</p>", "");
      this.dataAdd.PRASSET_TARGET = this.dataAdd.PRASSET_TARGET.replaceAll("<br>", "<br/>");
      this.dataAdd.PRASSET_TARGET = this.dataAdd.PRASSET_TARGET.replaceAll("<p>", "<br/>");
      this.dataAdd.PRASSET_TARGET = this.dataAdd.PRASSET_TARGET.replaceAll("</p>", "");
      this.dataAdd.PRASSET_REASON = this.dataAdd.PRASSET_REASON.replaceAll("<br>", "<br/>");
      this.dataAdd.PRASSET_REASON = this.dataAdd.PRASSET_REASON.replaceAll("<p>", "<br/>");
      this.dataAdd.PRASSET_REASON = this.dataAdd.PRASSET_REASON.replaceAll("</p>", "");
      this.dataAdd.PRASSET_INSIDE = this.dataAdd.PRASSET_INSIDE.replaceAll("<p>", "<br/>");
      this.dataAdd.PRASSET_INSIDE = this.dataAdd.PRASSET_INSIDE.replaceAll("</p>", "");
      this.dataAdd.PRASSET_EXTERNAL = this.dataAdd.PRASSET_EXTERNAL.replaceAll("<br>", "<br/>");
      this.dataAdd.PRASSET_EXTERNAL = this.dataAdd.PRASSET_EXTERNAL.replaceAll("<p>", "<br/>");
      this.dataAdd.PRASSET_EXTERNAL = this.dataAdd.PRASSET_EXTERNAL.replaceAll("</p>", "");
      this.dataAdd.PRASSET_RESEARCH = this.dataAdd.PRASSET_RESEARCH.replaceAll("<br>", "<br/>");
      this.dataAdd.PRASSET_RESEARCH = this.dataAdd.PRASSET_RESEARCH.replaceAll("<p>", "<br/>");
      this.dataAdd.PRASSET_RESEARCH = this.dataAdd.PRASSET_RESEARCH.replaceAll("</p>", "");
      this.apiService
        .getupdate(this.dataAdd, this.url)
        .pipe(first())
        .subscribe((data: any) => {
          //console.log(data.status);       
          if (data.status == 1) {
            this.toastr.success("แจ้งเตือน:เพิ่มข้อมูลเรียบร้อยแล้ว");
            this.fetchdatalist();
            this.fetchdatalistapp();
            // document.getElementById("ModalClose")?.click();
            this.clickshow = null;
          }
        });
    }
  }
  showapp(code: any, name: any) {
    this.clickshow = true;
    this.dataAdd.PRASSETAPP_CODE = code;
    this.dataAdd.htmlStringd = name;
    this.dataAdd.PRASSETFAC_NOTE = '';
    this.dataAdd.PRASSET_PSTATUS = 0;
  }

  open() {
    this.stbtn == true ? this.stbtn = null : this.stbtn = true;
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
  showHide() {
    if (this.dataAdd.RPLINCOME_CODE == '02') {
      this.dataAdd.PRASSET_TYPE = '3';
      this.rowict = 1;
    } else {
      this.rowict = '';
    }
  }
  calexpenses() {
    this.dataAdd.sum = this.dataAdd.PRASSET_NUMBER * this.dataAdd.PRASSET_MONEY.replace(/,/g, "");
  }
  onChangecrpartrister() {
    this.dataAdd.opt = "viewcrpartregis";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataCrpartregis = data;
        //console.log(this.dataSub);
      });
  }
  // ฟังก์ขันสำหรับการดึงข้อมูลทะเบียนครุภัณฑ์     
   onChangerister() {
   // this.dataAdd.checkregis =Array;
    this.datalistregister =null;
    this.dataAdd.opt = "readregis"; 
    this.apiService
    .getdata(this.dataAdd,this.url)
    .pipe(first())
    .subscribe((data: any) => {
      if(data.status==1){
      this.datalistregister  = data.data;
      }
    });         
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
  previewPdf(url: string) {
    this.previewPdfUrl = url;
    this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url + '#navpanes=0');
  }
  closePdfPreview() {
    this.previewPdfUrl = '';
    this.safePdfUrl = '';
  }
}
