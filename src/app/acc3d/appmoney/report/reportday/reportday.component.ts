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
  selector: 'app-reportday',
  templateUrl: './reportday.component.html',
  styleUrls: ['./reportday.component.scss']
})
export class ReportdayComponent implements OnInit {
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
  dataAdd: any = { check: [], FNANNALSMAP_CODE: [] };
  searchTerm: any;
  show: any;
  dataPro: any;
  datarstatus: any;
  dataStafftype: any;
  numrow: any;
  rownum: any;
  dataNameb: any;
  dataNamea: any;
  url = "/acc3d/appmoney/report/reportday.php";
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
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.localeService.use('th');
    this.dataAdd.citizen = this.tokenStorage.getUser().citizen;
    this.fetchdata();
    this.dataAdd.DATENOWS = new Date();
    this.dataAdd.DATENOWT = new Date();
    this.dataAdd.DATENOWTT = new Date();
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
      "opt": "viewnamereportday",
      "citizen": this.tokenStorage.getUser().citizen,
      "FACULTY_CODE": this.dataAdd.FACULTY_CODE
    }
    this.apiService
      .getdata(varN1, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataNameb = data;
        // this.dataAdd.CITIZEN_IDA = data[0].CITIZEN_ID;
      });
  }
    fetchdataedit() {
    this.dataNamea = null;
    var varN1 = {
      "opt": "viewnamecheckb",
      "citizen": this.tokenStorage.getUser().citizen,
      "FACULTY_CODE": this.dataAdd.FACULTY_CODE
    }
    this.apiService
      .getdata(varN1, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataNamea = data;
        // this.dataAdd.CITIZEN_IDA = data[0].CITIZEN_ID;
      });
  }
  showinput() {
    this.rowpbi = 1;
    this.rowpbu = '';
    this.dataAdd.CITIZEN_IDA = '';
  }
  showedit(id: any) {
    this.dataAdd.FNANNALSMAP_CODE = id;
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

  fetchdataload() {
    this.datalistdetail = null;
    this.dataAdd.FNANNALSMAP_CODE = [];
    this.dataAdd.check = [];
    this.dataAdd.opt = "viewannal";
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == '1') {
          this.datalistdetail = data.data;
          for (let i = 0; i < this.datalistdetail.length; i++) {
            this.dataAdd.FNANNALSMAP_CODE[i] = this.datalistdetail[i].FNANNALSMAP_CODE;
            if (this.datalistdetail[i].FNANNALSMAPRDT_CODE == '') {
              this.dataAdd.check[i] = false;
            }
            if (this.datalistdetail[i].FNANNALSMAPRDT_CODE != '') {
              this.dataAdd.check[i] = true;
            }
          }
        }
      });
  }
  fetchdataloadshow() {

    this.dataAdd.opt = "viewannalshow";
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
    this.dataAdd.opt = "readAll";
    if (this.dataAdd.DATENOWS != '') {
      this.dataAdd.DATENOWS1 = this.datenow(this.dataAdd.DATENOWS);
      this.dataAdd.DATENOWT2 = this.datenow(this.dataAdd.DATENOWTT);
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
  returnData(id: any) {
      this.dataAdd.opt = 'RETURN';
      this.dataAdd.FNANNALSMAP_CODE = id;
        Swal.fire({
          title: 'ต้องการปรับปรุงข้อมูลใหม่?',
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
                  Swal.fire('ปรับปรุงข้อมูลใหม่!', 'ปรับปรุงข้อมูลเรียบร้อยแล้ว', 'success');
                  this.fetchdataload();
                }
              });
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire('ยกเลิก', 'ยกเลิกการปรับปรุงข้อมูล', 'error');
          }
        });
      
    }
  // ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
  editdata(id: any, fac: any) {
    this.dataAdd.FACULTY_CODE = fac;
    this.fetchdatareport();
    this.setshowbti();
    this.apiService
      .getById(id, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataAdd.FNANNALSMAPR_CODE = data.data[0].FNANNALSMAPR_CODE;
        this.dataAdd.CITIZEN_IDA = data.data[0].CITIZEN_IDA;
        this.dataAdd.CITIZEN_IDB = data.data[0].CITIZEN_IDB;

        this.dataAdd.DATENOWT = new Date(data.data[0].FNANNALSMAPR_DATE);
        //  console.log(this.dataAdd.DATENOWT);
        this.fetchdataload();
      });
    this.rowpbi = null;
    this.rowpbu = true;
  }
  setshowbti() {
    this.dataAdd.FNANNALSMAPR_CODE = '';
    this.dataAdd.CITIZEN_IDED = '';
    this.dataAdd.FNANNALSMAP_NOTE = '';
    this.fetchdataedit();
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
      if (this.dataAdd.DATENOWT != '') {
        this.dataAdd.DATENOWT1 = this.datenow(this.dataAdd.DATENOWT);
      } else {
        this.dataAdd.DATENOWT = '';
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

      this.dataAdd.opt = "update";
      if (this.dataAdd.DATENOWT != '') {
        this.dataAdd.DATENOWT1 = this.datenow(this.dataAdd.DATENOWT);
      } else {
        this.dataAdd.DATENOWT = '';
      }
      this.apiService
        .getupdate(this.dataAdd, this.url)
        .pipe(first())
        .subscribe((data: any) => {
          //console.log(data.status);       
          if (data.status == 1) {
            this.Uploadfiles.uploadcontract(this.file, this.dataAdd.FACULTY_CODE, this.dataAdd.PLYEARBUDGET_CODE, this.dataAdd.FNANNALSMAPR_CODE, this.dataAdd.citizen, '86')
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
  editdatashow(id: any) {
    this.dataAdd.FNANNALSMAPR_CODE = id;
    this.fetchdataloadshow();
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
