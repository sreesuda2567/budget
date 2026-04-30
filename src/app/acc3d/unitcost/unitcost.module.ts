import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { UnitcostRoutingModule } from './unitcost-routing.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AutocompleteLibModule} from 'angular-ng-autocomplete';
import { UnitcostComponent } from './unitcost.component';
import { ExactivityComponent } from './exactivity/exactivity.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { UexpensesComponent } from './uexpenses/uexpenses.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ReportledgerComponent } from './budget/reportledger/reportledger.component';
import { DekamonthComponent } from './budget/dekamonth/dekamonth.component';
import { Reportrm4Component } from './budget/reportrm4/reportrm4.component';
import { ReportsubmoneyaccComponent } from './budget/reportsubmoneyacc/reportsubmoneyacc.component';
import { ApproveaccComponent } from './budget/approveacc/approveacc.component';
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


@NgModule({
  declarations: [
    UnitcostComponent,
    ExactivityComponent,
    UexpensesComponent,
    ReportledgerComponent,
    DekamonthComponent,
    Reportrm4Component,
    ReportsubmoneyaccComponent,
    ApproveaccComponent,
    Reportrm1Component,
    PaymentdateComponent,
    RegiscontrolComponent,
    AccupdateComponent,
    DailyincomeComponent,
    ApppaydateComponent,
    FregiscontrolComponent,
    DepositdateComponent,
    PaymentdirecComponent,
    PlexpensesComponent,
    AllocateaccComponent,
    ReportdayappComponent,
    ReportdaycheckComponent,
    ReportdaycorrectComponent,
    FpaymentdateComponent
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    UnitcostRoutingModule,
    HttpClientModule,
    AngularEditorModule,
    AutocompleteLibModule,
    BsDatepickerModule,
    Ng2SearchPipeModule,
    NgxPaginationModule
  ]
})
export class UnitcostModule { }
