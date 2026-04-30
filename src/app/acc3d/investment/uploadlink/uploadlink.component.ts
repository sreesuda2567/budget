import { Component, OnInit,ElementRef, HostListener ,ViewChild} from '@angular/core';
import { ApiPdoService } from '../../../_services/api-pui.service';
import { TokenStorageService } from '../../../_services/token-storage.service';
import { first, map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-uploadlink',
  templateUrl: './uploadlink.component.html',
  styleUrls: ['./uploadlink.component.scss']
})
export class UploadlinkComponent implements OnInit {
  loading:any;
  datalist:any 
  dataFac :any;
  rownum:any;
  url = "/acc3d/investment/manage/linkupload.php";
  url1 = "/acc3d/investment/userpermission.php";
  dataAdd:any = {};
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
        this.dataAdd.opt = "readAll";
    this.apiService
    .getdata(this.dataAdd,this.url)
    .pipe(first())
    .subscribe(
     (data: any) => {
      if(data.status==1){
      this.datalist = data.data;
      this.loading=null; 
      this.rownum='true';
    }else{
      this.datalist=data.data; 
      this.loading=null;
      this.rownum=null;
       this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
     }
    });
      });
    });
    
  }  
    // ฟังก์ขันสำหรับการดึงข้อมูลครุภัณฑ์
    fetchdatalist(){  
      this.dataAdd.opt = "readAll";
    this.apiService
    .getdata(this.dataAdd,this.url)
    .pipe(first())
    .subscribe(
     (data: any) => {
      if(data.status==1){
      this.datalist = data.data;
      this.loading=null; 
      this.rownum='true';
    }else{
      this.datalist=data.data; 
      this.loading=null;
      this.rownum=null;
       this.toastr.warning("แจ้งเตือน:ไม่มีข้อมูล");
     }
    });
    }    
}
