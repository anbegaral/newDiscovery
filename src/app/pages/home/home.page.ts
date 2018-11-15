import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { Location, Country } from '../../services/models';
import { NavController, LoadingController } from '@ionic/angular';
import { AudioguideService } from '../../services/audioguide.service';
import { LocationsService } from '../../services/locations.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
locations: Location[] = [];
  locationsSearched: Location[] = [];
  country: Country;
  numberOfAudioguides = 0;
  storageImageRef: any;
  loader: any;

  lang: string;

  isSearched = true;
  lastKeyPress = 0;

  constructor(public navCtrl: NavController,
    private audioguideService: AudioguideService,
    private locationService: LocationsService,
    public translate: TranslateService,
    private loadingCtrl: LoadingController) {
      this.lang = this.translate.getDefaultLang();
  }

  ngOnInit() {
    this.getLocations();
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

  getLocations($event?) {
    this.presentLoadingWithOptions('Loading locations...');
    const idLocation = $event;
    this.locationService.getLocations().subscribe(locations => {
      this.locations = [];
      // tslint:disable-next-line:no-shadowed-variable
      locations.forEach(element => {
        // Getting the audioguides by location
        this.audioguideService.getAudioguideListByLocation(element.key).subscribe(audioguides => {
          audioguides = audioguides.filter(audioguide => audioguide.reviewed === true);
          if (idLocation !== undefined) {
            audioguides = audioguides.filter(audioguide => audioguide.idLocation === idLocation);
          }
          element.numberOfAudioguides = audioguides.length;
          if (element.numberOfAudioguides > 0) {
            // Getting the country by location
            this.locationService.getCountryById(element.idCountry).subscribe(country => {
              const countryName = country[0].language.find(language => language.code === this.lang);
              element.countryName = countryName.name;
            });
            // Getting the location by selected lang
            const locationNameLang = element.language.find(language => language.code === this.lang);
            element.locationName = locationNameLang.name;
            this.locations.push(element);
          }
        });
      });
      this.locationsSearched = this.locations;
    }, error => console.log(error)
    );
  }

  initializeList(): void {
    this.locations = this.locationsSearched;
  }

  searchLocations($event) {

    this.initializeList();

    const val = $event.target.value;
    if (val && val.trim() !== '') {
      this.locations = this.locations.filter(location => {
        return location.language.filter(language => language.name.toLowerCase().indexOf(val.toLowerCase()) > -1).length > 0;
      });
    }
  }

//   openLocation(location: Location) {
//     this.navCtrl.push('ListGuidesPage', location);
//   }
}
