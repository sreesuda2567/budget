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
defineLocale('th', thBeLocale);
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-follwasset',
  templateUrl: './follwasset.component.html',
  styleUrls: ['./follwasset.component.scss']
})
export class FollwassetComponent implements OnInit {
  title = 'angular-app';
  fileName= 'report.xlsx';
  userList = [{}]

  datarstatus:any ;
  dataFac :any;
  dataIncome :any;
  dataCrpart :any ;
  dataMoneypay :any;
  dataYear :any;
  dataPlmoneypay :any;
  dataSubplmoneypay :any;
  datalist:any;
  datalistresearch:any;
  datalists:any;
  datalistdetail:any;
  datalistex:any;
  datalisttd:any;
  datalisttdp:any;
  loading:any;
  dataESection :any;
  dataEIncome :any;
  dataECrpart :any;
  dataEYear :any;
  dataMethod :any;
  dataMtpt :any;
  dataAdd:any = {};
  dataFAdd:any = {PLPROJECTDRESULTC:[],PLPROJECTDRESULTP:[],PLPROJECTDCODE:[],PLPROJECTDPCODE:[]};
  rownum:any;
  rownumre:any;
  rowpl:any;
  rowpm:any;
  rowpbi:any;
  rowpbu:any;
  statusmoc: any;
  pp:any;
  dataESubplmoneypay :any;
  dataEDepartment :any;
  datafrc :any;
  dataEpl :any ;
  searchTerm: any;
  statuscon: any;
  statuscredit: any;
  statusno: any;
  clickshow: any;
  url = "/acc3d/budget/follow/followasset.php";
  url1 = "/acc3d/budget/userpermission.php";
  page = 1;
  count = 0;
  tableSize = 10;
  tableSizes = [10,20,30];
  locale = 'th-be';
  locales = listLocales();

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
    this.dataFAdd.citizen =this.tokenStorage.getUser().citizen;
    this.dataAdd.PLPROJECTTYPE=1;
    this.dataFAdd.PLASSETPROC_TSDATE=new Date();  
  }
  keyword = 'name';
  datacomplete = [];
  selectEvent(item: any) {
    this.dataFAdd.FNCREDITOR_CODE = item.id; 
    console.log(item);
  }
  onChangeSearch(val: string) {
    var varP = {
      "opt": "viewFNCREDITOR",
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
  fetchclose(){
    this.clickshow=null;  
  }
  showapp(){
    //console.log('1');
    this.clickshow=true;
  } 
  fetchdata(){
    //ดึงคณะตามสังกัด
    var varN = {
     "opt": "viewufac",
     "citizen":this.tokenStorage.getUser().citizen
   }
   this.apiService
 .getdata(varN,this.url1)
 .pipe(first())
 .subscribe((data: any) => {
   this.dataAdd.UFACULTY_CODE = data[0].FACULTY_CODE;
   this.dataAdd.UCAMPUS_CODE = data[0].CAMPUS_CODE;
 
 });
     var varP = {
      "opt": "viewp",
      "citizen":this.tokenStorage.getUser().citizen
    }
       //ดึงรายการคณะตามสิทธิ์
    this.apiService.getdata(varP,this.url1)
    .pipe(first())
    .subscribe((data: any) => {
      this.datarstatus = data;
      this.dataAdd.PRIVILEGE_RSTATUS=data[0].PRIVILEGE_RSTATUS;
       var varNf = {
        "opt": "viewfac",
        "citizen":this.tokenStorage.getUser().citizen,
         "PRIVILEGERSTATUS":data[0].PRIVILEGE_RSTATUS
      }
      this.apiService
    .getdata(varNf,this.url1)
    .pipe(first())
    .subscribe((data: any) => {
      this.dataFac = data;
     // console.log(data[0].FACULTY_CODE);
      this.dataAdd.FACULTY_CODE = data[0].FACULTY_CODE;
 
    });
    });
    //รายการประเภทเงิน
    var Table = {
     "opt": "viewTable",
     "Table":"PLINCOME where PLINCOME_ASTATUS=1"
   }
   this.apiService
   .getdata(Table,this.url1)
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
   .getdata(Tabley,this.url1)
   .pipe(first())
   .subscribe((data: any) => {
     this.dataYear = data;
     this.dataAdd.PLYEARBUDGET_CODE = data[0].PLYEARBUDGET_CODE;   
 
    //รายการภาค
   var Table2 = {
     "opt": "viewCRPART",
     "PLYEARBUDGET_CODE":data[0].PLYEARBUDGET_CODE,
     "FACULTY_CODE": "",
     "PLINCOME_CODE": ""
   }
   this.apiService
   .getdata(Table2,this.url1)
   .pipe(first())
   .subscribe((data: any) => {
     this.dataCrpart = data;
     this.dataAdd.CRPART_ID = data[0].CRPART_ID;
   });

   });
       //วิธีการจัดซื้อ
       var Table3 = {
        "opt": "viewmethod"
      }
      this.apiService
      .getdata(Table3,this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.dataMethod = data;

      }); 
   }
      //ภาคเงิน
  fetchdatalistcr(){  
        this.dataAdd.opt = "viewCRPART"; 
        this.apiService
        .getdata(this.dataAdd,this.url1)
        .pipe(first())
        .subscribe((data: any) => {
          this.dataCrpart = data;
          this.dataAdd.CRPART_ID = data[0].CRPART_ID;
        }); 
  }
        //สถานะดำเนินการ
  fetchdatamd(){  
          this.dataFAdd.opt = "viewmethodmd"; 
          this.apiService
          .getdata(this.dataFAdd,this.url1)
          .pipe(first())
          .subscribe((data: any) => {
            this.dataMtpt = data;
            this.dataFAdd.PLASSETMD_CODE = data[0].PLASSETMD_CODE;
          }); 
    }
  fetchdatalist(){ 
   this.dataAdd.opt = 'readAll';
    this.loading=true;
    this.datalist = null;
    this.datalistresearch = null;
    this.apiService
   .getdata(this.dataAdd,this.url)
   .pipe(first())
   .subscribe((data: any) => {
    if(data.status==1){
     this.datalist = data.data; 
     this.datalistresearch= data.dataresearch; 
     this.loading=null;  
     this.rownum=1; 
     if(this.datalist.length==0 && this.datalistresearch.length==0){
      this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
      this.datalist = data.data; 
     }

    }
   });
  } 
  clear(){
    this.dataFAdd.PLASSETPROC_CSDATE='';
    this.dataFAdd.PLASSETPROC_CEDATE='';
    this.dataFAdd.PLASSETPROC_MONEY=0;
    this.dataFAdd.PLASSETPROC_MONEYC=0;
    this.dataFAdd.PLASSETPROC_PO='';
    this.dataFAdd.PLASSETPROC_NUM='';
    this.dataFAdd.FNCREDITOR_CODE='null';
    this.dataFAdd.PLASSETPROC_DETAIL='';
    this.dataFAdd.PLASSETMETHOD_NOTE='';
  }
  editdata(id: any,type: any){
    this.clear();
    this.localeService.use(this.locale);
    this.dataFAdd.opt = 'readone';  
    this.dataFAdd.PLASSET_CODE=id;
    this.dataFAdd.PLPROJECTTYPE1=type;
    this.rowpbi=true;
    this.rowpbu=null;
    this.apiService
    .getdata(this.dataFAdd,this.url)
    .pipe(first())
    .subscribe((data: any) => {//datalisttd
     if(data.status==1){
      this.datalisttdp=data.data;
      this.dataFAdd.PLPROJECT_NAME= data.name;
      this.dataFAdd.PLASSETPROC_NUMBER= data.number;
      this.dataFAdd.PLASSETMETHOD_CODE= data.methodcode;
      this.dataMtpt =null;
      var Table = {
        "opt": "viewmethodmd",
        "PLASSETMETHOD_CODE":data.methodcode
      }
          this.apiService
          .getdata(Table,this.url1)
          .pipe(first())
          .subscribe((datat: any) => {
            this.dataMtpt = datat;
            this.dataFAdd.PLASSETMD_CODE= data.mtdtcode;
          }); 
      
     }else{
      this.datalisttdp=data.data;
     }
    });  

  }
  datenow(datenow:any){
    const yyyy = datenow.getFullYear();
    let mm = datenow.getMonth() + 1; // Months start at 0!
    let dd = datenow.getDate();
    return  yyyy+'-'+mm+'-'+dd;
    } 
  insertdata(){    
    //console.log(this.dataAdd.PRASSET_COURSET );
    if(this.dataFAdd.PLASSETPROC_NUMBER =='' || this.dataFAdd.PLASSETMETHOD_CODE =='' || this.dataFAdd.PLASSETMD_CODE ==''){
       if(this.dataFAdd.PLASSETPROC_NUMBER ==''){
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกครั้งที่ดำเนินการ");
       }
       if(this.dataFAdd.PLASSETMETHOD_CODE ==''){
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกวิธีการจัดซื้อ");
       }
       if(this.dataFAdd.PLASSETMD_CODE ==''){
        this.toastr.warning("แจ้งเตือน:กรุณาเลือกสถานะการดำเนินการ");
       }
      }else{

          if(this.dataFAdd.PLASSETPROC_CSDATE ==''){
            this.dataFAdd.PLASSETPROC_CSDATE1='';
          }else{
            this.dataFAdd.PLASSETPROC_CSDATE1=this.datenow(this.dataFAdd.PLASSETPROC_CSDATE);
            this.dataFAdd.PLASSETPROC_CEDATE1=this.datenow(this.dataFAdd.PLASSETPROC_CEDATE);
          }
          
          if(this.dataFAdd.PLASSETPROC_TSDATE ==''){
            this.dataFAdd.PLASSETPROC_TSDATE1='';
          }else{
            this.dataFAdd.PLASSETPROC_TSDATE1=this.datenow(this.dataFAdd.PLASSETPROC_TSDATE);
          }
        this.dataFAdd.opt = "insert"; 
        this.apiService
     .getupdate(this.dataFAdd,this.url)
     .pipe(first())
     .subscribe((data: any) => {
       //console.log(data.status);       
     if (data.status == 1) {
       this.toastr.success("แจ้งเตือน:เพิ่มข้อมูลเรียบร้อยแล้ว");
       this.fetchdatalist();
       this.clear();
       this.dataFAdd.opt = 'readone'; 
       this.apiService
      .getdata(this.dataFAdd,this.url)
      .pipe(first())
      .subscribe((data: any) => {//datalisttd
         if(data.status==1){
          this.datalisttdp=data.data;
         }
     });
     } 
     });
      } 
    }
    updatedata(){    
      //console.log(1 );
      if(this.dataFAdd.PLASSETPROC_NUMBER =='' || this.dataFAdd.PLASSETMETHOD_CODE =='' || this.dataFAdd.PLASSETMD_CODE ==''){
        if(this.dataFAdd.PLASSETPROC_NUMBER ==''){
         this.toastr.warning("แจ้งเตือน:กรุณาเลือกครั้งที่ดำเนินการ");
        }
        if(this.dataFAdd.PLASSETMETHOD_CODE ==''){
         this.toastr.warning("แจ้งเตือน:กรุณาเลือกวิธีการจัดซื้อ");
        }
        if(this.dataFAdd.PLASSETMD_CODE ==''){
         this.toastr.warning("แจ้งเตือน:กรุณาเลือกสถานะการดำเนินการ");
        }
       }else{
  
            if(this.dataFAdd.PLASSETPROC_CSDATE ==''){
              this.dataFAdd.PLASSETPROC_CSDATE1='';
              this.dataFAdd.PLASSETPROC_CEDATE1='';
            }else{
              this.dataFAdd.PLASSETPROC_CSDATE1=this.datenow(this.dataFAdd.PLASSETPROC_CSDATE);
              this.dataFAdd.PLASSETPROC_CEDATE1=this.datenow(this.dataFAdd.PLASSETPROC_CEDATE);
            }
            
            if(this.dataFAdd.PLASSETPROC_TSDATE ==''){
              this.dataFAdd.PLASSETPROC_TSDATE1='';
            }else{
              this.dataFAdd.PLASSETPROC_TSDATE1=this.datenow(this.dataFAdd.PLASSETPROC_TSDATE);
            }
          this.dataFAdd.opt = "update"; 
          this.apiService
       .getupdate(this.dataFAdd,this.url)
       .pipe(first())
       .subscribe((data: any) => {
         //console.log(data.status);       
       if (data.status == 1) {
        this.rowpbi=true;
        this.rowpbu=null;
         this.toastr.success("แจ้งเตือน:แก้ไขข้อมูลเรียบร้อยแล้ว");
         this.clear();
         this.dataFAdd.opt = 'readone'; 
         this.apiService
        .getdata(this.dataFAdd,this.url)
        .pipe(first())
        .subscribe((data: any) => {//datalisttd
           if(data.status==1){
            this.datalisttdp=data.data;
           }
       });
       } 
       });
        } 
      }
   // ฟังก์ชันสำหรับการลบข้อมูล
   deleteData(id: any){
    Swal.fire({
      title: 'ต้องการลบข้อมูล?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.value) {
        Swal.fire('ลบข้อมูล!', 'ลบข้อมูลเรียบร้อยแล้ว', 'success');    
        this.datalistdetail=null;
        this.dataFAdd.id = id; 
        this.dataFAdd.opt = "delete"; 
        this.apiService
        .getdata(this.dataFAdd,this.url)
        .pipe(first())
        .subscribe((data: any) => {
        if(data.status==1){
        this.fetchdatalist();
         // console.log(data.status);
         this.dataFAdd.opt = 'readone'; 
           this.apiService
          .getdata(this.dataFAdd,this.url)
          .pipe(first())
          .subscribe((data: any) => {//datalisttd
             if(data.status==1){
              this.datalisttdp=data.data;
             }
         });
       }
         }); 
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('ยกเลิก', 'ยกเลิกการลบข้อมูล', 'error');
      }
    });
    
  } 
  editdatamethod(id: any){
    this.dataFAdd.PLASSETPROC_CODE = id; 
    this.dataFAdd.opt = "readonemethod"; 
    this.rowpbi=null;
    this.rowpbu=true;
    this.apiService
    .getdata(this.dataFAdd,this.url)
    .pipe(first())
     .subscribe((data: any) => {//datalisttd
          this.dataFAdd.PLASSETPROC_CODE = data[0].code;
          this.dataFAdd.PLASSETPROC_NUMBER= data[0].number;
          this.dataFAdd.PLASSETMETHOD_CODE= data[0].PLASSETMETHOD_CODE; 
          this.dataFAdd.PLASSETMD_CODE= data[0].PLASSETMD_CODE;  
          this.dataFAdd.PLASSETPROC_TSDATE = new Date(data[0].PLASSETPROC_TSDATE1);
          this.dataFAdd.PLASSETPROC_DETAIL = data[0].detail;
          this.dataFAdd.PLASSETPROC_MONEY = parseFloat(data[0].money).toFixed(2);
          this.dataFAdd.PLASSETPROC_PO = data[0].po;
          this.dataFAdd.PLASSETMETHOD_NOTE=data[0].note;
          this.dataFAdd.PLASSETPROC_MONEYC = data[0].PLASSETPROC_MONEYC;
          this.dataFAdd.PLASSETPROC_NUM = data[0].PLASSETPROC_NUM;
          //this.statusmethod(data[0].PLASSETMETHOD_CODE);
          //console.log(data[0].PLASSETMETHOD_CODE);
           this.statusmethodv(data[0].PLASSETMD_CODE);
          if(data[0].credit !=null){
            this.dataFAdd.FNCREDITOR_CODE= data[0].credit;
            this.dataFAdd.FNCREDITOR_CODE1= data[0].FNCREDITOR_NAME;
          }
            if(data[0].PLASSETPROC_CSDATE1 !=null){
            this.dataFAdd.PLASSETPROC_CSDATE = new Date(data[0].PLASSETPROC_CSDATE1);
            this.dataFAdd.PLASSETPROC_CEDATE = new Date(data[0].PLASSETPROC_CEDATE1);
            }else{
             this.dataFAdd.PLASSETPROC_CSDATE ='';
             this.dataFAdd.PLASSETPROC_CEDATE ='';
            }   
        });
  }         
  CheckNum(num: any){
    //console.log(num.keyCode); 
          if (num.keyCode < 46 || num.keyCode > 57){
        alert('กรุณากรอกข้อมูล ที่เป็นตัวเลข');
            num.returnValue = false;
            }
       }
