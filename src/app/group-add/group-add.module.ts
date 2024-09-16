import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GroupAddPageRoutingModule } from './group-add-routing.module';
import { GroupAddPage } from './group-add.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    GroupAddPageRoutingModule
  ],
  declarations: [GroupAddPage]
})
export class GroupAddPageModule {}
