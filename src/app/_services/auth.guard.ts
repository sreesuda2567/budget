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
        try {
          const parts = token.split('.');
          if (parts.length >= 2) {
            const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            const payload = JSON.parse(jsonPayload);
            const expiry = payload.exp;
            if(!expiry || ((Math.floor((new Date).getTime() / 1000)) <= expiry)){
              return true;
            }else{
              this.tokenStorage.signOut();
              console.log("logout Expire");
              this.router.navigate(['/login']);
              return false;
            }
          }
        } catch (e) {
          console.error("Token parse error in AuthGuard:", e);
        }
      }
    this.router.navigate(['/login']);
    return false;
  }

}
