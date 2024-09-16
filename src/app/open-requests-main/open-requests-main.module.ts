import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OpenRequestsMainPageRoutingModule } from './open-requests-main-routing.module';
import { OpenRequestsMainPage } from './open-requests-main.page';
import {SharedModule} from "../shared.module";

@NgModule({
    imports: [
        FormsModule,
        OpenRequestsMainPageRoutingModule,
        SharedModule
    ],
  declarations: [OpenRequestsMainPage]
})
export class OpenRequestsMainPageModule {}
