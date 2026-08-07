import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { ApiPdoService } from '../../../../_services/api-pui.service';
import { TokenStorageService } from '../../../../_services/token-storage.service';
import { first, map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { listLocales } from 'ngx-bootstrap/chronos';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { thBeLocale } from 'ngx-bootstrap/locale';
import * as XLSX from 'xlsx-js-style';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rqdeka',
  templateUrl: './rqdeka.component.html',
  styleUrls: ['./rqdeka.component.scss']
})
export class RqdekaComponent implements OnInit {
  title = 'angular-app';
  fileName = 'report.xlsx';
  userList = [{}]

  dataYear: any;
  dataCam: any;
  datalist: any;
  datalistdetail: any;
  loading: any;
  loadingdetail: any;
  dataAdd: any = { List: [] };
  clickshow: any;
  datalistdetailmoney: any;
  searchTerm: any;
  show: any;
  dataFac: any;
  dataCrpart: any;
  dataPro: any;
  datarstatus: any;
  dataIncome: any;
  dataSubplmoneypay: any;
  dataPlmoneypay: any;
  numrow: any;
  locale = 'th-be';
  locales = listLocales();
  Momoney = 0;
  Mamoney = 0;
  Mcmoney = 0;
  Mrmoney = 0;
  rownum: any;
  rowpbi: any;
  rowpbu: any;
  data3d: any;
  data3d2: any;
  page = 1;
  count = 0;
  tableSize = 20;
  tableSizes = [20, 30, 40];
  url = "/acc3d/budget/approve/rqdeka.php";
  url1 = "/acc3d/budget/userpermission.php";
  constructor(
    private tokenStorage: TokenStorageService,
    private apiService: ApiPdoService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private eRef: ElementRef,
    private formBuilder: FormBuilder,
    private localeService: BsLocaleService
  ) { }

