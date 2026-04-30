import { Component, OnInit,ElementRef, HostListener } from '@angular/core';
import { ApiPdoService } from '../../../../_services/api-pui.service';
import { TokenStorageService } from '../../../../_services/token-storage.service';
import { first, map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-reportplanproject',
  templateUrl: './reportplanproject.component.html',
  styleUrls: ['./reportplanproject.component.scss']
})
export class ReportplanprojectComponent implements OnInit {
  title = 'angular-app';
  fileName= 'report.xlsx';
  userList = [{}]
  datarstatus:any ;
  dataFac :any;
  dataIncome :any;
  dataCrpart :any;
  dataYear :any;
  dataUnit :any;
  dataProduct :any;
  dataAssettype :any;
  dataProvince :any;
  dataSubdistrict :any;
  dataDistrict :any;
  dataTagget :any;
  dataSection :any;
  datatype:any;
  dataCourse :any;
  dataSub :any;
  dataPsub :any=[];
  datalist:any ;
  dataPstatus:any ;
  dataPlproduct :any;
  datalistyear:any ;
  url = "/acc3d/investment/report/reportplanproject.php";
  url1 = "/acc3d/investment/userpermission.php";
  dataAdd:any = {};
  loading:any;
  rownum:any;

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
    this.fetchdata();
    this.dataAdd.PLGPRODUCT_CODE='';
    this.dataAdd.PRASSET_RSTATUS='';
    this.dataAdd.PLPROJECTTYPE='';
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
        this.datarstatus = data;
        this.dataAdd.PRIVILEGE_RSTATUS = data[0].PRIVILEGE_RSTATUS;
         // console.log(data);
         var varN = {
          "opt": "viewfac",
          "citizen":this.tokenStorage.getUser().citizen,
           "PRIVILEGERSTATUS":data[0].PRIVILEGE_RSTATUS
        }
        this.apiService
      .getdata(varN,this.url1)
      .pipe(first())
      .subscribe((datafac: any) => {
        this.dataFac = datafac;
       // console.log(data[0].FACULTY_CODE);
        this.dataAdd.FACULTY_CODE = datafac[0].FACULTY_CODE;       
      });
            //สถานะ
            var Tabletar = {
              "opt": "viewPRSTATUS",
              "PRIVILEGERSTATUS":data[0].PRIVILEGE_RSTATUS
            }
            this.apiService
            .getdata(Tabletar,this.url1)
            .pipe(first())
            .subscribe((data: any) => {
              this.dataPstatus = data;
            }); 
      }); 
      
          //รายการประเภทเงิน
          var Tablein = {
            "opt": "viewincome"
          }
          this.apiService
          .getdata(Tablein,this.url1)
          .pipe(first())
          .subscribe((data: any) => {
            this.dataIncome = data;
            this.dataAdd.PLINCOME_CODE = '';//data[0].PLINCOME_CODE;
           // this.showHide('dataAdd.type',this.dataAdd.PLINCOME_CODE);
          // console.log(data[0].PLINCOME_CODE);
          }); 

           //รายการปี
           var Tabley = {
            "opt": "viewyear"
          }
          this.apiService
          .getdata(Tabley,this.url1)
          .pipe(first())
          .subscribe((data: any) => {
          //  console.log(data);
            this.dataYear = data;
            this.dataAdd.SPRYEARASSET_CODE = data[0].PLYEARBUDGET_CODE;
            this.dataAdd.EPRYEARASSET_CODE = data[0].PLYEARBUDGET_CODE;
                //รายการภาค
                var Table2 = {
                  "opt": "viewcrpart",
                  "PRYEARASSET_CODE":data[0].PLYEARBUDGET_CODE,
                  "FACULTY_CODE": "",
                  "PLINCOME_CODE": "01"
                }
                 //  console.log(Table2);
                    this.apiService
                    .getdata(Table2,this.url1)
                    .pipe(first())
                    .subscribe((datacr: any) => {
                      console.log(datacr);
                      this.dataCrpart = datacr;
                      this.dataAdd.CRPART_ID = '';//datacr[0].CRPART_ID;
                    }); 
      
          });   
         
         //รายการหน่วยนับ
      var Tablegc = {
        "opt": "viewgcunit"
      }
      this.apiService
      .getdata(Tablegc,this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataUnit = data;
  
      }); 
       
      //รายการผลิต
      var Tablepro = {
        "opt": "viewpro"
      }
      this.apiService
      .getdata(Tablepro,this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataProduct  = data;
  
      }); 
       //รายการประเภทครุภัณฑ์
       var Tablest = {
        "opt": "viewtstype"
      }
      this.apiService
      .getdata(Tablest,this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataAssettype  = data;
  
      }); 
 //ผลผลิต
 var Table4 = {
  "opt": "viewpro"
}     
this.apiService
.getdata(Table4,this.url1)
.pipe(first())
.subscribe((datapro: any) => {
this.dataPlproduct = datapro;        
//console.log(datapro);
});         
      this.dataAdd.CITIZEN_ID = this.tokenStorage.getUser().citizen;
        }
//ภาคเงิน
fetchdatalistcr(){  
  this.dataAdd.opt = "viewcrpart"; 
  this.apiService
  .getdata(this.dataAdd,this.url1)
  .pipe(first())
  .subscribe((data: any) => {
   //  console.log(data);
    this.dataCrpart = data;
    this.dataAdd.CRPART_ID = data[0].CRPART_ID;
 
  }); 
}
  // ฟังก์ขันสำหรับการดึงข้อมูลครุภัณฑ์
  fetchdatalist(){ 
    this.datalist = null; 
    this.datalistyear = null; 
    this.loading=true; 
    this.dataAdd.opt = "readAll";
    this.rownum= null;
    this.apiService
    .getdata(this.dataAdd,this.url)
    .pipe(first())
    .subscribe(
     (data: any) => {
      if(data.status==1){
      this.datalist = data.data;
      this.datalistyear = data.datayear;
      this.dataAdd.PLINCOME_NAME=data.PLINCOME_NAME; 
      this.dataAdd.PRSTATUS_NAME=data.PRSTATUS_NAME;
      this.rownum=data.numth; 
     // console.log(this.rownum);
      this.loading=null; 
    }else{
      this.datalist=data.data; 
      this.loading=null;
       this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
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
