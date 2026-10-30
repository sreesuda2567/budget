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

  toggleSubmenu(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const target = event.currentTarget as HTMLElement;
    const parent = target.parentElement;
    if (parent) {
      const siblings = parent.parentElement?.querySelectorAll(':scope > .dropdown-submenu');
      siblings?.forEach((sib) => {
        if (sib !== parent) {
          sib.classList.remove('show');
          sib.querySelector(':scope > .dropdown-menu')?.classList.remove('show');
        }
      });
      parent.classList.toggle('show');
      const childMenu = parent.querySelector(':scope > .dropdown-menu');
      if (childMenu) {
        childMenu.classList.toggle('show');
      }
    }
  }

  setProjectType(type: any): void {
    sessionStorage.setItem('PRPLPROJECT_TYPE', type.toString());
  }
}
