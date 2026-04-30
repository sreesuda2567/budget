import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { ApiPdoService } from '../../../../_services/api-pui.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
  selector: 'app-contractother',
  templateUrl: './contractother.component.html',
  styleUrls: ['./contractother.component.scss']
})
export class ContractotherComponent implements OnInit {
  datalist: any;
  loading: any;
  rownum: any;
  file: any;
  dataFac: any;
  dataYear: any;
  datarstatus: any;
  dataName: any;
  dataNameb: any;
  url = "/acc3d/appmoney/other/contractother.php";
  url1 = "/acc3d/appmoney/userpermission.php";
  dataProvince: any;
  rowpbi: any;
  rowpbu: any;
  rownum1: any;
  dataAdd: any = {};
  locale = 'th-be';
  locales = listLocales();
  datalistapp: any;
  page = 1;
  count = 0;
  number = 0;
  tableSize = 20;
  tableSizes = [20, 30,40,100,200];
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
    this.applyLocale('thBeLocale');
    this.fetchdata();
    this.rownum = 1;
    this.dataAdd.DATENOWS = '';
    this.dataAdd.DATENOWT = '';
    this.dataAdd.DATENOWD = '';
    this.dataAdd.DATENOWR = '';
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
    this.dataAdd.EBOOKREQ_FILE = '';
    this.dataAdd.FNANNALS_CODE = '';
    this.dataAdd.FNANNALSMAP_CODE = '';
    this.dataAdd.FNANNALS_NUMBER = '';
    this.dataAdd.DATENOWE = '';
    this.dataAdd.DATENOWR = '';
    this.dataAdd.FNANNALS_MONEYC= '';
  }
  // ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
  editdata(id: any, money: any) {
     this.setshowbti();
    this.dataAdd.FNANNALS_CODE = id;
    this.dataAdd.FNANNALS_MONEYC = parseFloat(money).toFixed(2);
    //this.dataAdd.EBOOKREQ_LINK = link;
    this.rowpbi = true;
  }
  // ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
  editdatapp(id: any, link: any, ciz: any, number: any, date1: any, date2: any, code: any, money: any) {
    this.setshowbti();
    this.dataAdd.FNANNALSMAP_CODE = id;
    this.dataAdd.EBOOKREQ_LINK = link;
    this.dataAdd.CITIZEN_IDA = ciz;
    this.dataAdd.FNANNALS_NUMBER = number;
    this.dataAdd.FNANNALS_CODE = code;
     this.dataAdd.FNANNALS_MONEYC = parseFloat(money).toFixed(2);
    if(date1 !=null){
    this.dataAdd.DATENOWE =  new Date(date1)
    this.dataAdd.DATENOWR = new Date(date2);
    }
   // console.log(date1);
    this.rowpbi = '';
    this.rowpbu = 1;
  }
  onChangepdf(event: any) {
    this.file = event.target.files[0];
  }

  // ฟังก์ขันสำหรับการเพิ่มข้อมูล
  insertdata() {
    if (this.dataAdd.EBOOKREQ_FILE == '') {
      if (this.dataAdd.EBOOKREQ_FILE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาแนบไฟล์");
      }

    } else {
      this.dataAdd.opt = "insert";
      if (this.dataAdd.DATENOWR == '') {
        this.dataAdd.DATENOWR1 = '';
        this.dataAdd.DATENOWE1 = '';
      } else {
        this.dataAdd.DATENOWR1 = this.datenow(this.dataAdd.DATENOWR);
        this.dataAdd.DATENOWE1 = this.datenow(this.dataAdd.DATENOWE);
      }
      this.apiService
        .getupdate(this.dataAdd, this.url)
        .pipe(first())
        .subscribe((data: any) => {
          //console.log(data.status);   uploadbook    
          if (data.status == 1) {
            this.Uploadfiles.uploadcontract(this.file, this.dataAdd.FACULTY_CODE, this.dataAdd.PLYEARBUDGET_CODE, this.dataAdd.FNANNALS_CODE, this.dataAdd.citizen,'26')
              .subscribe((event: any) => {
                // 
                if (event.type == 4) {
                  this.fetchdatalist();
                }
              }
              );
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
    if (this.dataAdd.DATENOWR == '') {
        this.dataAdd.DATENOWR1 = '';
        this.dataAdd.DATENOWE1 = '';
      } else {
        this.dataAdd.DATENOWR1 = this.datenow(this.dataAdd.DATENOWR);
        this.dataAdd.DATENOWE1 = this.datenow(this.dataAdd.DATENOWE);
      }
    this.apiService
      .getupdate(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        //console.log(data.status);       
        if (data.status == 1) {
           this.Uploadfiles.uploadcontract(this.file, this.dataAdd.FACULTY_CODE, this.dataAdd.PLYEARBUDGET_CODE, this.dataAdd.FNANNALS_CODE, this.dataAdd.citizen,'26')
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
