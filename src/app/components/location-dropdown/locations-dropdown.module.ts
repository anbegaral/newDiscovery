import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { LocationDropdownComponent } from './location-dropdown.component';

@NgModule({
    declarations: [LocationDropdownComponent],
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TranslateModule.forChild(),
    ],
    exports: [LocationDropdownComponent],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class LocationsDropdownComponentModule {}
