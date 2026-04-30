import { Component, OnInit, ElementRef, HostListener, ViewChild } from '@angular/core';
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
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-epmedicalretire',
  templateUrl: './epmedicalretire.component.html',
  styleUrls: ['./epmedicalretire.component.scss']
})
export class EpmedicalretireComponent implements OnInit {
  title = 'angular-app';
  fileName = 'report.xlsx';
  userList = [{}]

  dataYear: any;
  dataCam: any;
  dataFac: any;
  datalist: any;
  datalistdetail: any;
  loading: any;
  loadingdetail: any;
  dataAdd: any = { check: [], FEREIMDT_DBILL: [], FEREIMDT_EBILL: [], FEREIMDT_TMONEY: [], FEREIMDT_WMONEY: [], FEPIO_CODE: [], FERELE_NAME: [] };
  clickshow: any;
  searchTerm: any;
  show: any;
  dataPro: any;
  datarstatus: any;
  dataStafftype: any;
  numrow: any;
  locale = 'th-be';
  locales = listLocales();
  rownum: any;
  rowpbi: any;
  rowpbu: any;
  dataFer: any;
  dataStatus: any;
  dataOcc: any;
  dataPio: any;
  dataForeman: any;
  dataPiod: any;
  url = "/acc3d/welfare/manage/epmedicalretire.php";
  url1 = "/acc3d/welfare/userpermission.php";
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
    this.localeService.use(this.locale);
    this.dataAdd.citizen = this.tokenStorage.getUser().citizen;
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
        this.dataAdd.PRIVILEGE_RSTATUS = data[0].PRIVILEGE_RSTATUS;
        var varN = {
          "opt": "viewcam",
          "citizen": this.tokenStorage.getUser().citizen,
          "PRIVILEGERSTATUS": data[0].PRIVILEGE_RSTATUS
        }
        this.apiService
          .getdata(varN, this.url1)
          .pipe(first())
          .subscribe((datacam: any) => {
            this.dataCam = datacam;
            this.dataAdd.CAMPUS_CODE = datacam[0].CAMPUS_CODE;
            this.fetchdataCam();
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
        this.dataYear = data;
        this.dataAdd.PLYEARBUDGET_CODE = data[0].PLYEARBUDGET_CODE;
      });
      this.onChangeforeman();    
  }
  CheckNum(num: any) {
    //console.log(num.keyCode); 
    if (num.keyCode < 46 || num.keyCode > 57) {
      alert('กรุณากรอกข้อมูล ที่เป็นตัวเลข');
      num.returnValue = false;
    }
  }
  
  fetchdataCam() {
    this.dataFac = null;
    this.dataAdd.opt = "viewfac";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataFac = data;
        this.dataAdd.FACULTY_CODE = '';
        this.fetchdataretire();
      });
  }
  fetchdataretire() {
    this.dataStafftype = null;
    this.dataAdd.opt = "viewpersonretire";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataStafftype = data;
      });
  }
  applyLocale(pop: any) {
    this.localeService.use(this.locale);
  }
  datenow(datenow: any) {
    const yyyy = datenow.getFullYear();
    let mm = datenow.getMonth() + 1; // Months start at 0!
    let dd = datenow.getDate();
    return yyyy + '-' + mm + '-' + dd;
  }
  fetchdatalist() {
    this.loading = true;
    this.datalist = null;
    this.dataAdd.opt = "readAll";
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == '1') {
          this.datalist = data.data;
          this.loading = null;
          this.rownum = 1;
          

        } else {
          this.rownum = null;
          this.loading = null;
          this.datalist = data.data;
          this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
        }
      });
  }
  onChangeforeman() {
    this.dataForeman = null;
    this.dataAdd.opt = "viewCHIEF";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataForeman = data;
        this.dataAdd.CHIEF_CODE = data[2].CHIEF_CODE;
      });
  }
  deletecheck(i: any) {
    //console.log(i);
    this.dataAdd.FEREIMDT_DBILL[i] = '';
    this.dataAdd.FEREIMDT_EBILL[i] = '';
    this.dataAdd.FEREIMDT_TMONEY[i] = '';
    this.dataAdd.FEREIMDT_WMONEY[i] = '';
  }
  fetchdatafepio() {
    this.dataAdd.FEPIO_CODE = [];
    this.dataAdd.FERELE_NAME = [];
    this.dataAdd.check = [];
    var varN = {
      "opt": "viewFEPIO",
      "CITIZEN_ID": this.dataAdd.CITIZEN_ID1
    }
    this.apiService
      .getdata(varN, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataPio = data;
        for (let i = 0; i < this.dataPio.length; i++) {
          this.dataAdd.FEPIO_CODE[i] = this.dataPio[i].FEPIO_CODE;
          this.dataAdd.FERELE_NAME[i] = this.dataPio[i].FERELE_NAME;
          this.dataAdd.check[i] = false;
        }
      });
  }
  // ฟังก์ชันสำหรับการลบข้อมูล
  deleteData(id: any) {
    this.dataAdd.opt = "delete";
    // this.dataAdd.id = id;
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
  // ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
  editdata(id: any) {
    this.setshowbti();
    this.apiService
      .getById(id, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataPiod = data.data2;
        this.dataAdd.FEREIM_CODE = data.data[0].FEREIM_CODE;
        this.dataAdd.FFACULTY_CODE = data.data[0].FFACULTY_CODE;
        this.dataAdd.FEREIM_DISS = data.data[0].FEREIM_DISS;
        this.dataAdd.FEREIM_HNAME = data.data[0].FEREIM_HNAME;
        this.dataAdd.FETHOSP_CODE = data.data[0].FETHOSP_CODE;
        this.dataAdd.DATENOWS = new Date(data.data[0].FEREIM_SDHEAL);
        this.dataAdd.DATENOWT = new Date(data.data[0].FEREIM_PDHEAL);
        this.dataAdd.FEREIM_NBILL = data.data[0].FEREIM_NBILL;
        this.dataAdd.CHIEF_CODE = data.data[0].CHIEF_CODE;
        for (let i = 0; i < this.dataPio.length; i++) {
          //console.log(this.dataTypeU.length);
          for (var j = 0; j < this.dataPiod.length; j++) {
            if (this.dataPio[i].FEPIO_CODE == this.dataPiod[j].FEPIO_CODE) {
              //console.log(this.dataPiod[i].FEREIMDT_WMONEY);
              this.dataAdd.check[i] = true;
              this.dataAdd.FEREIMDT_WMONEY[i] = this.numberWithCommas(Number(this.dataPiod[j].FEREIMDT_WMONEY).toFixed(2));
              this.dataAdd.FEREIMDT_TMONEY[i] = this.numberWithCommas(Number(this.dataPiod[j].FEREIMDT_TMONEY).toFixed(2));
              this.dataAdd.FEREIMDT_DBILL[i] = new Date(this.dataPiod[j].FEREIMDT_DBILL);
              this.dataAdd.FEREIMDT_EBILL[i] = new Date(this.dataPiod[j].FEREIMDT_EBILL);
            }
            // this.dataAdd.FEREIMDT_WMONEY[i]='';
            //this.dataAdd.check[i] = data[i].SECTION_CODE;
          }
        }
      });
    this.rowpbi = null;
    this.rowpbu = true;
  }
  numberWithCommas(x: any) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
  showtype() {
    if (this.dataAdd.FERELE_CODE == '5') {
      this.dataAdd.row1 = '';
      this.dataAdd.row2 = 1;
    } else {
      this.dataAdd.row1 = 1;
      this.dataAdd.row2 = '';
    }
  }
  setshowbti() {
    this.dataAdd.FEREIM_CODE = '';
    this.dataAdd.FEREIM_DISS = '';
    this.dataAdd.FEREIM_HNAME = '';
    this.dataAdd.FEREIM_NBILL = 1;
    this.dataAdd.DATENOWS = '';
    this.dataAdd.DATENOWT = '';
    this.dataAdd.FETHOSP_CODE = 1;
    for (let i = 0; i < this.dataPio.length; i++) {
      this.dataAdd.FEREIMDT_DBILL[i] = '';
      this.dataAdd.FEREIMDT_EBILL[i] = '';
      this.dataAdd.FEREIMDT_TMONEY[i] = '';
      this.dataAdd.FEREIMDT_WMONEY[i] = '';
    }

  }
  // ฟังก์ขันสำหรับการเพิ่มข้อมูล
  insertdata() {
    this.loading = true;
    let num = 0; let name = '';
    for (let i = 0; i < this.dataAdd.check.length; i++) {
      if (this.dataAdd.check[i] == true) {
        num = 1;
        if (this.dataAdd.FEREIMDT_TMONEY[i] == '' && this.dataAdd.FEREIMDT_WMONEY[i] == '' && this.dataAdd.FEREIMDT_DBILL[i] == '' && this.dataAdd.FEREIMDT_EBILL[i] == '') {
          name = "กรุณากรอกค่ารักษาพยาบาลของ(" + this.dataAdd.FERELE_NAME[i] + ")ให้ครบถ้วน"
          //this.toastr.warning("แจ้งเตือน:กรุณากรอกค่ารักษาพยาบาลของ("+this.dataAdd.FERELE_NAME[i]+")ให้ครบถ้วน");
          //console.log(this.dataAdd.check[i]);
        }
      }
    }
    if (this.dataAdd.FEREIM_DISS == '' || this.dataAdd.FEREIM_HNAME == '' || this.dataAdd.FETHOSP_CODE == '' || this.dataAdd.FEREIM_NBILL == '' || num == 0 || name != '') {
      if (this.dataAdd.FEREIM_DISS == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกป่วยเป็นโรค");
      }
      if (this.dataAdd.FEREIM_HNAME == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกชื่อสถานพยาบาล");
      }
      if (this.dataAdd.FETHOSP_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกสถานะของโรงพยาบาล");
      }
      if (this.dataAdd.FEREIM_NBILL == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกจำนวนใบเสร็จที่แนบ");
      }
      if (num == 0) {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกขอเบิกค่ารักษาพยาบาลสำหรับ/กรอกข้อมูลให้ครบถ้วน");
      }
      if (name != '') {
        this.toastr.warning("แจ้งเตือน:" + name);
      }

    } else {

      if (this.dataAdd.FEPIO_RCDD != '') {
        this.dataAdd.FEREIM_SDHEAL = this.datenow(this.dataAdd.DATENOWS);
        this.dataAdd.FEREIM_PDHEAL = this.datenow(this.dataAdd.DATENOWT);
      } else {
        this.dataAdd.FEREIM_SDHEAL = '';
        this.dataAdd.FEREIM_PDHEAL = '';
      }
      for (let i = 0; i < this.dataAdd.FEPIO_CODE.length; i++) {
        if (parseFloat(this.dataAdd.FEREIMDT_WMONEY[i]) > 0) {
          //console.log(this.dataAdd.FEREIMDT_DBILL[i]);
          this.dataAdd.FEREIMDT_DBILL[i] = this.datenow(this.dataAdd.FEREIMDT_DBILL[i]);
          this.dataAdd.FEREIMDT_EBILL[i] = this.datenow(this.dataAdd.FEREIMDT_EBILL[i]);
        }
      }
      this.dataAdd.opt = "insert";
      this.apiService
        .getupdate(this.dataAdd, this.url)
        .pipe(first())
        .subscribe((data: any) => {
          //console.log(data.status);       
          if (data.status == 1) {
            this.toastr.success("แจ้งเตือน:เพิ่มข้อมูลเรียบร้อยแล้ว");
            this.fetchdatalist();
            document.getElementById("ModalClose")?.click();
          } else {
            this.toastr.warning("แจ้งเตือน:ไม่สามารถเพิ่มข้อมูลได้");
          }
        });
    }
  }
  //แก้ไขข้อมูล
  updatedata() {

    if (this.dataAdd.FEREIM_DISS == '' || this.dataAdd.FEREIM_HNAME == '' || this.dataAdd.FETHOSP_CODE == '' || this.dataAdd.FEREIM_NBILL == '') {
      if (this.dataAdd.FEREIM_DISS == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกป่วยเป็นโรค");
      }
      if (this.dataAdd.FEREIM_HNAME == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกชื่อสถานพยาบาล");
      }
      if (this.dataAdd.FETHOSP_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกสถานะของโรงพยาบาล");
      }
      if (this.dataAdd.FEREIM_NBILL == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกจำนวนใบเสร็จที่แนบ");
      }

    } else {

      if (this.dataAdd.FEPIO_RCDD != '') {
        this.dataAdd.FEREIM_SDHEAL = this.datenow(this.dataAdd.DATENOWS);
        this.dataAdd.FEREIM_PDHEAL = this.datenow(this.dataAdd.DATENOWT);
      } else {
        this.dataAdd.FEREIM_SDHEAL = '';
        this.dataAdd.FEREIM_PDHEAL = '';
      }
      for (let i = 0; i < this.dataAdd.FEPIO_CODE.length; i++) {
        if (parseFloat(this.dataAdd.FEREIMDT_WMONEY[i]) > 0) {
          //console.log(this.dataAdd.FEREIMDT_DBILL[i]);
          this.dataAdd.FEREIMDT_DBILL[i] = this.datenow(this.dataAdd.FEREIMDT_DBILL[i]);
          this.dataAdd.FEREIMDT_EBILL[i] = this.datenow(this.dataAdd.FEREIMDT_EBILL[i]);
        }
      }
      this.dataAdd.opt = "update";
      this.apiService
        .getupdate(this.dataAdd, this.url)
        .pipe(first())
        .subscribe((data: any) => {
          //console.log(data.status);       
          if (data.status == 1) {
            this.fetchdatalist();
            //this.fetchdatalist();
            this.toastr.success("แจ้งเตือน:แก้ไขข้อมูลเรียบร้อยแล้ว");
            document.getElementById("ModalClose")?.click();
          }
        });
    }
    this.rowpbi = null;
    this.rowpbu = true;
  }
  showinput() {
    this.rowpbi = 1;
    this.rowpbu = '';
    this.showtype();
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
