import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { AuthGuard } from '../../_services/auth.guard';

const design = () => import('./design/design.module').then(x => x.DesignModule);
const routes: Routes = [
  { path: '', component: MenuComponent, canActivate: [AuthGuard] },
  { path: 'design', loadChildren: design, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuildingRoutingModule { }
