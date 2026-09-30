import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { OidcAuthService } from '../_services/oidc-auth.service';
import { SsoSettingsService, SsoSettings } from '../_services/sso-settings.service';
import { FormBuilder } from '@angular/forms';
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

  // RUTS SSO State Variables
  ssoSettings: SsoSettings = { sso_enabled: true, auto_redirect: false };
  isCheckingSSO: boolean = false;
  ssoStatusMessage: string = '';
  ssoError: boolean = false;
  ssoErrorMessage: string = '';
  showLoginForm: boolean = true;
  isLoggingInSSO: boolean = false;

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private oidcAuth: OidcAuthService,
    private ssoSettingsService: SsoSettingsService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {}

  async ngOnInit(): Promise<void> {
    this.key = this.tokenStorage.getVersion();

    // 1. ถ้ามี Token อยู่แล้ว นำทางเข้าสู่ระบบ
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.router.navigate(['/home']);
      return;
    }

    // 2. ตรวจสอบ OIDC Callback (?code= ใน URL)
    if (window.location.search.includes('code=')) {
      await this.processSsoCallback();
      return;
    }

    // 3. โหลดการตั้งค่า SSO (ล้าง cache ก่อนเสมอ ตามปัญหา Blueprint ข้อ 7)
    this.ssoSettingsService.clearCache();
    try {
      this.ssoSettings = await this.ssoSettingsService.getSettings();
    } catch (e) {
      console.warn('Could not load SSO settings:', e);
      this.ssoSettings = { sso_enabled: true, auto_redirect: false };
    }

    // 4. ตรวจสอบพารามิเตอร์ ?no_auto=1 เพื่อป้องกัน Auto-Redirect Loop หลัง Logout (ปัญหาข้อ 8)
    const urlParams = new URLSearchParams(window.location.search);
    const noAuto = urlParams.get('no_auto') === '1';

    // 5. ตัดสินใจแสดงผล UI / จัดการ Auto-Redirect
    if (this.ssoSettings.sso_enabled && this.ssoSettings.auto_redirect && !noAuto) {
      await this.handleAutoRedirect();
    } else {
      // แสดงฟอร์มปกติ (มีปุ่ม SSO หาก sso_enabled = true)
      this.showLoginForm = true;
      this.isCheckingSSO = false;
    }
  }

  /**
   * ประมวลผล Callback หลัง Keycloak redirect กลับมา
   */
  private async processSsoCallback(): Promise<void> {
    this.loading = true;
    this.isCheckingSSO = true;
    this.showLoginForm = false;
    this.ssoStatusMessage = 'กำลังตรวจสอบสิทธิ์ผ่าน RUTS SSO...';

    try {
      const result = await this.oidcAuth.handleCallback();
      if (result && result.success) {
        this.isLoggedIn = true;
        this.toastr.success('เข้าสู่ระบบสำเร็จ', 'ยินดีต้อนรับ');
        this.router.navigate(['/home']);
      } else {
        this.fallbackToOriginalForm(result?.message || 'การเข้าสู่ระบบผ่าน RUTS SSO ไม่สำเร็จ');
      }
    } catch (err) {
      console.error('SSO Callback error:', err);
      this.fallbackToOriginalForm('เกิดข้อผิดพลาดในการประมวลผลการเข้าสู่ระบบ SSO');
    } finally {
      this.loading = false;
      this.isCheckingSSO = false;
      // ล้าง query parameters ออกจาก URL เพื่อความปลอดภัย
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  /**
   * จัดการ Auto-Redirect พร้อมระบบ Health Check ป้องกันค้าง (Timeout 2 วินาที)
   */
  private async handleAutoRedirect(): Promise<void> {
    this.showLoginForm = false;
    this.isCheckingSSO = true;
    this.ssoStatusMessage = 'กำลังตรวจสอบความพร้อมของระบบ RUTS SSO...';

    // Health Check ไปยัง Discovery URL (Timeout 2000ms)
    const isHealthy = await this.oidcAuth.healthCheck();

    if (isHealthy) {
      this.ssoStatusMessage = 'กำลังนำท่านไปยังหน้าเข้าสู่ระบบ RUTS SSO...';
      try {
        await this.oidcAuth.login();
      } catch (err) {
        console.error('Auto redirect login error:', err);
        this.fallbackToOriginalForm('ไม่สามารถนำทางไปยังหน้า RUTS SSO ได้ กรุณาเข้าสู่ระบบด้วยแบบฟอร์มปกติ');
      }
    } else {
      // เซิร์ฟเวอร์ล่ม หรือ Timeout เกิน 2 วินาที -> Fallback แสดงฟอร์มเดิมทันที!
      this.fallbackToOriginalForm('ระบบ RUTS SSO ขัดข้องชั่วคราว กรุณาเข้าสู่ระบบด้วยชื่อผู้ใช้และรหัสผ่านเดิม');
    }
  }

  /**
   * ตัดสลับมาแสดงหน้า Login เดิมเมื่อ SSO ล่มหรือมีข้อผิดพลาด
   */
  public fallbackToOriginalForm(message: string): void {
    this.isCheckingSSO = false;
    this.showLoginForm = true;
    this.ssoError = true;
    this.ssoErrorMessage = message;
    this.toastr.warning(message, 'แจ้งเตือน');
  }

  /**
   * ผู้ใช้กดปุ่ม "🔑 เข้าสู่ระบบด้วย RUTS SSO"
   */
  async loginWithSSO(): Promise<void> {
    this.isLoggingInSSO = true;
    try {
      await this.oidcAuth.login();
    } catch (err) {
      console.error('Login with SSO error:', err);
      this.toastr.error('ไม่สามารถเชื่อมต่อไปยัง RUTS SSO ได้', 'แจ้งเตือน');
      this.isLoggingInSSO = false;
    }
  }

  /**
   * ฟังก์ชัน Submit ฟอร์มเดิม (ยังคงรักษาฟังก์ชันเดิมไว้ 100%)
   */
  onSubmit(): void {
    this.loading = true;
    const { username, password } = this.form;
    this.authService.login(username, password).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().permission;
        this.reloadPage();
      },
      err => {
        this.toastr.warning('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง', 'แจ้งเตือน');
        this.isLoginFailed = true;
        this.loading = false;
      }
    );
  }

  grad(): void {
    this.router.navigate(['/logingrad']);
  }

  reloadPage(): void {
    window.location.reload();
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
