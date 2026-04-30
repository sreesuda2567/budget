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


  pgetdata(url: string,opt: any,tbl: any,permis: any,param: any) {
    return this.http.post<any[]>(`${environment.apiUrlPHP}` + url,
      {
        "opt": opt,
        "tbl":tbl,
        "permis":permis,
        "param":param
      });
  }
  getdata(params: any,linkapi: string) {
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

  getdata_new(url: string,opt: any,tbl: any,permis: any,param: any) {
    return this.http.post<any[]>(`${environment.apiUrlPHP}` + url,
      {
        "opt": opt,
        "tbl":tbl,
        "permis":permis,
        "param":param
      });
  }
  getById(id: string, linkapi: any) {
    return this.http.post<any>(`${environment.apiUrlPHP}`+ linkapi,
      {
        "opt": "readone",
        "id": id
      });
  }
  
  delete(id: string,linkapi: any) {
    return this.http.post(`${environment.apiUrlPHP}` + linkapi, {
      "opt": "delete",
      "id": id
    });
     
  }
  getupdate(params: any, linkapi: any) {
    //params.opt = "create";
    //params.FL_CustomersID=params.params;
    return this.http.post(`${environment.apiUrlPHP}` + linkapi, params);
  }

}
