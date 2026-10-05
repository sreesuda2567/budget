import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
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

  // Default values
  private defaultSettings: SsoSettings = {
    sso_enabled: true,
    auto_redirect: false
  };

  constructor(private http: HttpClient) {}

  /**
   * ล้าง Cache ใน sessionStorage และปรับค่า auto_redirect ใน localStorage ให้เป็น false เสมอ
   * ป้องกันปัญหา Browser ค้างค่า auto_redirect: true จากการตั้งค่าเก่า
   */
  public clearCache(): void {
    sessionStorage.removeItem(SETTINGS_CACHE_KEY);
    try {
      const local = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (local) {
        const parsed = JSON.parse(local);
        if (parsed.auto_redirect) {
          parsed.auto_redirect = false;
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
        }
      }
    } catch (e) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }

  /**
   * ดึงค่าการตั้งค่า SSO (มี Fallback หลายชั้น: Backend -> LocalStorage -> Default)
   */
  public getSettings(): Promise<SsoSettings> {
    // 1. ตรวจสอบ sessionStorage cache ก่อน
    const cached = sessionStorage.getItem(SETTINGS_CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.auto_redirect) {
          parsed.auto_redirect = false;
        }
        return Promise.resolve(parsed);
      } catch (e) {
        sessionStorage.removeItem(SETTINGS_CACHE_KEY);
      }
    }

    // 2. ดึงค่า Local หรือ Fallback (บังคับ auto_redirect = false เสมอ)
    const local = this.getLocalOrFallback();

    // 3. ดึงจาก Backend เสมอเพื่อตรวจสอบสถานะล่าสุด
    return this.http.get<any>(this.apiUrl).pipe(
      map(res => {
        if (res && res.status && res.data) {
          const settings: SsoSettings = {
            sso_enabled: !!res.data.sso_enabled,
            auto_redirect: !!res.data.auto_redirect,
            updated_at: res.data.updated_at
          };
          this.setLocalCache(settings);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
          return settings;
        }
        return local;
      }),
      catchError(err => {
        // Fallback ไปใช้ Local/Default (auto_redirect = false) เมื่อเซิร์ฟเวอร์ยังไม่มีไฟล์ ssoSettings.php
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
        // ทำความสะอาดและแก้ไข auto_redirect ที่ค้างเป็น true ให้เป็น false ทันที
        if (parsed.auto_redirect) {
          parsed.auto_redirect = false;
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
        }
        return {
          sso_enabled: parsed.sso_enabled !== undefined ? !!parsed.sso_enabled : true,
          auto_redirect: false,
          updated_at: parsed.updated_at
        };
      } catch (e) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }
    return { ...this.defaultSettings };
  }
}
