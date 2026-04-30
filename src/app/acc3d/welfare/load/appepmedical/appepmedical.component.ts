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
import { UploadfileserviceService } from '../../../../acc3d/_services/uploadfileservice.service';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-appepmedical',
  templateUrl: './appepmedical.component.html',
  styleUrls: ['./appepmedical.component.scss']
})
export class AppepmedicalComponent implements OnInit {
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
  dataAdd: any = { check: [], FEREIM_CODE: [], FEREIMDT_WMONEY: [], FEREIMDT_LINK: [],FRACCCODE:[] };
  searchTerm: any;
  show: any;
  dataPro: any;
  datarstatus: any;
  dataStafftype: any;
  datacampus: any;
  numrow: any;
  locale = 'th-be';
  locales = listLocales();
  rownum: any;
  url = "/acc3d/welfare/load/appepmedical.php";
  url1 = "/acc3d/welfare/userpermission.php";
  page = 1;
  count = 0;
  number: any = [0, 1, 2];
  tableSize = 20;
  tableSizes = [20, 30, 40, 80, 100];
  rowpbi: any;
  rowpbu: any;
  file: any;
  dataNameb: any;
  dataEdoc: any;
  datachief: any;
  dataIncome: any;
  dataAcc: any;
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
    private Uploadfiles: UploadfileserviceService,
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

        //หน่วยเบิกจ่าย
        var Tablein = {
          "opt": "viewCAMPUS",
          "PRIVILEGE_RSTATUS": this.dataAdd.PRIVILEGE_RSTATUS,
          "citizen": this.tokenStorage.getUser().citizen
        }
        this.apiService
          .getdata(Tablein, this.url1)
          .pipe(first())
          .subscribe((data: any) => {
            this.datacampus = data;
            this.dataAdd.CAMPUS_CODE = data[0].CAMPUS_CODE;
          });



        this.dataFac = null;
        this.dataAdd.opt = "viewfacapp";
        this.apiService
          .getdata(this.dataAdd, this.url1)
          .pipe(first())
          .subscribe((data: any) => {
            this.dataFac = data;
            this.dataAdd.FACULTY_CODE = data[0].FACULTY_CODE;
            this.fetchdatareport();
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

      });
    //รายการประเภทเงิน
    var Tablein = {
      "opt": "viewPLINCOME"
    }
    this.apiService
      .getdata(Tablein, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataIncome = data;
        this.dataAdd.PLINCOME_CODE = data[0].PLINCOME_CODE;
      });
    //ประเภทบุคลากร
    var Tablein = {
      "opt": "viewFNANNALSMAPTS"
    }
    this.apiService
      .getdata(Tablein, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataStafftype = data;
      });  
   this.dataAdd.opt = "viewFRACCE";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataAcc = data;
        //console.log(data);
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
        // this.dataAdd.CITIZEN_IDA = data[0].CITIZEN_ID;
        // this.dataAdd.CITIZEN_IDB = data[1].CITIZEN_ID;

      });
  }
  onChangepdf(event: any) {
    this.file = event.target.files[0];
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
    this.dataAdd.opt = "viewepmedicalapp";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == '1') {
          this.datalistdetail = data.data;
          this.datalistlink = data.data2;
          for (let i = 0; i < this.datalistdetail.length; i++) {
            this.dataAdd.FEREIM_CODE[i] = this.datalistdetail[i].FEPSTATE_CODE;
            this.dataAdd.FEREIMDT_WMONEY[i] = this.datalistdetail[i].FEPSTATE_TMONEY;
            if (this.datalistdetail[i].FNANNALSMAP_CODE == '') {
              this.dataAdd.check[i] = false;
            }
            if (this.datalistdetail[i].FNANNALSMAP_CODE == '1') {
              this.dataAdd.check[i] = true;
            }
            for (let i = 0; i < this.datalistlink.length; i++) {
              this.dataAdd.FEREIMDT_LINK[i] = this.datalistlink[i].link;

            }
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
  onChangeedoc() {
    this.dataEdoc = null;
    this.dataAdd.opt = "viewedoc";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataEdoc = data.data;
        this.dataAdd.DEPARTMENT_CODE = data.data[0].mapSectionCode;
      });
  }
  onChangechief() {
    this.datachief = null;
    this.dataAdd.opt = "viewCHIEFANNAL";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.datachief = data;
        // this.dataAdd.CHIEF_CODE = data[0].CHIEF_CODE;
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
        this.dataAdd.FNANNALSMAP_CODE = data.data[0].FNANNALSMAP_CODE;
        this.dataAdd.DEPARTMENT_CODE = data.data[0].DEPARTMENT_CODE;
        this.dataAdd.CHIEF_CODE = data.data[0].CHIEF_CODE;
        this.dataAdd.PLINCOME_CODE = data.data[0].PLINCOME_CODE;
        this.dataAdd.FNANNALSMAPTS_CODE = data.data[0].FNANNALSMAPTS_CODE;
        this.dataAdd.CAMPUS_CODE = data.data[0].CAMPUS_CODE;
        this.dataAdd.CITIZEN_IDC1 = data.data[0].CITIZEN_IDC1;
          for (let i = 0; i < data.data2.length; i++) {
           
            this.dataAdd.FRACCCODE[i] = data.data2[i].FRACC_CODE;
            
          }
          // console.log(this.dataAdd.FRACCCODE);
        this.fetchdataload();
      });
    this.rowpbi = null;
    this.rowpbu = true;
  }
  setshowbti() {
    this.onChangeedoc();
    this.onChangechief();
    this.fetchdatareport();
    this.dataAdd.FNANNALSMAP_CODE = '';
    this.dataAdd.DEPARTMENT_CODE = '';
    this.dataAdd.CHIEF_CODE = '';
    this.dataAdd.PLINCOME_CODE = '01';
    this.dataAdd.FNANNALSMAPTS_CODE = '';
    this.dataAdd.CAMPUS_CODE = '';
    this.dataAdd.CITIZEN_IDC1 = '';
     for (let i = 0; i < this.number.length; i++) {
      this.dataAdd.FRACCCODE[i] = '';
     }

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
    } else if (this.dataAdd.EBOOKREQ_FILE == '') {
      this.toastr.warning("แจ้งเตือน:ยังไม่ได้แนบไฟล์");
    } else {
      this.dataAdd.opt = "insert";
      this.apiService
        .getupdate(this.dataAdd, this.url)
        .pipe(first())
        .subscribe((data: any) => {
          //console.log(data.status);       
          if (data.status == 1) {
            this.Uploadfiles.uploadcheck(this.file, this.dataAdd.FACULTY_CODE, this.dataAdd.PLYEARBUDGET_CODE, data.id, this.dataAdd.citizen, '112')
              .subscribe((event: any) => {
                // 
                if (event.type == 4) {
                  this.fetchdatalist();
                }
              }
              );
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
      this.apiService
        .getupdate(this.dataAdd, this.url)
        .pipe(first())
        .subscribe((data: any) => {
          //console.log(data.status);       
          if (data.status == 1) {
            this.Uploadfiles.uploadcheck(this.file, this.dataAdd.FACULTY_CODE, this.dataAdd.PLYEARBUDGET_CODE, data.id, this.dataAdd.citizen, '112')
              .subscribe((event: any) => {
                // 
                if (event.type == 4) {
                  this.fetchdatalist();
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
  sendfile(id: any, link: any, link3: any) {
    this.editdata(id);
    this.dataAdd.link2 = link;
    this.dataAdd.link3 = link3;
    Swal.fire({
      title: 'ต้องการรวมไฟล์ส่งสารบรรณ',
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
