import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { AutocompleteLibModule} from 'angular-ng-autocomplete';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { WelfareRoutingModule } from './welfare-routing.module';
import { MenuwelfareComponent } from './menuwelfare/menuwelfare.component';
import { EpmedicalControlComponent } from './report/epmedical-control/epmedical-control.component';
import { EpschoolControlComponent } from './report/epschool-control/epschool-control.component';
import { MemberretireComponent } from './manage/memberretire/memberretire.component';
import { EpmedicalretireComponent } from './manage/epmedicalretire/epmedicalretire.component';
import { EpschoolLoadComponent } from './load/epschool-load/epschool-load.component';
import { EpmedicalLoadComponent } from './load/epmedical-load/epmedical-load.component';
import { EpschoolretireComponent } from './manage/epschoolretire/epschoolretire.component';
import { AppepschoolComponent } from './load/appepschool/appepschool.component';
import { AppepmedicalComponent } from './load/appepmedical/appepmedical.component';
import { LoadwfComponent } from './load/loadwf/loadwf.component';
import { LoadwComponent } from './load/loadw/loadw.component';
import { WfdashboardComponent } from './load/wfdashboard/wfdashboard.component';
import { IncomepmedicalComponent } from './load/incomepmedical/incomepmedical.component';
import { IncomepschoolComponent } from './load/incomepschool/incomepschool.component';
import { EpmedicalSummonthComponent } from './report/epmedical-summonth/epmedical-summonth.component';
import { EpschoolSummonthComponent } from './report/epschool-summonth/epschool-summonth.component';
@NgModule({
  declarations: [MenuwelfareComponent, EpmedicalControlComponent, EpschoolControlComponent, MemberretireComponent, EpmedicalretireComponent, EpschoolLoadComponent, EpmedicalLoadComponent, EpschoolretireComponent, AppepschoolComponent, AppepmedicalComponent, LoadwfComponent, LoadwComponent, WfdashboardComponent, IncomepmedicalComponent, IncomepschoolComponent, EpmedicalSummonthComponent, EpschoolSummonthComponent],
  imports: [
    CommonModule,
    FormsModule,
    WelfareRoutingModule,
    HttpClientModule,
    AutocompleteLibModule,
    BsDatepickerModule,
    Ng2SearchPipeModule,
    NgxPaginationModule
  ]
})
export class WelfareModule { }
