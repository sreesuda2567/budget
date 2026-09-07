import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../../_services/token-storage.service';
import { ApiPdoService } from '../../../_services/api-pui.service';
import { first, map, startWith } from 'rxjs/operators';
@Component({
  selector: 'app-menuwelfare',
  templateUrl: './menuwelfare.component.html',
  styleUrls: ['./menuwelfare.component.scss']
})
export class MenuwelfareComponent implements OnInit {
     dataAdd: any = { };
     datastatus: any ;
     url = "/acc3d/welfare/load/appepmedical.php";
     url1 = "/acc3d/welfare/userpermission.php";
  constructor(private tokenStorage: TokenStorageService,
      private apiService: ApiPdoService) { }

  ngOnInit(): void {
    this.dataAdd.citizen = this.tokenStorage.getUser().citizen;
    this.fetchdata();
  }
    fetchdata() {
    var varP = {
      "opt": "viewp",
      "citizen": this.tokenStorage.getUser().citizen
    }
    //ดึงรายการคณะตามสิทธิ์
    this.apiService.getdata(varP, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.datastatus = data[0].PRIVILEGE_RSTATUS;

          });
          
}

 }
