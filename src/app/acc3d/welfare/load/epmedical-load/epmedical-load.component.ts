import { Component, OnInit, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ApiPdoService } from '../../../../_services/api-pui.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
  selector: 'app-epmedical-load',
  templateUrl: './epmedical-load.component.html',
  styleUrls: ['./epmedical-load.component.scss']
})
export class EpmedicalLoadComponent implements OnInit {
  title = 'angular-app';
  fileName = 'report.xlsx';
  userList = [{}]

  dataYear: any;
  dataCam: any;
  dataFac: any;
  datalist: any;
  datalistdetail: any;
  datalistlink: any;
  loading: any;
  loadingdetail: any;
  dataAdd: any = { check: [], FEREIM_CODE: [], FEREIMDT_WMONEY: [], FEREIMDT_LINK: [] };
  searchTerm: any;
  show: any;
  dataPro: any;
  datarstatus: any;
  dataStafftype: any;
  numrow: any;
  locale = 'th-be';
  locales = listLocales();
  rownum: any;
  url = "/acc3d/welfare/load/epmedical_load.php";
  url1 = "/acc3d/welfare/userpermission.php";
  page = 1;
  count = 0;
  number = 0;
  tableSize = 20;
  tableSizes = [20, 30, 40, 80, 100];
  rowpbi: any;
  rowpbu: any;
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
    private localeService: BsLocaleService,
    private sanitizer: DomSanitizer
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

          });
        this.fetchdataFac();
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
      });

  }
  showinput() {
    this.rowpbi = 1;
    this.rowpbu = '';
  }
  fetchdataFac() {
    this.dataFac = null;
    this.dataAdd.opt = "viewfacload";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataFac = data;
        this.dataAdd.FACULTY_CODE = data[0].FACULTY_CODE;
      });
  }
  fetchdataload() {
    this.datalistdetail = null;
    this.datalistlink = null;
    this.dataAdd.FEREIM_CODE = [];
    this.dataAdd.FEREIMDT_WMONEY = [];
    this.dataAdd.check = [];
    this.dataAdd.opt = "viewepmedicaload";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == '1') {
          this.datalistdetail = data.data;
          this.datalistlink = data.data2;
          for (let i = 0; i < this.datalistdetail.length; i++) {
            this.dataAdd.FEREIM_CODE[i] = this.datalistdetail[i].FEREIM_CODE;
            this.dataAdd.FEREIMDT_WMONEY[i] = this.datalistdetail[i].FEREIMDT_WMONEY;
            if (this.datalistdetail[i].FEPSTATE_CODE == '') {
              this.dataAdd.check[i] = false;
            }
            if (this.datalistdetail[i].FEPSTATE_CODE == '1') {
              this.dataAdd.check[i] = true;
            }
          }
          for (let i = 0; i < this.datalistlink.length; i++) {
            this.dataAdd.FEREIMDT_LINK[i] = this.datalistlink[i].link;

          }
        }
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
  fetchdatadetail(CODE: any, name: any) {
    this.dataAdd.MCITIZEN_ID = CODE;
    this.dataAdd.FEREIM_NAME = name;
    this.dataAdd.opt = 'reportdetail';
    this.datalistdetail = null;
    this.loading = true;
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == 1) {
          this.datalistdetail = data.data;
          this.loading = null;
        } else {
          this.loading = null;
          this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
          this.datalistdetail = data.data;
        }
      });

  }
  // ฟังก์ชันสำหรับการลบข้อมูล
  deleteData(id: any) {
    this.dataAdd.opt = "delete";
     this.dataAdd.id = id;
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
    this.apiService
      .getById(id, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataAdd.FACULTY_CODE = data.data[0].FACULTY_CODE;
        this.dataAdd.FEPSTATE_CODE = data.data[0].FEPSTATE_CODE;
        this.dataAdd.FEPSTATE_NDEKA = data.data[0].FEPSTATE_NDEKA;
        // this.dataAdd.link2 = data.data[0].link;
        this.fetchdataload();
        if (data.data[0].FEPSTATE_SAVE != null) {
          this.dataAdd.DATENOWS = new Date(data.data[0].FEPSTATE_SAVE);
        } else {
          this.dataAdd.DATENOWS = '';
        }

      });
    this.rowpbi = null;
    this.rowpbu = true;
  }
  sendfile(id: any, link: any) {
    this.editdata(id);
    this.dataAdd.link2 = link;
    Swal.fire({
      title: 'ต้องการรวมไฟล์',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      this.dataAdd.opt = "sendfile";
      if (result.value) {
        this.apiService
          .getdata(this.dataAdd, this.url)
          .pipe(first())
          .subscribe((data: any) => {
            if (data.status == 1) {
              this.toastr.success("แจ้งเตือน:รวมไฟล์เรียบร้อยแล้ว");
              this.fetchdatalist();

            }
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('ยกเลิก', 'ยกเลิกการรวมไฟล์', 'error');
      }
    });

  }
  setshowbti() {
    this.dataAdd.FEPSTATE_CODE = '';
    this.dataAdd.DATENOWS = '';
    this.dataAdd.FEPSTATE_NDEKA = '';
  }
  // ฟังก์ขันสำหรับการเพิ่มข้อมูล
  insertdata() {
    this.loading = true;
    let num = 0;
    for (let i = 0; i < this.dataAdd.check.length; i++) {
      // console.log(this.dataAdd.check[i]);
      if (this.dataAdd.check[i] == true) {
        num = 1;
      }
    }
    if (num == 0) {
      this.toastr.warning("แจ้งเตือน:ยังไม่ได้เลือกข้อมูล");
    } else {
      if (this.dataAdd.DATENOWS != '') {
        this.dataAdd.FEPSTATE_DSAVE = this.datenow(this.dataAdd.DATENOWS);
      } else {
        this.dataAdd.FEPSTATE_DSAVE = '';
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
    let num = 0;
    for (let i = 0; i < this.dataAdd.check.length; i++) {
      // console.log(this.dataAdd.check[i]);
      if (this.dataAdd.check[i] == true) {
        num = 1;
      }
    }
    if (num == 0) {
      this.toastr.warning("แจ้งเตือน:ยังไม่ได้เลือกข้อมูล");
    } else {
      if (this.dataAdd.DATENOWS != '') {
        this.dataAdd.FEPSTATE_DSAVE = this.datenow(this.dataAdd.DATENOWS);
      } else {
        this.dataAdd.FEPSTATE_DSAVE = '';
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
  previewPdf(url: string) {
    this.previewPdfUrl = url;
    this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url + '#navpanes=0');
  }
  closePdfPreview() {
    this.previewPdfUrl = '';
    this.safePdfUrl = '';
  }
}
