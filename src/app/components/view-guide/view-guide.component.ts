import { PlayGuideProvider } from './../../services/play-service';
import { AudioguideService } from './../../services/audioguide.service';
import { AlertController } from '@ionic/angular';
import { LoadingController, NavController } from '@ionic/angular';
import { Audioguide } from './../../services/models';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SqliteServiceProvider } from '../../services/sqlite-service';
import { Storage } from '@ionic/storage';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-view-guide',
    templateUrl: './view-guide.component.html',
    styleUrls: ['./view-guide.component.scss']
})
export class ViewGuideComponent implements OnInit {
    audioguide: Audioguide;
    isPlaying: any = false;

    constructor(private storage: Storage,
        private sqliteService: SqliteServiceProvider,
        public translate: TranslateService,
        public loadingCtrl: LoadingController,
        public navCtrl: NavController,
        private route: ActivatedRoute,
        public alertCtrl: AlertController,
        private audioguideService: AudioguideService,
        private playService: PlayGuideProvider) {}

    ngOnInit() {
        this.getAudioguide();
    }

    listen(filename) {
        this.playService.listenStreaming(filename);
        this.playService.isPlaying.subscribe(isPlaying => this.isPlaying = isPlaying);
    }

    pause() {
        this.playService.pause();
        this.playService.isPlaying.subscribe(isPlaying => this.isPlaying = isPlaying);
    }

    stop() {
        this.playService.stop();
        this.playService.isPlaying.subscribe(isPlaying => this.isPlaying = isPlaying);
    }

    async presentAlertConfirm() {
        const alert = await this.alertCtrl.create({
        header: 'Error!',
        message: 'This audioguide already exists.',
        buttons: [
          {
            text: 'Close',
            role: 'close',
            // cssClass: 'secondary',
            handler: () => {
                this.navCtrl.navigateForward('/GuidesPage');
            }
          }
        ]
      });
      await alert.present();
    }

    getAudioguide() {
        const idAudioguide = this.route.snapshot.paramMap.get('id');
        this.audioguideService.getAudioguide(idAudioguide).subscribe(audioguide => {
            this.audioguide = audioguide[0];
            this.audioguideService.getPoiList(this.audioguide.key).subscribe(poi => this.audioguide.audioguidePois = poi);
        });
    }

    getAccount() {
        this.storage.get('isLoggedin').then(isLoggedin => {
            if (isLoggedin) {
                // TODO sistema de compra
                this.sqliteService.getDatabaseState().subscribe(ready => {
                    if (ready) {
                        this.buyAudioguide(this.audioguide);
                    }
                });
            } else {
                this.storage.get('useremail').then(
                    (data) => {
                        console.log(`no logged in ` + data);
                        if (data === null || data === 'undefined') {
                            console.log(`no registered in ` + data);
                            this.navCtrl.navigateForward('/tabs/(home:view-guide/:' + this.audioguide.id + ')');
                        } else {
                            console.log(`registered in ` + data);
                            this.navCtrl.navigateForward('/tabs/(home:login/:' + this.audioguide.id + ')');
                        }
                    }
                );
            }
        });
    }

    buyAudioguide(audioguide: Audioguide) {
        // Checks if the audioguide is already downloaded in sqlite
        this.sqliteService.getAudioguide(audioguide.key).then(data => {
            console.log(`buy ` + data);
            if (data === null) {  // it does not exist
                audioguide.purchased = true;
                this.sqliteService.addAudioguide(audioguide).then(() => {
                    this.navCtrl.navigateForward('/GuidesPage');
                }).catch(error => console.log('error addAudioguide ' + error));
            } else {
                this.presentAlertConfirm();
            }
        }).catch(error => console.log('Error buyAudioguide:  ' + error.message.toString()));
    }
}
