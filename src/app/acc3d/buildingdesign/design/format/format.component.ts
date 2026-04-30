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

@Component({
  selector: 'app-format',
  templateUrl: './format.component.html',
  styleUrls: ['./format.component.scss']
})
export class FormatComponent implements OnInit {
  title = 'angular-app';
  fileName = 'report.xlsx';
  userList = [{}]

  dataYear: any;
  dataCam: any;
  dataFac: any;
  dataBuild: any
  datalist: any;
  loading: any;
  loadingdetail: any;
  dataAdd: any = { BDTYPEDATE_CODE: [], BDOPERATIONTD_SDATE: [], BDOPERATIONTD_EDATE: [], BDOPERATIONTD_TDATE: [] };
  clickshow: any;
  searchTerm: any;
  show: any;
  dataPro: any;
  datarstatus: any;
  numrow: any;
  rowpbi: any;
  rowpbu: any;
  dataAaset: any;
  locale = 'th-be';
  locales = listLocales();
  rownum: any;
  dataMyear: any;
  url = "/acc3d/buildingdesign/design/format.php";
  url1 = "/acc3d/buildingdesign/userpermission.php";

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
            //  this.onChangeyear();
            this.fetchdatalist();
          });
      });


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
        // this.fetchdatalist();
        //this.dataAdd.PRYEARASSET_CODE = data[0].PRYEARASSET_CODE;
      });
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
  setshowbti() {
    this.dataAdd.BDFORMAT_CODE = '';
    for (let i = 0; i < 9; i++) {
      this.dataAdd.BDOPERATIONTD_SDATE[i] = '';
      this.dataAdd.BDOPERATIONTD_EDATE[i] = '';
      this.dataAdd.BDOPERATIONTD_TDATE[i] = '';
    }
    this.dataAdd.BDTYPEDATE_CODE[0] = '01';
    this.dataAdd.BDTYPEDATE_CODE[1] = '02';
    this.dataAdd.BDTYPEDATE_CODE[2] = '03';
    this.dataAdd.BDTYPEDATE_CODE[3] = '04';
    this.dataAdd.BDTYPEDATE_CODE[4] = '05';
    this.dataAdd.BDTYPEDATE_CODE[5] = '06';
    this.dataAdd.BDTYPEDATE_CODE[6] = '07';
    this.dataAdd.BDTYPEDATE_CODE[7] = '08';
    this.dataAdd.BDTYPEDATE_CODE[8] = '09';
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
        this.dataAdd.BDFORMAT_CODE = data[0].BDOPERATION_CODE;
        this.dataAdd.BDOPERATION_RSTATUS = data[0].BDOPERATION_RSTATUS;
        if (data[0].BDFORMAT_SDATEX != null) {
          this.dataAdd.BDOPERATIONTD_SDATE[0] = new Date(data[0].BDFORMAT_SDATEX);
          this.dataAdd.BDOPERATIONTD_EDATE[0] = new Date(data[0].BDFORMAT_EDATEX);
        }

        if (data[0].BDFORMAT_SDATEM != null) {
          this.dataAdd.BDOPERATIONTD_SDATE[1] = new Date(data[0].BDFORMAT_SDATEM);
          this.dataAdd.BDOPERATIONTD_EDATE[1] = new Date(data[0].BDFORMAT_EDATEM);
        }

        if (data[0].BDFORMAT_SDATED != null) {
          this.dataAdd.BDOPERATIONTD_SDATE[2] = new Date(data[0].BDFORMAT_SDATED);
          this.dataAdd.BDOPERATIONTD_EDATE[2] = new Date(data[0].BDFORMAT_EDATED);
        }

        if (data[0].BDFORMAT_SDATES != null) {
          this.dataAdd.BDOPERATIONTD_SDATE[3] = new Date(data[0].BDFORMAT_SDATES);
          this.dataAdd.BDOPERATIONTD_EDATE[3] = new Date(data[0].BDFORMAT_EDATES);
        }

        if (data[0].BDFORMAT_SDATEA != null) {
          this.dataAdd.BDOPERATIONTD_SDATE[4] = new Date(data[0].BDFORMAT_SDATEA);
          this.dataAdd.BDOPERATIONTD_EDATE[4] = new Date(data[0].BDFORMAT_EDATEA);
        }

        if (data[0].BDFORMAT_SDATET != null) {
          this.dataAdd.BDOPERATIONTD_SDATE[5] = new Date(data[0].BDFORMAT_SDATET);
          this.dataAdd.BDOPERATIONTD_EDATE[5] = new Date(data[0].BDFORMAT_EDATET);
        }

        if (data[0].BDFORMAT_SDATEE != null) {
          this.dataAdd.BDOPERATIONTD_SDATE[6] = new Date(data[0].BDFORMAT_SDATEE);
          this.dataAdd.BDOPERATIONTD_EDATE[6] = new Date(data[0].BDFORMAT_EDATEE);
        }

        if (data[0].BDFORMAT_SDATER != null) {
          this.dataAdd.BDOPERATIONTD_SDATE[7] = new Date(data[0].BDFORMAT_SDATER);
          this.dataAdd.BDOPERATIONTD_EDATE[7] = new Date(data[0].BDFORMAT_EDATER);
        }

        if (data[0].BDFORMAT_SDATES != null) {
          this.dataAdd.BDOPERATIONTD_SDATE[8] = new Date(data[0].BDFORMAT_SDATEMT);
          this.dataAdd.BDOPERATIONTD_EDATE[8] = new Date(data[0].BDFORMAT_EDATEMT);
        }

      });
    this.rowpbi = null;
    this.rowpbu = true;
  }
  datenow(datenow: any) {
    const yyyy = datenow.getFullYear();
    let mm = datenow.getMonth() + 1; // Months start at 0!
    let dd = datenow.getDate();
    return yyyy + '-' + mm + '-' + dd;
  }
  //แก้ไขข้อมูล
  updatedata() {
    if (this.dataAdd.BDOPERATIONTD_SDATE[0] != '' && this.dataAdd.BDOPERATIONTD_EDATE[0] == '') {
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกวันที่สำรวจพื้นที่ให้ครบถ้วน");
    } else if (this.dataAdd.BDOPERATIONTD_SDATE[1] != '' && this.dataAdd.BDOPERATIONTD_EDATE[1] == '') {
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกวันที่ประชุมหาความต้องการให้ครบถ้วน");
    } else if (this.dataAdd.BDOPERATIONTD_SDATE[2] != '' && this.dataAdd.BDOPERATIONTD_EDATE[2] == '') {
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกวันที่ประชุมหาความต้องการให้ครบถ้วน");
    } else if (this.dataAdd.BDOPERATIONTD_SDATE[3] != '' && this.dataAdd.BDOPERATIONTD_EDATE[3] == '') {
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกวันที่ประชุมสรุปความต้องการให้ครบถ้วน");
    } else if (this.dataAdd.BDOPERATIONTD_SDATE[4] != '' && this.dataAdd.BDOPERATIONTD_EDATE[4] == '') {
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกวันที่เขียนแบบสถาปัตย์ให้ครบถ้วน");
    } else if (this.dataAdd.BDOPERATIONTD_SDATE[5] != '' && this.dataAdd.BDOPERATIONTD_EDATE[5] == '') {
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกวันที่เขียนแบบโครงสร้างให้ครบถ้วน");
    } else if (this.dataAdd.BDOPERATIONTD_SDATE[6] != '' && this.dataAdd.BDOPERATIONTD_EDATE[6] == '') {
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกวันที่เขียนแบบไฟฟ้าให้ครบถ้วน");
    } else if (this.dataAdd.BDOPERATIONTD_SDATE[7] != '' && this.dataAdd.BDOPERATIONTD_EDATE[7] == '') {
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกวันที่เขียนแบบสุขาภิบาลให้ครบถ้วน");
    } else if (this.dataAdd.BDOPERATIONTD_SDATE[8] != '' && this.dataAdd.BDOPERATIONTD_EDATE[8] == '') {
      this.toastr.warning("แจ้งเตือน:กรุณาเลือกวันที่ประชุมคณะกรรมการแบบรูปรายการให้ครบถ้วน");

    } else {
      if (this.dataAdd.BDOPERATIONTD_SDATE[0] != '') {
        this.dataAdd.BDOPERATIONTD_SDATE[0] = this.datenow(this.dataAdd.BDOPERATIONTD_SDATE[0]);
        this.dataAdd.BDOPERATIONTD_EDATE[0] = this.datenow(this.dataAdd.BDOPERATIONTD_EDATE[0]);
      }

      if (this.dataAdd.BDOPERATIONTD_SDATE[1] != '') {
        this.dataAdd.BDOPERATIONTD_SDATE[1] = this.datenow(this.dataAdd.BDOPERATIONTD_SDATE[1]);
        this.dataAdd.BDOPERATIONTD_EDATE[1] = this.datenow(this.dataAdd.BDOPERATIONTD_EDATE[1]);
      }

      if (this.dataAdd.BDOPERATIONTD_SDATE[2] != '') {
        this.dataAdd.BDOPERATIONTD_SDATE[2] = this.datenow(this.dataAdd.BDOPERATIONTD_SDATE[2]);
        this.dataAdd.BDOPERATIONTD_EDATE[2] = this.datenow(this.dataAdd.BDOPERATIONTD_EDATE[2]);
      }

      if (this.dataAdd.BDOPERATIONTD_SDATE[3] != '') {
        this.dataAdd.BDOPERATIONTD_SDATE[3] = this.datenow(this.dataAdd.BDOPERATIONTD_SDATE[3]);
        this.dataAdd.BDOPERATIONTD_EDATE[3] = this.datenow(this.dataAdd.BDOPERATIONTD_EDATE[3]);
      }

      if (this.dataAdd.BDOPERATIONTD_SDATE[4] != '') {
        this.dataAdd.BDOPERATIONTD_SDATE[4] = this.datenow(this.dataAdd.BDOPERATIONTD_SDATE[4]);
        this.dataAdd.BDOPERATIONTD_EDATE[4] = this.datenow(this.dataAdd.BDOPERATIONTD_EDATE[4]);
      }

      if (this.dataAdd.BDOPERATIONTD_SDATE[5] != '') {
        this.dataAdd.BDOPERATIONTD_SDATE[5] = this.datenow(this.dataAdd.BDOPERATIONTD_SDATE[5]);
        this.dataAdd.BDOPERATIONTD_EDATE[5] = this.datenow(this.dataAdd.BDOPERATIONTD_EDATE[5]);
      }

      if (this.dataAdd.BDOPERATIONTD_SDATE[6] != '') {
        this.dataAdd.BDOPERATIONTD_SDATE[6] = this.datenow(this.dataAdd.BDOPERATIONTD_SDATE[6]);
        this.dataAdd.BDOPERATIONTD_EDATE[6] = this.datenow(this.dataAdd.BDOPERATIONTD_EDATE[6]);
      }

      if (this.dataAdd.BDOPERATIONTD_SDATE[7] != '') {
        this.dataAdd.BDOPERATIONTD_SDATE[7] = this.datenow(this.dataAdd.BDOPERATIONTD_SDATE[7]);
        this.dataAdd.BDOPERATIONTD_EDATE[7] = this.datenow(this.dataAdd.BDOPERATIONTD_EDATE[7]);
      }

      if (this.dataAdd.BDOPERATIONTD_SDATE[8] != '') {
        this.dataAdd.BDOPERATIONTD_SDATE[8] = this.datenow(this.dataAdd.BDOPERATIONTD_SDATE[8]);
        this.dataAdd.BDOPERATIONTD_EDATE[8] = this.datenow(this.dataAdd.BDOPERATIONTD_EDATE[8]);
      }


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
}
