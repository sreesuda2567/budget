import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
  selector: 'app-annalsendm',
  templateUrl: './annalsendm.component.html',
  styleUrls: ['./annalsendm.component.scss']
})
export class AnnalsendmComponent implements OnInit {
  datalist: any;
  loading: any;
  rownum: any;
  file: any;
  dataFac: any;
  dataYear: any;
  datarstatus: any;
  dataName: any;
  dataNameb: any;
  url = "/acc3d/appmoney/annal/annalsendm.php";
  url1 = "/acc3d/appmoney/userpermission.php";
  dataProvince: any;
  rowpbi: any;
  rowpbu: any;
  rownum1: any;
  dataAdd: any = {};
  locale = 'th-be';
  locales = listLocales();
  datalistapp: any;
  dataEdoc: any;
  datachief: any;
  datareceipt: any;
  dataReceiptdetail: any;
  page = 1;
  count = 0;
  number = 0;
  tableSize = 40;
  tableSizes = [40, 100, 200];
  searchTerm: any;
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
    this.dataAdd.citizen = this.tokenStorage.getUser().citizen;
    this.dataAdd.search = "";
    this.dataAdd.FNANNALSSEQREQ_DETAIL = "";
    this.fetchdata();
    this.rownum = 1;
    this.dataAdd.DATENOWS = '';
    this.dataAdd.DATENOWT = '';
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
        var varN = {
          "opt": "viewnamecheckm",
          "citizen": this.tokenStorage.getUser().citizen,
          "FACULTY_CODE": data[0].FACULTY_CODE
        }
        this.apiService
          .getdata(varN, this.url1)
          .pipe(first())
          .subscribe((data: any) => {
            this.dataNameb = data;
            this.dataAdd.CITIZEN_IDA = data[0].CITIZEN_IA;

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
                this.fetchdatalist();

              });
          });

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

  fetchdatalist() {
    this.datalist = null;
    this.datalistapp = null;
    this.loading = true;
    this.dataAdd.opt = "readAll";
    if (this.dataAdd.DATENOWS != '') {
      this.applyLocale('thBeLocale');
      this.dataAdd.DATENOWS1 = this.datenow(this.dataAdd.DATENOWS);
      this.dataAdd.DATENOWT2 = this.datenow(this.dataAdd.DATENOWT);
    } else {
      this.dataAdd.DATENOWS1 = '';
      this.dataAdd.DATENOWT2 = '';
      //console.log(this.dataAdd.DATENOWS);  
    }
    this.rownum = null;
    this.rownum1 = null;
    this.apiService.getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == 1) {
          this.datalist = data.data;
          this.loading = null;
          this.rownum = 'true';
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
    this.dataAdd.EBOOKREQ_LINK = '';
    this.dataAdd.FNANNALSMAP_CODE = '';
    this.dataAdd.FNANNALS_CODE = '';
    this.dataAdd.CITIZEN_IDA = '';
    this.dataAdd.EBOOKREQ_FILE = '';
    this.dataAdd.FNANNALS_MONEYC = '';
    this.dataAdd.USERNAME_CISCO = '';
    this.dataAdd.FNANNALS_BOOK_AT = '';
    this.dataAdd.FNEXACCTD_NOTE = '';
    this.dataAdd.FSTF_FNAME = '';
    this.dataAdd.FNRESTATUS_CODE = '2';
    this.dataAdd.FNRESTATUS_CODE2 = '';
  }
  // ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
  editdata(id: any, id2: any, money: any, mail: any, at: any, name: any, mail2: any) {
    this.setshowbti();
    this.onChangeedoc();
    this.onChangechief();
    this.onChangeReceiptdetail(id2);
    this.dataAdd.FNANNALSMAP_CODE = id;
    this.dataAdd.FNANNALS_CODE = id2;
    this.dataAdd.USERNAME_CISCO = mail;
    this.dataAdd.USERNAME_CISCOA = mail2;
    this.dataAdd.FNANNALS_BOOK_AT = at;
    this.dataAdd.FSTF_FNAME = name;
    this.dataAdd.FNANNALS_MONEYC = parseFloat(money).toFixed(2);
    this.rowpbi = true;
    // console.log(this.dataAdd.FNANNALSMAP_CODE1);
  }
  // ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไขFNANNALSMAP_CODE
  editdatapp(id: any, id2: any, link: any, ciz: any, money: any, status: any) {
    this.setshowbti();
    this.onChangeedoc();
    this.onChangechief();
    this.dataAdd.FNANNALS_CODE = id;
    this.dataAdd.FNANNALSMAP_CODE = id2;
    this.dataAdd.EBOOKREQ_LINK = link;
    this.dataAdd.CITIZEN_IDA = ciz;
    this.dataAdd.FNANNALS_MONEYC = parseFloat(money).toFixed(2);
    if (status != null) {
      this.dataAdd.FNRESTATUS_CODE = 1;
    }
    this.rowpbi = '';
    this.rowpbu = 1;
  }
  onChangepdf(event: any) {
    this.file = event.target.files[0];
  }
  onChangeRadio(event: any) {
    this.dataAdd.FNRESTATUS = event;
  }

  // ฟังก์ขันสำหรับการเพิ่มข้อมูล
  insertdata() {
    if (this.dataAdd.EBOOKREQ_FILE == '') {
      if (this.dataAdd.EBOOKREQ_FILE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาแนบไฟล์");
      }

    } else {
      this.dataAdd.opt = "insert";
      this.apiService
        .getupdate(this.dataAdd, this.url)
        .pipe(first())
        .subscribe((data: any) => {
          //console.log(data.status);   uploadbook    
          if (data.status == 1) {
            this.Uploadfiles.uploadcontract(this.file, this.dataAdd.FACULTY_CODE, this.dataAdd.PLYEARBUDGET_CODE, data.id, this.dataAdd.citizen, '81')
              .subscribe((event: any) => {
                // 
                if (event.type == 4) {
                  this.fetchdatalist();
                }
              }
              );
            if (this.dataAdd.FNRESTATUS_CODE == '0') {
              this.dataAdd.opt = "sendemailNRE";
              this.apiService
                .getupdate(this.dataAdd, this.url)
                .pipe(first())
                .subscribe((data: any) => {
                });
            }

            this.fetchdatalist();
            this.toastr.success("แจ้งเตือน:เพิ่มข้อมูลเรียบร้อยแล้ว");
            document.getElementById("ModalClose")?.click();
          } else {
            this.toastr.warning("แจ้งเตือน:ไม่สามารถเพิ่มข้อมูลได้");
          }
        });


    }
  }
  updatedata() {

    this.dataAdd.opt = "update";
    this.apiService
      .getupdate(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        //console.log(data.status);       
        if (data.status == 1) {
          this.Uploadfiles.uploadcontract(this.file, this.dataAdd.FACULTY_CODE, this.dataAdd.PLYEARBUDGET_CODE, this.dataAdd.FNANNALSMAP_CODE, this.dataAdd.citizen, '81')
            .subscribe((event: any) => {
              // 
              if (event.type == 4) {
                this.fetchdatalist();
              }
            }
            );
          this.fetchdatalistapp();
          this.toastr.success("แจ้งเตือน:แก้ไขข้อมูลเรียบร้อยแล้ว");
          document.getElementById("ModalClose")?.click();
        }
      });
  }
  updatereceipt() {
    this.dataAdd.opt = "updatereceipt";
    this.apiService
      .getupdate(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        //console.log(data.status);       
        if (data.status == 1) {
          this.fetchdatalistapp();
          this.toastr.success("แจ้งเตือน:บันทึกข้อมูลเรียบร้อยแล้ว");
          document.getElementById("ModalClose")?.click();
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
  onChangeReceiptdetail(id: any) {
    this.dataReceiptdetail = null;
    this.dataAdd.opt = "viewFNREDETAIL";
    this.dataAdd.FNANNALS_CODE = id;
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataReceiptdetail = data.data;
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
        this.dataAdd.CHIEF_CODE = data[0].CHIEF_CODE;
      });
  }
  returnData() {
    if (this.dataAdd.FNEXACCTD_NOTE == '') {
      this.toastr.warning("แจ้งเตือน:กรุณากรอกหมายเหตุ");
    } else {
      this.dataAdd.opt = 'RETURN';
      let num = 0;
      this.apiService
        .getdata(this.dataAdd, this.url)
        .pipe(first())
        .subscribe(
          (data: any) => {
            if (data.status == '1') {

              this.dataAdd.opt = "sendemail";
              this.apiService
                .getupdate(this.dataAdd, this.url)
                .pipe(first())
                .subscribe((data: any) => {
                });

              this.fetchdatalist();
              this.toastr.success("แจ้งเตือน:ส่งคืนข้อมูลเรียบร้อย");
              document.getElementById("ModalClose")?.click();
            }
          });
    }

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
  returnDataf() {
    if (this.dataAdd.FNEXACCTD_NOTE == '') {
      this.toastr.warning("แจ้งเตือน:กรุณากรอกหมายเหตุ");
    } else {
      this.dataAdd.opt = 'RETURNf';
      let num = 0;
      this.apiService
        .getdata(this.dataAdd, this.url)
        .pipe(first())
        .subscribe(
          (data: any) => {
            if (data.status == '1') {

              this.dataAdd.opt = "sendemailf";
              this.apiService
                .getupdate(this.dataAdd, this.url)
                .pipe(first())
                .subscribe((data: any) => {
                });

              this.fetchdatalist();
              this.toastr.success("แจ้งเตือน:ส่งคืนข้อมูลเรียบร้อย");
              document.getElementById("ModalClose")?.click();
            }
          });
    }

  }
  // ฟังก์ชัน การแสดงข้อมูลตามต้องการ
  onTableDataChange(event: any) {
    this.page = event;
    this.fetchdatalistapp();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.fetchdatalistapp();
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