  ngOnInit(): void {
    this.localeService.use(this.locale);
    this.fetchdata();
    this.dataAdd.citizen = this.tokenStorage.getUser().citizen;
    this.dataAdd.date_type = 'FNEXPENSES_DATE';
    this.dataAdd.PLSUBMONEYPAY_CODE = '';
    this.dataAdd.DATENOWS = '';
    this.dataAdd.DATENOWT = '';
    this.dataAdd.search = '';
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
        var varN = {
          "opt": "viewcam",
          "citizen": this.tokenStorage.getUser().citizen,
          "PRIVILEGERSTATUS": data[0].PRIVILEGE_RSTATUS
        }
        this.apiService
          .getdata(varN, this.url1)
          .pipe(first())
          .subscribe((datacam: any) => {
            this.dataCam = datacam;
            this.dataAdd.CAMPUS_CODE = datacam[0].CAMPUS_CODE;
            this.fetchdataCam();
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
                this.fetchdatalist();
              });
          });
      });


  }
  fetchdataCam() {
    // console.log(1);
    this.dataFac = null;
    this.dataAdd.opt = "viewfacreport";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataFac = data;
        if (this.dataAdd.CAMPUS_CODE != '') {
          this.dataAdd.FACULTY_CODE = data[0].FACULTY_CODE;
        } else {
          this.dataAdd.FACULTY_CODE = '';
        }
      });
  }
  // ฟังก์ขันสำหรับการเพิ่มข้อมูล/และแก้ไขข้อมูล
  insertdata() {
    if (this.dataAdd.FNDEKA_REMARK == '') {
      this.toastr.warning("แจ้งเตือน:กรุณาระบุเรื่อง");
    } else {
      this.dataAdd.opt = "insert";
      this.apiService
        .getdata(this.dataAdd, this.url)
        .pipe(first())
        .subscribe((data: any) => {
          //console.log(data.status);       
          if (data.status == 1) {
            this.toastr.success("แจ้งเตือน:เพิ่มข้อมูลเรียบร้อยแล้ว");
            this.fetchdatalist();
            document.getElementById("ModalClose")?.click();
          }
        });
    }
  }
  //แก้ไขข้อมูล
  updatedata() {
    if (this.dataAdd.FNDEKA_REMARK == '') {
      this.toastr.warning("แจ้งเตือน:กรุณาระบุเรื่อง");
    } else {

      this.dataAdd.opt = "update";
      this.apiService
        .getupdate(this.dataAdd, this.url)
        .pipe(first())
        .subscribe((data: any) => {
          if (data.status == 1) {
            this.toastr.success("แจ้งเตือน:แก้ไขข้อมูลเรียบร้อยแล้ว");
            this.fetchdatalist();
            document.getElementById("ModalClose")?.click();
          }
        });
    }
  }
  Passetsearch() {
    //รายการวิชา
    this.dataAdd.opt = "view3ddbp";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.data3d = data.data;
        //console.log(this.dataSub);
      });
  }
  //ภาคเงิน
  fetchdatalistcr() {
    this.dataAdd.CRPART_ID = '';
    this.dataAdd.opt = "viewCRPART";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataCrpart = data;
        // this.dataAdd.CRPART_ID = data[0].CRPART_ID;
      });
  }
  // ฟังก์ขันสำหรับการดึงข้อมูลรายการหมวดรายจ่ายย่อย
  fetchdataSubplmoneypay() {
    this.dataAdd.opt = "viewSUBPLMONEYPAY";
    //  console.log(this.dataAdd);
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataSubplmoneypay = data;
      });
  }
  applyLocale(pop: any) {
    this.localeService.use(this.locale);
  }
  datenow(datenow: any) {
    const yyyy = datenow.getFullYear();
    let mm = datenow.getMonth() + 1; // Months start at 0!
    let dd = datenow.getDate();
    return yyyy + '-' + mm + '-' + dd;
  }
  showinput() {
    this.rowpbi = 1;
    this.rowpbu = '';
  }
  setshowbti() {
    this.data3d = null;
    this.data3d2 = null;
    this.dataAdd.List = [];
    this.dataAdd.FNDEKA_REMARK = "";
    this.dataAdd.FNDEKA_RSTATUS = "1";
    this.Passetsearch();
  }
  fetchdatalist() {

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
    this.datalist = null;
    this.dataAdd.opt = "readAll";
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

        } else {
          this.rownum = null;
          this.loading = null;
          this.datalist = data.data;
          this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
        }
      }, (err: any) => {
        this.loading = null;
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
              this.fetchdatalist();
            }
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('ยกเลิก', 'ยกเลิกการลบข้อมูล', 'error');
      }
    });
  }
  // ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
  editdata(id: any) {
    this.setshowbti();
    this.dataAdd.FNDEKA_CODE = id;
    this.apiService
      .getById(id, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        this.data3d2 = data.data2;
        this.dataAdd.FNDEKA_REMARK = data.data[0].FNDEKA_REMARK;
        this.dataAdd.FNDEKA_RSTATUS = data.data[0].FNDEKA_RSTATUS;
        for (let i = 0; i < data.data2.length; i++) {
          this.dataAdd.List.push(data.data2[i].id);
        }

      });
    this.rowpbi = null;
    this.rowpbu = true;
  }
  removeItemsById(arr: any, id: any) {

    //arr.splice(1, 1);
    for (let i = 0; i < arr.length; i++) {
      arr[i].id == id ? arr.splice(i, 1) : '';
    }
  }

  addIt() {
    // ตรวจสอบว่ามีการเลือกหลายรายการหรือไม่
    const selectedItems = Array.isArray(this.dataAdd.SelectList)
      ? this.dataAdd.SelectList
      : [this.dataAdd.SelectList];

    if (!this.data3d2) this.data3d2 = [];
    if (!this.dataAdd.List) this.dataAdd.List = [];


    // วนลูปเพิ่มเข้า dataPerson2 และลบออกจาก dataPerson
    for (const selectedId of selectedItems) {
      // หาข้อมูลจาก dataPerson ก่อนลบ
      const personData = this.data3d.find((p: any) => p.id === selectedId);

      if (personData) {
        // ตรวจสอบว่ายังไม่มีใน dataPerson2
        const exists = this.data3d2.some((p: any) => p.id === selectedId);
        if (!exists) {
          this.data3d2.push(personData);
        }

        // ลบออกจาก dataPerson
        this.removeItemsById(this.data3d, selectedId);

        // เพิ่มเข้า List
        if (!this.dataAdd.List.includes(selectedId)) {
          this.dataAdd.List.push(selectedId);
        }
      }
    }

    // ล้าง selection หลังเพิ่มเสร็จ
    this.dataAdd.SelectList = [];
  }
  delIt() {
    // ตรวจสอบว่ามีการเลือกหลายรายการหรือไม่
    const selectedItems = Array.isArray(this.dataAdd.PickList)
      ? this.dataAdd.PickList
      : [this.dataAdd.PickList];

    // วนลูปลบออกจาก dataPerson2 และ List สำหรับแต่ละ item ที่เลือก
    for (const selectedId of selectedItems) {
      this.removeItemsById(this.data3d2, selectedId);

      // ลบออกจาก List
      const listIndex = this.dataAdd.List.indexOf(selectedId);
      if (listIndex > -1) {
        this.dataAdd.List.splice(listIndex, 1);
      }
      const list1Index = this.dataAdd.List1.indexOf(selectedId);
      if (list1Index > -1) {
        this.dataAdd.List1.splice(list1Index, 1);
      }

      // ดึงข้อมูลและเพิ่มกลับเข้า dataPerson
      var Tablesec = {
        "opt": "viewpersonannalwhere",
        "CITIZEN_ID": selectedId
      }
      this.apiService
        .getdata(Tablesec, this.url1)
        .pipe(first())
        .subscribe((data: any) => {
          if (data && data.length > 0) {
            // ตรวจสอบว่ายังไม่มีใน dataPerson
            const exists = this.data3d.some((p: any) => p.id === data[0].id);
            if (!exists) {
              this.data3d.push({ "id": data[0].id, "name": data[0].name });
            }
          }
        });
    }

    // ล้าง selection หลังลบเสร็จ
    this.dataAdd.PickList = [];
  }
  showadd(id: any) {
    this.dataAdd.showde = id.target.value;
    //console.log(id.target.value);
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
