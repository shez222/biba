import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OpenRequestsForMePage } from './open-requests-forme.page';

const routes: Routes = [
  {
    path: '',
    component: OpenRequestsForMePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OpenRequestsForMePageRoutingModule {}
