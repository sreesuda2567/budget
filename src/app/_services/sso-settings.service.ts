import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap, timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface SsoSettings {
  sso_enabled: boolean;
  auto_redirect: boolean;
  updated_at?: string;
}

const SETTINGS_CACHE_KEY = 'sso_settings_cache';
const LOCAL_STORAGE_KEY = 'ruts_budget_sso_settings';

@Injectable({
  providedIn: 'root'
})
export class SsoSettingsService {
  private apiUrl = `${environment.apiUrlLogin}/loginJWT/ssoSettings.php`;

  // Default values: เปิดใช้งาน SSO และ Auto-Redirect เพื่อให้วิ่งไป SSO ทันที
  private defaultSettings: SsoSettings = {
    sso_enabled: true,
    auto_redirect: true
  };

  constructor(private http: HttpClient) {}

  /**
   * ล้าง Cache ใน sessionStorage
   */
  public clearCache(): void {
    sessionStorage.removeItem(SETTINGS_CACHE_KEY);
  }

  /**
   * ดึงค่าการตั้งค่า SSO (มี Fallback หลายชั้น: Backend -> LocalStorage -> Default)
   * เพิ่ม timeout(2500) เพื่อป้องกันอาการค้างหรือ 504 Gateway Timeout จากเซิร์ฟเวอร์
   */
  public getSettings(): Promise<SsoSettings> {
    // 1. ตรวจสอบ sessionStorage cache ก่อน
    const cached = sessionStorage.getItem(SETTINGS_CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        return Promise.resolve(parsed);
      } catch (e) {
        sessionStorage.removeItem(SETTINGS_CACHE_KEY);
      }
    }

    // 2. ดึงค่า Local หรือ Fallback
    const local = this.getLocalOrFallback();

    // 3. ดึงจาก Backend (ตั้ง timeout 2.5 วินาที ป้องกัน 504 Gateway Timeout ทำให้หน้าค้าง)
    return this.http.get<any>(this.apiUrl).pipe(
      timeout(2500),
      map(res => {
        const data = res?.data || res?.settings;
        if (res && (res.status || res.success) && data) {
          const settings: SsoSettings = {
            sso_enabled: data.sso_enabled !== undefined ? !!data.sso_enabled : (data.ssoEnabled !== undefined ? !!data.ssoEnabled : true),
            auto_redirect: data.auto_redirect !== undefined ? !!data.auto_redirect : (data.autoRedirect !== undefined ? !!data.autoRedirect : true),
            updated_at: data.updated_at
          };
          this.setLocalCache(settings);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
          return settings;
        }
        return local;
      }),
      catchError(err => {
        // Fallback ไปใช้ Local/Default (auto_redirect = true) เมื่อเซิร์ฟเวอร์ยังไม่มีไฟล์ ssoSettings.php หรือ Timeout 504
        this.setLocalCache(local);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(local));
        return of(local);
      })
    ).toPromise().then(res => res || this.defaultSettings);
  }

  /**
   * บันทึกการตั้งค่า SSO (สำหรับ Admin)
   */
  public saveSettings(settings: SsoSettings): Promise<any> {
    // บันทึกลง localStorage ไว้สำรองเสมอ
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
    this.setLocalCache(settings);

    return this.http.post<any>(this.apiUrl, settings).pipe(
      map(res => {
        return res || { status: true, message: 'บันทึกเรียบร้อย' };
      }),
      catchError(err => {
        return of({
          status: true,
          message: 'บันทึกลงการตั้งค่าในเครื่องเรียบร้อย (เซิร์ฟเวอร์ออฟไลน์)',
          data: settings
        });
      })
    ).toPromise();
  }

  private setLocalCache(settings: SsoSettings): void {
    sessionStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(settings));
  }

  private getLocalOrFallback(): SsoSettings {
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (local) {
      try {
        const parsed = JSON.parse(local);
        return {
          sso_enabled: parsed.sso_enabled !== undefined ? !!parsed.sso_enabled : true,
          auto_redirect: parsed.auto_redirect !== undefined ? !!parsed.auto_redirect : true,
          updated_at: parsed.updated_at
        };
      } catch (e) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }
    return { ...this.defaultSettings };
  }
}
