import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GroupMembersPageRoutingModule } from './group-members-routing.module';
import { GroupMembersPage } from './group-members.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    GroupMembersPageRoutingModule
  ],
  declarations: [GroupMembersPage]
})
export class GroupMembersPageModule {}
