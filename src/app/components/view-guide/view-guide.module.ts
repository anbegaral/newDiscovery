import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TranslateModule } from '@ngx-translate/core';
import { ViewGuideComponent } from './view-guide.component';
import { PreloadImageComponentModule } from '../preload-image/preload-image.module';

const routes: Routes = [
    { path: '', component: ViewGuideComponent },
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PreloadImageComponentModule,
        TranslateModule.forChild(),
        RouterModule.forChild(routes)
    ],
    declarations: [ViewGuideComponent],
    exports: [RouterModule]
})
export class ViewGuideComponentModule { }
