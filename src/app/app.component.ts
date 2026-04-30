import { ApplicationRef, Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';
import { TokenStorageService } from './_services/token-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public version?: string;
  isLoggedIn = false;
  username?: string;
  isLoginFailed:any;
  text = "";
  constructor(
    private tokenStorageService: TokenStorageService,
    private update: SwUpdate,
    private appRef: ApplicationRef

  ) {
    this.updateClient();
    this.checkUpdate();
  }
  ngOnInit(): void {
    this.version = "2.0.2";
    const nameVs = {'namev':'Ruts Platform','typev':'V','codev':this.version};
    this.tokenStorageService.saveVersion(nameVs);
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.username = user.username;
      //console.log(user);
    }

  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
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
}
