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
  url = "/acc3d/status_menu.php";
  datastatusfn:any;
  datastatusas:any;
  datastatusau:any;
  datastatuspl:any;
  datastatusbl:any;
  datastatuswe:any;
  datastatusappm:any;
  datastatusams:any;
  datastatusbs:any;
  constructor(
    private tokenStorage: TokenStorageService,
    private apiService: ApiPdoService,
  ) { }

  ngOnInit(): void {
    this.fetchdata();
  }
  fetchdata(){
    //เช็คสิทธิ
    this.datastatusfn=null;
   // let param = {'citizen':this.user.citizen};
    this.apiService.getdata(this.url,'readmenu','','',this.tokenStorage.getUser().citizen)
    .pipe(first())
    .subscribe((data: any) => {
        this.datastatusfn=data.statusfn;
        this.datastatusas=data.statusas;
        this.datastatusau=data.statusau;
        this.datastatuspl=data.statuspl;
        this.datastatusbl=data.statusbl;
        this.datastatuswe=data.statuswe;
        this.datastatusappm=data.statusappm;
        this.datastatusams=data.statusams;
        this.datastatusbs=data.statusbs;
      //  console.log(this.tokenStorage.getUser().citizen);
});
  }
  golinkams() {

    //  console.log(this.tokenStorage.getUser().token.data.token);
   let token=this.tokenStorage.getUser().token.data.token;
       let url='https://ams.rmutsv.ac.th/logintkn/ams_home_by_pis/'+token;
       window.open(url, '_parent');
    }
}
