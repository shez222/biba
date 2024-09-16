import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyPrefferedRequestsPage } from './my-preffered-requests.page';

const routes: Routes = [
  {
    path: '',
    component: MyPrefferedRequestsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyPrefferedRequestsPageRoutingModule {}
