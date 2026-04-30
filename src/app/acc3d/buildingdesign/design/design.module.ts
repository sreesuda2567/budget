import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DesignRoutingModule } from './design-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { HttpClientModule} from '@angular/common/http';
import { MenudesignComponent } from './menudesign/menudesign.component';
import { BasicComponent } from './basic/basic.component';
import { AutocompleteLibModule} from 'angular-ng-autocomplete';
import { FormatComponent } from './format/format.component';
import { EstimatestructureComponent } from './estimatestructure/estimatestructure.component';
import { EstimateelectricityComponent } from './estimateelectricity/estimateelectricity.component';
import { OfferComponent } from './offer/offer.component';
import { FormatrComponent } from './formatr/formatr.component';
import { EstimatestructurerComponent } from './estimatestructurer/estimatestructurer.component';
import { EstimateelectricityrComponent } from './estimateelectricityr/estimateelectricityr.component';
import { OfferrComponent } from './offerr/offerr.component';
import { ApprovepComponent } from './approvep/approvep.component';
import { ApproverComponent } from './approver/approver.component';
@NgModule({
  declarations: [MenudesignComponent, BasicComponent, FormatComponent, EstimatestructureComponent, EstimateelectricityComponent, OfferComponent, FormatrComponent, EstimatestructurerComponent, EstimateelectricityrComponent, OfferrComponent, ApprovepComponent, ApproverComponent],
  imports: [
    CommonModule,
    FormsModule,
    DesignRoutingModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    HttpClientModule,
    BsDatepickerModule,
    AutocompleteLibModule
  ]
})
export class DesignModule { }
