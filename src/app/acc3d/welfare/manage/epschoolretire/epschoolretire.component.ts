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
  selector: 'app-epschoolretire',
  templateUrl: './epschoolretire.component.html',
  styleUrls: ['./epschoolretire.component.scss']
})
export class EpschoolretireComponent implements OnInit {
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
  dataAdd: any = { check: [], FEDUCAPIO_DBILL1: [], FETHOSP_CODE: [], FEDLEVEL_CODE: [], FEDUCAPIO_SCHY: [], FEDUCAPIO_YEAR: [], FEDUCAPIO_SCH: [], FEDUCAPIO_SCHDIS: [], PROVINCE_ID: [], FEPIO_CODE: []
    , FEDUCAPIO_MONEY1: [], FEDUCAPIO_RMONEY1: [], FEDUCAPIO_DBILL2: [], FEDUCAPIO_MONEY2: [], FEDUCAPIO_RMONEY2: [], FERELE_NAME: [],MONEY: []};
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
  dataProvince: any;
  datathosp: any;
  datalevel: any;
  url = "/acc3d/welfare/manage/epschoolretire.php";
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
    //ระดับการศึกษา
    var Tablelevel = {
      "opt": "viewFEDLEVEL"
    }
    this.apiService
      .getdata(Tablelevel, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.datalevel = data;
      });
    //ระดับการศึกษา
    var Tablelevel = {
      "opt": "viewFETHOSP"
    }
    this.apiService
      .getdata(Tablelevel, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.datathosp = data;
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
        this.dataAdd.CITIZEN_ID1 = data[0].CITIZEN_ID;
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
          this.dataAdd.FEPIO_NAME = data.FEPIO_NAME;

        } else {
          this.rownum = null;
          this.loading = null;
          this.datalist = data.data;
          this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
          this.dataAdd.FEPIO_NAME = data.FEPIO_NAME;
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

    var varN = {
      "opt": "viewFEDUCAPIO",
      "FEPIO_CODE": this.dataAdd.FEPIO_CODE[i]
    }
    this.apiService
      .getdata(varN, this.url1)
      .pipe(first())
      .subscribe((data: any) => {

        this.dataAdd.FEDUCAPIO_SCH[i] = data[0].FEDUCAPIO_SCH;
        this.dataAdd.FEDUCAPIO_SCHDIS[i] = data[0].FEDUCAPIO_SCHDIS;
        this.dataAdd.PROVINCE_ID[i] = data[0].PROVINCE_ID;
      //  this.dataAdd.FEDUCAPIO_SCHY[i] = data[0].FEDUCAPIO_SCHY;

      });

  }
  fetchdatafepio() {
    this.dataAdd.FEPIO_CODE = [];
    this.dataAdd.FERELE_NAME = [];
    this.dataAdd.check = [];
    var varN = {
      "opt": "viewFEPIOEDU",
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
        this.dataAdd.FFACULTY_CODE = data.data[0].FFACULTY_CODE;
        this.dataAdd.FEDUCATION_CODE = data.data[0].FEDUCATION_CODE;
        this.dataAdd.CHIEF_CODE = data.data[0].CHIEF_CODE;
        this.dataAdd.FACULTY_CODE = data.data[0].FFACULTY_CODE;
        for (let i = 0; i < this.dataPio.length; i++) {
          //console.log(this.dataTypeU.length);
          for (var j = 0; j < this.dataPiod.length; j++) {

            if (this.dataPio[i].FEPIO_CODE == this.dataPiod[j].FEPIO_CODE) {
              //console.log(this.dataPiod[i].FEDUCAPIO_MONEY1+' '+this.dataPiod[j].FEDUCAPIO_MONEY2 ); 
              //console.log(this.dataPiod[i].FEDUCAPIO_RMONEY1+' '+this.dataPiod[j].FEDUCAPIO_RMONEY2 ); 
              this.dataAdd.check[i] = true;
              if (this.dataPiod[j].FEDUCAPIO_MONEY1 > 0) {

                this.dataAdd.FEDUCAPIO_MONEY1[i] = Number(this.dataPiod[j].FEDUCAPIO_MONEY1).toFixed(2);
                this.dataAdd.FEDUCAPIO_RMONEY1[i] = Number(this.dataPiod[j].FEDUCAPIO_RMONEY1).toFixed(2);
                this.dataAdd.FEDUCAPIO_DBILL1[i] = new Date(this.dataPiod[j].FEDUCAPIO_DBILL);
              }
              if (this.dataPiod[j].FEDUCAPIO_MONEY2 > 0) {
                this.dataAdd.FEDUCAPIO_MONEY2[i] = Number(this.dataPiod[j].FEDUCAPIO_MONEY2).toFixed(2);
                this.dataAdd.FEDUCAPIO_RMONEY2[i] = Number(this.dataPiod[j].FEDUCAPIO_RMONEY2).toFixed(2);
                this.dataAdd.FEDUCAPIO_DBILL2[i] = new Date(this.dataPiod[j].FEDUCAPIO_DBILL);
              }
              this.dataAdd.FEDUCAPIO_SCHY[i] = this.dataPiod[j].FEDUCAPIO_SCHY;
              this.dataAdd.FEDUCAPIO_YEAR[i] = this.dataPiod[j].FEDUCAPIO_YEAR;
              this.dataAdd.FEDUCAPIO_SCH[i] = this.dataPiod[j].FEDUCAPIO_SCH;
              this.dataAdd.FEDUCAPIO_SCHDIS[i] = this.dataPiod[j].FEDUCAPIO_SCHDIS;
              this.dataAdd.PROVINCE_ID[i] = this.dataPiod[j].PROVINCE_ID;
              this.dataAdd.FETHOSP_CODE[i] = this.dataPiod[j].FETHOSP_CODE;
              this.dataAdd.FEDLEVEL_CODE[i] = this.dataPiod[j].FEDLEVEL_CODE;
             // console.log(this.dataPiod[j].FETHOSP_CODE); 
            }
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
    this.dataAdd.FEDUCATION_CODE = '';
    for (let i = 0; i < this.dataPio.length; i++) {
      this.dataAdd.FEDUCAPIO_SCHY[i] = '';
      this.dataAdd.FEDUCAPIO_YEAR[i] = new Date().getFullYear() + 543;
      this.dataAdd.FEDUCAPIO_SCH[i] = '';
      this.dataAdd.FEDUCAPIO_SCHDIS[i] = '';
      this.dataAdd.FEDUCAPIO_DBILL1[i] = '';
      this.dataAdd.FEDUCAPIO_MONEY1[i] = '';
      this.dataAdd.FEDUCAPIO_RMONEY1[i] = '';
      this.dataAdd.FEDUCAPIO_DBILL2[i] = '';
      this.dataAdd.FEDUCAPIO_MONEY2[i] = '';
      this.dataAdd.FEDUCAPIO_RMONEY2[i] = '';
      this.dataAdd.FETHOSP_CODE[i] = '';
      this.dataAdd.FEDLEVEL_CODE[i] = '';
      this.dataAdd.check[i] =false;
    }

  }
  // ฟังก์ขันสำหรับการเพิ่มข้อมูล
 // ฟังก์ขันสำหรับการเพิ่มข้อมูล
 insertdata() {
  this.loading = true;
  let num = 0; let name = '';
  for (let i = 0; i < this.dataAdd.check.length; i++) {

    if (this.dataAdd.check[i] == true) {

      num = 1;
      if (this.dataAdd.FEDUCAPIO_MONEY1[i] == '' && this.dataAdd.FEDUCAPIO_MONEY2[i] == '' && this.dataAdd.FEDLEVEL_CODE[i] == '' && this.dataAdd.FETHOSP_CODE[i] == '') {
        name = "กรุณากรอกค่าเล่าเรียนของ(" + this.dataAdd.FERELE_NAME[i] + ")ให้ครบถ้วน"
      }
    }
  }
  if (num == 0 || name != '') {
    console.log(num);
    if (num == 0) {
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกขอเบิกค่าเล่าเรียนสำหรับ/กรอกข้อมูลให้ครบถ้วน");
    }
    if (name != '') {
      this.toastr.warning("แจ้งเตือน:" + name);
    }
  } else {
    for (let i = 0; i < this.dataAdd.FEPIO_CODE.length; i++) {
      if (parseFloat(this.dataAdd.FEDUCAPIO_MONEY1[i]) > 0) {
        this.dataAdd.FEDUCAPIO_DBILL1[i] = this.datenow(this.dataAdd.FEDUCAPIO_DBILL1[i]);
      }
      if (parseFloat(this.dataAdd.FEDUCAPIO_MONEY2[i]) > 0) {
        this.dataAdd.FEDUCAPIO_DBILL2[i] = this.datenow(this.dataAdd.FEDUCAPIO_DBILL2[i]);
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
   //แก้ไขข้อมูล
   updatedata() {

    let num = 0; let name = '';
    for (let i = 0; i < this.dataAdd.check.length; i++) {
      if (this.dataAdd.check[i] == true) {
        // console.log(this.dataAdd.check[i]); 
        num = 1;
        if (this.dataAdd.FEDUCAPIO_MONEY1[i] == '' && this.dataAdd.FEDUCAPIO_MONEY2[i] == '') {
          name = "กรุณากรอกค่าเล่าเรียนของ(" + this.dataAdd.FERELE_NAME[i] + ")ให้ครบถ้วน"
        }
      }
    }
    if (num == 0 || name != '') {
      if (num == 0) {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกขอเบิกค่าเล่าเรียนสำหรับ/กรอกข้อมูลให้ครบถ้วน");
      }
      if (name != '') {
        this.toastr.warning("แจ้งเตือน:" + name);
      }
    } else {
      for (let i = 0; i < this.dataAdd.FEPIO_CODE.length; i++) {
        if (parseFloat(this.dataAdd.FEDUCAPIO_MONEY1[i]) > 0) {
          this.dataAdd.FEDUCAPIO_DBILL1[i] = this.datenow(this.dataAdd.FEDUCAPIO_DBILL1[i]);
        }
        if (parseFloat(this.dataAdd.FEDUCAPIO_MONEY2[i]) > 0) {
          this.dataAdd.FEDUCAPIO_DBILL2[i] = this.datenow(this.dataAdd.FEDUCAPIO_DBILL2[i]);
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
  onChangeTuition(i:any) {
    this.dataAdd.opt = "viewFEDTUITION";
    this.dataAdd.codel=this.dataAdd.FEDLEVEL_CODE[i];
    this.dataAdd.codes=this.dataAdd.FETHOSP_CODE[i];
    let mo=0;let mo1=0;let mo2=0;
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        //this.dataForeman = data;
        this.dataAdd.MONEY[i]=' เบิกได้ปีละ:'+this.numberWithCommas(Number(data[0].FEDTUITION_MONEY));
        mo=parseFloat(this.dataAdd.FEDUCAPIO_MONEY1[i]);
        mo2=parseFloat(this.dataAdd.FEDUCAPIO_MONEY2[i]);
        mo1=parseFloat(data[0].FEDTUITION_MONEY)/2;
       // console.log(mo2);
        if(mo>mo1 || mo2>mo1){
          if(mo>0){
          this.dataAdd.FEDUCAPIO_RMONEY1[i] = Number(data[0].FEDTUITION_MONEY/2).toFixed(2);
          }
          if(mo2>0){
            this.dataAdd.FEDUCAPIO_RMONEY2[i] = Number(data[0].FEDTUITION_MONEY/2).toFixed(2);
            }
        }else{
          if(mo>0){
          this.dataAdd.FEDUCAPIO_RMONEY1[i] = mo;  
          }
          if(mo2>0){
            this.dataAdd.FEDUCAPIO_RMONEY2[i] = mo2;  
          }
        }
      });
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
