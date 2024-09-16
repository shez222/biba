import { Component, OnInit } from '@angular/core';
import {PushNotificationService} from "../../services/push-notification.service";
import {SendReceiveRequestsService} from "../../providers/send-receive-requests.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-notification-badge',
  templateUrl: './notification-badge.component.html',
  styleUrls: ['./notification-badge.component.scss'],
})
export class NotificationBadgeComponent  implements OnInit {

  public unReadPushNotification:number = 0;
  private subscriptions = new Subscription();

  constructor(private sendReceiveRequestsService: SendReceiveRequestsService,
              private pushNotificationService : PushNotificationService) {
    }

  async ngOnInit() {
    this.unReadPushNotification = this.pushNotificationService.unreadNotifications;
    this.pushNotificationService.notificationTriggered$.subscribe((notifications: number) => {
      this.unReadPushNotification = notifications;
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
