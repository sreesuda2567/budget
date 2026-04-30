import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
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
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.scss']
})
export class RevenueComponent implements OnInit {
  dataYear: any;
  dataFac: any;
  datalist: any;
  loading: any;
  dataCrpart: any;
  dataCrcourse: any;
  url = "/acc3d/budget/manage/revenue.php";
  url1 = "/acc3d/budget/userpermission.php";
  dataAdd: any = {};
  locale = 'th-be';
  locales = listLocales();
  rowpbi: any;
  rowpbu: any;
  bon: any;
  rownum: any;
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
    this.fetchdata();
    this.dataAdd.citizen = this.tokenStorage.getUser().citizen;
    this.rownum = null;
    this.dataAdd.CRPART_ID = null;
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
            // console.log(data[0].FACULTY_CODE);
            // this.dataAdd.FACULTY_CODE = data[0].FACULTY_CODE;
            this.fetchcrpart();

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
        this.fetchdatalist();

      });
    //ดึงวันที่
    var varNf = {
      "opt": "viewCRCOURSE",
      "citizen": this.tokenStorage.getUser().citizen
    }
    this.apiService
      .getdata(varNf, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataCrcourse = data;
        this.dataAdd.CRCOURSE_ID = data[0].CRCOURSE_ID;
       
      });

  }
  showinput() {
    this.rowpbi = 1;
    this.rowpbu = '';
  }
  setshowbti() {
    this.dataAdd.REVEVUE_N1 = 0;
    this.dataAdd.REVEVUE_N2 = 0;
    this.dataAdd.REVEVUE_N3 = 0;
    this.dataAdd.REVEVUE_REGISTER1 = 0;
    this.dataAdd.REVEVUE_REGISTER2 = 0;
    this.dataAdd.REVEVUE_REGISTER3 = 0;
    this.dataAdd.REVEVUE_ELE = 0;
    this.dataAdd.REVEVUE_EDT = 0;
    this.dataAdd.REVEVUE_CEN = 0;
    this.dataAdd.REVEVUE_BE = 0;
    this.dataAdd.REVEVUE_LIBRARY = 0;
    this.dataAdd.REVEVUE_NETWORK = 0;
    this.dataAdd.REVEVUE_FRESD = 0;
    this.dataAdd.REVEVUE_RES = 0;
    this.dataAdd.REVEVUE_FPER = 0;
    this.dataAdd.REVEVUE_MB = 0;
    this.dataAdd.REVEVUE_FAC = 0;
    this.dataAdd.REVEVUE_OTHER = 0;
    this.dataAdd.FACULTY_CODE = '';
    this.dataAdd.CRPART_ID = '';
  }
  fetchcrpart() {
    this.dataCrpart = null;
    this.dataAdd.opt = "viewCRPART";
    this.dataAdd.PLINCOME_CODE = "02";
    //รายการภาค
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataCrpart = data;
        //  this.dataAdd.CRPART_ID = data[0].CRPART_ID;
      });
  }
  fetchdatalist() {
    this.rownum = null;
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
    //console.log(this.dataAdd.moneybl1);
  }
  numberWithCommas(x: any) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
  applyLocale(pop: any) {
    this.localeService.use(this.locale);
  }
  datenow(datenow: any) {
    const yyyy = datenow.getFullYear();
    let mm = datenow.getMonth() + 1; // Months start at 0!
    let dd = datenow.getDate();
    return yyyy + '/' + mm + '/' + dd;
  }
  // ฟังก์ขันสำหรับการเพิ่มข้อมูล/และแก้ไขข้อมูล
  insertdata() {
    if (this.dataAdd.FACULTY_CODE == '' ||  this.dataAdd.CRCOURSE_ID== '' ||  this.dataAdd.CRPART_ID== '') {
      if (this.dataAdd.FACULTY_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกคณะ/หน่วยงาน");
      }
      if (this.dataAdd.CRCOURSE_ID == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกการศึกษา");
      }
      if (this.dataAdd.CRPART_ID == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกภาคเงิน");
      }
    
  }else{
    this.dataAdd.opt = "insert";
    this.apiService
      .getdata(this.dataAdd, this.url)
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
  // ฟังก์ชันสำหรับการลบข้อมูล
  deleteData(id: any) {
    this.dataAdd.opt = "delete";
    this.dataAdd.id = id;
    this.dataAdd.CITIZEN_ID = this.tokenStorage.getUser().citizen;
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
  // ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
  editdata(id: any) {
    this.setshowbti();
    //this.dataAdd.MAINPROGRAM_CODE = name;
    // this.htmlStringd = name;
    this.apiService
      .getById(id, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataAdd.REVEVUE_CODE = data[0].REVEVUE_CODE;
        this.dataAdd.FACULTY_CODE = data[0].FACULTY_CODE;
        this.dataAdd.CRCOURSE_ID = data[0].CRCOURSE_ID;
        this.fetchcrpart();
        this.dataAdd.CRPART_ID = data[0].CRPART_ID;
        this.dataAdd.REVEVUE_N1 = this.numberWithCommas(parseFloat(data[0].REVEVUE_N1).toFixed(2));
        this.dataAdd.REVEVUE_N2 = this.numberWithCommas(parseFloat(data[0].REVEVUE_N2).toFixed(2));
        this.dataAdd.REVEVUE_N3 =this.numberWithCommas(parseFloat(data[0].REVEVUE_N3).toFixed(2));
        this.dataAdd.REVEVUE_REGISTER1 = this.numberWithCommas(parseFloat(data[0].REVEVUE_REGISTER1).toFixed(2));
        this.dataAdd.REVEVUE_REGISTER2 = this.numberWithCommas(parseFloat(data[0].REVEVUE_REGISTER2).toFixed(2));
        this.dataAdd.REVEVUE_REGISTER3 = this.numberWithCommas(parseFloat(data[0].REVEVUE_REGISTER3).toFixed(2));
        this.dataAdd.REVEVUE_ELE = this.numberWithCommas(parseFloat(data[0].REVEVUE_ELE).toFixed(2));
        this.dataAdd.REVEVUE_EDT = this.numberWithCommas(parseFloat(data[0].REVEVUE_EDT).toFixed(2));
        this.dataAdd.REVEVUE_CEN = this.numberWithCommas(parseFloat(data[0].REVEVUE_CEN).toFixed(2));
        this.dataAdd.REVEVUE_BE = this.numberWithCommas(parseFloat(data[0].REVEVUE_BE).toFixed(2));
        this.dataAdd.REVEVUE_LIBRARY = this.numberWithCommas(parseFloat(data[0].REVEVUE_LIBRARY).toFixed(2));
        this.dataAdd.REVEVUE_NETWORK = this.numberWithCommas(parseFloat(data[0].REVEVUE_NETWORK).toFixed(2));
        this.dataAdd.REVEVUE_FRESD = this.numberWithCommas(parseFloat(data[0].REVEVUE_FRESD).toFixed(2));
        this.dataAdd.REVEVUE_RES = this.numberWithCommas(parseFloat(data[0].REVEVUE_RES).toFixed(2));
        this.dataAdd.REVEVUE_FPER = this.numberWithCommas(parseFloat(data[0].REVEVUE_FPER).toFixed(2));
        this.dataAdd.REVEVUE_MB = this.numberWithCommas(parseFloat(data[0].REVEVUE_MB).toFixed(2));
        this.dataAdd.REVEVUE_FAC = this.numberWithCommas(parseFloat(data[0].REVEVUE_FAC).toFixed(2));
        this.dataAdd.REVEVUE_OTHER = this.numberWithCommas(parseFloat(data[0].REVEVUE_OTHER).toFixed(2));

      });
    this.rowpbi = null;
    this.rowpbu = true;
  }
  //แก้ไขข้อมูล
updatedata(){ 
  if (this.dataAdd.FACULTY_CODE == '' ||  this.dataAdd.CRCOURSE_ID== '' ||  this.dataAdd.CRPART_ID== '') {
    if (this.dataAdd.FACULTY_CODE == '') {
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกคณะ/หน่วยงาน");
    }
    if (this.dataAdd.CRCOURSE_ID == '') {
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกการศึกษา");
    }
    if (this.dataAdd.CRPART_ID == '') {
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกภาคเงิน");
    }
    
}else {

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
}
