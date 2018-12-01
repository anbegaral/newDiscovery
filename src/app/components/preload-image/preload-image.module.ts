import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';
import { PreloadImageComponent } from './preload-image.component';

const routes: Routes = [
    { path: '', component: PreloadImageComponent },
];

@NgModule({
    declarations: [PreloadImageComponent],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslateModule.forChild(),
        RouterModule.forChild(routes)
    ],
    exports: [PreloadImageComponent],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class PreloadImageComponentModule { }
