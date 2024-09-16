import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MyAppliesPageRoutingModule } from './my-applies-routing.module';
import { MyAppliesPage } from './my-applies.page';
import { ExpandableMyappliesComponent } from '../components/expandable-myapplies/expandable-myapplies.component';
import {SharedModule} from "../shared.module";

@NgModule({
    imports: [
        FormsModule,
        MyAppliesPageRoutingModule,
        SharedModule
    ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  declarations: [MyAppliesPage, ExpandableMyappliesComponent]
})
export class MyAppliesPageModule {}
