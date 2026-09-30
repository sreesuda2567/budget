import { Component, OnInit, ElementRef, HostListener, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ApiPdoService } from '../../../../_services/api-pui.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TokenStorageService } from '../../../../_services/token-storage.service';
import { PDFDocument } from 'pdf-lib';
import { first, map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UploadfileserviceService } from '../../../../acc3d/_services/uploadfileservice.service';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { thLocale } from 'ngx-bootstrap/locale'; // ✅ เปลี่ยนเป็น path ที่ถูกต้อง
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
defineLocale('th', thLocale); // โหลด locale ภาษาไทย

@Component({
  selector: 'app-reportpaper',
  templateUrl: './reportpaper.component.html',
  styleUrls: ['./reportpaper.component.scss']
})
export class ReportpaperComponent implements OnInit {
  title = 'angular-app';
  fileName = 'report.xlsx';
  totalReportPages: number = 0;
  totalReport2Pages: number = 0;
  groupedFacultyList: any[] = [];
  totalGroupCount: number = 0;
  totalGroupAmount: number = 0;
  totalGroupPages1: number = 0;
  totalGroupPages2: number = 0;
  totalGroupPagesAll: number = 0;
  userList = [{}];

  dataYear: any;
  dataCam: any;
  dataFac: any;
  datalist: any;
  datalistdetail: any;
  loading: any;
  loadingdetail: any;
  dataAdd: any = {PAPERPAGE:[]};
  searchTerm: any;
  show: any;
  dataPro: any;
  datarstatus: any;
  dataStafftype: any;
  numrow: any;
  rownum: any;
  dataNameb: any;
  url = '/acc3d/appmoney/report/reportpaper.php';
  url1 = "/acc3d/appmoney/userpermission.php";
  page = 1;
  count = 0;
  number = 0;
  tableSize = 20;
  tableSizes = [20, 30, 40, 100, 200];
  rowpbi: any;
  rowpbu: any;
  file: any;
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
    private Uploadfiles: UploadfileserviceService,
    private localeService: BsLocaleService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
     this.localeService.use('th');
    this.dataAdd.citizen = this.tokenStorage.getUser().citizen;
    this.dataAdd.DATENOWS = '';
    this.dataAdd.DATENOWT = '';
    this.dataAdd.type='01'
    this.dataAdd.MONTH='10';
    this.fetchdata();
  }
