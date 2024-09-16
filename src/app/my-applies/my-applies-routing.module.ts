import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyAppliesPage } from './my-applies.page';

const routes: Routes = [
  {
    path: '',
    component: MyAppliesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyAppliesPageRoutingModule {}
