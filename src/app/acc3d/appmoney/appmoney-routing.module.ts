import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../_services/auth.guard';
import { HomeComponent } from './home/home.component';
import { ContractnumberComponent } from './annal/contractnumber/contractnumber.component';
import { WritecheckComponent } from './annal/writecheck/writecheck.component';
import { FinancecheckComponent } from './annal/financecheck/financecheck.component';
import { Writecheck1Component } from './annal/writecheck1/writecheck1.component';
import { ClearcheckComponent } from './annal/clearcheck/clearcheck.component';
import { DisbursementComponent } from './check/disbursement/disbursement.component';
import { DisbursementappComponent } from './annal/disbursementapp/disbursementapp.component';
import { ReportannalComponent } from './report/reportannal/reportannal.component';
import { ReportsignComponent } from './report/reportsign/reportsign.component';
import { ContractotherComponent } from './other/contractother/contractother.component';
import { Load3dComponent } from './other/load3d/load3d.component';
import { Load3dfaceComponent } from './other/load3dface/load3dface.component';
import { Load3dsignComponent } from './other/load3dsign/load3dsign.component';
import { Load3dfsignComponent } from './other/load3dfsign/load3dfsign.component';
import { LoaddktbComponent } from './other/loaddktb/loaddktb.component';
import { KtbbunlockComponent } from './other/ktbbunlock/ktbbunlock.component';
import { TransferannalComponent } from './annal/transferannal/transferannal.component';
import { ReportannalthComponent } from './report/reportannalth/reportannalth.component';
import { ReportannalthsignComponent } from './report/reportannalthsign/reportannalthsign.component';
import { ReportdayComponent } from './report/reportday/reportday.component';
import { LoaddktbannalComponent } from './other/loaddktbannal/loaddktbannal.component';
import { Load3dannalComponent } from './other/load3dannal/load3dannal.component';
import { LoaddktbreportComponent } from './other/loaddktbreport/loaddktbreport.component';
import { AnnalsendComponent } from './annal/annalsend/annalsend.component';
import { Load3dfaceanComponent } from './other/load3dfacean/load3dfacean.component';
import { AnnalsendmComponent } from './annal/annalsendm/annalsendm.component';
import { ContractotherwComponent } from './other/contractotherw/contractotherw.component';
import { ClearchecktComponent } from './other/clearcheckt/clearcheckt.component';
import { AnnalrefundComponent } from './annal/annalrefund/annalrefund.component';
import { PaymentdateComponent } from './other/paymentdate/paymentdate.component';
import { ReportdayeditComponent } from './report/reportdayedit/reportdayedit.component';
import { SendotherComponent } from './other/sendother/sendother.component';
import { CheckotherComponent } from './other/checkother/checkother.component';
import { ReturnotherComponent } from './other/returnother/returnother.component';
import { ScheckotherComponent } from './other/scheckother/scheckother.component';
import { Writecheck2Component } from './annal/writecheck2/writecheck2.component';
import { Load3dmComponent } from './other/load3dm/load3dm.component';
import { ReceiveotherComponent } from './other/receiveother/receiveother.component';
import { RqannalComponent } from './annal/rqannal/rqannal.component';
import { ReportdayappcComponent } from './report/reportdayappc/reportdayappc.component';
import { ReportamendComponent } from './report/reportamend/reportamend.component';

const routes: Routes = [
  { path: '', component: HomeComponent , children : [
    { path: 'contractnumber', component : ContractnumberComponent , canActivate: [AuthGuard]},
    { path: 'transferannal', component : TransferannalComponent , canActivate: [AuthGuard]},
    { path: 'offercheck', component : WritecheckComponent , canActivate: [AuthGuard]},
    { path: 'writecheck1', component : Writecheck1Component , canActivate: [AuthGuard]},
    { path: 'clearcheck', component : ClearcheckComponent , canActivate: [AuthGuard]},
    { path: 'disbursement', component : DisbursementComponent , canActivate: [AuthGuard]},
    { path: 'disbursementapp', component : DisbursementappComponent , canActivate: [AuthGuard]},
    { path: 'financecheck', component : FinancecheckComponent , canActivate: [AuthGuard]},
    { path: 'reportannal', component : ReportannalComponent , canActivate: [AuthGuard]},
    { path: 'reportsign', component : ReportsignComponent , canActivate: [AuthGuard]},
    { path: 'contractother', component : ContractotherComponent , canActivate: [AuthGuard]},
    { path: 'load3d', component : Load3dComponent , canActivate: [AuthGuard]},
    { path: 'load3df', component : Load3dfaceComponent , canActivate: [AuthGuard]},
    { path: 'load3dsign', component : Load3dsignComponent , canActivate: [AuthGuard]},
    { path: 'load3dfsign', component : Load3dfsignComponent , canActivate: [AuthGuard]},
    { path: 'loaddktb', component : LoaddktbComponent , canActivate: [AuthGuard]},
    { path: 'ktbbunlock', component : KtbbunlockComponent , canActivate: [AuthGuard]},
    { path: 'reportannalth', component : ReportannalthComponent , canActivate: [AuthGuard]},
    { path: 'reportannalthsign', component : ReportannalthsignComponent , canActivate: [AuthGuard]},
     { path: 'reportday', component : ReportdayComponent , canActivate: [AuthGuard]},
    { path: 'loaddktbannal', component : LoaddktbannalComponent , canActivate: [AuthGuard]},
    { path: 'load3dannal', component : Load3dannalComponent , canActivate: [AuthGuard]},
    { path: 'loaddktbreport', component : LoaddktbreportComponent , canActivate: [AuthGuard]},
    { path: 'annalsend', component : AnnalsendComponent , canActivate: [AuthGuard]},
    { path: 'load3dfacean', component : Load3dfaceanComponent , canActivate: [AuthGuard]},
    { path: 'annalsendm', component : AnnalsendmComponent , canActivate: [AuthGuard]},
    { path: 'contractotherw', component : ContractotherwComponent , canActivate: [AuthGuard]},
    { path: 'clearother', component : ClearchecktComponent , canActivate: [AuthGuard]},
    { path: 'annalrefund', component : AnnalrefundComponent , canActivate: [AuthGuard]},
    { path: 'paymentdate', component : PaymentdateComponent , canActivate: [AuthGuard]},
    { path: 'reportdayedit', component : ReportdayeditComponent , canActivate: [AuthGuard]},
    { path: 'sendother', component : SendotherComponent , canActivate: [AuthGuard]},
    { path: 'checkother', component : CheckotherComponent , canActivate: [AuthGuard]},
    { path: 'returnother', component : ReturnotherComponent , canActivate: [AuthGuard]},
    { path: 'scheckother', component : ScheckotherComponent , canActivate: [AuthGuard]},
    { path: 'writecheck', component : Writecheck2Component , canActivate: [AuthGuard]},
    { path: 'load3dm', component : Load3dmComponent , canActivate: [AuthGuard]},
    { path: 'receiveother', component : ReceiveotherComponent , canActivate: [AuthGuard]},
    { path: 'rqannal', component : RqannalComponent , canActivate: [AuthGuard]},
    { path: 'reportdayapp', component : ReportdayappcComponent , canActivate: [AuthGuard]},
    { path: 'reportamend', component : ReportamendComponent , canActivate: [AuthGuard]},
    
    
    { path: '**', redirectTo: '' }
]
},
];
@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class AppmoneyRoutingModule { }




