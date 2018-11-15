import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Country, Location } from '../../services/models';
import { TranslateService } from '@ngx-translate/core';
import { LocationsService } from '../../services/locations.service';
import { Nav } from '@ionic/angular';

@Component({
  selector: 'location-dropdown',
  templateUrl: './location-dropdown.component.html',
  styleUrls: ['./location-dropdown.component.scss']
})
export class LocationDropdownComponent {

    @ViewChild(String) idCountry: string;
    lang: string;
    @Input() creating = false;
    @Output() creatingEvent = new EventEmitter<boolean>();
    @Output() creatingLocationEvent = new EventEmitter<any>();

    @Output() idLocationEvent = new EventEmitter<string>();

    countries: Country[] = [];
    locations: Location[] = [];

    placesDisabled = true;

    constructor(public translate: TranslateService,
      private locationService: LocationsService) {
      this.getCountries();
      this.lang = this.translate.getDefaultLang();
    }

    getCountries() {
      this.locationService.getCountries().subscribe(countries => {
        countries.forEach((element: Country) => {
          // Getting the country by selected lang
          const countryNameLang = element.language.find(language => language.code === this.lang);
          element.countryName = countryNameLang.name;
          this.countries.push(element);
        });
      });
    }

    getLocations(event: any) {
      const idCountry = event.target.value;
      if (idCountry === 'other') {
        this.showInputs();
      } else {
        this.placesDisabled = false;
        this.locationService.getLocationsByCountry(idCountry).subscribe(locations => {
          locations.forEach(element => {
              // Getting the location by selected lang
              const locationName = element.language.find(language => language.code === this.lang);
              element.locationName = locationName.name;
              this.locations.push(element);
          });
        });
      }
    }

    sendLocation(event: any) {
      const idLocation = event.target.value;
      if (idLocation === 'other') {
        this.showLocationInput(this.idCountry);
      } else {
        this.idLocationEvent.emit(idLocation);
      }
    }

    showInputs() {
      this.creatingEvent.emit(true);
    }

    showLocationInput(idCountry: string) {
      this.creatingLocationEvent.emit({event, idCountry});
    }

}
