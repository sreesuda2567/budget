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
import Swal from 'sweetalert2';
@Component({
  selector: 'app-financecheck',
  templateUrl: './financecheck.component.html',
  styleUrls: ['./financecheck.component.scss']
})
export class FinancecheckComponent implements OnInit {
  datalist: any;
  loading: any;
  rownum: any;
  file: any;
  dataFac: any;
  dataYear: any;
  datarstatus: any;
  dataName: any;
  url = "/acc3d/appmoney/annal/financecheck.php";
  url1 = "/acc3d/appmoney/userpermission.php";
  dataProvince: any;
  rowpbi: any;
  rowpbu: any;
  rownum1: any;
  dataAdd: any = {FRACCCODE:[],FRACCMONEY:[]};
  locale = 'th-be';
  locales = listLocales();
  dataEdoc: any;
  datachief: any;
  datalistapp: any;
  datareceipt: any;
  dataReceiptdetail: any;
  dataAcc: any;
  dataNamea: any;
  dataIncome: any;
  datacampus: any;
  dataProduct: any;
  page = 1;
  count = 0;
  number: any = [0, 1, 2];
  tableSize = 20;
  tableSizes = [20, 30, 40, 100, 200];
  searchTerm: any;
  dataSeq: any;
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
            //this.dataAdd.CAMPUS_CODE = data[0].CAMPUS_CODE;
          });
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
     this.dataAdd.opt = "viewFRACCE";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataAcc = data;
        //console.log(data);
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
       // this.dataAdd.PLINCOME_CODE = data[0].PLINCOME_CODE;
      }); 
       //รายการผลผลิต
    var Tablein = {
      "opt": "viewPLGPRODUCT"
    }
    this.apiService
      .getdata(Tablein, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataProduct = data;
       // this.dataAdd.PLGPRODUCT_CODE = data[0].PLGPRODUCT_CODE;
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
    this.dataAdd.FNANNALS_CODE = '';
    this.dataAdd.FNANNALSMAP_CODE = '';
    this.dataAdd.CHIEF_CODE = '';
    this.dataAdd.DEPARTMENT_CODE = '';
    this.dataAdd.FNANNALS_MONEYC = '';
    this.dataAdd.FNRESTATUS_CODE = '2';
    this.dataAdd.CITIZEN_IDP1 = '';
    this.dataAdd.CITIZEN_IDP2 = '';
    this.dataAdd.CITIZEN_IDP3 = '';
    this.dataAdd.CITIZEN_IDP4 = '';
    this.dataAdd.PLINCOME_CODE = '';
    this.dataAdd.PLGPRODUCT_CODE = '';
    this.dataAdd.CAMPUS_CODE = '';
    this.dataAdd.FRACCCODE = [];
    this.dataAdd.FRACCMONEY = [];
  }
     fetchdatareportnamea() {
    this.dataNamea = null;
    var varN1 = {
      "opt": "viewnamecheckc",
      "citizen": this.tokenStorage.getUser().citizen,
      "FACULTY_CODE": this.dataAdd.FACULTY_CODE
    }
    this.apiService
      .getdata(varN1, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataNamea = data;
      });
  }
  // ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
  editdata(id: any, id2: any, money: any, mail: any, bookdate: any, name: any) {
    this.setshowbti();
    this.onChangeedoc();
    this.onChangechief();
    this.onChangeReceiptdetail(id2);
    this.dataAdd.FNANNALSMAP_CODE = id;
    this.dataAdd.FNANNALS_CODE = id2;
    this.dataAdd.FNANNALS_MONEYC = parseFloat(money).toFixed(2);
    this.dataAdd.USERNAME_CISCO = mail;
    this.dataAdd.FNANNALS_BOOK_AT = bookdate;
    this.dataAdd.FSTF_FNAME = name;
    //console.log(id2);
    this.rowpbi = true;
  }
  // ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
  editdatapp(id: any, link: any, money: any, status: any) {
    this.setshowbti();
    this.onChangeedoc();
    this.onChangechief();
    this.dataAdd.FNANNALSMAP_CODE = id;
    this.dataAdd.EBOOKREQ_LINK = link;
    this.dataAdd.FNANNALS_MONEYC = parseFloat(money).toFixed(2);
    this.dataAdd.FNRESTATUS_CODE = status;
    this.rowpbi = '';
    this.rowpbu = 1;
  }
   // ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
  editdatapr(id: any, id2: any, money: any, mail: any, bookdate: any, name: any) {
 
    this.setshowbti();
    this.onChangeedoc();
    this.onChangechief();
    this.fetchdatareportnamea();
    this.onChangeReceiptdetail(id2);
    this.dataAdd.FNANNALSMAP_CODE = id;
    this.dataAdd.FNANNALS_CODE = id2;
    this.dataAdd.FNANNALS_MONEYC = parseFloat(money).toFixed(2);
    this.dataAdd.USERNAME_CISCO = mail;
    this.dataAdd.FNANNALS_BOOK_AT = bookdate;
    this.dataAdd.FSTF_FNAME = name;
    this.rowpbi = true;
    
    this.apiService
      .getById(id2, this.url)
      .pipe(first())
      .subscribe((data: any) => {
       // this.dataSeq = data.data2;
        this.dataAdd.CHIEF_CODE = data.data[0].CHIEF_CODE;
        this.dataAdd.DEPARTMENT_CODE = data.data[0].DEPARTMENT_CODE;
        this.dataAdd.PLINCOME_CODE = data.data[0].PLINCOME_CODE;
        this.dataAdd.PLGPRODUCT_CODE = data.data[0].PLGPRODUCT_CODE;
        this.dataAdd.CAMPUS_CODE = data.data[0].CAMPUS_CODE;
        this.dataAdd.CITIZEN_IDP1 = data.data[0].CITIZEN_IDP1;
        this.dataAdd.CITIZEN_IDP2 = data.data[0].CITIZEN_IDP2;
        this.dataAdd.CITIZEN_IDP3 = data.data[0].CITIZEN_IDP3;
        this.dataAdd.CITIZEN_IDP4 = data.data[0].CITIZEN_IDP4;
        this.dataAdd.FNANNALSMAP_CODE = data.data[0].FNANNALSMAP_CODE;
         for (let i = 0; i < data.data2.length; i++) {
            this.dataAdd.FRACCCODE[i] = data.data2[i].FRACC_CODE;
            this.dataAdd.FRACCMONEY[i] = parseFloat(data.data2[i].FNANNALSMAPACC_MONEY).toFixed(2);
          }
      });
  }
  sendfile(id: any, link: any, link3: any) {
        this.dataAdd.FNANNALSMAP_CODE = id;
      //  this.editdata(id);
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
  // ฟังก์ขันสำหรับการเพิ่มข้อมูล
  insertdataapp() {
    if (this.dataAdd.FNANNALS_MONEYC == '') {
      this.toastr.warning("แจ้งเตือน:กรุณากรอกจำนวนเงิน");

    } else {
      this.dataAdd.opt = "insertapp";
      this.apiService
        .getupdate(this.dataAdd, this.url)
        .pipe(first())
        .subscribe((data: any) => {
          //console.log(data.status);   uploadbook    
          if (data.status == 1) {
            this.fetchdatalist();
            this.toastr.success("แจ้งเตือน:เพิ่มข้อมูลเรียบร้อยแล้ว");
            document.getElementById("ModalCloseb")?.click();
          } else {
            this.toastr.warning("แจ้งเตือน:ไม่สามารถเพิ่มข้อมูลได้");
          }
        });


    }
  }     
  onChangepdf(event: any) {
    this.file = event.target.files[0];
  }

  // ฟังก์ขันสำหรับการเพิ่มข้อมูล
  insertdata() {
    if (this.dataAdd.EBOOKREQ_FILE == '' || this.dataAdd.DEPARTMENT_CODE == '' || this.dataAdd.CHIEF_CODE == '') {
      if (this.dataAdd.EBOOKREQ_FILE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาแนบไฟล์");
      }
      if (this.dataAdd.DEPARTMENT_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกสารบรรณ");
      }
      if (this.dataAdd.CHIEF_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกเรียน");
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
                this.fetchdatalistapp();
              }
            }
            );
          this.fetchdatalistapp();
          this.toastr.success("แจ้งเตือน:แก้ไขข้อมูลเรียบร้อยแล้ว");
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
              this.fetchdatalistapp();
            }
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('ยกเลิก', 'ยกเลิกการลบข้อมูล', 'error');
      }
    });
  }
  onChangeRadio(event: any) {
    this.dataAdd.FNRESTATUS = event;
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
  fetchdataloadshow(id: any) {
    this.dataAdd.FNANNALSMAP_CODE = id;
    this.dataAdd.opt = "viewshow";

    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == '1') {
          this.dataSeq = data.data;
        }
      });
  }
  exportpdf(link: any) {
    let url = link;
    window.open(url, '_blank');
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
