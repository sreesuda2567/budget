import { ApplicationRef, Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval, Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { TokenStorageService } from './_services/token-storage.service';
import { OidcAuthService } from './_services/oidc-auth.service';
import { ApiPdoService } from './_services/api-pdo.service';
import { filter, first } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public version?: string;
  isLoggedIn = false;
  username?: string;
  isLoginFailed:any;
  text = "";
  isAdmin = false;
  private authSub?: Subscription;
  private routerSub?: Subscription;

  constructor(
    private tokenStorageService: TokenStorageService,
    private oidcAuthService: OidcAuthService,
    private apiService: ApiPdoService,
    private update: SwUpdate,
    private appRef: ApplicationRef,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.updateClient();
    this.checkUpdate();
  }

  ngOnInit(): void {
    this.version = "2.0.2";
    const nameVs = {'namev':'Ruts Platform','typev':'V','codev':this.version};
    this.tokenStorageService.saveVersion(nameVs);

    this.checkLoginStatus();

    // 1. รับฟังการเปลี่ยนแปลง Token/User (เช่น เข้าสู่ระบบผ่าน SSO หรือบันทึก Token สำเร็จ)
    this.authSub = this.tokenStorageService.authState$.subscribe(() => {
      this.checkLoginStatus();
    });

    // 2. รับฟัง Router Navigation เมื่อเปลี่ยนหน้า เพื่ออัปเดตสถานะเมนูเสมอ
    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkLoginStatus();
    });

    this.setupPdfPreviewHandlers();
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
    this.routerSub?.unsubscribe();
  }

  checkLoginStatus(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.username = user ? user.username : '';
      this.checkAdminStatus();
    } else {
      this.username = undefined;
      this.isAdmin = false;
    }
    this.cdr.detectChanges();
  }

  checkAdminStatus(): void {
    const user = this.tokenStorageService.getUser();
    const citizen = user?.citizen || user?.cid;

    // 1. ตรวจสอบค่าที่แคชไว้ใน sessionStorage หรือจาก user object ก่อน
    const cachedStatus = sessionStorage.getItem('acc3d_status') || user?.status;
    if (cachedStatus === 'A') {
      this.isAdmin = true;
    }

    if (!citizen) return;

    // 2. เรียกตรวจสอบสิทธิ์จาก /acc3d/status_menu.php เพื่อยืนยัน status ล่าสุด
    this.apiService.getdata('/acc3d/status_menu.php', 'readmenu', '', '', citizen)
      .pipe(first())
      .subscribe((data: any) => {
        if (data && data.status) {
          sessionStorage.setItem('acc3d_status', data.status);
          this.isAdmin = (data.status === 'A');
        } else if (user && user.status) {
          this.isAdmin = (user.status === 'A');
        }
      }, () => {
        const fallbackStatus = sessionStorage.getItem('acc3d_status') || user?.status;
        this.isAdmin = (fallbackStatus === 'A');
      });
  }

  logout(): void {
    sessionStorage.removeItem('acc3d_status');
    this.isAdmin = false;
    if (this.oidcAuthService.isSsoLoggedIn()) {
      this.oidcAuthService.logout();
    } else {
      this.tokenStorageService.signOut();
      window.location.href = window.location.origin + '/login?no_auto=1';
    }
  }

  updateClient() {
    if (!this.update.isEnabled) {
      console.log('Not Enables')
      return;
    }
    this.update.available.subscribe((event) => {
      console.log('current', event.current, 'available', event.available);
      if (confirm('คุณต้องการปรับปรุง PiS App เป็น New Version ตกลงหรือไม่?'/*+ this.version*/)) {
        this.update.activateUpdate().then(() => location.reload());
      }
    });
    this.update.activated.subscribe((event) => {
      console.log('current', event.previous, 'available', event.current);
    })
  }
  checkUpdate() {
    this.appRef.isStable.subscribe((isStable) => {
      if (isStable) {
        const timeInterval = interval(8 * 60 * 60 *100);
        timeInterval.subscribe(()=>{
          this.update.checkForUpdate().then(()=> console.log('check'));
          console.log('update checked');
        });

      }
    })
  }

  setupPdfPreviewHandlers(): void {
    if (typeof document === 'undefined') return;

    document.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target) return;

      // 1. Print button
      const printBtn = target.closest('.pdf-print-btn') as HTMLElement;
      if (printBtn) {
        event.preventDefault();
        event.stopPropagation();
        const panel = printBtn.closest('.pdf-preview-panel') || document.querySelector('.pdf-preview-panel.open');
        const iframe = panel?.querySelector('iframe') as HTMLIFrameElement;
        if (iframe && iframe.contentWindow) {
          try {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            return;
          } catch (e) {
            console.warn('Direct iframe print failed, trying window.open fallback', e);
          }
        }
        const openLink = panel?.querySelector('a[href]') as HTMLAnchorElement;
        if (openLink && openLink.href) {
          const printWin = window.open(openLink.href, '_blank');
          if (printWin) {
            printWin.focus();
            setTimeout(() => {
              try { printWin.print(); } catch (err) {}
            }, 500);
          }
        }
        return;
      }

      // 2. Maximize / Fullscreen toggle button
      const maxBtn = target.closest('.pdf-maximize-btn') as HTMLElement;
      if (maxBtn) {
        event.preventDefault();
        event.stopPropagation();
        const panel = maxBtn.closest('.pdf-preview-panel') as HTMLElement;
        if (panel) {
          const isMaximized = panel.classList.toggle('maximized');
          const icon = maxBtn.querySelector('i');
          if (icon) {
            if (isMaximized) {
              icon.className = 'fa-solid fa-compress';
              maxBtn.setAttribute('title', 'ย่อขนาด');
            } else {
              icon.className = 'fa-solid fa-expand';
              maxBtn.setAttribute('title', 'ขยายเต็มจอ');
            }
          }
        }
        return;
      }

      // 3. Reset maximize state when close button or overlay is clicked
      const closeBtn = target.closest('.pdf-preview-header button[title="ปิด"], .pdf-preview-overlay');
      if (closeBtn) {
        const panels = document.querySelectorAll('.pdf-preview-panel');
        panels.forEach(p => {
          p.classList.remove('maximized');
          const icon = p.querySelector('.pdf-maximize-btn i');
          if (icon) icon.className = 'fa-solid fa-expand';
        });
      }

      // 4. Reset maximize state when a new preview trigger is clicked
      const previewTrigger = target.closest('[click*="previewPdf"], [title*="รายงาน"]');
      if (previewTrigger) {
        const panels = document.querySelectorAll('.pdf-preview-panel');
        panels.forEach(p => {
          p.classList.remove('maximized');
          const icon = p.querySelector('.pdf-maximize-btn i');
          if (icon) icon.className = 'fa-solid fa-expand';
        });
      }
    });

    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        const openPanel = document.querySelector('.pdf-preview-panel.open');
        if (openPanel) {
          const closeBtn = openPanel.querySelector('.pdf-preview-header button[title="ปิด"]') as HTMLButtonElement;
          if (closeBtn) closeBtn.click();
        }
      }
    });
  }
}
