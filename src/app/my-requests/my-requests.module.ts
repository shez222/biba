import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MyRequestsPageRoutingModule } from './my-requests-routing.module';
import { MyRequestsPage } from './my-requests.page';
import { ExpandableMyrequestsComponent } from '../components/expandable-myrequests/expandable-myrequests.component';
import {SharedModule} from "../shared.module";

@NgModule({
    imports: [
        FormsModule,
        MyRequestsPageRoutingModule,
        SharedModule
    ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  declarations: [MyRequestsPage, ExpandableMyrequestsComponent]
})
export class MyRequestsPageModule {}
