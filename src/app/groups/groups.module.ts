import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GroupsPageRoutingModule } from './groups-routing.module';
import { GroupsPage } from './groups.page';
import {SharedModule} from "../shared.module";

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        GroupsPageRoutingModule,
        SharedModule
    ],
  declarations: [GroupsPage]
})
export class GroupsPageModule {}
