import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListGuidesPage } from './list-guides.page';
import { TranslateModule } from '@ngx-translate/core';
import { PreloadImageComponentModule } from '../../components/preload-image/preload-image.module';

const routes: Routes = [
  {
    path: '',
    component: ListGuidesPage
  }
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
  declarations: [ListGuidesPage],
  exports: [RouterModule]
})
export class ListGuidesPageModule {}
