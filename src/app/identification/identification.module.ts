import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IdentificationPageRoutingModule } from './identification-routing.module';
import { IdentificationPage } from './identification.page';
import { MultiFileUploadPassportComponent } from '../components/multi-file-upload-passport/multi-file-upload-passport.component';
import { MultiFileUploadIdentificationFrontComponent } from "../components/multi-file-upload-identification-front/multi-file-upload-identification-front.component";
import { MultiFileUploadIdentificationBackComponent } from "../components/multi-file-upload-identification-back/multi-file-upload-identification-back.component";
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FileUploadModule,
    IdentificationPageRoutingModule
  ],
  declarations: [IdentificationPage, MultiFileUploadPassportComponent, MultiFileUploadIdentificationFrontComponent, MultiFileUploadIdentificationBackComponent]
})
export class IdentificationPageModule {}
