import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { ApiPdoService } from '../../../_services/api-pui.service';
import { TokenStorageService } from '../../../_services/token-storage.service';
import { first, map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agsignature',
  templateUrl: './agsignature.component.html',
  styleUrls: ['./agsignature.component.scss']
})
export class AgsignatureComponent implements OnInit {
  datalist: any;
  loading: any;
  rownum: any;
  searchTerm: any;
  dataFac: any;
  datastatus: any
  datamainprogram: any;
  datastatusprogram: any;
  url = "/ag/manage/agsignature.php";
  url1 = "/ag/userpermission.php";
  dataAdd: any = {};
  rowpbi: any;
  rowpbu: any;
  page = 1;
  count = 0;
  number = 0;
  tableSize = 20;
  tableSizes = [20, 30, 40];
  keyword = 'name';
  datacomplete = [];
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
    this.dataAdd.CITIZEN_ID = this.tokenStorage.getUser().citizen;
    this.fetchdata();
  }
  fetchdata(){
    //ระบบ
    var varP = {
      "opt": "viewfac"
    }
    this.apiService
    .getdata(varP,this.url1)
    .pipe(first())
    .subscribe((data: any) => {
      this.dataFac = data; 
      this.dataAdd.FACULTY_CODE=data[0].FACULTY_CODE;   
      this.fetchdatalist(); 
    });
  
  }

  // ฟังก์ชัน การแสดงข้อมูลตามต้องการ
  fetchdatalist() {
    this.datalist = null;
    this.dataAdd.opt = "readAll";
    //ดึงรายการคณะตามสิทธิ์
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

  selectEvent(item: any) {
    this.dataAdd.USERSYSLOG_CODE = item.id; 
  }

  onChangeSearch(val: string) {
    var varP = {
      "opt": "viewpersonusersyslog",
      "search":val
    }
    this.apiService
    .getdata(varP,this.url1)
    .pipe(first())
    .subscribe((data: any) => {
      this.datacomplete = data;  
      // console.log(data);
    }); 
  }
  onTableDataChange(event: any) {
    this.page = event;
    this.fetchdatalist();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.fetchdatalist();
  }
}
