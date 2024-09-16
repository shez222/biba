import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlertToShowPage } from './alert-to-show.page';

const routes: Routes = [
  {
    path: '',
    component: AlertToShowPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlertToShowPageRoutingModule {}
