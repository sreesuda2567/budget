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
  selector: 'app-annalrefund',
  templateUrl: './annalrefund.component.html',
  styleUrls: ['./annalrefund.component.scss']
})
export class AnnalrefundComponent implements OnInit {
  datalist: any;
  loading: any;
  rownum: any;
  file: any;
  dataFac: any;
  dataYear: any;
  datarstatus: any;
  dataName: any;
  dataNameb: any;
  url = "/acc3d/appmoney/annal/annalrefund.php";
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
  searchTerm: any;
  page = 1;
  count = 0;
  tableSize = 20;
  tableSizes = [20,30,40,100,200];
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
            this.dataAdd.CITIZEN_IDK1 = data[0].CITIZEN_ID;
            this.dataAdd.CITIZEN_IDK2 = data[1].CITIZEN_ID;

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
    this.dataAdd.FNANNALSMAP_CODE = '';
    this.dataAdd.FNANNALS_CODE = '';
  }


  onChangepdf(event: any) {
    this.file = event.target.files[0];
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
        this.dataAdd.CHIEF_CODE = data[0].CHIEF_CODE;
      });
  }
  onTableDataChange(event: any){
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
