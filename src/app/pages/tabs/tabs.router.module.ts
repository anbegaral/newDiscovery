import { ListGuidesComponent } from './../../components/list-guides/list-guides.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';
import { HomePage } from '../home/home.page';
import { GuidesPage } from '../guides/guides.page';
import { ContactPage } from '../contact/contact.page';
import { ViewGuideComponent } from '../../components/view-guide/view-guide.component';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: '/tabs/(home:home)',
        pathMatch: 'full',
      },
      {
        path: 'home',
        outlet: 'home',
        component: HomePage
      },
      {
        path: 'list-guides/:id',
        outlet: 'home',
        component: ListGuidesComponent
      },
      {
        path: 'view-guide/:id',
        outlet: 'home',
        component: ViewGuideComponent
      },
      {
        path: 'guides',
        outlet: 'guides',
        component: GuidesPage
      },
      {
        path: 'contact',
        outlet: 'contact',
        component: ContactPage
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/(home:home)',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
