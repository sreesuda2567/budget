import { Component, OnInit } from '@angular/core';
import { SsoSettingsService, SsoSettings } from '../_services/sso-settings.service';
import { OidcAuthService } from '../_services/oidc-auth.service';
import { ToastrService } from 'ngx-toastr';

import { Router } from '@angular/router';

@Component({
  selector: 'app-sso-settings',
  templateUrl: './sso-settings.component.html',
  styleUrls: ['./sso-settings.component.scss']
})
export class SsoSettingsComponent implements OnInit {
  settings: SsoSettings = {
    sso_enabled: true,
    auto_redirect: false
  };

  loading = false;
  saving = false;
  testingHealth = false;
  healthStatus: 'unknown' | 'online' | 'offline' = 'unknown';
  healthMessage = '';

  constructor(
    private ssoSettingsService: SsoSettingsService,
    private oidcAuthService: OidcAuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    // ตรวจสอบสิทธิ์เฉพาะผู้ใช้ที่มี status เป็น 'A' เท่านั้น
    const status = sessionStorage.getItem('acc3d_status');
    if (status && status !== 'A') {
      this.toastr.warning('เฉพาะผู้ดูแลระบบ (Status A) เท่านั้นที่สามารถเข้าถึงหน้านี้ได้', 'ไม่มีสิทธิ์เข้าถึง');
      this.router.navigate(['/home']);
      return;
    }

    this.loading = true;
    try {
      this.ssoSettingsService.clearCache();
      this.settings = await this.ssoSettingsService.getSettings();
    } catch (e) {
      console.error('Error loading settings', e);
    } finally {
      this.loading = false;
    }

    this.checkHealth();
  }

  async checkHealth(): Promise<void> {
    this.testingHealth = true;
    this.healthMessage = 'กำลังตรวจสอบการเชื่อมต่อกับ RUTS SSO Server...';
    try {
      const isOnline = await this.oidcAuthService.healthCheck();
      if (isOnline) {
        this.healthStatus = 'online';
        this.healthMessage = 'เชื่อมต่อกับ RUTS SSO Server ได้ปกติ (Discovery Endpoint พร้อมใช้งาน)';
      } else {
        this.healthStatus = 'offline';
        this.healthMessage = 'ไม่สามารถเชื่อมต่อ RUTS SSO Server ได้ (อาจเกิดจากเครือข่าย หรือเซิร์ฟเวอร์ขัดข้อง)';
      }
    } catch (err) {
      this.healthStatus = 'offline';
      this.healthMessage = 'เกิดข้อผิดพลาดในการตรวจสอบสถานะ SSO Server';
    } finally {
      this.testingHealth = false;
    }
  }

  onToggleSso(): void {
    if (!this.settings.sso_enabled) {
      // ถ้าปิด SSO ให้ปิด Auto-Redirect ด้วยเสมอ
      this.settings.auto_redirect = false;
    }
  }

  async saveSettings(): Promise<void> {
    this.saving = true;
    try {
      const res = await this.ssoSettingsService.saveSettings(this.settings);
      this.toastr.success('บันทึกการตั้งค่า SSO เรียบร้อยแล้ว', 'สำเร็จ');
    } catch (err) {
      this.toastr.error('ไม่สามารถบันทึกการตั้งค่าได้', 'เกิดข้อผิดพลาด');
    } finally {
      this.saving = false;
    }
  }
}
