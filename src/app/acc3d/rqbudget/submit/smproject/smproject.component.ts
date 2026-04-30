import { Component, OnInit, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ApiPdoService } from '../../../../_services/api-pui.service';
import { TokenStorageService } from '../../../../_services/token-storage.service';
import { first, map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-smproject',
  templateUrl: './smproject.component.html',
  styleUrls: ['./smproject.component.scss']
})
export class SmprojectComponent implements OnInit {
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
  dataAdd: any = { check: [], PRASSET_CODEA: [], PRASSET_MONEY: [] };
  url = "/acc3d/rqbudget/submit/smproject.php";
  url1 = "/acc3d/rqbudget/userpermission.php";

  constructor(
    private tokenStorage: TokenStorageService,
    private apiService: ApiPdoService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private eRef: ElementRef,
    private formBuilder: FormBuilder
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
            this.dataAdd.PRASSET_CODEA[i] = this.datalistapp[i].PRPLPROJECT_CODE;
            this.dataAdd.PRASSET_MONEY[i] = this.datalistapp[i].PRPLPROJECT_MONEY;

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
    this.dataAdd.opt = "approvefac";
    this.apiService
      .getupdate(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        //console.log(data.status);       
        if (data.status == 1) {
          this.clickshow = null;
          this.fetchdatalistapp();
          //this.fetchdatalist();
          this.toastr.success("แจ้งเตือน:อนุมัติข้อมูลเรียบร้อยแล้ว");
        }
      });
  }
  numberWithCommas(x: any) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
  insertdataapp() {
    this.dataAdd.opt = "deliver";
    if (this.dataAdd.check.length == 0) {
      this.toastr.warning("แจ้งเตือน:ยังไม่ได้เลือกข้อมูลนำส่ง");
    } else {
      let num = 0;
      for (let i = 0; i < this.dataAdd.check.length; i++) {
        num += parseFloat(this.dataAdd.PRASSET_MONEY[i]);
      }
      Swal.fire({
        title: 'ต้องการนำส่งข้อมูลรายการโครงการ ทั้งหมด ' + this.dataAdd.check.length + ' รายการ จำนวนเงิน ' + this.numberWithCommas(num) + ' บาท',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ยกเลิก',
      }).then((result) => {
        if (result.value) {
          this.apiService
            .getupdate(this.dataAdd, this.url)
            .pipe(first())
            .subscribe((data: any) => {
              //console.log(data.status);       
              if (data.status == 1) {
                this.fetchdatalistapp();
                this.toastr.success("แจ้งเตือน:นำส่งข้อมูลเรียบร้อยแล้ว");
              }else{
                this.toastr.warning("แจ้งเตือน:ไม่สามารถนำส่งข้อมูลได้");
              }
            });
        }
      });
    }
  }
  checkall() {
    if (this.dataAdd.checkall == true) {
      for (let i = 0; i < this.datalistapp.length; i++) {
        this.dataAdd.check[i] = false;
      }
    } else {
      for (let i = 0; i < this.datalistapp.length; i++) {
        this.dataAdd.check[i] = true;
      }
    }
  }
}
