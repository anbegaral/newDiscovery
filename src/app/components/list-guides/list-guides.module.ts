import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListGuidesComponent } from './list-guides.component';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
    { path: '', component: ListGuidesComponent },
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslateModule.forChild(),
        RouterModule.forChild(routes)
    ],
    declarations: [ListGuidesComponent],
    exports: [RouterModule]
})
export class ListGuidesComponentModule { }
