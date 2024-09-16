import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProfilePageRoutingModule } from './profile-routing.module';
import { ProfilePage } from './profile.page';
import { MultiFileUploadComponent } from "../components/multi-file-upload/multi-file-upload.component";
import { FileUploadModule } from 'ng2-file-upload';
import { MaskitoModule } from '@maskito/angular';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaskitoModule,
    IonicModule,
    FileUploadModule,
    ProfilePageRoutingModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  declarations: [ProfilePage, MultiFileUploadComponent]
})
export class ProfilePageModule {}
