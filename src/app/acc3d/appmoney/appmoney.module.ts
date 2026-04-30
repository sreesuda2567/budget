import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { AutocompleteLibModule} from 'angular-ng-autocomplete';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AppmoneyRoutingModule } from './appmoney-routing.module';
import { HomeComponent } from './home/home.component';
import { ContractnumberComponent } from './annal/contractnumber/contractnumber.component';
import { WritecheckComponent } from './annal/writecheck/writecheck.component';
import { FinancecheckComponent } from './annal/financecheck/financecheck.component';
import { Writecheck1Component } from './annal/writecheck1/writecheck1.component';
import { Writecheck2Component } from './annal/writecheck2/writecheck2.component';
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
import { Load3dmComponent } from './other/load3dm/load3dm.component';
import { ReceiveotherComponent } from './other/receiveother/receiveother.component';
import { RqannalComponent } from './annal/rqannal/rqannal.component';
import { ReportdayappcComponent } from './report/reportdayappc/reportdayappc.component';
import { ReportamendComponent } from './report/reportamend/reportamend.component';


@NgModule({
  declarations: [
    HomeComponent,
    ContractnumberComponent,
    WritecheckComponent,
    FinancecheckComponent,
    Writecheck1Component,
    Writecheck2Component,
    ClearcheckComponent,
    DisbursementComponent,
    DisbursementappComponent,
    ReportannalComponent,
    ReportsignComponent,
    ContractotherComponent,
    Load3dComponent,
    Load3dfaceComponent,
    Load3dsignComponent,
    Load3dfsignComponent,
    LoaddktbComponent,
    KtbbunlockComponent,
    TransferannalComponent,
    ReportannalthComponent,
    ReportannalthsignComponent,
    ReportdayComponent,
    LoaddktbannalComponent,
    Load3dannalComponent,
    LoaddktbreportComponent,
    AnnalsendComponent,
    Load3dfaceanComponent,
    AnnalsendmComponent,
    ContractotherwComponent,
    ClearchecktComponent,
    AnnalrefundComponent,
    PaymentdateComponent,
    ReportdayeditComponent,
    SendotherComponent,
    CheckotherComponent,
    ReturnotherComponent,
    ScheckotherComponent,
    Load3dmComponent,
    ReceiveotherComponent,
    RqannalComponent,
    ReportdayappcComponent,
    ReportamendComponent
  ],
  imports: [
        CommonModule,
        FormsModule,
        AppmoneyRoutingModule,
        HttpClientModule,
        AutocompleteLibModule,
        BsDatepickerModule,
        Ng2SearchPipeModule,
        NgxPaginationModule
  ]
})
export class AppmoneyModule { }
