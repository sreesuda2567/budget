import {
  Component,
  OnInit,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
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
  selector: 'app-reportdaycorrect',
  templateUrl: './reportdaycorrect.component.html',
  styleUrls: ['./reportdaycorrect.component.scss'],
})
export class ReportdaycorrectComponent implements OnInit {
  title = 'angular-app';
  fileName = 'report.xlsx';
  userList = [{}];

  dataYear: any;
  dataCam: any;
  dataFac: any;
  datalist: any;
  datalistdetail: any;
  loading: any;
  loadingdetail: any;
  dataAdd: any = { check: [], FNANNALSMAPR_CODE: [], FNANNALSMAP_CODE: [],CFNANNALSMAPR_CODE: [], CFNANNALSMAP_CODE: [] };
  searchTerm: any;
  selectedItems: any[] = [];
  show: any;
  dataPro: any;
  datarstatus: any;
  dataStafftype: any;
  numrow: any;
  rownum: any;
  dataNameb: any;
  datareceipt: any;
  dataReceiptdetail: any;
  url = '/acc3d/appmoney/report/reportdaycorrect.php';
  url1 = "/acc3d/unitcost/userpermission.php";
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
    this.dataAdd.DATENOWS = '';
    this.dataAdd.DATENOWT = '';
    this.dataAdd.FNRESTATUS_CODE = '';
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
              opt: 'viewyear',
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
  fetchdataloadshow() {
    this.dataAdd.opt = 'viewannalshow';
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
    this.dataAdd.opt = 'readAll';
    this.dataAdd.check = [];
    this.dataAdd.FNANNALSMAP_CODE = [];
    this.dataAdd.FNANNALSMAPRDT_CODE = [];
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
          for (let i = 0; i < this.datalist.length; i++) {
            this.dataAdd.FNANNALSMAPR_CODE[i] = this.datalist[i].FNANNALSMAPR_CODE;
            this.dataAdd.FNANNALSMAP_CODE[i] = this.datalist[i].FNANNALSMAP_CODE;
            this.dataAdd.check[i] = false;
          }
        } else {
          this.rownum = null;
          this.loading = null;
          this.datalist = data.data;
          this.toastr.warning('แจ้งเตือน:ไม่มีข้อมูล');
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
          this.toastr.warning('แจ้งเตือน:ไม่มีข้อมูล');
          this.datalistdetail = data.data;
        }
      });
  }

  setshowbti() {
    this.dataAdd.FNANNALSMAPR_CODE = '';
  }

  returnData() {
    this.dataAdd.opt = 'RETURN';
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
      this.toastr.warning('แจ้งเตือน:ยังไม่ได้เลือกข้อมูลรายการที่ส่งตรวจสอบ');
    } else {
      Swal.fire({
        title: 'ต้องการส่งตรวจสอบข้อมูลใหม่?',
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
                Swal.fire('ส่งตรวจสอบ!', 'ส่งตรวจสอบข้อมูลเรียบร้อยแล้ว', 'success');
                this.fetchdatalist();
              }
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('ยกเลิก', 'ยกเลิกการส่งตรวจสอบข้อมูล', 'error');
        }
      });
    }
  }

  updatereceipt() {
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
      this.toastr.warning('แจ้งเตือน:ยังไม่ได้เลือกรายการ');
    } else {
    this.dataAdd.opt = "updatereceipt";
    this.apiService
      .getupdate(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        //console.log(data.status);       
        if (data.status == 1) {
          this.dataAdd.FNRESTATUS_CODE = '';
          this.fetchdatalist();
          this.toastr.success("แจ้งเตือน:บันทึกข้อมูลเรียบร้อยแล้ว");
          document.getElementById("ModalClose")?.click();
        }
      });
      }
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
  checkall() {
    if (this.dataAdd.checkall == true) {
      for (let i = 0; i < this.datalist.length; i++) {
        this.dataAdd.check[i] = false;
      }
      this.selectedItems = [];
      this.dataAdd.CFNANNALSMAPR_CODE = [];
      this.dataAdd.CFNANNALSMAP_CODE = [];
    } else {
      for (let i = 0; i < this.datalist.length; i++) {
        this.dataAdd.check[i] = true;
      }
      this.selectedItems = [...this.datalist];
      this.dataAdd.CFNANNALSMAPR_CODE = this.datalist.map((item: any) => item.FNANNALSMAPR_CODE);
      this.dataAdd.CFNANNALSMAP_CODE = this.datalist.map((item: any) => item.FNANNALSMAP_CODE);
    }
  }
  onCheckChange(item: any, index: number) {
    if (this.dataAdd.check[index]) {
      // คลิกเลือก → เก็บค่าไว้ในตัวแปร
      this.selectedItems.push(item);
      this.dataAdd.CFNANNALSMAPR_CODE.push(item.FNANNALSMAPR_CODE);
      this.dataAdd.CFNANNALSMAP_CODE.push(item.FNANNALSMAP_CODE);
    } else {
      // คลิกออก → ลบค่าที่เก็บไว้ในตัวแปร
      const idx = this.selectedItems.findIndex(
        (s: any) => s.FNANNALSMAPR_CODE === item.FNANNALSMAPR_CODE
      );
      if (idx > -1) {
        this.selectedItems.splice(idx, 1);
        this.dataAdd.CFNANNALSMAPR_CODE.splice(idx, 1);
        this.dataAdd.CFNANNALSMAP_CODE.splice(idx, 1);
      }
    }
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
