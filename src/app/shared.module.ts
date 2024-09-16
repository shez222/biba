import { NgModule } from '@angular/core';
import {NotificationBadgeComponent} from "./components/notification-badge/notification-badge.component";
import {CommonModule} from "@angular/common";
import {IonicModule} from "@ionic/angular";

@NgModule({
  declarations: [NotificationBadgeComponent],
  imports:
  [
    CommonModule,
    IonicModule
  ],
  exports: [
    CommonModule,
    IonicModule,
    NotificationBadgeComponent]
})
export class SharedModule {}
