import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../_services/auth.guard';
import { MenuwelfareComponent } from './menuwelfare/menuwelfare.component';
import { EpmedicalControlComponent } from './report/epmedical-control/epmedical-control.component';
import { EpschoolControlComponent } from './report/epschool-control/epschool-control.component';
import { MemberretireComponent } from './manage/memberretire/memberretire.component';
import { EpmedicalretireComponent } from './manage/epmedicalretire/epmedicalretire.component';
import { EpschoolretireComponent } from './manage/epschoolretire/epschoolretire.component';
import { EpschoolLoadComponent } from './load/epschool-load/epschool-load.component';
import { EpmedicalLoadComponent } from './load/epmedical-load/epmedical-load.component';
import { AppepschoolComponent } from './load/appepschool/appepschool.component';
import { AppepmedicalComponent } from './load/appepmedical/appepmedical.component';
import { LoadwfComponent } from './load/loadwf/loadwf.component';
import { LoadwComponent } from './load/loadw/loadw.component';
import { WfdashboardComponent } from './load/wfdashboard/wfdashboard.component';
import { IncomepmedicalComponent } from './load/incomepmedical/incomepmedical.component';
import { IncomepschoolComponent } from './load/incomepschool/incomepschool.component';
import { EpmedicalSummonthComponent } from './report/epmedical-summonth/epmedical-summonth.component';
import { EpschoolSummonthComponent } from './report/epschool-summonth/epschool-summonth.component';

const routes: Routes = [
  { path: '', component: MenuwelfareComponent , children : [
    { path: '', component: WfdashboardComponent, canActivate: [AuthGuard] },  
    { path: 'epmedical_control', component : EpmedicalControlComponent , canActivate: [AuthGuard]},
    { path: 'epschool_control', component : EpschoolControlComponent , canActivate: [AuthGuard]},
    { path: 'memberretire', component : MemberretireComponent , canActivate: [AuthGuard]},
    { path: 'epmedicalretire', component : EpmedicalretireComponent , canActivate: [AuthGuard]},
    { path: 'epschoolretire', component : EpschoolretireComponent , canActivate: [AuthGuard]},
    { path: 'epschool_load', component : EpschoolLoadComponent , canActivate: [AuthGuard]},
    { path: 'epmedical_load', component : EpmedicalLoadComponent , canActivate: [AuthGuard]},
    { path: 'appepschool', component : AppepschoolComponent , canActivate: [AuthGuard]},
    { path: 'appepmedical', component : AppepmedicalComponent , canActivate: [AuthGuard]},
    { path: 'loadwf', component : LoadwfComponent , canActivate: [AuthGuard]},
    { path: 'loadw', component : LoadwComponent , canActivate: [AuthGuard]},
    { path: 'incomepmedical', component : IncomepmedicalComponent , canActivate: [AuthGuard]},
    { path: 'incomepschool', component : IncomepschoolComponent , canActivate: [AuthGuard]},
    { path: 'epmedical_report', component : EpmedicalSummonthComponent , canActivate: [AuthGuard]},
    { path: 'epschool_report', component : EpschoolSummonthComponent , canActivate: [AuthGuard]},
    { path: '**', redirectTo: '' }
]
},
];
@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class WelfareRoutingModule { }
