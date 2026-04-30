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
  selector: 'app-incomepmedical',
  templateUrl: './incomepmedical.component.html',
  styleUrls: ['./incomepmedical.component.scss']
})
export class IncomepmedicalComponent implements OnInit {
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
  dataAdd: any = { };
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
  datareceipt: any;
  url = "/acc3d/welfare/load/incomepmedical.php";
  url1 = "/acc3d/welfare/userpermission.php";

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
        this.localeService.use(this.locale);
    this.dataAdd.citizen = this.tokenStorage.getUser().citizen;
    this.dataAdd.STAFFTYPE_ID = '';
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
          this.fetchdatalist();
        });
   
    var varR = {
      "opt": "viewFNRESTATUS"
    }
    this.apiService
      .getdata(varR, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.datareceipt = data;
      });  
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
            this.dataAdd.CAMPUS_NAME = data.CAMPUS_NAME;
            this.dataAdd.PLINCOME_NAME = data.PLINCOME_NAME;
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
  // ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
  editdata(id: any, mail: any, name: any,money:any) {
    this.setshowbti();
    this.dataAdd.FEREIM_CODE = id;
    this.dataAdd.USERNAME_CISCO = mail;
    this.dataAdd.FSTF_FNAME = name;
    this.dataAdd.FEREIM_WMONEY = money;
  }
  setshowbti() {
    this.dataAdd.FNRESTATUS_CODE ='';
    this.dataAdd.FNEXACCTD_NOTE ='';
  }
   //ส่งอีเมลสถานะใบเสร็จ
  sendemail() {
    if (this.dataAdd.FNEXACCTD_NOTE == '') {
      this.toastr.warning("แจ้งเตือน:กรุณากรอกหมายเหตุ");
    } else {

      this.dataAdd.opt = "sendemailRE";
      this.apiService
        .getupdate(this.dataAdd, this.url)
        .pipe(first())
        .subscribe((data: any) => {
          this.toastr.success("แจ้งเตือน:ส่งอีเมลสถานะใบเสร็จเรียบร้อย");
        });

    }
  }
    updatereceipt() {
    if (this.dataAdd.FNRESTATUS_CODE == '') {
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกสถานะใบเสร็จ");
    } else {  
    this.dataAdd.opt = "updatereceipt";
    this.apiService
      .getupdate(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        //console.log(data.status);       
        if (data.status == 1) {
          this.fetchdatalist();
          this.toastr.success("แจ้งเตือน:บันทึกข้อมูลเรียบร้อยแล้ว");
          document.getElementById("ModalClose")?.click();
        }
      });
    }
  }
}
