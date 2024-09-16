import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AlertToShowPageRoutingModule } from './alert-to-show-routing.module';
import { AlertToShowPage } from './alert-to-show.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AlertToShowPageRoutingModule
  ],
  declarations: [AlertToShowPage]
})
export class AlertToShowPageModule {}
