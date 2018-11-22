import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs.router.module';

import { TabsPage } from './tabs.page';
import { ContactPageModule } from '../contact/contact.module';
import { GuidesPageModule } from '../guides/guides.module';
import { HomePageModule } from '../home/home.module';
import { ListGuidesComponentModule } from '../../components/list-guides/list-guides.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    HomePageModule,
    GuidesPageModule,
    ContactPageModule,
    ListGuidesComponentModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
