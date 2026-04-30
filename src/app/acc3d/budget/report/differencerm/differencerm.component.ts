import { Component, OnInit,ElementRef, HostListener } from '@angular/core';
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
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-differencerm',
  templateUrl: './differencerm.component.html',
  styleUrls: ['./differencerm.component.scss']
})
export class DifferencermComponent implements OnInit {
  title = 'angular-app';
  fileName= 'report.xlsx';
  userList = [{}]

  dataYear :any;
  dataCam :any;
  datalist:any ;
  loading:any;
  loadingdetail:any;
  dataAdd:any = {};
  clickshow:any;
  datalistdetailmoney:any;
  searchTerm: any;
  searchTermd: any;
  show: any;
  dataFac :any;
  dataCrpart :any;
  url = "/acc3d/budget/report/differencerm.php";
  url1 = "/acc3d/budget/userpermission.php";
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
    this.fetchdata();
    this.dataAdd.citizen =this.tokenStorage.getUser().citizen;
    this.dataAdd.MONTH='';
    this.show=null;  
  }
  fetchdata(){
    var varP = {
      "opt": "viewp",
      "citizen":this.tokenStorage.getUser().citizen
    }
    //ดึงรายการคณะตามสิทธิ์
    this.apiService.getdata(varP,this.url1)
       .pipe(first())
       .subscribe((data: any) => {
          // console.log(data);
          var varN = {
           "opt": "viewfac",
           "citizen":this.tokenStorage.getUser().citizen,
            "PRIVILEGERSTATUS":data[0].PRIVILEGE_RSTATUS
         }
         this.apiService
       .getdata(varN,this.url1)
       .pipe(first())
       .subscribe((data: any) => {
         this.dataFac = data;
        // console.log(data[0].FACULTY_CODE);
         this.dataAdd.FACULTY_CODE = data[0].FACULTY_CODE;
               
        }); 
      });   
   
        //รายการปี
           var Tabley = {
            "opt": "viewyear"
          }
          this.apiService
          .getdata(Tabley,this.url1)
          .pipe(first())
          .subscribe((data: any) => {
            this.dataYear = data;
            this.dataAdd.PLYEARBUDGET_CODE = data[0].PLYEARBUDGET_CODE;
            //รายการภาค
      var Tablecr = {
        "opt": "viewcrpartrm",
        "PLYEARBUDGET_CODE":data[0].PLYEARBUDGET_CODE
      }
      this.apiService
      .getdata(Tablecr,this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataCrpart = data;
        this.dataAdd.CRPART_ID = data[0].CRPART_ID;
      });
      
          }); 
    //ดึงวันที่
    var varNd = {
      "opt": "viewdaterm",
      "citizen":this.tokenStorage.getUser().citizen
    }
    this.apiService
  .getdata(varNd,this.url1)
  .pipe(first())
  .subscribe((data: any) => {
    this.dataAdd.CHECK3D_GF_DATE = new Date(data.date);
  
  });
}
fetchcrpart(){
  this.dataAdd.opt = "viewCRPART"; 
  this.dataAdd.PLINCOME_CODE = "02";
              //รายการภาค
              this.apiService
              .getdata(this.dataAdd,this.url1)
              .pipe(first())
              .subscribe((data: any) => {
                this.dataCrpart = data;
                this.dataAdd.CRPART_ID = data[0].CRPART_ID;
              });
}
numberWithCommas(x:any) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}
fetchdatalist(){
      this.datalist=null;
      this.loading=true;
      this.dataAdd.htmlString = name;
      this.dataAdd.opt = 'readrmf';
      this.dataAdd.moneybl1=0;
      this.dataAdd.moneybl2=0;
      this.dataAdd.moneybl3=0;
      this.dataAdd.moneybl4=0;
      this.dataAdd.moneybl5=0;
    //  console.log(this.dataAdd);
      this.apiService
       .getdata(this.dataAdd,this.url)
       .pipe(first())
       .subscribe(
        (data: any) => {
         if(data.status=='1'){
          this.datalist = data.data;
          this.dataAdd.CHECK3D_RM_DATE= data.CHECK3D_RM_DATE;
          this.dataAdd.NAME= data.name;
          this.dataAdd.FACNAME= data.FACNAME;
          this.loading=null; 
          this.show=true;
          let moneybl1=0; let moneybl2=0; let moneybl3=0; let moneybl4=0; 
          for(let i=0; i<this.datalist.length;i++){
         moneybl1 += Number(this.datalist[i].CHECK3D_GF_MONEYAL);
         moneybl2 += Number(this.datalist[i].CHECK3D_GF_MONEYGF);
         moneybl3 += Number(this.datalist[i].FNEXPENSES_RMONEY);
         moneybl4 += Number(this.datalist[i].FNEXPENSES_RMONEYT);
          }  
          this.dataAdd.moneybl1=this.numberWithCommas(moneybl1.toFixed(2));   
          this.dataAdd.moneybl2=this.numberWithCommas(moneybl2.toFixed(2));
          this.dataAdd.moneybl3=this.numberWithCommas(moneybl3.toFixed(2));
          this.dataAdd.moneybl4=this.numberWithCommas(moneybl4.toFixed(2));
          this.dataAdd.moneybl5=this.numberWithCommas((moneybl4*100/moneybl2).toFixed(2));
         }else{
          document.getElementById("ModalClose")?.click();
          this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
          this.loading=null; 
          
         }
        
       });
      
}
fetchclose(){
  this.clickshow=null;  
}
fetchdataexpen(opt:any,codepl:any,codepls:any,codepr:any,codele:any,name:any,crp:any){ 
  this.dataAdd.opt = opt;
  this.dataAdd.PLMONEYPAY_CODE = codepl;
  this.dataAdd.PLSUBMONEYPAY_CODE = codepls;
  this.dataAdd.PLPRODUCT_CODE = codepr;
  this.dataAdd.PLSUBMONEYPAY_LEVEL = codele;
  this.dataAdd.CRPART_ID = crp;
  this.dataAdd.htmlStringd=name;
  this.clickshow=true;
  this.datalistdetailmoney=null;
  this.loadingdetail=true;
  this.dataAdd.moneydetail=0;
  this.dataAdd.moneydetailo=0;
  this.dataAdd.moneydetaila=0;
  this.apiService
  .getdata(this.dataAdd,this.url)
  .pipe(first())
  .subscribe(
   (data: any) => {
    if(data.status==1){
     this.datalistdetailmoney = data.data;
     this.loadingdetail=null;    
   let summoney=0;let summoneyo=0;let summoneya=0;
   for(let i=0; i<this.datalistdetailmoney.length;i++){
    summoney += Number(this.datalistdetailmoney[i].FNEXPENSES_RMONEY);
    summoneyo += Number(this.datalistdetailmoney[i].FNEXPENSES_OMONEY);
    summoneya += Number(this.datalistdetailmoney[i].FNEXPENSES_AMONEY);
   }
   this.dataAdd.moneydetail = this.numberWithCommas(summoney.toFixed(2));
   this.dataAdd.moneydetailo = this.numberWithCommas(summoneyo.toFixed(2));
   this.dataAdd.moneydetaila = this.numberWithCommas(summoneya.toFixed(2));
  }else{
    this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
    this.loadingdetail=null;  
  }
   });
}
exportexcel(): void
{
  /* pass here the table id */
  let element = document.getElementById('excel-table');
  const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

  /* generate workbook and add the worksheet */
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  /* save to file */  
  XLSX.writeFile(wb, this.fileName);

} 

}
