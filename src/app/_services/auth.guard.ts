import { Injectable } from '@angular/core';
import { Router,ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService
) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const token = this.tokenStorage.getToken();
      if(token != null){
        const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
        if(token && ((Math.floor((new Date).getTime() / 1000)) <= expiry)){
          return true;
        }else{
          this.tokenStorage.signOut();
          console.log("logout Expire");
          this.reloadPage();
          return false;
        }

      }
    this.router.navigate(['/login-V2'])
    return false;
  }
  reloadPage(): void {
    window.location.reload();
  }

}
