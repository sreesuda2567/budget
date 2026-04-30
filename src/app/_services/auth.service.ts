import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'

const AUTH_API = environment.apiUrlLogin;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + '/loginJWT/loginRUTS.php', {
    //return this.http.post(AUTH_API + '/loginJWT/loginEP.php', {
      username,
      password
    }, httpOptions);
  }

  login_token(token: string): Observable<any> {
    return this.http.post(AUTH_API + '/loginJWT/loginRUTSweb.php', {
    //return this.http.post(AUTH_API + '/loginJWT/loginEP.php', {
      token
    }, httpOptions);
  }

}
