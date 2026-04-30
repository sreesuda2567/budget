/*import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UploadfileserviceService {
  //baseApiUrl = 'https://eis.rmutsv.ac.th/uploadfile';
  private baseApiUrl = environment.apiUrlPHP+"/uploadfile";

  constructor(private http: HttpClient) {}

  // Returns an observable
  upload(file: any): Observable<any> {
    // Create form data
    const formData = new FormData();

    // Store form name as "file" with file data
    formData.append('file', file, file.name);

    // Make http post request over api
    // with formData as req
    return this.http.post(this.baseApiUrl, formData);
  }
}*/

import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadfileserviceService {

  private baseUrl = environment.apiUrlPHP+"/acc3d/investment/passet/";
  private baseUrlannal = environment.apiUrlPHP+"/acc3d/appmoney/annal/";
  private baseUrlcheck = environment.apiUrlPHP+"/acc3d/appmoney/check/";
  private baseUrlsig = environment.apiUrlPHP+"/hr/personnel/";
  private baseUrlcard = environment.apiUrlPHP+"/hr/other/";
  private baseUrlfinance = environment.apiUrlPHP+"/hr/finance/";
  private baseUrlroom = environment.apiUrlPHP+"/bms/manage/";

  constructor(private http: HttpClient) { }

  uploadasset(file: File,fileict: File,filerequest: File,filespec: File,year:any,fac:any,id:any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('fileict', fileict);
    formData.append('filerequest', filerequest);
    formData.append('filespec', filespec);
    formData.append('year',year);
    formData.append('fac',fac);
    formData.append('id',id);

    const req = new HttpRequest('POST', `${this.baseUrl}/upload.php`, formData, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }
    uploadassetrq(file: File,fileict: File,filerequest: File,filespec: File,year:any,fac:any,id:any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('fileict', fileict);
    formData.append('filerequest', filerequest);
    formData.append('filespec', filespec);
    formData.append('year',year);
    formData.append('fac',fac);
    formData.append('id',id);

    const req = new HttpRequest('POST', `${this.baseUrl}/uploadrq.php`, formData, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }
  uploadbuil(file: File,fileict: File,filerequest: File,year:any,fac:any,id:any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('filebuil', file);
    formData.append('fileictbuil', fileict);
    formData.append('filerequestbuil', filerequest);
    formData.append('year',year);
    formData.append('fac',fac);
    formData.append('id',id);

    const req = new HttpRequest('POST', `${this.baseUrl}/upload.php`, formData, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }
  uploadbuilrq(file: File,fileict: File,filerequest: File,year:any,fac:any,id:any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('filebuil', file);
    formData.append('fileictbuil', fileict);
    formData.append('filerequestbuil', filerequest);
    formData.append('year',year);
    formData.append('fac',fac);
    formData.append('id',id);

    const req = new HttpRequest('POST', `${this.baseUrl}/uploadrq.php`, formData, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }

  upload(file: File,fileict: File,year:any,fac:any,id:any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('fileict', fileict);
    formData.append('year',year);
    formData.append('fac',fac);
    formData.append('id',id);

    const req = new HttpRequest('POST', `${this.baseUrl}/upload.php`, formData, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }
  uploadsig(file: File,fac:any,id:any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('fac',fac);
    formData.append('id',id);

    const req = new HttpRequest('POST', `${this.baseUrlsig}/upload.php`, formData, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }
  uploadproject(file: File,file1: File,file2: File,fac:any,year:any,id:any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('filevh1', file1);
    formData.append('filevh2', file2);
    formData.append('fac',fac);
    formData.append('id',id);
    formData.append('year',year);

    const req = new HttpRequest('POST', `${this.baseUrlfinance}/uploadannal.php`, formData, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }
    uploadannal(file: File,file3: File,file4: File,fac:any,year:any,id:any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file2', file);
    formData.append('filevht1', file3);
    formData.append('filevht2', file4);
    formData.append('fac',fac);
    formData.append('id',id);
    formData.append('year',year);

    const req = new HttpRequest('POST', `${this.baseUrlfinance}/uploadannal.php`, formData, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }
  uploadbook(file: File,fac:any,year:any,id:any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('fac',fac);
    formData.append('id',id);
    formData.append('year',year);

    const req = new HttpRequest('POST', `${this.baseUrlsig}/uploadbook.php`, formData, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }
  uploadcontract(file: File,fac:any,year:any,id:any,citizen:any,code:any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('fac',fac);
    formData.append('id',id);
    formData.append('year',year);
    formData.append('citizen',citizen);
    formData.append('code',code);

    const req = new HttpRequest('POST', `${this.baseUrlannal}/uploadannal.php`, formData, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }
    uploadcheck(file: File,fac:any,year:any,id:any,citizen:any,code:any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('fac',fac);
    formData.append('id',id);
    formData.append('year',year);
    formData.append('citizen',citizen);
    formData.append('code',code);

    const req = new HttpRequest('POST', `${this.baseUrlcheck}/uploadcheck.php`, formData, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }

  uploadassetp(file: File,file2: File,file3: File,fac:any,id:any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('file2', file2);
    formData.append('file3', file3);
    formData.append('fac',fac);
    formData.append('id',id);

    const req = new HttpRequest('POST', `${this.baseUrlcard}/uploadasset.php`, formData, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }
  uploadvehicle(file: File,fac:any,year:any,id:any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('fac',fac);
    formData.append('id',id);
    formData.append('year',year);

    const req = new HttpRequest('POST', `${this.baseUrlcard}/uploadvehicle.php`, formData, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }
    uploadborrowasset(file: File,fac:any,year:any,id:any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('fac',fac);
    formData.append('id',id);
    formData.append('year',year);

    const req = new HttpRequest('POST', `${this.baseUrlcard}/uploadborrowasset.php`, formData, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }
  uploadvehiclep(file: File,fac:any,year:any,id:any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('fac',fac);
    formData.append('id',id);
    formData.append('year',year);

    const req = new HttpRequest('POST', `${this.baseUrlcard}/uploadvehiclep.php`, formData, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);
  }
  uploadclear(file: File,fac:any,year:any,id:any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('fac',fac);
    formData.append('id',id);
    formData.append('year',year);

    const req = new HttpRequest('POST', `${this.baseUrlfinance}/uploadclear.php`, formData, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);
  }
    uploadclearm(file: File,fac:any,year:any,id:any,ciz:any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('fac',fac);
    formData.append('id',id);
    formData.append('year',year);
    formData.append('ciz',ciz);

    const req = new HttpRequest('POST', `${this.baseUrlfinance}/uploadclearm.php`, formData, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);
  }
    uploadwelfare(file: File,fac:any,year:any,id:any,type:any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('fac',fac);
    formData.append('id',id);
    formData.append('year',year);
    formData.append('type',type);

    const req = new HttpRequest('POST', `${this.baseUrlfinance}/uploadwelfare.php`, formData, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);
  }
  uploadbroom(file: File,fac:any,id:any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('fac',fac);
    formData.append('id',id);

    const req = new HttpRequest('POST', `${this.baseUrlroom}/uploadbroom.php`, formData, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);
  } 
  uploadbroomde(file: File,fac:any,id:any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('fac',fac);
    formData.append('id',id);

    const req = new HttpRequest('POST', `${this.baseUrlroom}/uploadbroomde.php`, formData, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);
  } 
  uploadbrqroom(file: File,year:any,id:any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('year',year);
    formData.append('id',id);

    const req = new HttpRequest('POST', `${this.baseUrlcard}/uploadreserve.php`, formData, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);
  } 
  uploadla(file: File,fac:any,year:any,id:any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('fac',fac);
    formData.append('id',id);
    formData.append('year',year);

    const req = new HttpRequest('POST', `${this.baseUrlsig}/uploadla.php`, formData, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }
  uploadcard(file1: File,file2: File,file3: File,file4: File,file5: File,file6: File,ct:any,type:any,id:any,fac:any,opt:any,citizen:any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file1', file1);
    formData.append('file2', file2);
    formData.append('file3', file3);
    formData.append('file4', file4);
    formData.append('file5', file5);
    formData.append('file6', file6);
    formData.append('id',id);
    formData.append('ct',ct);
    formData.append('type',type);
    formData.append('fac',fac);
    formData.append('opt',opt);
    formData.append('citizen',citizen);
    const req = new HttpRequest('POST', `${this.baseUrlcard}/upload.php`, formData, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }
  getFiles(id:any): Observable<any> {
    return this.http.get(`${this.baseUrl}/files.php`);
  }
  getFilesById(id:any) {
    return this.http.post<any>(`${this.baseUrl}/files.php`, {
      "opt": "scandir",
      "id": id
    });
  }
}
