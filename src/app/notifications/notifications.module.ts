import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotificationsPageRoutingModule } from './notifications-routing.module';
import { NotificationsPage } from './notifications.page';
import {SharedModule} from "../shared.module";

@NgModule({
    imports: [
        FormsModule,
        NotificationsPageRoutingModule,
        SharedModule
    ],
  declarations: [NotificationsPage]
})
export class NotificationsPageModule {}
