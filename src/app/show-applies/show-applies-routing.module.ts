import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowAppliesPage } from './show-applies.page';

const routes: Routes = [
  {
    path: '',
    component: ShowAppliesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowAppliesPageRoutingModule {}
