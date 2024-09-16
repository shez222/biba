import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OpenRequestsForMePageRoutingModule } from './open-requests-forme-routing.module';
import { OpenRequestsForMePage } from './open-requests-forme.page';
import { ExpandableFormeComponent } from '../components/expandable-forme/expandable-forme.component';
import {SharedModule} from "../shared.module";

@NgModule({
    imports: [
        FormsModule,
        OpenRequestsForMePageRoutingModule,
        SharedModule
    ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  declarations: [OpenRequestsForMePage, ExpandableFormeComponent]
})
export class OpenRequestsForMePageModule {}