statusmethodv(value: any){
    let status=value;
    if(status=='010' || status=='024' || status=='039' || status=='053' || status=='069' ){
      this.statuscon=true;
      this.statuscredit=null;
      this.statusmoc=null;
      this.statusno=null;
    }else if(status=='008' || status=='022' || status=='037' || status=='051' || status=='067' ){
      this.statuscon=null;
      this.statuscredit=true;
      this.statusmoc=null;
      this.statusno=null;
    }else if(status=='007' || status=='021' || status=='036' || status=='050' || status=='066' || status=='078'|| status=='079'|| status=='080'|| status=='081'|| status=='082'){
      this.statuscon=null;
      this.statuscredit=null;
      this.statusno=true;
      this.statusmoc=null;
    }else if(status=='004' || status=='017' || status=='031' || status=='046' || status=='060' ){
      this.statuscon=null;
      this.statuscredit=null;
      this.statusno=null;
      this.statusmoc=true;
    }else{
      this.statuscon=null;
      this.statuscredit=null;
      this.statusmoc=null;
      this.statusno=null;
    }  
  } 
  statusmethod(value: any){
    let status=value.target.value;
    console.log(status);
    if(status=='010' || status=='024' || status=='039' || status=='053' || status=='069' ){
      this.statuscon=true;
      this.statuscredit=null;
      this.statusmoc=null;
      this.statusno=null;
    }else if(status=='008' || status=='022' || status=='037' || status=='051' || status=='067' ){
      this.statuscon=null;
      this.statuscredit=true;
      this.statusmoc=null;
      this.statusno=null;
    }else if(status=='007' || status=='021' || status=='036' || status=='050' || status=='066' || status=='078'|| status=='079'|| status=='080'|| status=='081'|| status=='082'){
      this.statuscon=null;
      this.statuscredit=null;
      this.statusno=true;
      this.statusmoc=null;
    }else if(status=='004' || status=='017' || status=='031' || status=='046' || status=='060' ){
      this.statuscon=null;
      this.statuscredit=null;
      this.statusno=null;
      this.statusmoc=true;
    }else{
      this.statuscon=null;
      this.statuscredit=null;
      this.statusmoc=null;
      this.statusno=null;
    }  
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

