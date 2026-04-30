import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { ApiPdoService } from '../../../../_services/api-pui.service';
import { TokenStorageService } from '../../../../_services/token-storage.service';
import { first, map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-approve-expenses',
  templateUrl: './approve-expenses.component.html',
  styleUrls: ['./approve-expenses.component.scss']
})
export class ApproveExpensesComponent implements OnInit {
  title = 'angular-app';
  fileName = 'report.xlsx';
  userList = [{}]

  datarstatus: any;
  dataFac: any;
  dataIncome: any;
  dataCrpart: any;
  dataMoneypay: any;
  dataYear: any;
  dataPlmoneypay: any;
  dataSubplmoneypay: any;
  datalist: any;
  datalists: any;
  datalistdetail: any;
  loading: any;
  dataESection: any;
  dataEIncome: any;
  dataECrpart: any;
  dataEYear: any;
  dataPlproduct: any;
  dataMidbudget: any;
  rownum: any;
  rowpl: any;
  rowpm: any;
  rowpbi: any;
  rowpbu: any;
  pp: any;
  dataESubplmoneypay: any;
  dataEDepartment: any;
  datafrc: any;
  dataEpl: any;
  searchTerm: any;
  url = "/acc3d/budget/approve/approve_expenses.php";
  url1 = "/acc3d/budget/userpermission.php";
  dataAdd: any = { check: [], MONEY: [], FNEXPENSES_CODE: [], PLPROJECT_CODE: [], PLPROJECT_RSTATUS: [] };
  page = 1;
  count = 0;
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
    
