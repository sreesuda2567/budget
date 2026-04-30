import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadsigService {

  private baseUrl = environment.apiUrlPHP+"/profile";

  constructor(private http: HttpClient) {}

  upload(file: File,id:any): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    formData.append('id',id);

    const req = new HttpRequest('POST', `${this.baseUrl}/upload.php`, formData, {
      reportProgress: true,
      responseType: 'text'
    });

    return this.http.request(req);
  }
}
