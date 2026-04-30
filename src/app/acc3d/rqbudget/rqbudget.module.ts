import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { RqbudgetRoutingModule } from './rqbudget-routing.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AutocompleteLibModule} from 'angular-ng-autocomplete';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MenuComponent } from './menu/menu.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { RqtassetComponent } from './budget/rqtasset/rqtasset.component';
import { RqtbuildingComponent } from './budget/rqtbuilding/rqtbuilding.component';
import { RqtprojectComponent } from './budget/rqtproject/rqtproject.component';
import { SmassetComponent } from './submit/smasset/smasset.component';
import { SmbuildingComponent } from './submit/smbuilding/smbuilding.component';
import { SmprojectComponent } from './submit/smproject/smproject.component';
import { ReportrqassetComponent } from './report/reportrqasset/reportrqasset.component';
import { ReportrqbuildingComponent } from './report/reportrqbuilding/reportrqbuilding.component';
import { ReportrqprojectComponent } from './report/reportrqproject/reportrqproject.component';
import { AppassetComponent } from './approve/appasset/appasset.component';
import { AppbuildingComponent } from './approve/appbuilding/appbuilding.component';
import { AppprojectComponent } from './approve/appproject/appproject.component';
import { RqtassetpComponent } from './budget/rqtassetp/rqtassetp.component';



@NgModule({
  declarations: [MenuComponent, RqtassetComponent, RqtbuildingComponent, RqtprojectComponent, SmassetComponent, SmbuildingComponent, SmprojectComponent, ReportrqassetComponent, ReportrqbuildingComponent, ReportrqprojectComponent, AppassetComponent, AppbuildingComponent, AppprojectComponent, RqtassetpComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    AngularEditorModule,
    AutocompleteLibModule,
    BsDatepickerModule,
    Ng2SearchPipeModule,
    NgxPaginationModule,
    RqbudgetRoutingModule,
    CKEditorModule
  ]
})
export class RqbudgetModule { }
