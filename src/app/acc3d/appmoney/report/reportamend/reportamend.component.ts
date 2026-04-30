import { Component, OnInit, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ApiPdoService } from '../../../../_services/api-pui.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TokenStorageService } from '../../../../_services/token-storage.service';
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
  selector: 'app-reportamend',
  templateUrl: './reportamend.component.html',
  styleUrls: ['./reportamend.component.scss']
})
export class ReportamendComponent implements OnInit {
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
  dataAdd: any = {};
  searchTerm: any;
  show: any;
  dataPro: any;
  datarstatus: any;
  dataStafftype: any;
  numrow: any;
  rownum: any;
  dataNameb: any;
  url = "/acc3d/appmoney/report/reportamend.php";
  url1 = "/acc3d/appmoney/userpermission.php";
  page = 1;
  count = 0;
  number = 0;
  tableSize = 20;
  tableSizes = [20, 30,40,100,200];
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
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.localeService.use('th');
    this.dataAdd.citizen = this.tokenStorage.getUser().citizen;
    this.fetchdata();
    this.dataAdd.DATENOWT = new Date();
  }
fetchdata() {
    var varN = {
      "opt": "viewufac",
      "citizen": this.tokenStorage.getUser().citizen
    }
    this.apiService
      .getdata(varN, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataAdd.FACULTY_CODE = data[0].FACULTY_CODE;
        //รายการปี
        var Tabley = {
          "opt": "viewyear"
        }
        this.apiService
          .getdata(Tabley, this.url1)
          .pipe(first())
          .subscribe((datay: any) => {
            this.dataYear = datay;
            this.dataAdd.PLYEARBUDGET_CODE = datay[0].PLYEARBUDGET_CODE;
            this.fetchdatalist();
          });
        this.fetchdatareport();
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
        this.fetchdataFac();


      });

  }

  fetchdatareport() {
    this.dataNameb = null;
    var varN1 = {
      "opt": "viewnamereport",
      "citizen": this.tokenStorage.getUser().citizen,
      "FACULTY_CODE": this.dataAdd.FACULTY_CODE
    }
    this.apiService
      .getdata(varN1, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataNameb = data;
        this.dataAdd.CITIZEN_IDA = data[0].CITIZEN_ID;
      });
  }
  showinput() {
    this.rowpbi = 1;
    this.rowpbu = '';
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
  onChangepdf(event: any) {
    this.file = event.target.files[0];
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


  setshowbti() {
    this.dataAdd.FNANNALSMAPR_CODE = '';
    this.dataAdd.FNANNALSMAPR_CODE = '';
    this.dataAdd.EBOOKREQ_LINK= '';

  }
  
  //แก้ไขข้อมูล
  updatedata() {

    if (this.dataAdd.EBOOKREQ_FILE == '') {
      this.toastr.warning("แจ้งเตือน:กรุณาแนบไฟล์");
    } else {

      this.dataAdd.opt = "update";
      this.apiService
        .getupdate(this.dataAdd, this.url)
        .pipe(first())
        .subscribe((data: any) => {
          //console.log(data.status);       
          if (data.status == 1) {
            this.Uploadfiles.uploadcontract(this.file, this.dataAdd.FACULTY_CODE, this.dataAdd.PLYEARBUDGET_CODE, this.dataAdd.FNANNALSMAP_CODE, this.dataAdd.citizen, '86')
              .subscribe((event: any) => {
                // 
                if (event.type == 4) {
                }
              }
              );
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
  // ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
  editdata(id: any,id2: any) {
    this.setshowbti();
    this.dataAdd.FNANNALSMAPR_CODE = id;
    this.dataAdd.FNANNALSMAP_CODE = id2;
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
    previewPdf(url: string) {
    this.previewPdfUrl = url;
    this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url + '#navpanes=0');
  }
  closePdfPreview() {
    this.previewPdfUrl = '';
    this.safePdfUrl = '';
  } 
}
