import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../../_services/token-storage.service';
import { ApiPdoService } from '../../../_services/api-pdo.service';
import { first, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
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
    this.apiService.getdata('/acc3d/rqbudget/status_menu.php','readmenu','','',this.tokenStorage.getUser().citizen)
    .pipe(first())
    .subscribe((data: any) => {
        this.datastatus=data.datastatus;
        this.datastatusf=data.datastatusf;
        this.datastatusd=data.datastatusd;
       //console.log(data);
   });

  /*this.apiService.getdata(this.url,'counterps','','',this.tokenStorage.getUser().citizen)
    .pipe(first())
    .subscribe((data: any) => {
    
  });*/
  } 
}
