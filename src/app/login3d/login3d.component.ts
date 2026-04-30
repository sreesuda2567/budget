import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login3d',
  templateUrl: './login3d.component.html',
  styleUrls: ['./login3d.component.scss']
})
export class Login3dComponent implements OnInit {
  form:any;
  isLoggedIn = false;
  roles: string[] = [];
  loading = false;
  token:any;

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.token= this.route.snapshot.paramMap.get('token'); 
    //---------------
    //console.log(this.token);
    //---------------
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      const user = this.tokenStorage.getUser();
      this.router.navigate(['acc3d/']);
    //  console.log(this.token);
     // this.getpermisstion(this.token);
    }else{
      this.getpermisstion(this.token);
    }
  }
  getpermisstion(token:any){
    this.authService.login_token(token).subscribe(
      (data:any) => {
        
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);
        //console.log(token);
        //this.pdpa=data.pdpa[0];
        //console.log(data.jwt);
        this.isLoggedIn = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().permission;
        this.reloadPage();
      },
      (err:any) => {
        //this.errorMessage = data;
        this.toastr.warning('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง','แจ้งเตือน');
        this.isLoggedIn = true;
        this.loading = false;
        this.router.navigate(['/login']);
      }
    );
  }
  reloadPage(): void {
    window.location.reload();
  }
  onSubmit(): void {
    this.loading = true;
    const { token } = this.form;
    this.authService.login_token(token).subscribe(
      (data:any) => {
        console.log(data);
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);
        //this.pdpa=data.pdpa[0];
        //console.log(data.jwt);
        this.isLoggedIn = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().permission;
        this.reloadPage();
      },
      (err:any) => {
        //this.errorMessage = data;
        this.toastr.warning('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง','แจ้งเตือน');
        this.isLoggedIn = true;
        this.loading = false;
      }
    );
  }

}
