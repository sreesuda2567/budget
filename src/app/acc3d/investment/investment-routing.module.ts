import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvestmentComponent } from './investment.component';
import { ListassetComponent } from './listasset/listasset.component';
import { ListassetpComponent } from './listassetp/listassetp.component';
import { ListbuildingComponent } from './listbuilding/listbuilding.component';
import { ListprojectComponent } from './listproject/listproject.component';
import { ApproveassetComponent } from './approve/approveasset/approveasset.component';
import { ApprovebuildingComponent } from './approve/approvebuilding/approvebuilding.component';
import { ApproveprojectComponent } from './approve/approveproject/approveproject.component';
import { ReportassetComponent } from './report/reportasset/reportasset.component';
import { ReportbuildingComponent } from './report/reportbuilding/reportbuilding.component';
import { ReportprojectComponent } from './report/reportproject/reportproject.component';
import { UnitComponent } from './manage/unit/unit.component';
import { YearComponent } from './manage/year/year.component';
import { ProductComponent } from './manage/product/product.component';
import { LinkuploadComponent } from './manage/linkupload/linkupload.component';
import { UploadlinkComponent } from './uploadlink/uploadlink.component';
import { RegisassetComponent } from './register/regisasset/regisasset.component';
import { RegisisbuilingComponent } from './register/regisisbuiling/regisisbuiling.component';
import { RegisterprojectComponent } from './register/registerproject/registerproject.component';
import { ReportplanassetComponent } from './report/reportplanasset/reportplanasset.component';
import { ReportplanbuildingComponent } from './report/reportplanbuilding/reportplanbuilding.component';
import { ReportsplanassetComponent } from './report/reportsplanasset/reportsplanasset.component';
import { ReportsplanbuildingComponent } from './report/reportsplanbuilding/reportsplanbuilding.component';
import { ApprovefacassetComponent } from './approvefac/approvefacasset/approvefacasset.component';
import { ApprovefacassetpComponent } from './approvefac/approvefacassetp/approvefacassetp.component';
import { ApprovefacbuildingComponent } from './approvefac/approvefacbuilding/approvefacbuilding.component';
import { ApprovefacprojectComponent } from './approvefac/approvefacproject/approvefacproject.component';
import { DeliverassetComponent } from './deliver/deliverasset/deliverasset.component';
import { DeliverassetpComponent } from './deliver/deliverassetp/deliverassetp.component';
import { DeliverbuildingComponent } from './deliver/deliverbuilding/deliverbuilding.component';
import { DeliverprojectComponent } from './deliver/deliverproject/deliverproject.component';
import { ReportplanprojectComponent } from './report/reportplanproject/reportplanproject.component';
import { ReportsplanprojectComponent } from './report/reportsplanproject/reportsplanproject.component';
import { ReportsplanassetpComponent } from './report/reportsplanassetp/reportsplanassetp.component';
import { ItdashboardComponent } from './itdashboard/itdashboard.component';
import { TurnoffComponent } from './manage/turnoff/turnoff.component';
import { AuthGuard } from '../../_services/auth.guard';


const routes: Routes = [
  { path: '', component: InvestmentComponent , children : [
    { path: '', component: ItdashboardComponent, canActivate: [AuthGuard] },
    { path: 'listasset', component : ListassetComponent , canActivate: [AuthGuard]},
    { path: 'listassetp', component : ListassetpComponent , canActivate: [AuthGuard]},
    { path: 'listbuilding', component : ListbuildingComponent , canActivate: [AuthGuard]},
    { path: 'listproject', component : ListprojectComponent , canActivate: [AuthGuard]},
    { path: 'approve_fasset', component : ApprovefacassetComponent , canActivate: [AuthGuard]},
    { path: 'approve_fassetp', component : ApprovefacassetpComponent , canActivate: [AuthGuard]},
    { path: 'approve_fbuilding', component : ApprovefacbuildingComponent , canActivate: [AuthGuard]},
    { path: 'approve_fproject', component : ApprovefacprojectComponent , canActivate: [AuthGuard]},
    { path: 'approve_asset', component : ApproveassetComponent , canActivate: [AuthGuard]},
    { path: 'approve_building', component : ApprovebuildingComponent , canActivate: [AuthGuard]},
    { path: 'approve_project', component : ApproveprojectComponent , canActivate: [AuthGuard]},
    { path: 'report_asset', component : ReportassetComponent , canActivate: [AuthGuard]},
    { path: 'report_building', component : ReportbuildingComponent , canActivate: [AuthGuard]},
    { path: 'report_project', component : ReportprojectComponent , canActivate: [AuthGuard]},
    { path: 'unit', component : UnitComponent , canActivate: [AuthGuard]},
    { path: 'year', component : YearComponent , canActivate: [AuthGuard]},
    { path: 'product', component : ProductComponent , canActivate: [AuthGuard]},
    { path: 'link', component : LinkuploadComponent , canActivate: [AuthGuard]},
    { path: 'linkupload', component : UploadlinkComponent , canActivate: [AuthGuard]},
    { path: 'regis_asset', component : RegisassetComponent , canActivate: [AuthGuard]},
    { path: 'regis_building', component : RegisisbuilingComponent , canActivate: [AuthGuard]},
    { path: 'regis_project', component : RegisterprojectComponent , canActivate: [AuthGuard]},
    { path: 'report_planasset', component : ReportplanassetComponent , canActivate: [AuthGuard]},
    { path: 'report_planbuilding', component : ReportplanbuildingComponent , canActivate: [AuthGuard]},
    { path: 'report_planproject', component : ReportplanprojectComponent , canActivate: [AuthGuard]},
    { path: 'report_splanasset', component : ReportsplanassetComponent , canActivate: [AuthGuard]},
    { path: 'report_splanassetp', component : ReportsplanassetpComponent , canActivate: [AuthGuard]},
    { path: 'report_splanbuilding', component : ReportsplanbuildingComponent , canActivate: [AuthGuard]},
    { path: 'report_splanproject', component : ReportsplanprojectComponent , canActivate: [AuthGuard]},
    { path: 'deliver_asset', component : DeliverassetComponent , canActivate: [AuthGuard]},
    { path: 'deliver_assetp', component : DeliverassetpComponent , canActivate: [AuthGuard]},
    { path: 'deliver_building', component : DeliverbuildingComponent , canActivate: [AuthGuard]},
    { path: 'deliver_project', component : DeliverprojectComponent , canActivate: [AuthGuard]},    
    { path: 'turnoff', component : TurnoffComponent , canActivate: [AuthGuard]},  

        { path: '**', redirectTo: '' }
  ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvestmentRoutingModule { }