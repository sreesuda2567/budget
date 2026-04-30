import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { User } from '@app/_models';
//import { TbUserpermission } from '@app/acc3d/inventory/req/_models/tb-userpermission';

@Injectable({
  providedIn: 'root'
})
export class ApiPdoService {
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;
  //#######################################
 // private userpermissionSubject: BehaviorSubject<TbUserpermission>;
 // public  userpermission: Observable<TbUserpermission>;
  //----------------------------------------

  private params = new HttpParams();
  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
//#######################################
//    this.userpermissionSubject = new BehaviorSubject<TbUserpermission>(JSON.parse(localStorage.getItem('userpermission')));
//    this.userpermission = this.userpermissionSubject.asObservable();
//----------------------------------------
  }
  public get userValue(): User {
    return this.userSubject.value;
  }
//#######################################
//  public get userpermissionValue(): TbUserpermission {
//    return this.userpermissionSubject.value;
//  }
//----------------------------------------
  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
  //#######################################
  // localStorage.removeItem('userpermission');
  //----------------------------------------
    this.userSubject.next(null);
  //#######################################
  //this.userpermissionSubject.next(null);
  //----------------------------------------
    this.router.navigate(['/account/login']);
  }

  create(params, linkapi) {
    params.opt = "create";
    //params.FL_CustomersID=params.params;
    return this.http.post(`${environment.apiUrlPHP}` + linkapi, params);
 
  }

  getcreate(params, linkapi) {
    return this.http.post(`${environment.apiUrlPHP}` + linkapi, params);
  }

  getupdate(params, linkapi) {
    //params.opt = "create";
    //params.FL_CustomersID=params.params;
    return this.http.post(`${environment.apiUrlPHP}` + linkapi, params);
  }

  update(params, linkapi) {
   // params.opt="update";
    return this.http.post(`${environment.apiUrlPHP}` + linkapi,params);
    
  }

  delete(id: string,linkapi) {
    return this.http.post(`${environment.apiUrlPHP}` + linkapi, {
      "opt": "delete",
      "id": id
    });
     
  }

  getAll(linkapi) {
    return this.http.post<any[]>(`${environment.apiUrlPHP}` + linkapi,
      {
        "opt": "readAll"
      });
  }

  getAllTrue(linkapi) {
    return this.http.post<any[]>(`${environment.apiUrlPHP}` + linkapi,
      {
        "opt": "readAllTRUE"
      });
  }


  getAll_auto(linkapi) {
    return this.http.post<any[]>(`${environment.apiUrlPHP}` + linkapi,
      {
        "opt": "readAutocom"
      });
  }
  

  getDataTB(setxt, linkapi) {
    
    return this.http.post<any[]>(`${environment.apiUrlPHP}` + linkapi,
      {
        "opt": "readTable",
        "setxt": setxt
      });
  }


  getAdd(params,linkapi) {
    return this.http.post<any[]>(`${environment.apiUrlPHP}` + linkapi,params);
  }

  getAddTB(linkapi) {
    return this.http.post<any[]>(`${environment.apiUrlPHP}`+linkapi,
    {
      "opt": "readAdd"
    });
  }

  getByPage(p, s, d, se, setxt, linkapi) {
    let page = 0;
    if (p) page = p;
    return this.http.post<any[]>(`${environment.apiUrlPHP}` + linkapi,
      {
        "opt": "read",
        "page": p,
        "size": s,
        "sort": d,
        "se": se,
        "setxt": setxt
      });
  }
  getById(id: string, linkapi) {
    return this.http.post<any>(`${environment.apiUrlPHP}`+ linkapi,
      {
        "opt": "readone",
        "id": id
      });
  }

  getdata(url,opt,tbl,permis,param) {
    return this.http.post<any[]>(`${environment.apiUrlPHP}` + url,
      {
        "opt": opt, // insert/update/delete
        "tbl": tbl, // table name
        "permis": permis, // สิทธิ์การเข้าถึง
        "param": param // ตัวแปร -หลายตัว
      });
  }


}
