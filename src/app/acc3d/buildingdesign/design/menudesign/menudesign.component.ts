import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../../../_services/token-storage.service';
import { ApiPdoService } from '../../../../_services/api-pdo.service';
import { first, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-menudesign',
  templateUrl: './menudesign.component.html',
  styleUrls: ['./menudesign.component.scss']
})
export class MenudesignComponent implements OnInit {
  url = "/acc3d/status_menu.php";
  url1 = "/acc3d/buildingdesign/userpermission.php";
  ustatus: any;
  constructor(
    private tokenStorage: TokenStorageService,
    private apiService: ApiPdoService
  ) { }

  ngOnInit(): void {
    this.fetchdata();
  }
  fetchdata() {

    this.apiService.getdata(this.url, 'counterbd', '', '', this.tokenStorage.getUser().citizen)
      .pipe(first())
      .subscribe((data: any) => {
      });

    this.apiService.getdata(this.url1, 'viewu', '', '', this.tokenStorage.getUser().citizen)
      .pipe(first())
      .subscribe((data: any) => {
        this.ustatus=data[0].PRIVILEGE_RSTATUS;
      });
  }
}
