import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const VERSION_KEY = 'auth-version';


@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    console.log(user);
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
     return JSON.parse(user);
    /* const parsedUser = JSON.parse(user);
        parsedUser.citizen = '3920700221448'; 
        return parsedUser;*/
    }
    return {};
  }


  public saveVersion(version: any): void {
    window.sessionStorage.removeItem(VERSION_KEY);
    window.sessionStorage.setItem(VERSION_KEY, JSON.stringify(version));
   // console.log(version);
  }
  public getVersion(): any {
    const version = window.sessionStorage.getItem(VERSION_KEY);
    if (version) {
      return JSON.parse(version);
    }

    return {};
  }

}
