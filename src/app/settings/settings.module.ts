import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SettingsPageRoutingModule } from './settings-routing.module';
import { SettingsPage } from './settings.page';
import {SharedModule} from "../shared.module";

@NgModule({
  imports: [
    FormsModule,
    SettingsPageRoutingModule,
    SharedModule
  ],
  declarations: [SettingsPage]
})
export class SettingsPageModule {}
