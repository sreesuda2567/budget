import { Component, OnInit, ElementRef, HostListener, ViewChild } from '@angular/core';
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
defineLocale('th', thBeLocale);
import Swal from 'sweetalert2';
@Component({
  selector: 'app-accupdate',
  templateUrl: './accupdate.component.html',
  styleUrls: ['./accupdate.component.scss']
})
export class AccupdateComponent implements OnInit {
  title = 'angular-app';
  fileName = 'report.xlsx';
  userList = [{}]

  dataYear: any;
  dataCam: any;
  datalist: any;
  loading: any;
  loadingdetail: any;
  dataAdd: any = { FNEXACCCODE: [], FRACCCODE: [], FNEXACCMONEY: [], FNEXACCRDATE: [], FNEXACCDEKA: [], FRACC1: []
    , FNEXACC_RDATE1: [], FNEXACCMONEYCRE: [], FNEXACCRDATECRE: [],FNEXACCRDATECRE1: [],FNEXACC_TYPE: [],FNEXACC_NUMBER: [],statuscre: [] };
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
  rownum: any;
  url = "/acc3d/unitcost/manage/accupdate.php";
  url1 = "/acc3d/unitcost/userpermission.php";
  keyword = 'name';
  datacomplete = [];
  number: any = [1, 2, 3 , 4 , 5];
  dataType: any;
  constructor(
    private tokenStorage: TokenStorageService,
    private apiService: ApiPdoService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private eRef: ElementRef,
    private formBuilder: FormBuilder,
    private localeService: BsLocaleService,
  ) { }

