import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListassetComponent } from './listasset/listasset.component';
import { InvestmentComponent } from './investment.component';
import { InvestmentRoutingModule } from './investment-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ListbuildingComponent } from './listbuilding/listbuilding.component';
import { ApproveassetComponent } from './approve/approveasset/approveasset.component';
import { ApprovebuildingComponent } from './approve/approvebuilding/approvebuilding.component';
import { HttpClientModule} from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AutocompleteLibModule} from 'angular-ng-autocomplete';
import { NgxEditorModule } from 'ngx-editor';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ListprojectComponent } from './listproject/listproject.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
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
import { ApprovefacbuildingComponent } from './approvefac/approvefacbuilding/approvefacbuilding.component';
import { ApprovefacprojectComponent } from './approvefac/approvefacproject/approvefacproject.component';
import { DeliverassetComponent } from './deliver/deliverasset/deliverasset.component';
import { DeliverbuildingComponent } from './deliver/deliverbuilding/deliverbuilding.component';
import { DeliverprojectComponent } from './deliver/deliverproject/deliverproject.component';
import { ReportplanprojectComponent } from './report/reportplanproject/reportplanproject.component';
import { ReportsplanprojectComponent } from './report/reportsplanproject/reportsplanproject.component';
import { TurnoffComponent } from './manage/turnoff/turnoff.component';
import { ListassetpComponent } from './listassetp/listassetp.component';
import { ApprovefacassetpComponent } from './approvefac/approvefacassetp/approvefacassetp.component';
import { DeliverassetpComponent } from './deliver/deliverassetp/deliverassetp.component';
import { ReportsplanassetpComponent } from './report/reportsplanassetp/reportsplanassetp.component';
import { ItdashboardComponent } from './itdashboard/itdashboard.component';

@NgModule({
  declarations: [
    InvestmentComponent
    ,ListassetComponent
    ,ListbuildingComponent
    ,ApproveassetComponent
    ,ApprovebuildingComponent, ListprojectComponent, ApproveprojectComponent, ReportassetComponent, ReportbuildingComponent, ReportprojectComponent, UnitComponent, YearComponent, ProductComponent, LinkuploadComponent, UploadlinkComponent, RegisassetComponent, RegisisbuilingComponent, RegisterprojectComponent, ReportplanassetComponent, ReportplanbuildingComponent, ReportsplanassetComponent, ReportsplanbuildingComponent, ApprovefacassetComponent, ApprovefacbuildingComponent, ApprovefacprojectComponent, DeliverassetComponent, DeliverbuildingComponent, DeliverprojectComponent, ReportplanprojectComponent, ReportsplanprojectComponent, TurnoffComponent, ListassetpComponent, ApprovefacassetpComponent, DeliverassetpComponent, ReportsplanassetpComponent, ItdashboardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    InvestmentRoutingModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    HttpClientModule,
    AngularEditorModule,
    AutocompleteLibModule,
    NgxEditorModule,
    CKEditorModule,
    BsDatepickerModule
  ]
})
export class InvestmentModule { }
