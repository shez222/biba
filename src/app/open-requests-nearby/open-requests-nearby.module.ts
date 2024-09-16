import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OpenRequestsNearbyPageRoutingModule } from './open-requests-nearby-routing.module';
import { OpenRequestsNearbyPage } from './open-requests-nearby.page';
import {SharedModule} from "../shared.module";

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        OpenRequestsNearbyPageRoutingModule,
        SharedModule
    ],
  declarations: [OpenRequestsNearbyPage]
})
export class OpenRequestsNearbyPageModule {}