  ngOnInit(): void {
    this.localeService.use(this.locale);
    this.dataAdd.citizen = this.tokenStorage.getUser().citizen;
    this.dataAdd.DATENOWS = new Date();
    this.dataAdd.DATENOWT = new Date();
    this.dataAdd.PLSUBMONEYPAY_CODE = '';
    this.fetchdata();
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
            //คณะ/หน่วยงาน
            var Tablesub = {
              "opt": "viewfac",
              "CAMPUS_CODE": datacam[0].CAMPUS_CODE
            }
            // console.log(Tablesub);
            this.apiService
              .getdata(Tablesub, this.url1)
              .pipe(first())
              .subscribe((dataf: any) => {
                this.dataFac = dataf;
                this.dataAdd.FACULTY_CODE = '';
              });

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
        this.dataAdd.PLYEARBUDGET_CODE = data[0].PLYEARBUDGET_CODE;
        var Tablesub = {
          "opt": "viewproy",
          "FACULTY_CODE": "",
          "PLYEARBUDGET_CODE": data[0].PLYEARBUDGET_CODE
        }
        // console.log(Tablesub);
        this.apiService
          .getdata(Tablesub, this.url1)
          .pipe(first())
          .subscribe((data: any) => {
            this.dataPro = data;
            this.dataAdd.PLPRODUCT_CODE = '';
          });
        //รายการภาค
        var Table2 = {
          "opt": "viewcrpart",
          "PLYEARBUDGET_CODE": data[0].PLYEARBUDGET_CODE,
          "FACULTY_CODE": "",
          "PLINCOME_CODE": ""
        }
        this.apiService
          .getdata(Table2, this.url1)
          .pipe(first())
          .subscribe((data: any) => {
            this.dataCrpart = data;
            this.dataAdd.CRPART_ID = '';//data[0].CRPART_ID;
          });
        //รายการงบ
        var Table = {
          "opt": "viewPLMONEYPAY",
          "PLYEARBUDGET_CODE": data[0].PLYEARBUDGET_CODE
        }
        this.apiService
          .getdata(Table, this.url1)
          .pipe(first())
          .subscribe((data: any) => {
            this.dataPlmoneypay = data;
            this.dataAdd.PLMONEYPAY_CODE = '';
          });
      });
    //รายการประเภทเงิน
    var Table = {
      "opt": "viewTable",
      "Table": "PLINCOME where PLINCOME_ASTATUS=1"
    }
    this.apiService
      .getdata(Table, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataIncome = data;
        this.dataAdd.PLINCOME_CODE = data[0].PLINCOME_CODE;
        // console.log(data[0].PLINCOME_CODE);
      });
        //ประเภทเอกสาร
        var Tablet = {
          "opt": "viewnumbertype"
        }
        this.apiService
          .getdata(Tablet, this.url1)
          .pipe(first())
          .subscribe((data: any) => {
            this.dataType = data;
          });  
  }
  fetchdataCam() {
    this.dataFac = null;
    this.dataAdd.opt = "viewfac";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataFac = data;

      });
  }
  fetchdataproduct() {
    this.dataAdd.opt = "viewproy";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataPro = data;

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
        this.dataAdd.CRPART_ID = data[0].CRPART_ID;
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
  fetchdatalist() {
    this.dataAdd.check = [];
    this.dataAdd.FNEXACC_CODE = [];
    this.dataAdd.FNEXACC_DETAIL = [];
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
      });
  }

  //แก้ไขข้อมูล
  updatedata() {
    for(let i=0; i<this.dataAdd.FNEXACCRDATE.length;i++){
      
      if(parseFloat(this.dataAdd.FNEXACCMONEY[i])>0 || parseFloat(this.dataAdd.FNEXACCMONEY[i]) < 0){
      //  console.log(i);
       // console.log(this.dataAdd.FNEXACCMONEY[i]+'..'+this.datenow(this.dataAdd.FNEXACCRDATE[i]));
      this.dataAdd.FNEXACC_RDATE1[i]=this.datenow(this.dataAdd.FNEXACCRDATE[i]); 
      console.log(this.dataAdd.FNEXACC_RDATE1[i]);
      }
     /* if(parseFloat(this.dataAdd.FNEXACCMONEYCRE[i])>0){
        this.dataAdd.FNEXACCRDATECRE1[i]=this.datenow(this.dataAdd.FNEXACCRDATECRE[i]); 
        }*/
    }
  
    this.dataAdd.opt = "UPDATE";
    this.apiService
      .getupdate(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        console.log(data.status);
        if (data.status == 1) {
          this.toastr.success("แจ้งเตือน:ปรังปรุงข้อมูลเรียบร้อยแล้ว");
          this.fetchdatalist();
           document.getElementById("ModalClose")?.click();
        } else if (data.status == 0) {
          this.toastr.warning("แจ้งเตือน:กรุณากรอกเหตุผลความจำเป็นอย่างน้อย 1 หน้ากระดาษ");
        }
      });

  }
  // ฟังก์ชันสำหรับการลบข้อมูล
  deleteData(id: any) {
    this.dataAdd.opt = "delete";
    // this.dataAdd.id = id;
    Swal.fire({
      title: 'ต้องการลบข้อมูล?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.value) {
        this.apiService
          .delete(id, this.url)
          .pipe(first())
          .subscribe((data: any) => {
            if (data.status == 1) {
              Swal.fire('ลบข้อมูล!', 'ลบข้อมูลเรียบร้อยแล้ว', 'success');
              this.fetchdatalist();
              this.setshow();
              this.fetchdatalistfrm(id)
            }
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('ยกเลิก', 'ยกเลิกการลบข้อมูล', 'error');
      }
    });
  }
  //เช็คตัวเลข
  CheckNum(num: any) {
    if (num.keyCode < 46 || num.keyCode > 57) {
      alert('กรุณากรอกข้อมูล ที่เป็นตัวเลข');
      num.returnValue = false;
    }
  }
  selectEvent(item: any, num: any) {
    // console.log(item.id);
    this.dataAdd.FRACCCODE[num] = item.id;
  }
  onChangeSearch(val: string) {
    var varP = {
      "opt": "viewfrcc",
      "search": val
    }
    this.apiService
      .getdata(varP, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.datacomplete = data;
        // console.log(data);
      });
  }
  setshow() {
    for (let i = 0; i < 5; i++) {
      this.dataAdd.FNEXACCCODE[i] = '';
      this.dataAdd.FRACCCODE[i] = '';
      this.dataAdd.FNEXACCRDATE[i] = '';
      this.dataAdd.FNEXACCDEKA[i] = '';
      this.dataAdd.FNEXACC_TYPE[i] = '';
      this.dataAdd.FNEXACC_NUMBER[i] = '';
    //  this.dataAdd.FNEXACCMONEYCRE[i] = '';
    //  this.dataAdd.FNEXACCRDATECRE[i] = '';
      this.dataAdd.FNEXACCMONEY[i] = '';
      this.dataAdd.FRACC1[i] = '';
    }
    this.dataAdd.FNEXACC_NOTECRE = '';
  }
  // ฟังก์ขันสำหรับการนำข้อมูลมาแสดงเพื่อแก้ไข
  editdata(id: any,ide: any) {
    // console.log(id);
    this.dataAdd.FNEXPENSES_CODE = ide;
    this.setshow();
    this.fetchdatalistfrm(id);
  }
  //บัญชีแยกประเภท(จ่ายจริง)
  fetchdatalistfrm(id: any) {
    var varP = {
      "opt": "viewFRM",
      "id": id
    }

    this.apiService
      .getdata(varP, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
       // console.log(data);
        for (let i = 0; i < data.length; i++) {
          this.dataAdd.FNEXACCCODE[i] = data[i].FNEXACC_CODE;
          this.dataAdd.FRACCCODE[i] = data[i].FRACC_CODE;
          this.dataAdd.FRACC1[i] = data[i].FRACC_TNAME;
          this.dataAdd.FNEXACCRDATE[i] = new Date(data[i].FNEXACC_RDATE);
          this.dataAdd.FNEXACCDEKA[i] = data[i].FNEXACC_DEKA;
          this.dataAdd.FNEXACC_TYPE[i] = data[i].FNEXACC_TYPE;
          this.dataAdd.FNEXACC_NUMBER[i] = data[i].FNEXACC_NUMBER;
          this.dataAdd.FNEXACCMONEY[i] = (parseFloat(data[i].FNEXACC_MONEY).toFixed(2));
          if(data[i].FNEXACC_DATECRE !=null){
         // this.dataAdd.FNEXACCRDATECRE[i] = new Date(data[i].FNEXACC_DATECRE);
         // this.dataAdd.FNEXACCMONEYCRE[i] =(parseFloat(data[i].FNEXACC_MONEYCRE).toFixed(2));
          this.dataAdd.FNEXACC_NOTECRE =data[0].FNEXACC_NOTECRE;
          }
          if(i==0){
            this.dataAdd.statuscre[i]=true;
          }else{
            this.dataAdd.statuscre[i]=null; 
          }
          
        }
        //console.log(data.length);
      });
  }
}
