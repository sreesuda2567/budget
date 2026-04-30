import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { AgRoutingModule } from './ag-routing.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AutocompleteLibModule} from 'angular-ng-autocomplete';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { HomeComponent } from './home/home.component';
import { Useracc3dComponent } from './user/useracc3d/useracc3d.component';
import { LicenseComponent } from './user/license/license.component';
import { CampusComponent } from './main/campus/campus.component';
import { UniversityComponent } from './main/university/university.component';
import { FacultyComponent } from './main/faculty/faculty.component';
import { PrefixComponent } from './main/prefix/prefix.component';
import { TypefacComponent } from './main/typefac/typefac.component';
import { DepartmentComponent } from './main/department/department.component';
import { SectionComponent } from './main/section/section.component';
import { StatusprogramComponent } from './user/statusprogram/statusprogram.component';
import { SystemComponent } from './user/system/system.component';
import { AgsignatureComponent } from './manage/agsignature/agsignature.component';
import { ForemanComponent } from './manage/foreman/foreman.component';


@NgModule({
  declarations: [
    HomeComponent,
    Useracc3dComponent,
    LicenseComponent,
    CampusComponent,
    UniversityComponent,
    FacultyComponent,
    PrefixComponent,
    TypefacComponent,
    DepartmentComponent,
    SectionComponent,
    StatusprogramComponent,
    SystemComponent,
    AgsignatureComponent,
    ForemanComponent
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    AgRoutingModule,
    HttpClientModule,
    AngularEditorModule,
    AutocompleteLibModule,
    BsDatepickerModule,
    Ng2SearchPipeModule,
    NgxPaginationModule
  ]
})
export class AgModule { }
