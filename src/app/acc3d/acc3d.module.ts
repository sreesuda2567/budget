import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Acc3dRoutingModule } from './acc3d-routing.module';
import { HomeComponent } from './home.component';

import { InvestmentModule } from './investment/investment.module';
import { BudgetModule } from './budget/budget.module';
import { UnitcostModule } from './unitcost/unitcost.module';
import { BuildingdesignModule } from './buildingdesign/buildingdesign.module';
import { WelfareModule } from './welfare/welfare.module';
import { AppmoneyModule } from './appmoney/appmoney.module';
import { RqbudgetModule } from './rqbudget/rqbudget.module';



@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    Acc3dRoutingModule,
    InvestmentModule,
    BudgetModule,
    UnitcostModule,
    BuildingdesignModule,
    WelfareModule,
    AppmoneyModule,
    RqbudgetModule

  ]
})
export class Acc3dModule { }