fetchdata() {
    var varP = {
      opt: 'viewp',
      citizen: this.tokenStorage.getUser().citizen,
    };
    //ดึงรายการคณะตามสิทธิ์
    this.apiService
      .getdata(varP, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.datarstatus = data;
        this.dataAdd.PRIVILEGE_RSTATUS = data[0].PRIVILEGE_RSTATUS;
        var varN = {
          opt: 'viewcam',
          citizen: this.tokenStorage.getUser().citizen,
          PRIVILEGERSTATUS: data[0].PRIVILEGE_RSTATUS,
        };
        this.apiService
          .getdata(varN, this.url1)
          .pipe(first())
          .subscribe((datacam: any) => {
            this.dataCam = datacam;
            this.dataAdd.CAMPUS_CODE = datacam[0].CAMPUS_CODE;
            var Tabley = {
              opt: 'viewyearapp',
            };
            this.apiService
              .getdata(Tabley, this.url1)
              .pipe(first())
              .subscribe((datay: any) => {
                this.dataYear = datay;
                this.dataAdd.PLYEARBUDGET_CODE = datay[0].PLYEARBUDGET_CODE;
                
              });
          });
      });
  }

  fetchdatareport() {
    this.dataNameb = null;
    var varN1 = {
      opt: 'viewnamereport',
      citizen: this.tokenStorage.getUser().citizen,
      FACULTY_CODE: this.dataAdd.FACULTY_CODE,
    };
    this.apiService
      .getdata(varN1, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataNameb = data;
        this.dataAdd.CITIZEN_IDA = data[0].CITIZEN_ID;
      });
  }
  showinput(type: any) {
    // console.log(type);
    this.fetchdatareport();
    this.dataAdd.type = type;
    if (type == 1) {
      this.rowpbi = '';
      this.rowpbu = 1;
    } else {
      this.rowpbi = 1;
      this.rowpbu = '';
    }
  }
  fetchdataFac() {
    this.dataFac = null;
    this.dataAdd.opt = 'viewfacreport';
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataFac = data;
        this.dataAdd.FACULTY_CODE = data[0].FACULTY_CODE;
      });
  }
  onChangepdf(event: any) {
    this.file = event.target.files[0];
  }

  fetchdataload() {
    this.datalistdetail = null;
    this.dataAdd.FNANNALSMAP_CODE = [];
    this.dataAdd.check = [];
    this.dataAdd.opt = 'viewannal';
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == '1') {
          this.datalistdetail = data.data;
        }
      });
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
    this.groupedFacultyList = [];
    this.totalGroupCount = 0;
    this.totalGroupAmount = 0;
    this.totalGroupPages1 = 0;
    this.totalGroupPages2 = 0;
    this.totalGroupPagesAll = 0;
    this.dataAdd.totalReportPages = 0;
    this.dataAdd.totalReport2Pages = 0;
    this.dataAdd.opt = 'readAll';
    this.dataAdd.check = [];
    this.dataAdd.FNEXACC_CODE = [];
    this.dataAdd.FNEXACC_DETAIL = [];
        if (this.dataAdd.DATENOWS != '') {
      this.dataAdd.DATENOWS1 = this.datenow(this.dataAdd.DATENOWS);
      this.dataAdd.DATENOWT2 = this.datenow(this.dataAdd.DATENOWT);
    } else {
      this.dataAdd.DATENOWS1 = '';
      this.dataAdd.DATENOWT2 = '';
      //console.log(this.dataAdd.DATENOWS);  
    }
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
          this.groupDataByFaculty();
          // Count pages for PDFs
          if (this.datalist && this.datalist.length > 0) {
            this.datalist.forEach((p: any) => {
              if (p.REPORT_LINK) this.countPdfPages(p.REPORT_LINK, p, 'REPORT_LINK_pages');
              if (p.REPORT_LINK2) this.countPdfPages(p.REPORT_LINK2, p, 'REPORT_LINK2_pages');
              this.dataAdd.PAPERPAGE.push(p.CONTRACT_LINK);
            });
          }
          for (let i = 0; i < this.datalist.length; i++) {
            this.dataAdd.FNANNALSMAPR_CODE[i] =
              this.datalist[i].FNANNALSMAPR_CODE;
            this.dataAdd.FNEXACC_DETAIL[i] =
              'ส่งคืนเอกสารของ ' +
              this.datalist[i].FSTF_FNAME +
              'ประจำวันที่ ' +
              this.datalist[i].FNANNALSMAPR_DATE1;
            this.dataAdd.USERNAME_CISCO[i] = this.datalist[i].USERNAME_CISCO;
            this.dataAdd.check[i] = false;
          }
        } else {
          this.rownum = null;
          this.loading = null;
          this.datalist = data.data;
          this.groupedFacultyList = [];
          this.toastr.warning('แจ้งเตือน:ไม่มีข้อมูล');
        }
      });
  }

  returnData(status: any) {
    if (this.dataAdd.FNEXACCTD_NOTE == '') {
      this.toastr.warning('แจ้งเตือน:กรุณากรอกหมายเหตุ');
    } else {
      this.loadingdetail = true;
      this.dataAdd.opt = 'RETURN';
      this.dataAdd.STATUS = status;
      let num = 0;
      for (let i = 0; i < this.dataAdd.check.length; i++) {
        if (this.dataAdd.check[i] == true) {
          num = 1;
          //console.log(this.dataAdd.check[i]);
        }
      }
      //console.log(this.dataAdd.check);
      if (num == 0) {
        this.loadingdetail = null;
        this.toastr.warning('แจ้งเตือน:ยังไม่ได้เลือกข้อมูลรายการที่ส่งคืน');
      } else {
        this.apiService
          .getdata(this.dataAdd, this.url)
          .pipe(first())
          .subscribe((data: any) => {
            if (data.status == '1') {
              this.loadingdetail = null;
              this.dataAdd.opt = 'sendemail';
              this.apiService
                .getupdate(this.dataAdd, this.url)
                .pipe(first())
                .subscribe((data: any) => {});
              this.fetchdatalist();
              this.toastr.success('แจ้งเตือน:ส่งคืนข้อมูลเรียบร้อย ');
              document.getElementById('ModalClose')?.click();
            }
          });
      }
    }
  }
    // ฟังก์ขันสำหรับการเพิ่มข้อมูล
  insertdata() {

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

  async countPdfPages(url: string, item: any, propertyName: string) {
    if (!url) return;
    try {
      if (item[propertyName]) return;
      const response = await fetch(url);
      const pdfBytes = await response.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      item[propertyName] = pdfDoc.getPageCount();
      this.calculateTotalPages();
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error counting PDF pages for URL:', url, error);
    }
  }

  calculateTotalPages() {
    this.dataAdd.totalReportPages = 0;
    this.dataAdd.totalReport2Pages = 0;
    if (this.datalist && this.datalist.length > 0) {
      this.datalist.forEach((p: any) => {
        if (p.REPORT_LINK_pages) {
          this.dataAdd.totalReportPages += p.REPORT_LINK_pages;
        }
        if (p.REPORT_LINK2_pages) {
          this.dataAdd.totalReport2Pages += p.REPORT_LINK2_pages;
        }
      });
    }
    this.groupDataByFaculty();
  }

  groupDataByFaculty() {
    if (!this.datalist || this.datalist.length === 0) {
      this.groupedFacultyList = [];
      this.totalGroupCount = 0;
      this.totalGroupAmount = 0;
      this.totalGroupPages1 = 0;
      this.totalGroupPages2 = 0;
      this.totalGroupPagesAll = 0;
      return;
    }

    const map = new Map<string, any>();

    this.datalist.forEach((p: any) => {
      const facName = (p.FACULTY_TNAME || 'ไม่ระบุหน่วยงาน').trim();
      const amount = parseFloat(p.FNANNALS_AMOUNT) || 0;
      const pages1 = parseInt(p.REPORT_LINK_pages, 10) || 0;
      const pages2 = parseInt(p.REPORT_LINK2_pages, 10) || 0;

      if (!map.has(facName)) {
        map.set(facName, {
          FACULTY_TNAME: facName,
          count: 0,
          amount: 0,
          pages1: 0,
          pages2: 0,
          totalPages: 0
        });
      }

      const group = map.get(facName);
      group.count += 1;
      group.amount += amount;
      group.pages1 += pages1;
      group.pages2 += pages2;
      group.totalPages += (pages1 + pages2);
    });

    this.groupedFacultyList = Array.from(map.values()).sort((a, b) =>
      a.FACULTY_TNAME.localeCompare(b.FACULTY_TNAME, 'th')
    );

    this.totalGroupCount = this.groupedFacultyList.reduce((sum, g) => sum + g.count, 0);
    this.totalGroupAmount = this.groupedFacultyList.reduce((sum, g) => sum + g.amount, 0);
    this.totalGroupPages1 = this.groupedFacultyList.reduce((sum, g) => sum + g.pages1, 0);
    this.totalGroupPages2 = this.groupedFacultyList.reduce((sum, g) => sum + g.pages2, 0);
    this.totalGroupPagesAll = this.groupedFacultyList.reduce((sum, g) => sum + g.totalPages, 0);
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
