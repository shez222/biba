import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowAppliesPageRoutingModule } from './show-applies-routing.module';

import { ShowAppliesPage } from './show-applies.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowAppliesPageRoutingModule
  ],
  declarations: [ShowAppliesPage]
})
export class ShowAppliesPageModule {}
