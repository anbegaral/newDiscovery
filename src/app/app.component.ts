import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  rootPage: string;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public translate: TranslateService,
    private storage: Storage
  ) {
    this.translate.setDefaultLang('en');
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
        this.storage.ready().then(
          () => this.storage.get('lang').then(
            (data) => {
              if (data === null || data === 'undefined') {
                this.translate.setDefaultLang('en');
                this.splashScreen.hide();
                // borrar estas lineas y descomentar la anterior
                this.translate.use('en');
              } else {
                this.translate.use(data);
              }
            }
          )
        );
      });
  }
}
