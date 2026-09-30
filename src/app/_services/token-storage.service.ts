import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const VERSION_KEY = 'auth-version';


@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private authStateSubject = new BehaviorSubject<boolean>(!!this.getToken());
  public authState$: Observable<boolean> = this.authStateSubject.asObservable();

  constructor() { }

  signOut(): void {
    window.sessionStorage.clear();
    this.authStateSubject.next(false);
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
    this.authStateSubject.next(true);
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    this.authStateSubject.next(true);
    console.log(user);
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      const parsedUser = JSON.parse(user);

      /*  const mockCitizen = '3920500045808';
        parsedUser.citizen = mockCitizen;*/

      if (parsedUser) {
        if (!parsedUser.citizen && (parsedUser.cid || parsedUser.citizenId)) {
          parsedUser.citizen = parsedUser.cid || parsedUser.citizenId;
        }
        if (!parsedUser.token || !parsedUser.token.data || !parsedUser.token.data.token) {
          const universityToken = parsedUser.tokenelogin || (typeof parsedUser.token === 'string' ? parsedUser.token : '') || parsedUser.accessToken;
          parsedUser.token = {
            data: {
              token: universityToken,
              username: parsedUser.username,
              citizen: parsedUser.citizen
            }
          };
        }
      }
      return parsedUser;
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
