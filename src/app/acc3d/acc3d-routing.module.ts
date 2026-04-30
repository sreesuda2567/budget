import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { AuthGuard } from '../_services/auth.guard';

//import { InvestmentComponent } from './investment/investment.component';
const inversModule = () => import('./investment/investment.module').then(x => x.InvestmentModule);
const budgetModule = () => import('./budget/budget.module').then(x => x.BudgetModule);
const unitcostModule = () => import('./unitcost/unitcost.module').then(x => x.UnitcostModule);
const AllocateModule = () => import('./allocate/allocate.module').then(x => x.AllocateModule);
const buildingdesign = () => import('./buildingdesign/buildingdesign.module').then(x => x.BuildingdesignModule);
const welfareModule = () => import('./welfare/welfare.module').then(x => x.WelfareModule);
const appmoneyModule = () => import('./appmoney/appmoney.module').then(x => x.AppmoneyModule);
const rqbudgetModule = () => import('./rqbudget/rqbudget.module').then(x => x.RqbudgetModule);

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'investment', loadChildren: inversModule, canActivate: [AuthGuard] },
  { path: 'budget', loadChildren: budgetModule, canActivate: [AuthGuard] },
  { path: 'unitcost', loadChildren: unitcostModule, canActivate: [AuthGuard] },
  { path: 'allocate', loadChildren: AllocateModule, canActivate: [AuthGuard] },
  { path: 'buildingdesign', loadChildren: buildingdesign, canActivate: [AuthGuard] },
  { path: 'welfare', loadChildren: welfareModule, canActivate: [AuthGuard] },
  { path: 'appmoney', loadChildren: appmoneyModule, canActivate: [AuthGuard] },
  { path: 'rqbudget', loadChildren: rqbudgetModule, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Acc3dRoutingModule { }