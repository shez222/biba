import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddKidsPageRoutingModule } from './add-kids-routing.module';
import { AddKidsPage } from './add-kids.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AddKidsPageRoutingModule
  ],
  declarations: [AddKidsPage]
})
export class AddKidsPageModule {}