    this.dataAdd.PLMONEYPAY_CODE = '';
    this.dataAdd.citizen = this.tokenStorage.getUser().citizen;
    this.dataAdd.searchTerm = '';
    this.fetchdata();
    this.dataAdd.checked = false;
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
        var varN = {
          "opt": "viewfac",
          "citizen": this.tokenStorage.getUser().citizen,
          "PRIVILEGERSTATUS": data[0].PRIVILEGE_RSTATUS
        }
        this.apiService
          .getdata(varN, this.url1)
          .pipe(first())
          .subscribe((data: any) => {
            this.dataFac = data;
            // console.log(data[0].FACULTY_CODE);
            this.dataAdd.FACULTY_CODE = data[0].FACULTY_CODE;

          });
      });
    //รายการประเภทเงิน
    var Tablep = {
      "opt": "viewTable",
      "Table": "PLINCOME where PLINCOME_ASTATUS=1"
    }
    this.apiService
      .getdata(Tablep, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataIncome = data;
        this.dataAdd.PLINCOME_CODE = data[0].PLINCOME_CODE;
        // console.log(data[0].PLINCOME_CODE);
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
        this.dataAdd.PLYEARBUDGET_CODE = data[0].PLYEARBUDGET_CODE;
        //รายการงบ
        var Tablepl = {
          "opt": "viewPLMONEYPAY",
          "PLYEARBUDGET_CODE": data[0].PLYEARBUDGET_CODE
        }
        //console.log(Table);   
        this.apiService
          .getdata(Tablepl, this.url1)
          .pipe(first())
          .subscribe((data: any) => {
            this.dataMoneypay = data;
            this.dataAdd.PLMONEYPAY_CODE = data[0].PLMONEYPAY_CODE;
          });
        //รายการภาค
        var Table2 = {
          "opt": "viewCRPART",
          "PLYEARBUDGET_CODE": data[0].PLYEARBUDGET_CODE,
          "FACULTY_CODE": "",
          "PLINCOME_CODE": ""
        }
        this.apiService
          .getdata(Table2, this.url1)
          .pipe(first())
          .subscribe((data: any) => {
            this.dataCrpart = data;
            this.dataAdd.CRPART_ID = data[0].CRPART_ID;
          });
        //รายการงบกลาง
        var Tablem = {
          "opt": "PLMIDDLEBUDGET",
          "PLYEARBUDGET_CODE": data[0].PLYEARBUDGET_CODE
        }
        this.apiService
          .getdata(Tablem, this.url1)
          .pipe(first())
          .subscribe((data: any) => {
            this.dataMidbudget = data;
            this.dataAdd.PLMIDDLEBUDGET_CODE = data[0].PLMIDDLEBUDGET_CODE;
          });

      });
  }
  //ภาคเงิน
  fetchdatalistcr() {
    this.dataAdd.opt = "viewCRPART";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataCrpart = data;
        this.dataAdd.CRPART_ID = '';
        //หมวดรายจ่าย
        this.dataAdd.opt = "viewCPLMONEYPAY";
        this.apiService
          .getdata(this.dataAdd, this.url1)
          .pipe(first())
          .subscribe((data: any) => {
            this.dataMoneypay = data;
            this.dataAdd.PLMONEYPAY_CODE = '';
          });
      });
  }
  //หมวดรายจ่าย
  fetchdatalistmo() {
    this.dataAdd.opt = "viewCPLMONEYPAY";
    // console.log(this.dataAdd);
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataMoneypay = data;
        this.dataAdd.PLMONEYPAY_CODE = data[0].PLMONEYPAY_CODE;
      });
  }
  fetchdatalist() {
    this.dataAdd.opt = 'readAll';
    this.loading = true;
    this.dataAdd.FNEXPENSES_CODE = [];
    this.dataAdd.PLPROJECT_CODE = [];
    this.dataAdd.PLPROJECT_RSTATUS = [];
    this.dataAdd.MONEY = [];
    this.dataAdd.check = [];
    this.datalist = null;
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == 1) {
          this.datalist = data.data;
          this.loading = null;
          this.rownum = 1;
          for (let i = 0; i < this.datalist.length; i++) {
            this.dataAdd.FNEXPENSES_CODE[i] = this.datalist[i].FNEXPENSES_CODE;
            this.dataAdd.PLPROJECT_CODE[i] = this.datalist[i].PLPROJECT_CODE;
            this.dataAdd.PLPROJECT_RSTATUS[i] = this.datalist[i].PLPROJECT_RSTATUS;
            this.dataAdd.check[i] = false;
          }
        } else {
          this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
          this.loading = null;
          this.datalist = data.data;
          //console.log('1');
        }
      });
  }
  fetchdatalist1() {
    this.datalist = null;
    this.dataAdd.FNEXPENSES_CODE = [];
    this.dataAdd.PLPROJECT_CODE = [];
    this.dataAdd.PLPROJECT_RSTATUS = [];
    this.dataAdd.check = [];
    this.dataAdd.opt = 'readAll1';
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == 1) {
          this.datalist = data.data;
          this.loading = null;
          this.rownum = 1;
          for (let i = 0; i < this.datalist.length; i++) {
            this.dataAdd.FNEXPENSES_CODE[i] = this.datalist[i].FNEXPENSES_CODE;
            this.dataAdd.PLPROJECT_CODE[i] = this.datalist[i].PLPROJECT_CODE;
            this.dataAdd.PLPROJECT_RSTATUS[i] = this.datalist[i].PLPROJECT_RSTATUS;
            this.dataAdd.check[i] = false;
          }
        } else {
          this.loading = null;
          this.datalist = data.data;
          //console.log('1');
        }
      });
  }
  // ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
  editdata(id: any) {
    this.apiService
      .getById(id, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        this.datalists = data;
        this.showdataplid(data[0].PLPROJECT_CODE);
      });

  }
  // ฟังก์ชันสำหรับการลบข้อมูล
  deleteData(id: any) {
    Swal.fire({
      title: 'ต้องการลบข้อมูล?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.value) {
        this.datalistdetail = null;
        this.dataAdd.id = id;
        this.dataAdd.opt = "delete";
        this.apiService
          .getdata(this.dataAdd, this.url)
          .pipe(first())
          .subscribe((data: any) => {
            if (data.status == 1) {
              Swal.fire('ลบข้อมูล!', 'ลบข้อมูลเรียบร้อยแล้ว', 'success');
              this.fetchdatalist1();
            }
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('ยกเลิก', 'ยกเลิกการลบข้อมูล', 'error');
      }
    });

  }
  showdataplid(val: any) {
    var varP = {
      "opt": "viewIDPLASSET",
      "id": val
    }
    //console.log(varP);
    this.dataAdd.htmlStringd = null;
    this.apiService
      .getdata(varP, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        //this.dataEpl = data;   
        this.dataAdd.htmlStringd = data[0].name;
        //console.log(data[0]);
      });
  }

  //แก้ไขข้อมูล
  updatedata() {
    Swal.fire({
      title: 'ต้องการอนุมัติข้อมูล?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.value) {
        this.dataAdd.opt = "update";
        this.apiService
          .getdata(this.dataAdd, this.url)
          .pipe(first())
          .subscribe((data: any) => {
            if (data.status == 1) {
              Swal.fire('อนุมัติข้อมูล!', 'อนุมัติข้อมูลเรียบร้อยแล้ว', 'success');
              this.fetchdatalist();

              this.dataAdd.PLMONEYPAY_CODE = this.dataAdd.PLMONEYPAY_CODE;
            }
          });

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('ยกเลิก', 'ยกเลิกการอนุมัติข้อมูล', 'error');
      }
    });

  }
  numberWithCommas(x: any) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
  // ฟังก์ชัน การแสดงข้อมูลตามต้องการ
  showmoney(i: any, money: any) {
    //console.log(parseFloat(this.dataAdd.MONEY[i]));
    if (parseFloat(this.dataAdd.MONEY[i]) > 0) {
      this.dataAdd.MONEY[i] = '';
    } else {
      this.dataAdd.MONEY[i] = this.numberWithCommas(parseFloat(money).toFixed(2));
    }
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

}
