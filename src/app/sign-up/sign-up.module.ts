import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SignUpPageRoutingModule } from './sign-up-routing.module';
import { SignUpPage } from './sign-up.page';
import { MaskitoModule } from '@maskito/angular';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaskitoModule,
    IonicModule,
    SignUpPageRoutingModule
  ],  
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  declarations: [SignUpPage]
})
export class SignUpPageModule {}
