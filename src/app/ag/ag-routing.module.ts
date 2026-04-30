import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../_services/auth.guard';
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

const routes: Routes = [
  { path: '', component:HomeComponent , children : [
    { path: 'useracc3d', component: Useracc3dComponent, canActivate: [AuthGuard] },
    { path: 'license', component: LicenseComponent, canActivate: [AuthGuard] },
    { path: 'campus', component: CampusComponent, canActivate: [AuthGuard] },
    { path: 'university', component: UniversityComponent, canActivate: [AuthGuard] },
    { path: 'faculty', component: FacultyComponent, canActivate: [AuthGuard] },
    { path: 'prefix', component: PrefixComponent, canActivate: [AuthGuard] },
    { path: 'typefac', component: TypefacComponent, canActivate: [AuthGuard] },
    { path: 'department', component: DepartmentComponent, canActivate: [AuthGuard] },
    { path: 'section', component: SectionComponent, canActivate: [AuthGuard] },
    { path: 'statusprogram', component: StatusprogramComponent, canActivate: [AuthGuard] },
    { path: 'system', component: SystemComponent, canActivate: [AuthGuard] },
    { path: 'agsignature', component: AgsignatureComponent, canActivate: [AuthGuard] },
    { path: 'foreman', component: ForemanComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgRoutingModule { }
