import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { ApiPdoService } from '../../../../_services/api-pui.service';
import { TokenStorageService } from '../../../../_services/token-storage.service';
import { first, map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-allocate',
  templateUrl: './allocate.component.html',
  styleUrls: ['./allocate.component.scss']
})
export class AllocateComponent implements OnInit {
  datalist: any;
  datalistp: any;
  loading: any;
  rownum: any;
  searchTerm: any;
  datamainprogram: any;
  datastatus: any;
  dataYear: any;
  PRIVILEGE_RSTATUS: any;
  datalcode: any;
  dataplmoney: any;
  dataFac: any;
  dataIncome: any;
  dataCrpart: any;
  dataCrpartm: any;
  url = "/acc3d/allocate/plan/allocate.php";
  url1 = "/acc3d/allocate/userpermission.php";
  dataAdd: any = { PLTRBUDGET_CODE: [[]], PLTRBUDGET_MONEY: [[]], PLSUBMONEYPAY_LEVEL: [], LEVEL: [], PLGPRODUCT_CODE: [[]], PLSUBMONEYPAY_CODE: [], PLSUBMONEYPAY_LCODE: [], PLTRBUDGET_MONEYALL: [], SUM_MONEYALL: [] };
  rowpbi: any;
  rowpbu: any;
  page = 1;
  count = 0;
  number = 0;
  tableSize = 20;
  tableSizes = [20, 30, 40];
  htmlStringd: any;
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
  fetchdata() {
    var varPT = {
      "opt": "viewp",
      "citizen": this.tokenStorage.getUser().citizen
    }
    //ดึงรายการคณะตามสิทธิ์
    this.apiService.getdata(varPT, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.PRIVILEGE_RSTATUS = data[0].PRIVILEGE_RSTATUS;
      });
    var varP = {
      "opt": "viewstatus"
    }
    this.apiService
      .getdata(varP, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.datastatus = data;
      });
    var varP = {
      "opt": "viewyear"
    }
    this.apiService
      .getdata(varP, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataYear = data;
        this.dataAdd.PLYEARBUDGET_CODE = data[0].PLYEARBUDGET_CODE;
        var varP = {
          "opt": "viewplmoney"
        }
        this.apiService
          .getdata(varP, this.url1)
          .pipe(first())
          .subscribe((data: any) => {
            this.dataplmoney = data;
            this.dataAdd.PLMONEYPAY_CODE = data[0].PLMONEYPAY_CODE;
          });
      });
    var varP = {
      "opt": "CRPARTM"
    }
    this.apiService
      .getdata(varP, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataCrpartm = data;
        this.dataAdd.CRPARTM_CODE = data[0].CRPARTM_CODE;
        this.onChangeCrpart();
      });
    this.onChangeFac();
    this.onChangeIncome();
  }
  onChangeIncome() {
    this.dataIncome = null;
    this.dataAdd.opt = "viewIncome";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataIncome = data;
        this.dataAdd.PLINCOME_CODE = data[0].PLINCOME_CODE;
        this.onChangeCrpart();
      });
  }
  onChangeCrpart() {
    this.dataCrpart = null;
    this.dataAdd.opt = "viewCRPARTA";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataCrpart = data;
        this.dataAdd.CRPART_ID = data[0].CRPART_ID;

      });
  }
  onChangeFac() {
    this.dataFac = null;
    this.dataAdd.opt = "viewcfacall";
    this.apiService
      .getdata(this.dataAdd, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataFac = data;
        this.dataAdd.FACULTY_CODE = data[0].FACULTY_CODE;
      });
  }
  // ฟังก์ชัน การแสดงข้อมูลตามต้องการ
  fetchdatalist() {
    var num = '123456';
    var row = 3; // Known at run time
    var col = 2; // Known at run time
    var i = 0;

    /* for(var r = 0; r < row; ++r)
     {
       this.dataAdd.PLTRBUDGET_MONEY[r] = [];
         for(var c = 0; c < col; ++c)
         {
           this.dataAdd.PLTRBUDGET_MONEY[r][c] = num[i++];
         }
     }*/
    //console.log(this.dataAdd.PLTRBUDGET_MONEY[0][0]); 
    this.loading = true;
    this.dataAdd.opt = "readAll";
    this.datalist = null;
    this.datalistp = null;
    // this.dataAdd.PLTRBUDGET_MONEY=[[]];
    // console.log(this.dataAdd.PLTRBUDGET_MONEY);
    this.apiService.getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        if (data.status == 1) {
          this.loading = null;
          this.datalistp = data.data;
          this.datalist = data.data1;
          this.dataAdd.numrow = this.datalist.length;
          this.dataAdd.numcomlum = this.datalistp.length;
          for (var k = 0; k < this.datalistp.length; ++k) {
            this.dataAdd.PLTRBUDGET_MONEYALL[k] = 0;
          }
          for (var r = 0; r < this.datalist.length; ++r) {
            this.dataAdd.PLSUBMONEYPAY_LCODE[r] = this.datalist[r].PLSUBMONEYPAY_LCODE;
            this.dataAdd.PLSUBMONEYPAY_CODE[r] = this.datalist[r].PLSUBMONEYPAY_CODE;
            this.dataAdd.PLSUBMONEYPAY_LEVEL[r] = this.datalist[r].PLSUBMONEYPAY_LEVEL;
            if (this.datalist[r].PLSUBMONEYPAY_ISTATUS == '1') {
              this.dataAdd.LEVEL[r] = true;
            } else {
              this.dataAdd.LEVEL[r] = null;
            }
            this.dataAdd.PLTRBUDGET_MONEY[r] = [];
            this.dataAdd.PLGPRODUCT_CODE[r] = [];
            this.dataAdd.PLTRBUDGET_CODE[r] = [];
            for (var c = 0; c < this.datalistp.length; ++c) {
              this.dataAdd.PLTRBUDGET_CODE[r][c] = this.dataAdd.FACULTY_CODE + this.dataAdd.PLYEARBUDGET_CODE + this.dataAdd.PLINCOME_CODE
                + this.dataAdd.CRPART_ID + this.dataAdd.PLYEARBUDGET_CODE + this.datalist[r].PLSUBMONEYPAY_CODE + this.dataAdd.PLYEARBUDGET_CODE + this.datalistp[c].PLGPRODUCT_CODE;
              this.dataAdd.PLGPRODUCT_CODE[r][c] = this.datalistp[c].PLGPRODUCT_CODE;
              
              if (c == 0) {
                //console.log(1);
                if(this.datalist[r].product0>0){
                this.dataAdd.PLTRBUDGET_MONEY[r][c] = this.numberWithCommas(parseFloat(this.datalist[r].product0).toFixed(2));
                }else{
                  this.dataAdd.PLTRBUDGET_MONEY[r][c] = ''; 
                }
                
                if (this.dataAdd.PLSUBMONEYPAY_LEVEL[r] == '1') {
                  this.dataAdd.PLTRBUDGET_MONEYALL[0] += parseFloat(this.datalist[r].product0);
                }
              }
              if (c == 1) {
                if(this.datalist[r].product1>0){
                this.dataAdd.PLTRBUDGET_MONEY[r][c] = this.numberWithCommas(parseFloat(this.datalist[r].product1).toFixed(2));
                }else{
                  if((this.datalistp[c].PLGPRODUCT_CODE=='101') && this.datalist[r].PLSUBMONEYPAY_CODE.substring(0, 4)=='2M16'){
                    this.dataAdd.PLTRBUDGET_MONEY[r][c] = '0'; 
                   // console.log(this.datalistp[c].PLGPRODUCT_CODE)
                  }else{
                  this.dataAdd.PLTRBUDGET_MONEY[r][c] = ''; 
                  }
                }
                if (this.dataAdd.PLSUBMONEYPAY_LEVEL[r] == '1') {
                  this.dataAdd.PLTRBUDGET_MONEYALL[1] += parseFloat(this.datalist[r].product1);
                }
              }
              if (c == 2) {
                if(this.datalist[r].product2>0){
                this.dataAdd.PLTRBUDGET_MONEY[r][c] = this.numberWithCommas(parseFloat(this.datalist[r].product2).toFixed(2));
                }else{
                  this.dataAdd.PLTRBUDGET_MONEY[r][c] = ''; 
                }
                if (this.dataAdd.PLSUBMONEYPAY_LEVEL[r] == '1') {
                  this.dataAdd.PLTRBUDGET_MONEYALL[2] += parseFloat(this.datalist[r].product2);
                }
              }
              if (c == 3) {
                if(this.datalist[r].product3>0){
                this.dataAdd.PLTRBUDGET_MONEY[r][c] = this.numberWithCommas(parseFloat(this.datalist[r].product3).toFixed(2));
                }else{
                  if(( this.datalistp[c].PLGPRODUCT_CODE=='103') && this.datalist[r].PLSUBMONEYPAY_CODE.substring(0, 4)=='2M16'){
                    this.dataAdd.PLTRBUDGET_MONEY[r][c] = '0'; 
                  }else{
                  this.dataAdd.PLTRBUDGET_MONEY[r][c] = ''; 
                  }
                }
                if (this.dataAdd.PLSUBMONEYPAY_LEVEL[r] == '1') {
                  this.dataAdd.PLTRBUDGET_MONEYALL[3] += parseFloat(this.datalist[r].product3);
                }
              }
              if (c == 4) {
                if(this.datalist[r].product4>0){
                this.dataAdd.PLTRBUDGET_MONEY[r][c] = this.numberWithCommas(parseFloat(this.datalist[r].product4).toFixed(2));
                }else{
                  this.dataAdd.PLTRBUDGET_MONEY[r][c] = ''; 
                }
                if (this.dataAdd.PLSUBMONEYPAY_LEVEL[r] == '1') {
                  this.dataAdd.PLTRBUDGET_MONEYALL[4] += parseFloat(this.datalist[r].product4);
                }
              }
              if (c == 5) {
                if(this.datalist[r].product5>0){
                this.dataAdd.PLTRBUDGET_MONEY[r][c] = this.numberWithCommas(parseFloat(this.datalist[r].product5).toFixed(2));
                }else{
                  this.dataAdd.PLTRBUDGET_MONEY[r][c] = ''; 
                }
                if (this.dataAdd.PLSUBMONEYPAY_LEVEL[r] == '1') {
                  this.dataAdd.PLTRBUDGET_MONEYALL[5] += parseFloat(this.datalist[r].product5);
                }
              }
              if (c == 6) {
                if(this.datalist[r].product6>0){
                this.dataAdd.PLTRBUDGET_MONEY[r][c] = this.numberWithCommas(parseFloat(this.datalist[r].product6).toFixed(2));
                }else{
                  this.dataAdd.PLTRBUDGET_MONEY[r][c] = ''; 
                }
                if (this.dataAdd.PLSUBMONEYPAY_LEVEL[r] == '1') {
                  this.dataAdd.PLTRBUDGET_MONEYALL[6] += parseFloat(this.datalist[r].product6);
                }
              }
              if (c == 7) {
                if(this.datalist[r].product7>0){
                this.dataAdd.PLTRBUDGET_MONEY[r][c] = this.numberWithCommas(parseFloat(this.datalist[r].product7).toFixed(2));
                }else{
                  this.dataAdd.PLTRBUDGET_MONEY[r][c] = ''; 
                }
                if (this.dataAdd.PLSUBMONEYPAY_LEVEL[r] == '1') {
                  this.dataAdd.PLTRBUDGET_MONEYALL[7] += parseFloat(this.datalist[r].product7);
                }
              }
              if (c == 8) {
                if(this.datalist[r].product8>0){
                this.dataAdd.PLTRBUDGET_MONEY[r][c] = this.numberWithCommas(parseFloat(this.datalist[r].product8).toFixed(2));
                }else{
                  this.dataAdd.PLTRBUDGET_MONEY[r][c] = ''; 
                }
                if (this.dataAdd.PLSUBMONEYPAY_LEVEL[r] == '1') {
                  this.dataAdd.PLTRBUDGET_MONEYALL[8] += parseFloat(this.datalist[r].product8);
                }
              }
              if (c == 9) {
                if(this.datalist[r].product9>0){
                this.dataAdd.PLTRBUDGET_MONEY[r][c] = this.numberWithCommas(parseFloat(this.datalist[r].product9).toFixed(2));
                }else{
                  this.dataAdd.PLTRBUDGET_MONEY[r][c] = ''; 
                }
                if (this.dataAdd.PLSUBMONEYPAY_LEVEL[r] == '1') {
                  this.dataAdd.PLTRBUDGET_MONEYALL[9] += parseFloat(this.datalist[r].product9);
                }
              }
              if (c == 10) {
                if(this.datalist[r].product10>0){
                this.dataAdd.PLTRBUDGET_MONEY[r][c] = this.numberWithCommas(parseFloat(this.datalist[r].product10).toFixed(2));
                }else{
                  this.dataAdd.PLTRBUDGET_MONEY[r][c] = ''; 
                }
                if (this.dataAdd.PLSUBMONEYPAY_LEVEL[r] == '1') {
                  this.dataAdd.PLTRBUDGET_MONEYALL[10] += parseFloat(this.datalist[r].product10);
                }
              }
              if (c == 11) {
                if(this.datalist[r].product11>0){
                this.dataAdd.PLTRBUDGET_MONEY[r][c] = this.numberWithCommas(parseFloat(this.datalist[r].product11).toFixed(2));
                }else{
                  this.dataAdd.PLTRBUDGET_MONEY[r][c] = ''; 
                }
                if (this.dataAdd.PLSUBMONEYPAY_LEVEL[r] == '1') {
                  this.dataAdd.PLTRBUDGET_MONEYALL[11] += parseFloat(this.datalist[r].product11);
                }
              }
              if (c == 12) {
                if(this.datalist[r].product12>0){
                this.dataAdd.PLTRBUDGET_MONEY[r][c] = this.numberWithCommas(parseFloat(this.datalist[r].product12).toFixed(2));
                }else{
                  this.dataAdd.PLTRBUDGET_MONEY[r][c] = ''; 
                }
                if (this.dataAdd.PLSUBMONEYPAY_LEVEL[r] == '1') {
                  this.dataAdd.PLTRBUDGET_MONEYALL[12] += parseFloat(this.datalist[r].product12);
                }
              }
              if (c == 13) {
                if(this.datalist[r].product13>0){
                this.dataAdd.PLTRBUDGET_MONEY[r][c] = this.numberWithCommas(parseFloat(this.datalist[r].product13).toFixed(2));
                }else{
                  this.dataAdd.PLTRBUDGET_MONEY[r][c] = ''; 
                }
                if (this.dataAdd.PLSUBMONEYPAY_LEVEL[r] == '1') {
                  this.dataAdd.PLTRBUDGET_MONEYALL[13] += parseFloat(this.datalist[r].product13);
                }
              }

            }
          }



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
  numberWithCommas(x: any) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }
  //เช็คตัวเลข
  CheckNum(num: any) {
    if (num.keyCode < 46 || num.keyCode > 57) {
      alert('กรุณากรอกข้อมูล ที่เป็นตัวเลข');
      num.returnValue = false;
    }
  }
  summoney(plcode: any, i: any, j: any, prcode: any) {
    //console.log(i)
    // console.log(this.dataAdd.PLTRBUDGET_MONEY[0][j]);
    // this.dataAdd.PLTRBUDGET_MONEY[i][j]=this.dataAdd.PLTRBUDGET_MONEY[i][j];
    this.dataAdd.PLTRBUDGET_MONEYALL[j] = 0;
    let plcodem = '';
    let plcodel = '';
    let summoney = 0;
    let plmoney = 0;
    let no2 = 0;
    for (var r = 0; r < this.datalist.length; ++r) {//ระดับ 4
      plcodem = this.dataAdd.PLSUBMONEYPAY_CODE[r];
      summoney = 0;
      for (var k = 0; k < this.datalist.length; ++k) {
        // console.log(this.dataAdd.PLTRBUDGET_MONEY[k][j]);
        plmoney = parseFloat(this.dataAdd.PLTRBUDGET_MONEY[k][j]);
        if (this.dataAdd.PLSUBMONEYPAY_LEVEL[r] == '4' && plcodem == this.dataAdd.PLSUBMONEYPAY_LCODE[k] && plmoney > 0) {
          plcodel = this.dataAdd.PLSUBMONEYPAY_LCODE[k];
          summoney += parseFloat(this.dataAdd.PLTRBUDGET_MONEY[k][j]);
        }
      }
      if (summoney > 0) {
        this.dataAdd.PLTRBUDGET_MONEY[r][j] = this.numberWithCommas(summoney.toFixed(2));
      }
    }
    for (var r = 0; r < this.datalist.length; ++r) {//ระดับ 3
      plcodem = this.dataAdd.PLSUBMONEYPAY_CODE[r];
      summoney = 0;
      no2 = 0;
      for (var k = 0; k < this.datalist.length; ++k) {
        plmoney = parseFloat(this.dataAdd.PLTRBUDGET_MONEY[k][j]);
        if (this.dataAdd.PLSUBMONEYPAY_LEVEL[r] == '3' && plcodem == this.dataAdd.PLSUBMONEYPAY_LCODE[k] && plmoney >= 0) {
          plcodel = this.dataAdd.PLSUBMONEYPAY_LCODE[k];
          summoney += parseFloat(this.dataAdd.PLTRBUDGET_MONEY[k][j].replace(/,/g, ""));
          no2 = 1;
        }
      }
      if (summoney >= 0 && no2 == 1) {
        this.dataAdd.PLTRBUDGET_MONEY[r][j] = this.numberWithCommas(summoney.toFixed(2));
      }
    }
    for (var r = 0; r < this.datalist.length; ++r) {//ระดับ 2
      plcodem = this.dataAdd.PLSUBMONEYPAY_CODE[r];
      summoney = 0;
      no2 = 0;
      for (var k = 0; k < this.datalist.length; ++k) {
        plmoney = parseFloat(this.dataAdd.PLTRBUDGET_MONEY[k][j]);
        if (this.dataAdd.PLSUBMONEYPAY_LEVEL[r] == '2' && plcodem == this.dataAdd.PLSUBMONEYPAY_LCODE[k] && plmoney >= 0) {
          plcodel = this.dataAdd.PLSUBMONEYPAY_LCODE[k];
          summoney += parseFloat(this.dataAdd.PLTRBUDGET_MONEY[k][j].replace(/,/g, ""));
          no2 = 1;
        }
      }
      if (summoney >= 0 && no2 == 1) {
        this.dataAdd.PLTRBUDGET_MONEY[r][j] = this.numberWithCommas(summoney.toFixed(2));
      }
    }
    for (var r = 0; r < this.datalist.length; ++r) {//ระดับ 1
      plcodem = this.dataAdd.PLSUBMONEYPAY_CODE[r];
      summoney = 0;
      no2 = 0;
      for (var k = 0; k < this.datalist.length; ++k) {
        plmoney = parseFloat(this.dataAdd.PLTRBUDGET_MONEY[k][j]);
       // console.log(plcodem+'-'+this.dataAdd.PLSUBMONEYPAY_LCODE[k]);
        if (this.dataAdd.PLSUBMONEYPAY_LEVEL[r] == '1' && plcodem == this.dataAdd.PLSUBMONEYPAY_LCODE[k] && plmoney >= 0) {
          plcodel = this.dataAdd.PLSUBMONEYPAY_LCODE[k];
          summoney += parseFloat(this.dataAdd.PLTRBUDGET_MONEY[k][j].replace(/,/g, ""));
          no2 = 1;
        }
      }
      if (summoney >= 0 && no2 == 1) {
        this.dataAdd.PLTRBUDGET_MONEY[r][j] = this.numberWithCommas(summoney.toFixed(2));
      }
    }

    for (var r = 0; r < this.datalist.length; ++r) {//ทั้งหมด
      plcodem = this.dataAdd.PLSUBMONEYPAY_CODE[r];
      summoney = 0;
      no2 = 0;
      for (var k = 0; k < this.datalist.length; ++k) {
        plmoney = parseFloat(this.dataAdd.PLTRBUDGET_MONEY[k][j]);
      //  console.log(plcodem+'-'+this.dataAdd.PLSUBMONEYPAY_LCODE[k]);
        if (this.dataAdd.PLSUBMONEYPAY_LEVEL[r] == '1' && this.dataAdd.PLMONEYPAY_CODE == this.dataAdd.PLSUBMONEYPAY_LCODE[k] && plmoney >= 0) {
          plcodel = this.dataAdd.PLSUBMONEYPAY_LCODE[k];
          summoney += parseFloat(this.dataAdd.PLTRBUDGET_MONEY[k][j].replace(/,/g, ""));
          no2 = 1;
        }
      }
      
      if (summoney >= 0 && no2 == 1) {
        this.dataAdd.PLTRBUDGET_MONEYALL[j] = summoney.toFixed(2);
        //this.dataAdd.PLTRBUDGET_MONEYALL[j] = this.numberWithCommas(summoney.toFixed(2));
      }
    }

  }

  // ฟังก์ขันสำหรับการเพิ่มข้อมูล/และแก้ไขข้อมูล
  insertdata() {
    this.dataAdd.opt = "insert";
    this.apiService
      .getdata(this.dataAdd, this.url)
      .pipe(first())
      .subscribe((data: any) => {
        //console.log(data.status);       
        if (data.status == 1) {
          this.toastr.success("แจ้งเตือน:เพิ่มข้อมูลเรียบร้อยแล้ว");
          // this.fetchdatalist();
        }
      });
  }
}
