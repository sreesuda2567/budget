import { Component, OnInit, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ApiPdoService } from '../../../../_services/api-pui.service';
import { TokenStorageService } from '../../../../_services/token-storage.service';
import { first, map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { auto } from '@popperjs/core';


@Component({
  selector: 'app-approvefacproject',
  templateUrl: './approvefacproject.component.html',
  styleUrls: ['./approvefacproject.component.scss']
})
export class ApprovefacprojectComponent implements OnInit {
  dataFac: any;
  dataIncome: any;
  dataCrpart: any;
  dataYear: any;
  datarstatus: any;
  rownum: any;
  datalist: any;
  searchTerm: any;
  loading: any;
  loadingapp: any;
  datalistapp: any;
  clickshow: any;
  datastatus: any
  dataAdd: any = {};
  url = "/acc3d/investment/project/listproject.php";
  url1 = "/acc3d/investment/userpermission.php";
  page = 1;
  count = 0;
  number = 0;
  tableSize = 10;
  tableSizes = [10, 20, 30];
  constructor(
    private tokenStorage: TokenStorageService,
    private apiService: ApiPdoService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private eRef: ElementRef,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    document.getElementById("ModalClose")?.click();
    this.fetchdata();
    this.dataAdd.CITIZEN_ID = this.tokenStorage.getUser().citizen;
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
        // console.log(data);
        var varN = {
          "opt": "viewfacasset",
          "citizen": this.tokenStorage.getUser().citizen,
          "PRIVILEGERSTATUS": data[0].PRIVILEGE_RSTATUS
        }
        this.apiService
          .getdata(varN, this.url1)
          .pipe(first())
          .subscribe((datafac: any) => {
            this.dataFac = datafac;
            // console.log(data[0].FACULTY_CODE);
            this.dataAdd.FACULTY_CODE = datafac[0].FACULTY_CODE;
            this.fetchdatalistapp();
          });
      });
    //รายการปี
    var Tabley = {
      "opt": "viewyear"
    }
    this.apiService
      .getdata(Tabley, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataYear = data;
        this.dataAdd.PRYEARASSET_CODE = '';//data[0].PLYEARBUDGET_CODE;   
        //this.fetchdatalistapp();
      });
    //สถานะ
    var Tabletar = {
      "opt": "viewstatusfac"
    }
    this.apiService
      .getdata(Tabletar, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.datastatus = data;
        this.dataAdd.PRSTATUS_CODE = data[0].PRSTATUS_CODE;
      });
  }
  //  ฟังก์ขันสำหรับการดึงข้อมูลสิ่งก่อสร้าง
  fetchdatalistapp() {
    this.dataAdd.opt = "readAllapp";
    this.loadingapp = true;
    this.datalistapp = null;
    // console.log(1);
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == 1) {
          this.datalistapp = data.data;
          this.loadingapp = null;
          this.rownum = true;
          for (let i = 0; i < this.datalistapp.length; i++) {
            this.dataAdd.PRASSET_CODEA[i] = this.datalistapp[i].PRASSET_CODE;

          }
        } else {
          this.datalistapp = data.data;
          this.loadingapp = null;
          this.rownum = null;
          this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
        }
      });
  }
  showapp(code: any, name: any) {
    this.clickshow = true;
    this.dataAdd.PRASSET_CODE = code;
    this.dataAdd.htmlStringd = name;
    this.dataAdd.PRASSETFAC_NOTE = '';
  }
  insertappfac() {
    this.loadingapp = true;
    this.dataAdd.opt = "approvefac";
    this.apiService
      .getupdate(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        //console.log(data.status);       
        if (data.status == 1) {
          this.clickshow = null;
          this.loadingapp = null;
          this.fetchdatalistapp();
          document.getElementById("ModalClose")?.click();
          //this.fetchdatalist();
          this.toastr.success("แจ้งเตือน:อนุมัติข้อมูลเรียบร้อยแล้ว");
        }
      });
  }
  fetchclose() {
    this.clickshow = null;
  }
  returnedit(id: any, name: any) {
    this.loading = true;  
    this.dataAdd.opt = "returnedit";
    this.dataAdd.id = id;
    Swal.fire({
      title: 'ต้องการส่งคืนข้อมูล?',
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
              this.loading = null; 
              Swal.fire('ส่งคืนข้อมูล!', 'ส่งคืนข้อมูลเรียบร้อยแล้ว', 'success');
              this.fetchdatalistapp();
            }
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('ยกเลิก', 'ยกเลิกการส่งคืนข้อมูล', 'error');
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
  fixedEncode(str: any) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
      return '%' + c.charCodeAt(0).toString(16).toUpperCase();
    });
  }
}
