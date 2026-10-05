import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';
import { environment } from '../../environments/environment';
import { TokenStorageService } from './token-storage.service';
import { AuthService } from './auth.service';
import { timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OidcAuthService {
  private isConfigured = false;

  constructor(
    private oauthService: OAuthService,
    private http: HttpClient,
    private tokenStorage: TokenStorageService,
    private authService: AuthService
  ) {}

  /**
   * ตั้งค่า OAuthService ด้วย OIDC Configuration
   */
  public configure(): void {
    if (this.isConfigured) return;

    const oidcConfig = environment.oidc;
    const authConfig: AuthConfig = {
      issuer: oidcConfig.issuer,
      clientId: oidcConfig.clientId,
      dummyClientSecret: oidcConfig.dummyClientSecret,
      redirectUri: oidcConfig.redirectUri || (window.location.origin + '/login'),
      postLogoutRedirectUri: oidcConfig.postLogoutRedirectUri || (window.location.origin + '/login'),
      responseType: 'code',
      scope: oidcConfig.scope || 'openid profile email',
      showDebugInformation: !environment.production,
      disablePKCE: false,
      requireHttps: false, // เพื่อรองรับการทดสอบบน localhost
      strictDiscoveryDocumentValidation: false,
      skipIssuerCheck: false
    };

    this.oauthService.configure(authConfig);

    // ★ ป้องกันระบบหลุดบ่อย: ต่ออายุ Token อัตโนมัติในเบื้องหลังก่อน Access Token หมดอายุ
    this.oauthService.setupAutomaticSilentRefresh();

    this.isConfigured = true;
  }

  /**
   * Health Check ตรวจสอบการเข้าถึง Discovery Document ของ SSO Server
   * ★ สำคัญ: ต้องใช้ HttpClient ของ Angular (ห้าม fetch) และตั้ง timeout 2000ms (1.5 - 2s ตามข้อกำหนด)
   */
  public async healthCheck(): Promise<boolean> {
    const discoveryUrl = `${environment.oidc.issuer}/.well-known/openid-configuration`;
    const timeoutMs = environment.oidc.healthCheckTimeoutMs || 2000;
    try {
      await this.http.get(discoveryUrl).pipe(
        timeout(timeoutMs)
      ).toPromise();
      return true;
    } catch (error) {
      console.warn(`[RUTS SSO] Health check failed or timed out (${timeoutMs}ms):`, error);
      return false;
    }
  }

  /**
   * เริ่มกระบวนการ Login ผ่าน SSO
   * ★ กฎสำคัญ: ต้อง await loadDiscoveryDocument() ก่อน initCodeFlow() เสมอ (ป้องกันปัญหา HRMS ข้อ 2)
   */
  public async login(): Promise<void> {
    this.configure();
    await this.oauthService.loadDiscoveryDocument();
    this.oauthService.initCodeFlow();
  }

  /**
   * ตรวจสอบและประมวลผล Callback หลัง Keycloak redirect กลับมาที่ /login?code=...
   */
  public async handleCallback(): Promise<{ success: boolean; message?: string; user?: any }> {
    this.configure();
    try {
      // 1. แลกเปลี่ยน authorization_code เป็น Token
      const loginSuccess = await this.oauthService.loadDiscoveryDocumentAndTryLogin();
      
      if (!this.oauthService.hasValidAccessToken()) {
        return { success: false, message: 'ไม่สามารถแลกเปลี่ยน Token จาก SSO Server ได้' };
      }

      // 2. ★ เก็บ id_token ทันทีหลัง login เพื่อใช้ส่งเป็น id_token_hint ตอน Logout
      const idToken = this.oauthService.getIdToken();
      if (idToken) {
        sessionStorage.setItem('sso-id-token', idToken);
        localStorage.setItem('sso-id-token', idToken);
      }

      // 3. ดึง Claims จาก Identity Token และ UserInfo
      const claims: any = this.oauthService.getIdentityClaims() || {};
      const accessToken = this.oauthService.getAccessToken();

      let userProfile: any = {};
      try {
        userProfile = await this.oauthService.loadUserProfile();
      } catch (e) {
        userProfile = claims;
      }

      const combinedClaims = { ...claims, ...userProfile };

      // 4. ส่ง Claims ไปยัง Backend loginSSO.php เพื่อตรวจสิทธิใน vUSER_ACC3D และรับ JWT ระบบ Budget
      let backendData: any = null;
      try {
        backendData = await this.authService.loginSSO(combinedClaims).toPromise();
      } catch (err) {
        console.warn('[RUTS SSO] Backend loginSSO.php call failed or not deployed yet, activating fallback mapping:', err);
      }

      // 5. บันทึก User & Token ลงในระบบ (พร้อม Token eLogin สำหรับเชื่อมต่อระบบเดิม EIS/PIS/RUTS)
      if (backendData && (backendData.status || backendData.success || backendData.accessToken)) {
        this.tokenStorage.saveToken(backendData.accessToken || accessToken);
        this.tokenStorage.saveUser(backendData);
        return { success: true, user: backendData };
      } else {
        // Fallback session mapping จาก Claims โดยตรง (ให้ระบบยังคงทำงานได้ต่อเนื่อง)
        const citizen = combinedClaims.cid || combinedClaims.username;
        const eLoginToken = combinedClaims.tokenelogin || combinedClaims.token || accessToken;
        const fallbackUser = {
          accessToken: accessToken,
          citizen: citizen,
          username: combinedClaims.username || combinedClaims.preferred_username,
          name: combinedClaims.name || `${combinedClaims.firstname || ''} ${combinedClaims.lastname || ''}`.trim(),
          permission: ['00', '15', '20'], // Default roles
          token: {
            data: {
              token: eLoginToken
            }
          },
          tokenelogin: eLoginToken,
          sso_login: true
        };

        this.tokenStorage.saveToken(accessToken);
        this.tokenStorage.saveUser(fallbackUser);
        return { success: true, user: fallbackUser };
      }
    } catch (error: any) {
      console.error('[RUTS SSO] Error in handleCallback:', error);
      return { success: false, message: error?.message || 'เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์ SSO' };
    }
  }

  /**
   * ออกจากระบบ (RP-Initiated Logout)
   * ★ ส่ง id_token_hint + post_logout_redirect_uri พร้อมพารามิเตอร์ ?no_auto=1
   */
  public logout(): void {
    const idToken = sessionStorage.getItem('sso-id-token') || localStorage.getItem('sso-id-token');
    
    // เคลียร์ session ภายในแอป
    this.tokenStorage.signOut();
    sessionStorage.removeItem('sso-id-token');
    localStorage.removeItem('sso-id-token');
    localStorage.removeItem('sso_logged_in');

    if (idToken) {
      const issuer = environment.oidc.issuer;
      const logoutUrl = `${issuer}/protocol/openid-connect/logout`;
      const postLogoutUri = encodeURIComponent(`${window.location.origin}/login?no_auto=1`);
      // Redirect ไปยัง Keycloak เพื่อทำลาย SSO session
      window.location.href = `${logoutUrl}?post_logout_redirect_uri=${postLogoutUri}&id_token_hint=${idToken}`;
    } else {
      window.location.href = `${window.location.origin}/login?no_auto=1`;
    }
  }

  /**
   * ตรวจสอบว่าผู้ใช้ล็อกอินผ่าน SSO หรือไม่
   */
  public isSsoLoggedIn(): boolean {
    return !!sessionStorage.getItem('sso-id-token') || !!localStorage.getItem('sso-id-token') || this.oauthService.hasValidAccessToken();
  }
}
