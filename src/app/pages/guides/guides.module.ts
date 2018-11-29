import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GuidesPage } from './guides.page';

const routes: Routes = [
  { path: '', component: GuidesPage, outlet: 'guides' }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GuidesPage],
  exports: [RouterModule]
})
export class GuidesPageModule {}
