import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_services/auth.guard';
import { LoginV2Component } from './login-v2/login-v2.component';
import { Login3dComponent } from './login3d/login3d.component';
import { Login3dplanComponent } from './login3dplan/login3dplan.component';
const acc3dModule = () => import('./acc3d/acc3d.module').then(x => x.Acc3dModule);
const routes: Routes = [
 { path: 'login3d/:token', component: Login3dComponent },
 { path: 'login3dplan/:token', component: Login3dplanComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginV2Component },
  { path: 'home', component: HomeComponent, canActivate : [AuthGuard] },
  { path: 'acc3d', loadChildren: acc3dModule, canActivate: [AuthGuard] },
  { path: '**', component: LoginV2Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
