import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../../_services/token-storage.service';
import { ApiPdoService } from '../../../_services/api-pui.service';
import { first, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  datastatus: any;
  url1 = "/acc3d/appmoney/userpermission.php";
  url = "/acc3d/status_menu.php";
  constructor(
    private tokenStorage: TokenStorageService,
    private apiService: ApiPdoService,
  ) { }

  ngOnInit(): void {
    this.fetchdata();
  }
  fetchdata() {
    //ดึงรายการคณะตามสิทธิ์
    var varP = {
      "opt": "viewp",
      "citizen": this.tokenStorage.getUser().citizen
    }
    this.apiService.getdata(varP, this.url1)
      .pipe(first())
      .subscribe((data: any) => {
        this.datastatus = data[0].PRIVILEGE_RSTATUS
      });


    var varP = {
      "opt": "counteram",
      "citizen": this.tokenStorage.getUser().citizen
    }
    this.apiService.getdata(varP, this.url)
      .pipe(first())
      .subscribe((data: any) => {
      });


  }

}
