import { LocationsService } from './../../services/locations.service';
import { Component, OnInit } from '@angular/core';
import { Audioguide } from '../../services/models';
import { AudioguideService } from '../../services/audioguide.service';
import { LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-guides',
  templateUrl: './guides.page.html',
  styleUrls: ['./guides.page.scss'],
})
export class GuidesPage implements OnInit {
    audioguides: Audioguide[] = [];
    locationName: string;
    lang: string;
    loader: any;
  constructor(
        private audioguideService: AudioguideService,
        private locationService: LocationsService,
        private loadingCtrl: LoadingController,
        public translate: TranslateService,
        private route: ActivatedRoute
    ) {}

  ngOnInit() {
    this.lang = this.translate.getDefaultLang();
    this.getAudioguides();
  }

  async presentLoadingWithOptions(message) {
    const loading = await this.loadingCtrl.create({
      spinner: 'bubbles',
      duration: 5000,
      message: message,
      translucent: true,
    //   cssClass: 'custom-class custom-loading'
    });
    return await loading.present();
  }

  getAudioguides() {
    const idLocation = this.route.snapshot.paramMap.get('id');

    this.presentLoadingWithOptions('Loading audioguides...');

    this.locationService.getLocationById(idLocation).subscribe(location =>
        this.locationName = location[0].language.find(language => language.code === this.lang).name);

    this.audioguideService.getAudioguideListByLocation(idLocation).subscribe(audioguides => {
      this.audioguides = audioguides;
      this.audioguides.forEach(audioguide => {
        audioguide.location = this.locationName;
        this.audioguideService.getPoiList(audioguide.key).subscribe(pois => {
          audioguide.audioguidePois = pois;
        });
      });
    });
  }
}
