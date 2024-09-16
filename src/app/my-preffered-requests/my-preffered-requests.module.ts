import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MyPrefferedRequestsPageRoutingModule } from './my-preffered-requests-routing.module';
import { MyPrefferedRequestsPage } from './my-preffered-requests.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MyPrefferedRequestsPageRoutingModule
  ],
  declarations: [MyPrefferedRequestsPage]
})
export class MyPrefferedRequestsPageModule {}
