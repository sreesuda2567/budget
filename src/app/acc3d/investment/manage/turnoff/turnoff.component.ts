import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { ApiPdoService } from '../../../../_services/api-pui.service';
import { TokenStorageService } from '../../../../_services/token-storage.service';
import { first, map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-turnoff',
  templateUrl: './turnoff.component.html',
  styleUrls: ['./turnoff.component.scss']
})
export class TurnoffComponent implements OnInit {
  datalist: any;
  loading: any;
  rownum: any;
  searchTerm: any;
  url = "/acc3d/investment/manage/turnoff.php";
  url1 = "/acc3d/investment/userpermission.php";
  dataAdd: any = {};
  rowpbi: any;
  rowpbu: any;
  dataYear: any;
  page = 1;
  count = 0;
  number = 0;
  tableSize = 20;
  tableSizes = [20, 30, 40];
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
  }
  fetchdata() {
    this.onChangeyear(1);
    this.dataAdd.opt = "readAll";
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe(
        (data: any) => {
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
  onChangeyear(value:any) {
        //รายการปี
        var Tabley = {
          "opt": "viewyearturnoff",
          "status": value
        }
        this.dataYear=null;
        this.apiService
          .getdata(Tabley, this.url1)
          .pipe(first())
          .subscribe((data: any) => {
            this.dataYear = data;
          });
  } 
  // ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
  editdata(id: any) {
    this.setshowbti();
    this.onChangeyear(0);
    this.apiService
      .getById(id, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        console.log(data);
        this.dataAdd.PRYEARASSET_CODE = data[0].PRYEARASSET_CODE;
        this.dataAdd.PRYEARASSET_RSTATUS = data[0].PRTURNOFF_RSTATUS;
      });
    this.rowpbi = null;
    this.rowpbu = true;
  }
  // ฟังก์ขันสำหรับการเพิ่มข้อมูล
  insertdata() {
    if (this.dataAdd.PRYEARASSET_CODE == '' || this.dataAdd.PRYEARASSET_RSTATUS == '') {
      if (this.dataAdd.PRYEARASSET_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกรหัสปีงบประมาณ");
      }
      if (this.dataAdd.PRYEARASSET_RSTATUS == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกสถานะ");
      }
    } else {
      this.dataAdd.opt = "insert";
      this.apiService
        .getupdate(this.dataAdd, this.url)
        .pipe(first())
        .subscribe((data: any) => {
          //console.log(data.status);       
          if (data.status == 1) {
            this.toastr.success("แจ้งเตือน:เพิ่มข้อมูลเรียบร้อยแล้ว");
            this.fetchdata();
            document.getElementById("ModalClose")?.click();
          }
        });
    }
  }
  //แก้ไขข้อมูล
  updatedata() {
    if (this.dataAdd.PRYEARASSET_CODE == ''  || this.dataAdd.PRYEARASSET_RSTATUS == '') {
      if (this.dataAdd.PRYEARASSET_CODE == '') {
        this.toastr.warning("แจ้งเตือน:กรุณากรอกรหัสปีงบประมาณ");
      }
      if (this.dataAdd.PRYEARASSET_RSTATUS == '') {
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกสถานะ");
      }
    } else {
      this.dataAdd.opt = "update";
      this.apiService
        .getupdate(this.dataAdd, this.url)
        .pipe(first())
        .subscribe((data: any) => {
          if (data.status == 1) {
            this.toastr.success("แจ้งเตือน:แก้ไขข้อมูลเรียบร้อยแล้ว");
            this.fetchdata();
            document.getElementById("ModalClose")?.click();
          }
        });
    }
  }
  setshowbti() {
    this.dataAdd.PRYEARASSET_CODE = '';
    this.dataAdd.PRYEARASSET_RSTATUS = '';
  }
  // ฟังก์ชัน การแสดงข้อมูลตามต้องการ
  onTableDataChange(event: any) {
    this.page = event;
    this.fetchdata();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.fetchdata();
  }
  showinput() {
    this.rowpbi = 1;
    this.rowpbu = '';
  }
}
