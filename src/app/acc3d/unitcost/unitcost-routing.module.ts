import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../_services/auth.guard';
import { UnitcostComponent } from './unitcost.component';
import { ExactivityComponent } from './exactivity/exactivity.component';
import { UexpensesComponent } from './uexpenses/uexpenses.component';
import { ReportsubmoneyaccComponent } from './budget/reportsubmoneyacc/reportsubmoneyacc.component';
import { ReportledgerComponent } from './budget/reportledger/reportledger.component';
import { DekamonthComponent } from './budget/dekamonth/dekamonth.component';
import { Reportrm4Component } from './budget/reportrm4/reportrm4.component';
import { ApproveaccComponent } from './budget/approveacc/approveacc.component';
import { Listrm4Component } from '../budget/manage/listrm4/listrm4.component';
import { Reportrm1Component } from './budget/reportrm1/reportrm1.component';
import { PaymentdateComponent } from './budget/paymentdate/paymentdate.component';
import { RegiscontrolComponent } from './budget/regiscontrol/regiscontrol.component';
import { AccupdateComponent } from './budget/accupdate/accupdate.component';
import { DailyincomeComponent } from './revenue/dailyincome/dailyincome.component';
import { ApppaydateComponent } from './budget/apppaydate/apppaydate.component';
import { FregiscontrolComponent } from './budget/fregiscontrol/fregiscontrol.component';
import { DepositdateComponent } from './budget/depositdate/depositdate.component';
import { PaymentdirecComponent } from './budget/paymentdirec/paymentdirec.component';
import { PlexpensesComponent } from './budget/plexpenses/plexpenses.component';
import { AllocateaccComponent } from './budget/allocateacc/allocateacc.component';
import { ReportdayappComponent } from './report/reportdayapp/reportdayapp.component';
import { ReportdaycheckComponent } from './report/reportdaycheck/reportdaycheck.component';
import { ReportdaycorrectComponent } from './report/reportdaycorrect/reportdaycorrect.component';
import { FpaymentdateComponent } from './budget/fpaymentdate/fpaymentdate.component';
const routes: Routes = [
    { path: '', component: UnitcostComponent , children : [
    { path: 'activity', component : ExactivityComponent , canActivate: [AuthGuard]},
    { path: 'uexpenses', component : UexpensesComponent , canActivate: [AuthGuard]},
    { path: 'budget_submoneyacc', component : ReportsubmoneyaccComponent , canActivate: [AuthGuard]},
    { path: 'budget_ledger', component : ReportledgerComponent , canActivate: [AuthGuard]},
    { path: 'budget_petition', component : DekamonthComponent , canActivate: [AuthGuard]},
    { path: 'budget_rm4', component : Reportrm4Component , canActivate: [AuthGuard]},
    { path: 'approveacc', component : ApproveaccComponent , canActivate: [AuthGuard]},
    { path: 'apppaydate', component : ApppaydateComponent , canActivate: [AuthGuard]},
    { path: 'manage_rm', component : Listrm4Component , canActivate: [AuthGuard]},
    { path: 'budget_rm1', component : Reportrm1Component , canActivate: [AuthGuard]},
    { path: 'paymentdate', component : PaymentdateComponent , canActivate: [AuthGuard]},
    { path: 'regiscontrol', component : RegiscontrolComponent , canActivate: [AuthGuard]},
    { path: 'fregiscontrol', component : FregiscontrolComponent , canActivate: [AuthGuard]},
    { path: 'accupdate', component : AccupdateComponent , canActivate: [AuthGuard]},
    { path: 'dailyincome', component : DailyincomeComponent , canActivate: [AuthGuard]},
    { path: 'depositdate', component : DepositdateComponent , canActivate: [AuthGuard]},
    { path: 'paymentdirec', component : PaymentdirecComponent , canActivate: [AuthGuard]},
    { path: 'plexpenses', component : PlexpensesComponent , canActivate: [AuthGuard]},
    { path: 'allocateacc', component : AllocateaccComponent , canActivate: [AuthGuard]},
    { path: 'reportdayapp', component : ReportdayappComponent , canActivate: [AuthGuard]},
    { path: 'reportdaycheck', component : ReportdaycheckComponent , canActivate: [AuthGuard]},
    { path: 'reportdaycorrect', component : ReportdaycorrectComponent , canActivate: [AuthGuard]},
    { path: 'fpaymentdate', component : FpaymentdateComponent , canActivate: [AuthGuard]},
    { path: '**', redirectTo: '' }
  ]
},
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnitcostRoutingModule { }
