import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../_services/auth.guard';
import { HomeComponent } from './home/home.component';
import { ListincomeComponent } from '../budget/income/listincome/listincome.component';
import { ListincometfComponent } from '../budget/income/listincometf/listincometf.component';
import { ReportfexpensesComponent } from '../budget/report/reportfexpenses/reportfexpenses.component';
import { ReportassetComponent } from '../budget/report/reportasset/reportasset.component';
import { YearbudgetComponent } from './prepare/yearbudget/yearbudget.component';
import { IncomeComponent } from './prepare/income/income.component';
import { GrproductComponent } from './prepare/grproduct/grproduct.component';
import { ProductComponent } from './prepare/product/product.component';
import { MoneytypeComponent } from './prepare/moneytype/moneytype.component';
import { PlmoneypayComponent } from './prepare/plmoneypay/plmoneypay.component';
import { PlsubmoneypayComponent } from './prepare/plsubmoneypay/plsubmoneypay.component';
import { TransferComponent } from './manage/transfer/transfer.component';
import { ProjectComponent } from './manage/project/project.component';
import { AssetComponent } from './manage/asset/asset.component';
import { PltrlyComponent } from './plan/pltrly/pltrly.component';
import { BudgetComponent } from './plan/budget/budget.component';
import { ApprovemiddleComponent } from '../budget/approve/approvemiddle/approvemiddle.component';
import { AllocateComponent } from './plan/allocate/allocate.component';
import { ReportprojectComponent } from '../budget/report/reportproject/reportproject.component';
import { ReportcincomeComponent } from '../budget/report/reportcincome/reportcincome.component';

const routes: Routes = [
  { path: '', component: HomeComponent , children : [
  { path: 'income', component : ListincomeComponent , canActivate: [AuthGuard]},
  { path: 'incometf', component : ListincometfComponent , canActivate: [AuthGuard]},
  { path: 'report_asset', component : ReportassetComponent , canActivate: [AuthGuard]},
  { path: 'report_fexpenses', component : ReportfexpensesComponent , canActivate: [AuthGuard]},
  { path: 'report_project', component : ReportprojectComponent , canActivate: [AuthGuard]},
  { path: 'report_cincome', component : ReportcincomeComponent , canActivate: [AuthGuard]},
  { path: 'yearbudget', component : YearbudgetComponent , canActivate: [AuthGuard]},
  { path: 'pincome', component : IncomeComponent , canActivate: [AuthGuard]},
  { path: 'grproduct', component : GrproductComponent , canActivate: [AuthGuard]},
  { path: 'product', component : ProductComponent , canActivate: [AuthGuard]},
  { path: 'moneytype', component : MoneytypeComponent , canActivate: [AuthGuard]},
  { path: 'plmoneypay', component : PlmoneypayComponent , canActivate: [AuthGuard]},
  { path: 'plsubmoneypay', component : PlsubmoneypayComponent , canActivate: [AuthGuard]},
  { path: 'transfer', component : TransferComponent , canActivate: [AuthGuard]},
  { path: 'project', component : ProjectComponent , canActivate: [AuthGuard]},
  { path: 'asset', component : AssetComponent , canActivate: [AuthGuard]},
  { path: 'pltrly', component : PltrlyComponent , canActivate: [AuthGuard]},
  { path: 'plsubmoneypay', component : BudgetComponent , canActivate: [AuthGuard]},
  { path: 'approve_middle', component : ApprovemiddleComponent , canActivate: [AuthGuard]}, 
  { path: 'allocate', component : AllocateComponent , canActivate: [AuthGuard]},  
        { path: '**', redirectTo: '' }
  ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllocateRoutingModule { }
