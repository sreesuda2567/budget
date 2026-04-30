import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { ApiPdoService } from '../../../../_services/api-pui.service';
import { TokenStorageService } from '../../../../_services/token-storage.service';
import { first, map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-listexpenses',
  templateUrl: './listexpenses.component.html',
  styleUrls: ['./listexpenses.component.scss']
})
export class ListexpensesComponent implements OnInit {
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
  datalistdetail: any;
  loading: any;
  dataESection: any;
  dataEIncome: any;
  dataECrpart: any;
  dataEYear: any;
  dataPlproduct: any;
  dataMidbudget: any;
  rownum: any;
  rowpl: any;
  rowpm: any;
  rowpbi: any;
  rowpbu: any;
  pp: any;
  dataESubplmoneypay: any;
  dataEDepartment: any;
  datafrc: any;
  number: any = [1, 2, 3, 4, 5];
  dataEpl: any;
  dataFAdd: any = {};
  searchTerm: any;
  clickshow: any;
  databook: any;
  url = "/acc3d/budget/expenses/listexpenses.php";
  url1 = "/acc3d/budget/userpermission.php";
  url2 = "/acc3d/budget/expenses/creditor.php";
  dataAdd: any = {};
  page = 1;
  count = 0;
  tableSize = 10;
  tableSizes = [10, 20, 30];
  constructor(
    private tokenStorage: TokenStorageService,
    private apiService: ApiPdoService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private eRef: ElementRef,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.fetchdata();
    this.dataAdd.citizen = this.tokenStorage.getUser().citizen;

  }
  keyword = 'name';
  datacomplete: any;

  selectEvent(item: any) {
    this.dataAdd.FNCREDITOR_CODE = item.id;
  }

