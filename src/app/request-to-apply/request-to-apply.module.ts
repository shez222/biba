import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RequestToApplyPageRoutingModule } from './request-to-apply-routing.module';
import { RequestToApplyPage } from './request-to-apply.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RequestToApplyPageRoutingModule
  ],
  declarations: [RequestToApplyPage]
})
export class RequestToApplyPageModule {}
