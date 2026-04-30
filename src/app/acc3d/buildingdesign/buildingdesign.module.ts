import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuildingRoutingModule } from './building-routing.module';
import { MenuComponent } from './menu/menu.component';


@NgModule({
  declarations: [
    MenuComponent
  ],
  imports: [
    CommonModule,
    BuildingRoutingModule
  ]
})
export class BuildingdesignModule { }
