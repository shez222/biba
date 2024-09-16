import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OpenRequestsMainPage } from './open-requests-main.page';
/*
const routes: Routes = [
  {
    path: '',
    component: OpenRequestsMainPage
  }
];
*/
const routes: Routes = 
[
  {
    path: 'open-requests-main',
    component: OpenRequestsMainPage,
    children: [
      {
        path: 'open-requests-forme',
        children: [
          {
            path: '',            
            loadChildren: () => import('../open-requests-forme/open-requests-forme.module').then( m => m.OpenRequestsForMePageModule)
          }
        ]
      },
      {
        path: 'open-requests-nearby',
        children: [
          {
            path: '',
            loadChildren: () => import('../open-requests-nearby/open-requests-nearby.module').then( m => m.OpenRequestsNearbyPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: 'open-requests-main/open-requests-forme',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'open-requests-main/open-requests-forme',
    pathMatch: 'full'
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OpenRequestsMainPageRoutingModule {}
