import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiPdoService {
  private params = new HttpParams();
  constructor(
    private router: Router,
    private http: HttpClient,
  ) { }


  getdata(url: string,opt: any,tbl: any,permis: any,param: any) {
    return this.http.post<any[]>(`${environment.apiUrlPHP}` + url,
      {
        "opt": opt,
        "tbl":tbl,
        "permis":permis,
        "param":param
      });
  }
  pgetdata(params: any,linkapi: any) {
    return this.http.post<any[]>(`${environment.apiUrlPHP}` + linkapi,params);
  }

  getDataPage(url: string,otp:any,p:any, size:any, sort:any, permis:any, param:any) {
    let page = 0;
    if (p) page = p;
    return this.http.post<any>(`${environment.apiUrlPHP}`+ url,
      {
        "opt": otp,
        "page": page,
        "size": size,
        "sort": sort,
        "permis": permis,
        "param": param
      });
  }

}