  onChangeSearch(val: string) {
    var varP = {
      "opt": "viewFNCREDITOR",
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
  onFocused(id: any, val: any) {
    this.dataAdd.FNCREDITOR_CODE1 = { "id": id, "name": val };
  }
  fetchdata() {
    //ดึงคณะตามสังกัด
    var varN = {
      "opt": "viewufac",
      "citizen": this.tokenStorage.getUser().citizen
    }
    this.apiService
      .getdata(varN, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataAdd.UFACULTY_CODE = data[0].FACULTY_CODE;
        this.dataAdd.UCAMPUS_CODE = data[0].CAMPUS_CODE;

      });
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
        var varNf = {
          "opt": "viewfac",
          "citizen": this.tokenStorage.getUser().citizen,
          "PRIVILEGERSTATUS": data[0].PRIVILEGE_RSTATUS
        }
        this.apiService
          .getdata(varNf, this.url1)
          .pipe(first())
          .subscribe((data: any) => {
            this.dataFac = data;
            // console.log(data[0].FACULTY_CODE);
            this.dataAdd.FACULTY_CODE = data[0].FACULTY_CODE;

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
        this.dataYear = data;
        this.dataAdd.PLYEARBUDGET_CODE = data[0].PLYEARBUDGET_CODE;
        //รายการงบ
        var Table1 = {
          "opt": "viewPLMONEYPAY",
          "PLYEARBUDGET_CODE": data[0].PLYEARBUDGET_CODE
        }
        //console.log(Table1);   
        this.apiService
          .getdata(Table1, this.url1)
          .pipe(first())
          .subscribe((data: any) => {
            this.dataMoneypay = data;
            this.dataAdd.PLMONEYPAY_CODE = data[0].PLMONEYPAY_CODE;
          });
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
       /* //รายการงบกลาง
        var Tablem = {
          "opt": "PLMIDDLEBUDGET",
          "PLYEARBUDGET_CODE": data[0].PLYEARBUDGET_CODE
        }
        this.apiService
          .getdata(Tablem, this.url1)
          .pipe(first())
          .subscribe((data: any) => {
            this.dataMidbudget = data;
            this.dataAdd.PLMIDDLEBUDGET_CODE = data[0].PLMIDDLEBUDGET_CODE;
          });*/

      });

 
    // console.log(this.dataAdd);
  }
    onChangmid() {
   // this.databook = null;
    this.dataAdd.opt = "PLMIDDLEBUDGET";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataMidbudget = data;
        //this.dataAdd.CHIEF_CODE=data[2].CHIEF_CODE;
      });
  }
  onChangannalreq() {
    this.databook = null;
    this.dataAdd.opt = "viewannalreq";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.databook = data;
        //this.dataAdd.CHIEF_CODE=data[2].CHIEF_CODE;
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
        //หมวดรายจ่าย
        this.dataAdd.opt = "viewCPLMONEYPAY";
        this.apiService
          .getdata(this.dataAdd, this.url1)
          .pipe(first())
          .subscribe((data: any) => {
            this.dataMoneypay = data;
            this.dataAdd.PLMONEYPAY_CODE = data[0].PLMONEYPAY_CODE;
          });

      });
  }


  //หมวดรายจ่าย
  fetchdatalistmo() {
    this.dataAdd.opt = "viewCPLMONEYPAY";
    // console.log(this.dataAdd);
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataMoneypay = data;
        this.dataAdd.PLMONEYPAY_CODE = data[0].PLMONEYPAY_CODE;
      });
  }
  showbook() {
    // this.setshowbti();
    for (let i = 0; i < this.databook.length; i++) {
      if ((this.databook[i].FNANNALS_CODE == this.dataAdd.FNANNALS_CODE)) {
        this.dataAdd.FNEXPENSES_NUMBOOK=this.databook[i].FNANNALS_NO;
        this.dataAdd.FNEXPENSES_TITLE = this.databook[i].FNANNALS_BOOK_SUB;
        this.dataAdd.link = this.databook[i].FNANNALSSEQ_LINK;
        this.dataAdd.FNCREDITOR_CODE = this.databook[i].FNCREDITOR_CODE;
        this.dataAdd.FNCREDITOR_CODE1 = this.databook[i].FNCREDITOR_NAME;
        this.dataAdd.DEPARTMENT_CODE = this.databook[i].DEPARTMENT_CODE;
        this.fetchdatalistsub();
        this.dataAdd.SECTION_CODE = this.databook[i].SECTION_CODE;
        this.dataAdd.FNANNALSSEQ_LINK= this.databook[i].FNANNALSSEQ_LINK;
        this.dataAdd.FNEXPENSES_CCDATE = this.databook[i].FNANNALS_BOOK_SDATE;
        this.dataAdd.FNEXPENSES_OMONEY = this.numberWithCommas(Number(this.databook[i].FNANNALS_AMOUNT).toFixed(2));
      }
    }
  }
  exportpdf(link: any) {
    let url = link;
    window.open(url, '_blank');
  }    
  fetchdatalist() {
    this.onChangmid();
    //ผลผลิต  
    this.loading = true;
    this.datalist = null;
    this.dataAdd.opt = 'PLPRODUCTTRL';
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((datapro: any) => {
        this.dataPlproduct = datapro;
        this.rownum = 1;
      });

    this.loading = true;
    this.datalist = null;

    this.dataAdd.opt = 'readAll1';
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == 1) {
          this.datalist = data.data;
          this.loading = null;
          this.rownum = 1;
          this.fetchdatalistsubm();
        } else {
          this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูลการจัดสรรงบประมาณ");
          this.loading = null;
          //console.log('1');
        }
        this.dataAdd.opt = 'viewDEPARTMENT';
        this.apiService
          .getdata(this.dataAdd, this.url1)
          .pipe(first())
          .subscribe((dataedp: any) => {
            this.dataEDepartment = dataedp;
          });
      })
    let PLTRBUDGET_CODE = this.dataAdd.FACULTY_CODE + this.dataAdd.PLYEARBUDGET_CODE + this.dataAdd.PLINCOME_CODE + this.dataAdd.CRPART_ID + this.dataAdd.PLYEARBUDGET_CODE + this.dataAdd.PLMONEYPAY_CODE;
    // console.log(PLTRBUDGET_CODE);
    this.showdatapl(PLTRBUDGET_CODE);
    this.onChangannalreq(); 
  }
  showdatalist(mcode: any, msubcode: any, prcode: any, ycode: any, faccode: any, incode: any, crcode: any, pcode: any, sub1: any, sub2: any, money: any) {
    this.dataAdd.PLMONEYPAY_CODE1 = mcode;
    this.dataAdd.PLYEARBUDGET_CODE1 = ycode;
    this.dataAdd.PLINCOME_CODE1 = incode;
    this.dataAdd.CRPART_ID1 = crcode;
    this.dataAdd.PLGPRODUCT_CODE = prcode.substring(sub1, sub2);
    this.dataAdd.PLSUBMONEYPAY_CODE = msubcode;
    this.dataAdd.MONEY = money.replace(/,/g, "");
    this.dataAdd.CODEMONEY = msubcode.substring(0, 4);
    this.rowpm = mcode;
    if (mcode != '26') {
      this.dataAdd.PLMIDDLEBUDGET_CODE1 = 0;
    } else {
      this.dataAdd.PLMIDDLEBUDGET_CODE1 = 1;
    }

    this.dataAdd.PLPROJECT_CODE1 = 0;
    this.dataAdd.PLPROJECT_CODE = '';
    this.rowpl = '';
    if (pcode != null) {
      this.rowpl = 1;
      this.dataAdd.PLPROJECT_CODE1 = 1;
      this.dataAdd.PLPROJECT_CODE = pcode;
    }
    this.fetchdatalistfn();
    this.rowpbi = 1;
    this.rowpbu = '';
    // console.log(this.dataAdd.PLPROJECT_CODE1);
  }
  fetchclose() {
    this.clickshow = null;
  }
  showapp() {
    //console.log('1');
    this.clickshow = true;
  }
  //รายการเบิก
  fetchdatalistfn() {
    this.datalistdetail = null;
    this.dataAdd.opt = "readexpen";
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        this.datalistdetail = data.data;
      });
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
  CheckNum(num: any) {
    //console.log(num.keyCode); 
    if (num.keyCode < 46 || num.keyCode > 57) {
      alert('กรุณากรอกข้อมูล ที่เป็นตัวเลข');
      num.returnValue = false;
    }
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
        Swal.fire('ลบข้อมูล!', 'ลบข้อมูลเรียบร้อยแล้ว', 'success');
        this.datalistdetail = null;
        this.dataAdd.id = id;
        this.dataAdd.opt = "delete";
        this.apiService
          .getdata(this.dataAdd, this.url)
          .pipe(first())
          .subscribe((data: any) => {
            if (data.status == 1) {
              this.fetchdatalistfn();
            }
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('ยกเลิก', 'ยกเลิกการลบข้อมูล', 'error');
      }
    });

  }
  // ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
  editdata(id: any) {
    this.cleardata();
    this.dataAdd.opt = "readone";
    this.dataAdd.id = id;
    //console.log(this.dataAdd);
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        /*var Table2 = {
          "opt": "viewDEPARTMENT",
          "FACULTY_CODE":data.data[0].FACULTY_CODE
        }
        this.apiService
        .getdata(Table2,this.url1)
        .pipe(first())
        .subscribe((dataedp: any) => {
        this.dataEDepartment = dataedp;
        });  
             //หลักสูตร
       var Table3 = {
        "opt": "viewSECTION",
        "DEPARTMENT_CODE":data.data[0].DEPARTMENT_CODE
      }
      this.apiService
      .getdata(Table3,this.url1)
      .pipe(first())
      .subscribe((datasec: any) => {
      this.dataESection = datasec;
      }); */
        //this.dataAdd = data.data[0];FNANNALS_CODE
        this.dataAdd.FNEXPENSES_CODE = data.data[0].FNEXPENSES_CODE;
        this.dataAdd.FNEXPENSES_NUMBOOK = data.data[0].FNEXPENSES_NUMBOOK;
        this.dataAdd.FNEXPENSES_TITLE = data.data[0].FNEXPENSES_TITLE;
        this.dataAdd.FNEXPENSES_CCDATE = data.data[0].FNEXPENSES_CCDATE;
        this.dataAdd.DEPARTMENT_CODE = data.data[0].DEPARTMENT_CODE;
        this.dataAdd.FNANNALS_CODE = data.data[0].FNANNALS_CODE;
        this.fetchdatalistsub();
        this.dataAdd.SECTION_CODE = data.data[0].SECTION_CODE;
        this.dataAdd.FNEXPENSES_OMONEY = this.numberWithCommas(Number(data.data[0].FNEXPENSES_OMONEY).toFixed(2));
        this.dataAdd.FNEXPENSES_EXTEND = data.data[0].FNEXPENSES_EXTEND;
        this.dataAdd.FNCREDITOR_CODE = data.data[0].FNCREDITOR_CODE;
        this.dataAdd.PLPROJECT_CODE = data.data[0].PLPROJECT_CODE;
        this.dataAdd.PLMIDDLEBUDGET_CODE = data.data[0].PLMIDDLEBUDGET_CODE;
        this.onFocused(data.data[0].FNCREDITOR_CODE, data.data[0].FNCREDITOR_NAME);
        this.dataAdd.SECTION_CODE = data.data[0].SECTION_CODE;
        if (data.data[0].PLPROJECT_CODE == '') {
          this.dataAdd.PLPROJECT_CODE1 = 0;
        } else {
          this.dataAdd.PLPROJECT_CODE1 = 1;
        }
        if (this.dataAdd.PLMONEYPAY_CODE1 == '26') {
          this.dataAdd.PLMIDDLEBUDGET_CODE1 = 1;
        } else {
          this.dataAdd.PLMIDDLEBUDGET_CODE1 = 0;
        }
        //console.log(data.data[0].PLPROJECT_CODE);
      });
    this.rowpbi = '';
    this.rowpbu = 1;
  }
  //เพิ่มข้อมูล
  insertdata() {
    if (this.dataAdd.PLMONEYPAY_CODE != '26' && (this.dataAdd.FNEXPENSES_NUMBOOK == '' || this.dataAdd.FNEXPENSES_CCDATE == ''
      || this.dataAdd.FNEXPENSES_TITLE == '' || this.dataAdd.FNEXPENSES_OMONEY == ''
      || this.dataAdd.FNCREDITOR_CODE1 == '' || this.dataAdd.DEPARTMENT_CODE == ''
      || this.dataAdd.SECTION_CODE == '')) {
      if (this.dataAdd.FNEXPENSES_EXTEND == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกเลขที่หนังสือ");
        //this.dataAdd.FNEXPENSES_NUMBOOK.focus();
      }
      if (this.dataAdd.FNEXPENSES_CCDATE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกวันที่ดำเนินการ");
        //this.dataAdd.FNEXPENSES_CCDATE.focus();
      }
      if (this.dataAdd.FNEXPENSES_TITLE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกชื่อเรื่อง/ชื่อโครงการ");
        //this.dataAdd.FNEXPENSES_TITLE.focus();
      }
      if (this.dataAdd.FNEXPENSES_OMONEY == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกขอเบิกเงินจำนวน");
        //this.dataAdd.FNEXPENSES_OMONEY.focus();
      }
      if (this.dataAdd.FNCREDITOR_CODE1 == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกเจ้าหนี้/ผู้ขอเบิก");
        //this.dataAdd.FNCREDITOR_CODE.focus();
      }
      if (this.dataAdd.DEPARTMENT_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกสาขา");
        //this.dataAdd.DEPARTMENT_CODE.focus();
      }
      if (this.dataAdd.SECTION_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกหลักสูตร");
        //this.dataAdd.SECTION_CODE.focus();
      }
    } else if (this.dataAdd.PLMONEYPAY_CODE == '26' && this.dataAdd.PLMIDDLEBUDGET_CODE == '') {
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกขอใช้งบกลาง");
      this.dataAdd.PLMIDDLEBUDGET_CODE.focus();
    } else if (Number(this.dataAdd.FNEXPENSES_OMONEY) > Number(this.dataAdd.MONEY) && this.dataAdd.CODEMONEY != '2M16') {
      this.toastr.warning("แจ้งเตือน:กรุณากรอกยอดเงินขอเบิกใหม่ ให้ไม่เกิดยอดเงินคงเหลือ :" + this.dataAdd.MONEY);
      this.dataAdd.FNEXPENSES_OMONEY.focus();
    } else {
      this.dataAdd.opt = "insert";
      this.apiService
        .getdata(this.dataAdd, this.url)
        .pipe(first())
        .subscribe((data: any) => {
          if (data.status == 1) {
            this.datalistdetail = null;
            this.dataAdd.MONEY = this.dataAdd.MONEY - this.dataAdd.FNEXPENSES_OMONEY;
            this.toastr.success("แจ้งเตือน:เพิ่มข้อมูลเรียบร้อยแล้ว เลข 3ดี คือ" + data.step);
            this.fetchdatalistfn();
            this.cleardata();
          }
        });
    }
  }
  //แก้ไขข้อมูล
  updatedata() {

    if (this.dataAdd.PLMONEYPAY_CODE != '26' && (this.dataAdd.FNEXPENSES_NUMBOOK == '' || this.dataAdd.FNEXPENSES_CCDATE == ''
      || this.dataAdd.FNEXPENSES_TITLE == '' || this.dataAdd.FNEXPENSES_OMONEY == ''
      || this.dataAdd.FNCREDITOR_CODE1 == '' || this.dataAdd.DEPARTMENT_CODE == ''
      || this.dataAdd.SECTION_CODE == '')) {
      //console.log(1);
      if (this.dataAdd.FNEXPENSES_NUMBOOK == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกเลขที่หนังสือ");
        // this.dataAdd.FNEXPENSES_NUMBOOK.focus();
      }
      if (this.dataAdd.FNEXPENSES_CCDATE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกวันที่ดำเนินการ");
        // this.dataAdd.FNEXPENSES_CCDATE.focus();
      }
      if (this.dataAdd.FNEXPENSES_TITLE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกชื่อเรื่อง/ชื่อโครงการ");
        // this.dataAdd.FNEXPENSES_TITLE.focus();
      }
      if (this.dataAdd.FNEXPENSES_OMONEY == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกขอเบิกเงินจำนวน");
        // this.dataAdd.FNEXPENSES_OMONEY.focus();
      }
      if (this.dataAdd.FNCREDITOR_CODE1 == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกเจ้าหนี้/ผู้ขอเบิก");
        // this.dataAdd.FNCREDITOR_CODE.focus();
      }
      if (this.dataAdd.DEPARTMENT_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกสาขา");
        // this.dataAdd.DEPARTMENT_CODE.focus();
      }
      if (this.dataAdd.SECTION_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกหลักสูตร");
        //this.dataAdd.SECTION_CODE.focus();
      }
    } else if (this.dataAdd.PLMONEYPAY_CODE == '26' && this.dataAdd.PLMIDDLEBUDGET_CODE == '') {
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกขอใช้งบกลาง");
      //this.dataAdd.PLMIDDLEBUDGET_CODE.focus();
    } else {

      this.dataAdd.opt = "update";
      this.apiService
        .getdata(this.dataAdd, this.url)
        .pipe(first())
        .subscribe((data: any) => {
          if (data.status == 1) {
            this.datalistdetail = null;
            this.toastr.success("แจ้งเตือน:แก้ข้อมูลเรียบร้อยแล้ว");
            this.fetchdatalistfn();
            this.cleardata();
            this.rowpbi = 1;
            this.rowpbu = '';
          }
        });
    }
  }

  //ล้างข้อมูล
  cleardata() {
    this.dataAdd.FNEXPENSES_NUMBOOK = '';
    this.dataAdd.FNEXPENSES_CCDATE = '';
    this.dataAdd.FNEXPENSES_TITLE = '';
    this.dataAdd.FNCREDITOR_CODE1 = '';
    this.dataAdd.FNEXPENSES_OMONEY = '';
    this.dataAdd.FNEXPENSES_EXTEND = '';
    this.dataAdd.FNANNALS_CODE= '';
    this.dataAdd.SECTION_CODE= '';
    /*this.dataAdd.PLPROJECT_CODE1 = 0;
    this.dataAdd.PLMIDDLEBUDGET_CODE1= 0;*/
  }
  //ข้อมูลครุภัณฑ์/สิ่งก่อสร้าง
  showdatapl(val: any) {
    var varP = {
      "opt": "viewPLASSET",
      "search": val
    }
    this.apiService
      .getdata(varP, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataEpl = data;
        /* if(data.length==0) {
           this.rowpl='';
           this.dataAdd.PLPROJECT_CODE1 =0;
         }else{
           this.rowpl=1;
           this.dataAdd.PLPROJECT_CODE1 =1;
         }*/
        // console.log(data.length);
      });

  }
  numberWithCommas(x: any) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
  //หมวดรายจ่ายย่อย
  fetchdatalistsubm() {
    this.dataAdd.opt = "viewSUBPLMONEYPAY";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataESubplmoneypay = data;
        // console.log(data);
      });

  }
  //หลักสูตร
  fetchdatalistsub() {
    this.dataESection=null;
    this.dataAdd.opt = "viewSECTION";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataESection = data;
      //  this.dataAdd.SECTION_CODE = data[0].SECTION_CODE;
        //console.log(data);
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


}
