import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../_services/token-storage.service';

import { ApiPdoService } from '../_services/api-pdo.service';
import { first, map, startWith } from 'rxjs/operators';

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
  ) {



  }

  getPermiss(){
    this.loading=true;
    //console.log( this.user);
    this.user = this.tokenStorage.getUser();
    //console.log( this.user);
  
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


golinkeis() {

  //  console.log(this.tokenStorage.getUser().token.data.token);
 let token=this.tokenStorage.getUser().token.data.token;
     let url='https://eis.rmutsv.ac.th/loginrutsapp/'+token;
     window.open(url, '_parent');
  }
  golinkpis() {

    //  console.log(this.tokenStorage.getUser().token.data.token);
   let token=this.tokenStorage.getUser().token.data.token;
       let url='https://pis.rmutsv.ac.th/loginrutsapp/'+token;
       window.open(url, '_parent');
    }
  golinkruts() {

    //  console.log(this.tokenStorage.getUser().token.data.token);
   let token=this.tokenStorage.getUser().token.data.token;
       let url='https://ruts.rmutsv.ac.th/loginrutsapp/'+token;
       window.open(url, '_parent');
    }
}
