import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OpenRequestsNearbyPage } from './open-requests-nearby.page';

const routes: Routes = [
  {
    path: '',
    component: OpenRequestsNearbyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OpenRequestsNearbyPageRoutingModule {}
