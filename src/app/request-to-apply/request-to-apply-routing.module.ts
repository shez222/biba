import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestToApplyPage } from './request-to-apply.page';

const routes: Routes = [
  {
    path: '',
    component: RequestToApplyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestToApplyPageRoutingModule {}
