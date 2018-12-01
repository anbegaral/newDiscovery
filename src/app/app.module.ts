import { PreloadImageComponentModule } from './components/preload-image/preload-image.module';
import { FilesServiceProvider } from './services/files-service';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from '@angular/fire';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicStorageModule } from '@ionic/storage';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './src/assets/i18n/', '.json');
  }

export const firebaseConfig = {
    apiKey: 'AIzaSyB0uWbXfQ3QauZzCoJZ8DjZi-PFkYEOYTQ',
    authDomain: 'discoveryag-15cc2.firebaseapp.com',
    databaseURL: 'https://discoveryag-15cc2.firebaseio.com',
    projectId: 'discoveryag-15cc2',
    storageBucket: 'discoveryag-15cc2.appspot.com',
    messagingSenderId: '79539419393'
  };
@NgModule({
  declarations: [
      AppComponent
    ],
  entryComponents: [],
  imports: [
      BrowserModule,
      IonicModule.forRoot(),
      IonicStorageModule.forRoot({
        name: '__mydb',
           driverOrder: ['sqlite', 'websql', 'indexeddb']
      }),
      AppRoutingModule,
      AngularFireModule.initializeApp(firebaseConfig),
      AngularFireDatabaseModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      }),
      HttpClientModule
    ],
  providers: [
    StatusBar,
    SplashScreen,
    TranslateService,
    SQLite,
    FilesServiceProvider,
    File,
    FileTransfer,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports: [
    TranslateModule
  ]
})
export class AppModule {}
