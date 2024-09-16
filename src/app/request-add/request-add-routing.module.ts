import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestAddPage } from './request-add.page';

const routes: Routes = [
  {
    path: '',
    component: RequestAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestAddPageRoutingModule {}
