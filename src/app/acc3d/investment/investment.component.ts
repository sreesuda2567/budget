import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../_services/token-storage.service';
import { ApiPdoService } from '../../_services/api-pdo.service';
import { first, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-investment',
  templateUrl: './investment.component.html',
  styleUrls: ['./investment.component.scss']
})
export class InvestmentComponent implements OnInit {
  url = "/acc3d/status_menu.php";
  datastatus:any;
  datastatusf:any;
  datastatusd:any;
  constructor(
    private tokenStorage: TokenStorageService,
    private apiService: ApiPdoService,
  ) { }

  ngOnInit(): void {
    this.fetchdata();
  }
  fetchdata(){
    //เช็คสิทธิ
    this.datastatus=null;
    this.datastatusf=null;
    this.datastatusd=null;
   // let param = {'citizen':this.user.citizen};
    this.apiService.getdata('/acc3d/investment/status_menu.php','readmenu','','',this.tokenStorage.getUser().citizen)
    .pipe(first())
    .subscribe((data: any) => {
        this.datastatus=data.datastatus;
        this.datastatusf=data.datastatusf;
        this.datastatusd=data.datastatusd;
       //console.log(data);
   });

  this.apiService.getdata(this.url,'counterps','','',this.tokenStorage.getUser().citizen)
    .pipe(first())
    .subscribe((data: any) => {
    
  });
  } 

}
