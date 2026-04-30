import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { ApiPdoService } from '../../../../_services/api-pui.service';
import { TokenStorageService } from '../../../../_services/token-storage.service';
import { first, map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UploadfileserviceService } from '../../../../acc3d/_services/uploadfileservice.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { listLocales } from 'ngx-bootstrap/chronos';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { thBeLocale } from 'ngx-bootstrap/locale';
defineLocale('th', thBeLocale);

@Component({
  selector: 'app-writecheck1',
  templateUrl: './writecheck1.component.html',
  styleUrls: ['./writecheck1.component.scss']
})
export class Writecheck1Component implements OnInit {
  datalist: any;
  loading: any;
  rownum: any;
  file: any;
  dataFac: any;
  dataYear: any;
  datarstatus: any;
  dataName: any;
  dataNameb: any;
  url = "/acc3d/appmoney/annal/writecheck1.php";
  url1 = "/acc3d/appmoney/userpermission.php";
  dataProvince: any;
  rowpbi: any;
  rowpbu: any;
  rownum1: any;
  dataAdd: any = {check: [], FNANNALS_CODE: [], FNANNALSMAP_CODE: [], FNANNALS_RSTATUS: []};
  locale = 'th-be';
  locales = listLocales();
  datalistapp: any;
  constructor(
    private tokenStorage: TokenStorageService,
    private apiService: ApiPdoService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private eRef: ElementRef,
    private formBuilder: FormBuilder,
    private Uploadfiles: UploadfileserviceService,
    private localeService: BsLocaleService
  ) { }

