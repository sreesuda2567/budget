import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../_services/token-storage.service';
import { ApiPdoService } from '../../_services/api-pdo.service';
import { first, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss']
})
export class BudgetComponent implements OnInit {
  url = "/acc3d/status_menu.php";
  datastatusbg:any;
  datastatus:any;
  datastatusma:any;
  datastatusfi:any;
  constructor(
    private tokenStorage: TokenStorageService,
    private apiService: ApiPdoService,
  ) { }

  ngOnInit(): void {
    this.fetchdata();
  }
  fetchdata(){
    //เช็คสิทธิ
    this.datastatusbg=null;
    this.datastatus=null;
   // let param = {'citizen':this.user.citizen};
    this.apiService.getdata(this.url,'readbudget','','',this.tokenStorage.getUser().citizen)
    .pipe(first())
    .subscribe((data: any) => {
        this.datastatusbg=data.datastatusbg;
        this.datastatus=data.datastatus;
        this.datastatusma=data.datastatusma;
        this.datastatusfi=data.datastatusfi;
       
});
this.apiService.getdata(this.url,'counterbt','','',this.tokenStorage.getUser().citizen)
.pipe(first())
.subscribe((data: any) => {

});
  }

}
