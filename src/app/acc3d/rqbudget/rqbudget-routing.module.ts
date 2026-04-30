import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../_services/auth.guard';
import { MenuComponent } from './menu/menu.component';
import { RqtassetComponent } from './budget/rqtasset/rqtasset.component';
import { RqtbuildingComponent } from './budget/rqtbuilding/rqtbuilding.component';
import { RqtprojectComponent } from './budget/rqtproject/rqtproject.component';
import { SmassetComponent } from './submit/smasset/smasset.component';
import { SmbuildingComponent } from './submit/smbuilding/smbuilding.component';
import { SmprojectComponent } from './submit/smproject/smproject.component';
import { RegisassetComponent } from '../investment/register/regisasset/regisasset.component';
import { RegisisbuilingComponent } from '../investment/register/regisisbuiling/regisisbuiling.component';
import { RegisterprojectComponent } from '../investment/register/registerproject/registerproject.component';
import { ReportrqassetComponent } from './report/reportrqasset/reportrqasset.component';
import { ReportrqbuildingComponent } from './report/reportrqbuilding/reportrqbuilding.component';
import { ReportrqprojectComponent } from './report/reportrqproject/reportrqproject.component';
import { AppassetComponent } from './approve/appasset/appasset.component';
import { AppbuildingComponent } from './approve/appbuilding/appbuilding.component';
import { AppprojectComponent } from './approve/appproject/appproject.component';
import { RqtassetpComponent } from './budget/rqtassetp/rqtassetp.component';

const routes: Routes = [
    { path: '', component: MenuComponent , children : [
    { path: 'rqasset', component : RqtassetComponent , canActivate: [AuthGuard]},
    { path: 'rqbuilding', component : RqtbuildingComponent , canActivate: [AuthGuard]},
    { path: 'rqproject', component : RqtprojectComponent , canActivate: [AuthGuard]},
    { path: 'smasset', component : SmassetComponent , canActivate: [AuthGuard]},
    { path: 'smbuilding', component : SmbuildingComponent , canActivate: [AuthGuard]},
    { path: 'smproject', component : SmprojectComponent , canActivate: [AuthGuard]},
    { path: 'regis_asset', component : RegisassetComponent , canActivate: [AuthGuard]},
    { path: 'regis_building', component : RegisisbuilingComponent , canActivate: [AuthGuard]},
    { path: 'regis_project', component : RegisterprojectComponent , canActivate: [AuthGuard]},
    { path: 'reportrqasset', component : ReportrqassetComponent , canActivate: [AuthGuard]},
    { path: 'reportrqbuilding', component : ReportrqbuildingComponent , canActivate: [AuthGuard]},
    { path: 'reportrqproject', component : ReportrqprojectComponent , canActivate: [AuthGuard]},
    { path: 'appasset', component : AppassetComponent , canActivate: [AuthGuard]},
    { path: 'appbuilding', component : AppbuildingComponent , canActivate: [AuthGuard]},
    { path: 'appproject', component : AppprojectComponent , canActivate: [AuthGuard]},
    { path: 'rqtassetp', component : RqtassetpComponent , canActivate: [AuthGuard]},
  
    { path: '**', redirectTo: '' }
  ]
},
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RqbudgetRoutingModule { }


