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
import Swal from 'sweetalert2';
import { auto } from '@popperjs/core';

@Component({
  selector: 'app-approvebuilding',
  templateUrl: './approvebuilding.component.html',
  styleUrls: ['./approvebuilding.component.scss']
})
export class ApprovebuildingComponent implements OnInit {
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
  datalistapp: any;
  rowpbi: any;
  rowpbu: any;
  clickshow: any;
  rowpaap: any;
  rowpaapn: any;
  datastatus: any;
  dataCrpartregis: any;
  url = "/acc3d/investment/approve/applistbuilding.php";
  url1 = "/acc3d/investment/userpermission.php";
  //dataAdd:any = {PRBOBJECT_NAME:[],PRBOBJECT_CODE:[],PRUSE_NAME:[],PRUSE_CODE:[]};
  dataAdd: any = {};
  searchTerm: any;
  searchTermd: any;
  selectedDevice: any;
  loading: any;
  loadingapp: any;
  page = 1;
  count = 0;
  tableSize = 20;
  tableSizes = [20, 30, 40];
  tablemonth = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

  rownum: any;
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
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    document.getElementById("ModalClose")?.click();
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
            // console.log(data);
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
    /*   var Tabley = {
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
              this.dataAdd.CRPART_ID = '';//datacr[0].CRPART_ID;
            }); 
                 
      });   */
    //รายการปี
    var Tableyp = {
      "opt": "viewyearp"
    }
    this.apiService
      .getdata(Tableyp, this.url1)
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
  // ฟังก์ขันสำหรับการดึงข้อมูลสิ่งก่อสร้าง
  fetchdatalist() {
    this.dataAdd.opt = "readAll";
    this.loading = true;
    this.datalist = null;
    this.dataAdd.code = null;
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == 1) {
          this.datalist = data.data;
          this.dataAdd.code = data.FACULTY_CODE;
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
  // ฟังก์ขันสำหรับการดึงข้อมูลสิ่งก่อสร้าง
  fetchdatalistapp() {
    this.dataAdd.opt = "readAllapp";
    this.loadingapp = true;
    this.datalistapp = null;
    this.dataAdd.fcode = null;
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == 1) {
          this.datalistapp = data.data;
          this.dataAdd.fcode = data.FACULTY_CODE;
          this.rownum = 'true';
          this.loadingapp = null;
          // console.log('1');
        } else {
          this.datalistapp = data.data;
          this.loadingapp = null;
          this.rownum = null;
          this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
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
        console.log(data);
        this.dataCrpart = data;
        this.dataAdd.CRPART_ID = data[0].CRPART_ID;

      });
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
  setshowmoney(deviceValue: any, devicenum: any) {
    this.dataAdd.PRBUILDING_MONEYT = this.numberWithCommas(deviceValue * devicenum);
    this.dataAdd.PRBUILDING_MONEYD = this.numberWithCommas((deviceValue * devicenum) - (deviceValue * devicenum) * 5 / 100);
    this.dataAdd.PRBUILDING_MONEYP = this.numberWithCommas((deviceValue * devicenum) * 5 / 100);

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
    /*this.dataAdd.PRBOBJECT_NAME[0] = '';
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

  }
  // ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
  editdata(id: any) {
    // this.clickshow=true; 
    this.setshowbti();
    this.apiService
      .getById(id, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        //console.log(data);
        this.onChangedistrict(data[0].PROVINCE_ID);
        this.onChangesubdistrict(data[0].DISTRICT_ID);
      });
    this.apiService
      .getById(id, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataAdd.AFACULTY_CODE = data[0].FACULTY_CODE;
        this.dataAdd.RPLINCOME_CODE = data[0].PLINCOME_CODE;
        this.onChangecrpartrister();
        this.dataAdd.RCRPART_ID = data[0].CRPART_ID;
        this.dataAdd.PRBUILDING_RSTATUS = 0;
        this.dataAdd.PRBUILDING_CODE = data[0].PRBUILDING_CODE;
        this.dataAdd.PRBUILDING_NAME = data[0].PRREGISBUILDING_NAME + ' ตำบล' + data[0].SUB_DISTRICT_NAME_TH + ' อำเภอ' + data[0].DISTRICT_NAME_TH + ' จังหวัด' + data[0].PROVINCE_TNAME;;
        this.dataAdd.PRBUILDING_NUMBER = data[0].PRBUILDING_NUMBER;
        this.dataAdd.GCUNIT_CODE = data[0].GCUNIT_CODE;
        this.dataAdd.PRBUILDING_MONEY = this.numberWithCommas(Number(data[0].PRBUILDING_MONEY).toFixed(2));
        this.dataAdd.PRBUILDING_REASON = data[0].PRBUILDING_REASON;
        this.dataAdd.PRBUILDING_OBJECT = data[0].PRBUILDING_OBJECT;
        this.dataAdd.PRBUILDING_PAT = data[0].PRBUILDING_PAT;
        this.dataAdd.PRBUILDING_PRICE = data[0].PRBUILDING_PRICE;
        this.dataAdd.PRBUILDING_USE = data[0].PRBUILDING_USE;
        this.dataAdd.PLGPRODUCT_CODE = data[0].PLGPRODUCT_CODE;
        this.dataAdd.PROVINCE_ID = data[0].PROVINCE_ID;
        this.dataAdd.DISTRICT_ID = data[0].DISTRICT_ID;
        this.dataAdd.SUB_DISTRICT_ID = data[0].SUB_DISTRICT_ID;
        this.dataAdd.PRBUILDING_TYPE = data[0].PRBUILDING_TYPE;
        this.dataAdd.PRBUILDING_YEAR = data[0].PRBUILDING_YEAR;
        this.dataAdd.PRBUILDING_SYEAR = data[0].PRBUILDING_SYEAR;

        this.dataAdd.PRBUILDING_EYEAR = data[0].PRBUILDING_EYEAR;
        this.dataAdd.PRBUILDING_LOOK = data[0].PRBUILDING_LOOK;
        this.dataAdd.PRBUILDING_HEIGHT = data[0].PRBUILDING_HEIGHT;
        this.dataAdd.PRBUILDING_AREA = data[0].PRBUILDING_AREA;
        this.dataAdd.PRBUILDING_APRICE = this.numberWithCommas(Number(data[0].PRBUILDING_APRICE).toFixed(2));
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
        this.dataAdd.PRBUILDING_SMONEY = this.numberWithCommas(Number(data[0].PRBUILDING_SMONEY).toFixed(2));
        let deviceValue = data[0].PRBUILDING_MONEY;
        let devicenum = data[0].PRBUILDING_NUMBER;
        this.showbuid();
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
        //this.rowpbi='';
        this.rowpbu = null;
        this.rowpaap = true;
        this.rowpaapn = true;

      });
  }
  fetchclose() {
    this.clickshow = null;
  }
  // ฟังก์ขันสำหรับการเพิ่มข้อมูล/และแก้ไขข้อมูล
  insertdata(id: any) {
    this.dataAdd.PRBUILDING_ASTATUS = id;
    //console.log(this.dataAdd);
    if (this.dataAdd.PRBUILDING_NAME == '' || this.dataAdd.PRBUILDING_NUMBER == '' || this.dataAdd.PRBUILDING_MONEY == ''
      || this.dataAdd.PRBUILDING_REASON == '') {
      if (this.dataAdd.PRASSET_NAME == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกชื่อรายการสิ่งก่อสร้าง");
      }
      if (this.dataAdd.PRBUILDING_NUMBER == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกจำนวน");
      }
      if (this.dataAdd.PRBUILDING_MONEY == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกราคาต่อหน่วย");
      }
      if (this.dataAdd.PRBUILDING_REASON == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกเหตุผลความจำเป็น");
      }
    } else {
      this.dataAdd.opt = "insert";
      this.dataAdd.PRBUILDING_REASON = this.dataAdd.PRBUILDING_REASON.replaceAll("<br>", "<br/>");
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
      this.dataAdd.PRBUILDING_ANOTHER = this.dataAdd.PRBUILDING_ANOTHER.replaceAll("</p>", "");
      this.apiService
        .getupdate(this.dataAdd, this.url)
        .pipe(first())
        .subscribe((data: any) => {
          //console.log(data);       
          if (data.status == 1) {
            this.toastr.success("แจ้งเตือน::อนุมัติข้อมูลเรียบร้อยแล้ว ");
            this.clickshow = null;
            this.fetchdatalist();
            this.fetchdatalistapp();
            document.getElementById("ModalClose")?.click();
          } else {
            this.toastr.warning("แจ้งเตือน:ไม่สามารถเพิ่มข้อมูลได้");

          }
        });
    }
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
        this.dataAdd.AFACULTY_CODE = data[0].FACULTY_CODE;
        //console.log(data[0].FACULTY_CODE);
        this.dataAdd.RPLINCOME_CODE = data[0].PLINCOME_CODE;
        this.onChangecrpartrister();
        this.dataAdd.PRYEARASSET_CODEA = data[0].PRYEARASSET_CODE;
        if(data[0].PRREGISBUILDING_CODE !=data[0].PRREGISBUILDING_CODEA && data[0].PRREGISBUILDING_CODEA !=null){
         this.dataAdd.PRREGISASSET_CODEA = data[0].PRREGISBUILDING_CODEA;
        }else{
        this.dataAdd.PRREGISASSET_CODEA = data[0].PRREGISBUILDING_CODE;
        }
        this.dataAdd.RCRPART_ID = data[0].CRPART_ID;
        this.dataAdd.PRBUILDING_CODE = data[0].PRBUILDING_CODE;
        this.dataAdd.PRBUILDING_NAME = data[0].PRREGISBUILDING_NAME;
        //this.dataAdd.PRBUILDING_NUMBER = Number(data[0].PRBUILDING_NUMBER);
         if(data[0].PRBUILDING_NUMBER !=data[0].PRBUILDING_NUMBERA  && data[0].PRBUILDING_NUMBERA !=null){
         this.dataAdd.PRASSET_NUMBER = Number(data[0].PRBUILDING_NUMBERA);
        }else{
        this.dataAdd.PRASSET_NUMBER = Number(data[0].PRBUILDING_NUMBER);
        }
        this.dataAdd.GCUNIT_CODE = data[0].GCUNIT_CODE;
       // this.dataAdd.PRBUILDING_MONEY = this.numberWithCommas(Number(data[0].PRBUILDING_MONEY).toFixed(2));
       if(data[0].PRBUILDING_MONEY !=data[0].PRBUILDING_MONEYA && data[0].PRBUILDING_MONEYA !=null){
         this.dataAdd.PRASSET_MONEY = this.numberWithCommas(Number(data[0].PRBUILDING_MONEYA).toFixed(2)); 
        }else{
        this.dataAdd.PRASSET_MONEY = this.numberWithCommas(Number(data[0].PRBUILDING_MONEY).toFixed(2));
        }
        this.dataAdd.PRBUILDING_REASON = data[0].PRBUILDING_REASON;
        this.dataAdd.PRBUILDING_OBJECT = data[0].PRBUILDING_OBJECT;
        this.dataAdd.PRBUILDING_PAT = data[0].PRBUILDING_PAT;
        this.dataAdd.PRBUILDING_PRICE = data[0].PRBUILDING_PRICE;
        this.dataAdd.PRBUILDING_USE = data[0].PRBUILDING_USE;
        this.dataAdd.PLGPRODUCT_CODE = data[0].PLGPRODUCT_CODE;
        this.dataAdd.PROVINCE_ID = data[0].PROVINCE_ID;
        this.dataAdd.DISTRICT_ID = data[0].DISTRICT_ID;
        this.dataAdd.SUB_DISTRICT_ID = data[0].SUB_DISTRICT_ID;
        this.dataAdd.PRBUILDING_TYPE = data[0].PRBUILDING_TYPE;
        this.dataAdd.PRBUILDING_YEAR = data[0].PRBUILDING_YEAR;
        this.dataAdd.PRBUILDING_SYEAR = data[0].PRBUILDING_SYEAR;
        this.dataAdd.PRBUILDING_EYEAR = data[0].PRBUILDING_EYEAR;
        this.dataAdd.PRBUILDING_LOOK = data[0].PRBUILDING_LOOK;
        this.dataAdd.PRBUILDING_HEIGHT = data[0].PRBUILDING_HEIGHT;
        this.dataAdd.PRBUILDING_AREA = data[0].PRBUILDING_AREA;
        this.dataAdd.PRBUILDING_APRICE = this.numberWithCommas(Number(data[0].PRBUILDING_APRICE).toFixed(2));
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
        this.dataAdd.PRBUILDING_RSTATUS = data[0].PRBUILDING_RSTATUS;;
        this.dataAdd.PRBUILDING_PDEVELOP = data[0].PRBUILDING_PDEVELOP
        this.dataAdd.PRBUILDING_PEXCELL = data[0].PRBUILDING_PEXCELL;
        this.dataAdd.PRBUILDING_ANOTHER = data[0].PRBUILDING_ANOTHER;
        this.dataAdd.PRBUILDING_SMONEY = this.numberWithCommas(Number(data[0].PRBUILDING_MONEY).toFixed(2));
        let deviceValue = data[0].PRBUILDING_MONEY;
        let devicenum = data[0].PRBUILDING_NUMBER;
        this.showbuid();

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
            // console.log(data[0].PRBUILDING_YEAR);
            this.dataAdd.PRBUILDING_SYEAR1 = data[0].PRBUILDING_SYEAR;
            this.dataAdd.PRBUILDING_SYEAR2 = Number(data[0].PRBUILDING_SYEAR) + 1;
            this.dataAdd.PRBUILDING_MONEY1 = this.numberWithCommas(Number((deviceValue * devicenum) - (deviceValue * devicenum) * 5 / 100) * 20 / 100);
            this.dataAdd.PRBUILDING_MONEY2 = this.numberWithCommas(Number((deviceValue * devicenum) - (deviceValue * devicenum) * 5 / 100) - ((deviceValue * devicenum) - (deviceValue * devicenum) * 5 / 100) * 20 / 100);
          }
        }
        this.rowpbi = '';
        this.rowpbu = 1;
        this.rowpaap = null;
        this.rowpaapn = null;

      });
  }
  //แก้ไขข้อมูล
  updatedata() {
    if (this.dataAdd.PRASSET_NUMBER == '' || this.dataAdd.PRASSET_MONEY == '') {
      if (this.dataAdd.PRASSET_MONEY == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกชื่อรายการสิ่งก่อสร้าง");
      }
      if (this.dataAdd.PRASSET_NUMBER == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกจำนวน");
      }
      if (this.dataAdd.PRBUILDING_MONEY == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกราคาต่อหน่วย");
      }
      

    } else {
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
  numberWithCommas(x: any) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
  //เช็คตัวเลข
  CheckNum(num: any) {
    if (num.keyCode < 46 || num.keyCode > 57) {
      alert('กรุณากรอกข้อมูล ที่เป็นตัวเลข');
      num.returnValue = false;
    }
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
  keymon() {
    this.dataAdd.PRBUILDING_SMONEY = this.dataAdd.PRBUILDING_MONEY;
  }
  showapp(code: any, name: any) {
    this.clickshow = true;
    this.dataAdd.PRASSETAPP_CODE = code;
    this.dataAdd.htmlStringd = name;
    this.dataAdd.PRASSETFAC_NOTE = '';
    this.dataAdd.PRASSET_PSTATUS = 0;
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
  previewPdf(pdfUrl: string) {
    this.previewPdfUrl = pdfUrl;
    this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
  }

  closePdfPreview() {
    this.previewPdfUrl = '';
    this.safePdfUrl = '';
  }
}
