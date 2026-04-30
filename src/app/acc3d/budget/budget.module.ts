import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShowexpensesComponent } from './expenses/showexpenses/showexpenses.component';
import { ListincomeComponent } from './income/listincome/listincome.component';
import { ListincometfComponent } from './income/listincometf/listincometf.component';
import { ListexpensesComponent } from './expenses/listexpenses/listexpenses.component';
import { CreditorComponent } from './expenses/creditor/creditor.component';
import { MiddleComponent } from './expenses/middle/middle.component';
import { ApproveExpensesComponent } from './approve/approve-expenses/approve-expenses.component';
import { ApprovepoComponent } from './approve/approvepo/approvepo.component';
import { ApprovebindingComponent } from './approve/approvebinding/approvebinding.component';
import { ApprovepayComponent } from './approve/approvepay/approvepay.component';
import { ApprovemiddleComponent } from './approve/approvemiddle/approvemiddle.component';
import { ApproveponewsComponent } from './approve/approveponews/approveponews.component';
import { SalaryComponent } from './approve/salary/salary.component';
import { FpaymentdateComponent } from './approve/fpaymentdate/fpaymentdate.component';
import { DailyComponent } from './approve/daily/daily.component';
import { ListgfComponent } from './manage/listgf/listgf.component';
import { Listrm4Component } from './manage/listrm4/listrm4.component';
import { RevenueComponent } from './manage/revenue/revenue.component';
import { SavemoneyComponent } from './manage/savemoney/savemoney.component';
import { DifferencegfComponent } from './report/differencegf/differencegf.component';
import { DifferencermComponent } from './report/differencerm/differencerm.component';
import { ReportsubmoneyComponent } from './report/reportsubmoney/reportsubmoney.component';
import { ReportsubmoneyaccComponent } from './report/reportsubmoneyacc/reportsubmoneyacc.component';
import { ControlregisComponent } from './report/controlregis/controlregis.component';
import { ReportassetComponent } from './report/reportasset/reportasset.component';
import { ReportfexpensesComponent } from './report/reportfexpenses/reportfexpenses.component';
import { ReportincomeComponent } from './report/reportincome/reportincome.component';
import { ReporaccComponent } from './report/reporacc/reporacc.component';
import { ReporttrainComponent } from './report/reporttrain/reporttrain.component';
import { ReportlaComponent } from './report/reportla/reportla.component';
import { ReportprojectComponent } from './report/reportproject/reportproject.component';
import { ReportcincomeComponent } from './report/reportcincome/reportcincome.component';
import { ReportpurchaseComponent } from './report/reportpurchase/reportpurchase.component';
import { ReportyexpensesComponent } from './report/reportyexpenses/reportyexpenses.component';
import { FollowprojectComponent } from './follow/followproject/followproject.component';
import { FollwassetComponent } from './follow/follwasset/follwasset.component';
import { InsprojectComponent } from './approve/insproject/insproject.component';
import { MallocateComponent } from './approve/mallocate/mallocate.component';
import { ProjectmoreComponent } from './approve/projectmore/projectmore.component';
import { PodayComponent } from './approve/poday/poday.component';

import { BudgetComponent } from './budget.component';
import { BudgetRountingModule } from './budget-rounting.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AutocompleteLibModule} from 'angular-ng-autocomplete';
@NgModule({
  declarations: [
    BudgetComponent,
    ShowexpensesComponent,
    ListexpensesComponent,
    ListincomeComponent,
    ListincometfComponent,
    CreditorComponent,
    MiddleComponent,
    ApproveExpensesComponent,
    ApprovepoComponent,
    ApprovebindingComponent,
    ApprovepayComponent,
    ApprovemiddleComponent,
    FollowprojectComponent,
    FollwassetComponent,
    ListgfComponent,
    Listrm4Component,
    DifferencegfComponent,
    DifferencermComponent,
    ReportsubmoneyComponent,
    ReportsubmoneyaccComponent,
    ReportassetComponent,
    ReportincomeComponent,
    ReportfexpensesComponent,
    ReportpurchaseComponent,
    DailyComponent,
    SalaryComponent,
    RevenueComponent,
    FpaymentdateComponent,
    ApproveponewsComponent,
    SavemoneyComponent,
    ControlregisComponent,
    ReporaccComponent,
    InsprojectComponent,
    MallocateComponent,
    ReporttrainComponent,
    ReportlaComponent,
    ReportprojectComponent,
    ReportcincomeComponent,
    ReportyexpensesComponent,
    ProjectmoreComponent,
    PodayComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BudgetRountingModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    BsDatepickerModule,
    AutocompleteLibModule,
    
  ]
})
export class BudgetModule { }
