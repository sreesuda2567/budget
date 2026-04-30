import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenudesignComponent } from './menudesign/menudesign.component';
import { AuthGuard } from '../../../_services/auth.guard';
import { BasicComponent } from './basic/basic.component';
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
const routes: Routes = [
  { path: '', component: MenudesignComponent , children : [
    { path: 'basic', component : BasicComponent , canActivate: [AuthGuard]},
    { path: 'format', component : FormatComponent , canActivate: [AuthGuard]},
    { path: 'estimatestructure', component : EstimatestructureComponent , canActivate: [AuthGuard]},
    { path: 'estimateelectricity', component : EstimateelectricityComponent , canActivate: [AuthGuard]},
    { path: 'offer', component : OfferComponent , canActivate: [AuthGuard]},
    { path: 'formatr', component : FormatrComponent , canActivate: [AuthGuard]},
    { path: 'estimatestructurer', component : EstimatestructurerComponent , canActivate: [AuthGuard]},
    { path: 'estimateelectricityr', component : EstimateelectricityrComponent , canActivate: [AuthGuard]},
    { path: 'offerr', component : OfferrComponent , canActivate: [AuthGuard]},
    { path: 'approvep', component : ApprovepComponent , canActivate: [AuthGuard]},
    { path: 'approver', component : ApproverComponent , canActivate: [AuthGuard]},


        { path: '**', redirectTo: '' }
  ]
},
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DesignRoutingModule { }