  ngOnInit(): void {
    this.dataAdd.citizen = this.tokenStorage.getUser().citizen;
    this.fetchdata();
    this.dataAdd.STATUS = '0';
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
        var varN1 = {
          "opt": "viewnamecheckc1",
          "citizen": this.tokenStorage.getUser().citizen,
          "FACULTY_CODE": data[0].FACULTY_CODE
        }
        this.apiService
          .getdata(varN1, this.url1)
          .pipe(first())
          .subscribe((data: any) => {
            this.dataName = data;
            this.dataAdd.CITIZEN_IDC1 = data[0].CITIZEN_ID;
            this.dataAdd.CITIZEN_IDC2 = data[1].CITIZEN_ID;

          });

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
        //รายการปี
        var Table = {
          "opt": "viewyear"
        }
        this.apiService
          .getdata(Table, this.url1)
          .pipe(first())
          .subscribe((datay: any) => {
            this.dataYear = datay;
            this.dataAdd.PLYEARBUDGET_CODE = datay[0].PLYEARBUDGET_CODE;
            var varNf = {
              "opt": "viewfacreport",
              "citizen": this.tokenStorage.getUser().citizen,
              "PRIVILEGE_RSTATUS": data[0].PRIVILEGE_RSTATUS
            }
            this.apiService
              .getdata(varNf, this.url1)
              .pipe(first())
              .subscribe((data: any) => {
                this.dataFac = data;
                // console.log(data[0].FACULTY_CODE);
                this.dataAdd.FACULTY_CODE = data[0].FACULTY_CODE;
                this.fetchdatalist('0');

              });

          });

      });

  }
  fetchdataFac() {
    this.dataFac = null;
    this.dataAdd.opt = "viewfacreport";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataFac = data;
        this.dataAdd.FACULTY_CODE = data[0].FACULTY_CODE;
      });
  }

  fetchdatalist(status: any) {
    this.dataAdd.STATUS = status;
    this.datalist = null;
    this.datalistapp = null;
    this.loading = true;
    this.dataAdd.FNANNALS_CODE = [];
    this.dataAdd.check = [];
    this.dataAdd.opt = "readAll";
    this.rownum = null;
    this.apiService.getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == 1) {
          this.datalist = data.data;
          this.loading = null;
          this.rownum = 'true';
           for (let i = 0; i < this.datalist.length; i++) {
            this.dataAdd.FNANNALS_CODE[i] = this.datalist[i].FNANNALS_CODE;
            this.dataAdd.FNANNALSMAP_CODE[i] = this.datalist[i].FNANNALSMAP_CODE;
            this.dataAdd.FNANNALS_RSTATUS[i] = this.datalist[i].FNANNALS_RSTATUS;
            this.dataAdd.check[i] = false;
          }
        } else {
          this.datalist = data.data;
          this.loading = null;
          this.rownum = null;
          this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
        }
      });
  }
  fetchdatalistapp() {
    // console.log(1);
    this.loading = true;
    this.datalist = null;
    this.datalistapp = null;
    if (this.dataAdd.DATENOWS != '') {
      this.applyLocale('thBeLocale');
      this.dataAdd.DATENOWS1 = this.datenow(this.dataAdd.DATENOWS);
      this.dataAdd.DATENOWT2 = this.datenow(this.dataAdd.DATENOWT);
    } else {
      this.dataAdd.DATENOWS1 = '';
      this.dataAdd.DATENOWT2 = '';
      //console.log(this.dataAdd.DATENOWS);  
    }
    this.loading = true;
    this.rownum = null;
    this.rownum1 = null;
    this.dataAdd.opt = "readapp";
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == '1') {
          this.datalistapp = data.data;
          this.loading = null;
          this.rownum1 = 1;
        } else {
          this.rownum1 = null;
          this.loading = null;
          this.datalistapp = data.data;
          this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
        }
      });
  }
  datenow(datenow: any) {
    const yyyy = datenow.getFullYear();
    let mm = datenow.getMonth() + 1; // Months start at 0!
    let dd = datenow.getDate();
    return yyyy + '-' + mm + '-' + dd;
  }
  applyLocale(pop: any) {
    this.localeService.use(this.locale);
  }
  showinput() {
    this.rowpbi = 1;
    this.rowpbu = '';
  }
  setshowbti() {
    this.dataAdd.EBOOKREQ_FILE = '';
  }
  // ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
  editdata(id: any) {
    this.dataAdd.FNANNALS_CODE = id;
    /*this.dataAdd.EBOOKREQ_LINK = link;
    this.dataAdd.CITIZEN_IDA = ciz;
    this.dataAdd.FNANNALS_BOOK_SUB = sub;*/
    this.rowpbi = true;
  }
  // ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
  editdatapp(id: any, ciz1: any, ciz2: any) {
    this.dataAdd.FNANNALS_CODE = id;
    this.dataAdd.CITIZEN_IDC1 = ciz1;
    this.dataAdd.CITIZEN_IDC2 = ciz2;
    this.rowpbi = '';
    this.rowpbu = 1;
  }
  onChangepdf(event: any) {
    this.file = event.target.files[0];
  }

 submitData() {
    this.loading = true;
    this.dataAdd.opt = 'UPDATE';
    let num = 0;
    for (let i = 0; i < this.dataAdd.check.length; i++) {
      if (this.dataAdd.check[i] == true) {
        num = 1;
        //console.log(this.dataAdd.check[i]);
      }
    }
    //console.log(this.dataAdd.check);
    if (num == 0) {
      this.loading = null;
      this.toastr.warning("แจ้งเตือน:ยังไม่ได้เลือกข้อมูลรายการที่อนุมัติ");
    } else {
      this.apiService
        .getdata(this.dataAdd, this.url)
        .pipe(first())
        .subscribe(
          (data: any) => {
            if (data.status == '1') {
              this.loading = null;
             

              //ส่งอีเมล
          /*    this.dataAdd.opt = "sendemail";
              this.apiService
                .getupdate(this.dataAdd, this.url)
                .pipe(first())
                .subscribe((data: any) => {

                });*/

            }
            this.toastr.success("แจ้งเตือน:อนุมัติข้อมูลเรียบร้อย ");
            this.fetchdatalist('0');
          });
    }
  }
    checkall() {
    if (this.dataAdd.checkall == true) {
      for (let i = 0; i < this.datalist.length; i++) {
        this.dataAdd.check[i] = false;
      }
    } else {
      for (let i = 0; i < this.datalist.length; i++) {
        this.dataAdd.check[i] = true;
      }
    }
  }
}
