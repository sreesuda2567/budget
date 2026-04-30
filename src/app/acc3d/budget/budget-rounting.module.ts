import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BudgetComponent } from './budget.component';
import { ListincomeComponent } from './income/listincome/listincome.component';
import { ListincometfComponent } from './income/listincometf/listincometf.component';
import { ShowexpensesComponent } from './expenses/showexpenses/showexpenses.component';
import { ListexpensesComponent } from './expenses/listexpenses/listexpenses.component';
import { CreditorComponent } from './expenses/creditor/creditor.component';
import { MiddleComponent } from './expenses/middle/middle.component';
import { ApproveExpensesComponent } from './approve/approve-expenses/approve-expenses.component';
import { ApprovepoComponent } from './approve/approvepo/approvepo.component';
import { ApprovebindingComponent } from './approve/approvebinding/approvebinding.component';
import { ApprovepayComponent } from './approve/approvepay/approvepay.component';
import { FollowprojectComponent } from './follow/followproject/followproject.component';
import { FollwassetComponent } from './follow/follwasset/follwasset.component';
import { ListgfComponent } from './manage/listgf/listgf.component';
import { Listrm4Component } from './manage/listrm4/listrm4.component';
import { RevenueComponent } from './manage/revenue/revenue.component';
import { DifferencegfComponent } from './report/differencegf/differencegf.component';
import { DifferencermComponent } from './report/differencerm/differencerm.component';
import { ReportsubmoneyComponent } from './report/reportsubmoney/reportsubmoney.component';
import { ReportsubmoneyaccComponent } from './report/reportsubmoneyacc/reportsubmoneyacc.component';
import { ReportincomeComponent } from './report/reportincome/reportincome.component';
import { ReportassetComponent } from './report/reportasset/reportasset.component';
import { ReportfexpensesComponent } from './report/reportfexpenses/reportfexpenses.component';
import { ReporaccComponent } from './report/reporacc/reporacc.component';
import { DailyComponent } from './approve/daily/daily.component';
import { AuthGuard } from '../../_services/auth.guard';
import { SalaryComponent } from './approve/salary/salary.component';
import { FpaymentdateComponent } from './approve/fpaymentdate/fpaymentdate.component';
import { ApproveponewsComponent } from './approve/approveponews/approveponews.component';
import { SavemoneyComponent } from './manage/savemoney/savemoney.component';
import { ControlregisComponent } from './report/controlregis/controlregis.component';
import { InsprojectComponent } from './approve/insproject/insproject.component';
import { MallocateComponent } from './approve/mallocate/mallocate.component';
import { ReporttrainComponent } from './report/reporttrain/reporttrain.component';
import { ReportlaComponent } from './report/reportla/reportla.component';
import { ReportprojectComponent } from './report/reportproject/reportproject.component';
import { ReportpurchaseComponent } from './report/reportpurchase/reportpurchase.component';
import { ReportyexpensesComponent } from './report/reportyexpenses/reportyexpenses.component';
import { ProjectmoreComponent } from './approve/projectmore/projectmore.component';

import { ReportcincomeComponent } from './report/reportcincome/reportcincome.component';
import { PodayComponent } from './approve/poday/poday.component';

const routes: Routes = [
  { path: '', component: BudgetComponent , children : [
    { path: 'income', component : ListincomeComponent , canActivate: [AuthGuard]},
    { path: 'incometf', component : ListincometfComponent , canActivate: [AuthGuard]},
    { path: 'showexpenses', component : ShowexpensesComponent , canActivate: [AuthGuard]},
    { path: 'listexpenses', component : ListexpensesComponent , canActivate: [AuthGuard]},
    { path: 'creditor', component : CreditorComponent , canActivate: [AuthGuard]},
    { path: 'middle', component : MiddleComponent , canActivate: [AuthGuard]},
    { path: 'approve_expenses', component : ApproveExpensesComponent , canActivate: [AuthGuard]},
    { path: 'approve_po', component : ApproveponewsComponent , canActivate: [AuthGuard]},
    { path: 'approve_binding', component : ApprovebindingComponent , canActivate: [AuthGuard]},
    { path: 'approve_pay', component : ApprovepayComponent , canActivate: [AuthGuard]},
    { path: 'daily', component : DailyComponent , canActivate: [AuthGuard]},
    { path: 'follow_project', component : FollowprojectComponent , canActivate: [AuthGuard]},
    { path: 'follow_asset', component : FollwassetComponent , canActivate: [AuthGuard]},
    { path: 'manage_gf', component : ListgfComponent , canActivate: [AuthGuard]},
    { path: 'manage_rm', component : Listrm4Component , canActivate: [AuthGuard]},
    { path: 'manage_revenue', component : RevenueComponent , canActivate: [AuthGuard]},
    { path: 'difference_gf', component : DifferencegfComponent , canActivate: [AuthGuard]},
    { path: 'difference_rm', component : DifferencermComponent , canActivate: [AuthGuard]},
    { path: 'report_submoney', component : ReportsubmoneyComponent , canActivate: [AuthGuard]},
    { path: 'report_income', component : ReportincomeComponent , canActivate: [AuthGuard]},
    { path: 'report_cincome', component : ReportcincomeComponent , canActivate: [AuthGuard]},
    { path: 'report_submoneyacc', component : ReportsubmoneyaccComponent , canActivate: [AuthGuard]},
    { path: 'report_asset', component : ReportassetComponent , canActivate: [AuthGuard]},  
    { path: 'report_fexpenses', component : ReportfexpensesComponent , canActivate: [AuthGuard]},  
    { path: 'report_acc', component : ReporaccComponent , canActivate: [AuthGuard]},
    { path: 'report_train', component : ReporttrainComponent , canActivate: [AuthGuard]},
    { path: 'report_la', component : ReportlaComponent , canActivate: [AuthGuard]},
    { path: 'report_project', component : ReportprojectComponent , canActivate: [AuthGuard]},
    { path: 'report_purchase', component : ReportpurchaseComponent , canActivate: [AuthGuard]},
    { path: 'report_yexpenses', component : ReportyexpensesComponent , canActivate: [AuthGuard]},
    { path: 'salary', component : SalaryComponent , canActivate: [AuthGuard]}, 
    { path: 'fpaymentdate', component : FpaymentdateComponent , canActivate: [AuthGuard]},
    { path: 'savemoney', component : SavemoneyComponent , canActivate: [AuthGuard]}, 
    { path: 'controlregis', component : ControlregisComponent , canActivate: [AuthGuard]},
    { path: 'insproject', component : InsprojectComponent , canActivate: [AuthGuard]},   
    { path: 'mallocate', component : MallocateComponent , canActivate: [AuthGuard]}, 
    { path: 'projectmore', component : ProjectmoreComponent , canActivate: [AuthGuard]},   
    { path: 'poday', component : PodayComponent , canActivate: [AuthGuard]},   
    { path: '**', redirectTo: '' }
  ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetRountingModule { }
