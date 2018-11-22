import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { LocationsDropdownComponentModule } from '../../components/location-dropdown/locations-dropdown.module';

const routes: Routes = [
    { path: '', component: HomePage },
];

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TranslateModule.forChild(),
        LocationsDropdownComponentModule,
        RouterModule.forChild(routes)
    ],
    declarations: [HomePage],
    exports: [RouterModule]
})
export class HomePageModule { }
