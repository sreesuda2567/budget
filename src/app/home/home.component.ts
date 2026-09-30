import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../_services/token-storage.service';

import { ApiPdoService } from '../_services/api-pdo.service';
import { first, map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loading:any;
  isLoginFailed:any;
  user:any;
  count_mms:any=0;
  btnPer00: any; btnPer15: any; btnPer18: any; btnPer19: any;
  btnPer20: any; btnPer21: any; btnPer22: any;btnPer23: any;
  url = "/eis/executives_menu.php";
  datastatuseis:any;
  datastatusacc:any;
  datastatusag:any;
  datastatusvm:any;
  datastatusres:any;
  datastatuslab:any;
  constructor(
    private tokenStorage: TokenStorageService,
    private apiService: ApiPdoService,
    private toastr: ToastrService
  ) {



  }

  getPermiss(){
    this.loading=true;
    this.user = this.tokenStorage.getUser();
    if (this.user && !this.user.citizen && (this.user.cid || this.user.citizenId)) {
      this.user.citizen = this.user.cid || this.user.citizenId;
    }
  
    setTimeout(()=>{ // this will make the execution after the above boolean has changed
      this.loading = null;
    },500);
  }

  ngOnInit(): void {
    const key = this.tokenStorage.getVersion();
    this.getPermiss();
    if(this.user){
     // this.get_massage(this.user.citizen);
      this.fetchdata();
    }
  }
  fetchdata(){
    //เช็คสิทธิ
    this.datastatuseis=null;
    this.datastatusacc=null;
    this.datastatusag=null;
    this.datastatusvm=null;
    this.datastatusres=null;
    this.datastatuslab=null;
   // let param = {'citizen':this.user.citizen};
    this.apiService.getdata(this.url,'readmenu','','',this.user.citizen)
    .pipe(first())
    .subscribe((data: any) => {
        this.datastatuseis=data.status;
        this.datastatusacc=data.statusacc;
        this.datastatusag=data.statusag;
        this.datastatusvm=data.statusvm;
        this.datastatusres=data.statusres;
        this.datastatuslab=data.statuslab;
       // console.log(this.datastatuseis);
});
  }

  /**
   * ตรวจสอบและดึง Token สำหรับส่งต่อไปยังระบบภายนอก (EiS, PiS, RUTS PLATFORM)
   */
  getSystemToken(): string | null {
    const user = this.tokenStorage.getUser();
    if (!user) {
      console.warn('[Home] getUser() returned null or empty');
      return null;
    }

    // 1. ตรวจสอบโครงสร้างเดิม user.token.data.token
    if (user.token && user.token.data && user.token.data.token) {
      return user.token.data.token;
    }

    // 2. ตรวจสอบ eLogin Token ที่ได้จาก UserInfo ของ Keycloak SSO
    if (user.tokenelogin) {
      return user.tokenelogin;
    }

    // 3. กรณี user.token เป็น string
    if (typeof user.token === 'string' && user.token.length > 0) {
      return user.token;
    }

    // 4. Fallback จาก accessToken หรือ token ใน sessionStorage
    if (user.accessToken) {
      return user.accessToken;
    }

    return this.tokenStorage.getToken();
  }

  golinkeis(): void {
    const token = this.getSystemToken();
    console.log('[Home -> EiS] Token to send:', token);
    if (!token) {
      this.toastr.warning('ไม่พบ Token สำหรับเข้าสู่ระบบ EiS กรุณาเข้าสู่ระบบใหม่อีกครั้ง', 'แจ้งเตือน');
      return;
    }
    const url = 'https://eis.rmutsv.ac.th/loginrutsapp/' + token;
    window.open(url, '_parent');
  }

  golinkpis(): void {
    const token = this.getSystemToken();
    console.log('[Home -> PiS] Token to send:', token);
    if (!token) {
      this.toastr.warning('ไม่พบ Token สำหรับเข้าสู่ระบบ PiS กรุณาเข้าสู่ระบบใหม่อีกครั้ง', 'แจ้งเตือน');
      return;
    }
    const url = 'https://pis.rmutsv.ac.th/loginrutsapp/' + token;
    window.open(url, '_parent');
  }

  golinkruts(): void {
    const token = this.getSystemToken();
    console.log('[Home -> RUTS PLATFORM] Token to send:', token);
    if (!token) {
      this.toastr.warning('ไม่พบ Token สำหรับเข้าสู่ระบบ RUTS PLATFORM กรุณาเข้าสู่ระบบใหม่อีกครั้ง', 'แจ้งเตือน');
      return;
    }
    const url = 'https://ruts.rmutsv.ac.th/loginrutsapp/' + token;
    window.open(url, '_parent');
  }
}
