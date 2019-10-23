import { ViewGuideComponentModule } from './../../components/view-guide/view-guide.module';
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
import { ListGuidesPageModule } from '../list-guides/list-guides.module';
import { LoginComponentModule } from '../../components/login/login.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    HomePageModule,
    GuidesPageModule,
    ContactPageModule,
    ListGuidesPageModule,
    ViewGuideComponentModule,
    LoginComponentModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
