import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login-v2',
  templateUrl: './login-v2.component.html',
  styleUrls: ['./login-v2.component.scss']
})
export class LoginV2Component implements OnInit {
  submitted = false;
  key: any = {};
  form: any = { username: null, password: null };
  loading = false;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  cid?: string;
  showPassword: boolean = false;
  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService

  ) { }

  ngOnInit(): void {
    //console.log(this.tokenStorage.getToken);
    this.key = this.tokenStorage.getVersion();
    //console.log('this.key');
    //console.log(this.key );
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.router.navigate(['/home'])
    }

  }

  onSubmit(): void {
    this.loading = true;
    const { username, password } = this.form;
    this.authService.login(username, password).subscribe(
      data => {
        //console.log(data);
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);
        //console.log(data.jwt);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().permission;
        this.reloadPage();
      },
      err => {
        //this.errorMessage = data;
        this.toastr.warning('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง', 'แจ้งเตือน');
        this.isLoginFailed = true;
        this.loading = false;
      }
    );
  }
  grad(): void {
    this.router.navigate(['/logingrad'])
  }
  reloadPage(): void {
    window.location.reload();
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}

