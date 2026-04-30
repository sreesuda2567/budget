import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { HttpClientModule} from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AutocompleteLibModule} from 'angular-ng-autocomplete';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AllocateRoutingModule } from './allocate-routing.module';
import { HomeComponent } from './home/home.component';
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
import { AllocateComponent } from './plan/allocate/allocate.component';



@NgModule({
  declarations: [
    HomeComponent,
    YearbudgetComponent,
    IncomeComponent,
    GrproductComponent,
    ProductComponent,
    MoneytypeComponent,
    PlmoneypayComponent,
    PlsubmoneypayComponent,
    TransferComponent,
    ProjectComponent,
    AssetComponent,
    PltrlyComponent,
    BudgetComponent,
    AllocateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AllocateRoutingModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    HttpClientModule,
    AngularEditorModule,
    AutocompleteLibModule,
    BsDatepickerModule
  ]
})
export class AllocateModule { }
