import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';
import {Device} from "@awesome-cordova-plugins/device";
import {AppVersion} from "@awesome-cordova-plugins/app-version";
import {FirebaseX} from "@awesome-cordova-plugins/firebase-x/ngx";
import {Subject} from "rxjs";
import {ProfileService} from "./profile.service";

type PushNotificationData = {
  deviceType: string,
  deviceToken: string|null,
  deviceKey: string,
  appVersion: string
};

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  private notificationTrigger = new Subject<number>();
  public notificationTriggered$ = this.notificationTrigger.asObservable();
  public unreadNotifications: number = 0;

  constructor(private SendReceiveRequestsService: SendReceiveRequestsService,
              private FBX: FirebaseX,
              private Platform: Platform,
              private profileService: ProfileService) {
    this.SendReceiveRequestsService.ObservableOnNotificationReaded().subscribe(data => {
      if (data.IS_PUSH_READED) {
        this.updateNotificationCount();
      }
    });

    this.updateNotificationCount();
  }

  async RegisterPushNotification(){
    let pushNotificationData : PushNotificationData | null;
    if (this.Platform.is("cordova")) {
      pushNotificationData = await this.RegisterPushNotifications();
    } else {
      pushNotificationData = this.RegisterPushNotificationsStub();
    }

    await this.UpdateDeviceInformation(pushNotificationData);
  }

  async UpdateDeviceInformation(pushNotificationData : PushNotificationData | null){
    if(pushNotificationData != null)
    {
      let RegisterPushToken=
        {
          token:pushNotificationData.deviceToken,
          device_type:pushNotificationData.deviceType,
          device_key:pushNotificationData.deviceKey,
          app_version:pushNotificationData.appVersion,
        }
      await this.SendReceiveRequestsService.RegisterPushToken(RegisterPushToken).then((result) =>
      {}).catch(error =>
      {
        console.log("Error registring token",error);
      });
    }
  }

  async RegisterPushNotifications() : Promise<PushNotificationData | null> {
    try {
      const permissionGranted = await this.FBX.hasPermission();
      if (!permissionGranted) {
        await this.FBX.grantPermission();
        console.log("Permission prompted");
      }
    } catch (error) {
      console.log("Error checking/granting permission", error);
      return null;
    }
    const deviceType = this.Platform.is('android') ? 'android' : 'ios';
    const deviceKey = Device.uuid;
    const appVersion = await AppVersion.getVersionNumber();
    let token : string|null = null;
    try {
      token = await this.FBX.getToken();
    } catch (error) {
      console.log("Error getting token", error);
    }
    this.SubscribeRefreshPushToken();
    this.FBX.onMessageReceived().subscribe(this.HandleMessageReceived.bind(this));
    return {
      deviceType: deviceType,
      deviceToken: token,
      deviceKey: deviceKey,
      appVersion: appVersion
    };
  }

  RegisterPushNotificationsStub() : PushNotificationData {
    console.log("Init Push")
    return {
      deviceType: 'android',
      deviceToken: 'dummy-token',
      deviceKey: '12345-mock-device-id',
      appVersion: "9.9.9"
    };
  }

  HandleMessageReceived(Message:any){
    this.updateNotificationCount();
    if(Message.tap)
    {
      this.SendReceiveRequestsService.Router.navigate(['/notifications']);
    }
  }

  SubscribeRefreshPushToken()
  {
    this.FBX.onTokenRefresh().subscribe(async (Token) =>
    {
      const pushNotificationData : PushNotificationData = {
        deviceType: (this.Platform.is('android') ? 'android' : 'ios'),
        deviceToken: Token!,
        deviceKey: Device.uuid,
        appVersion: await AppVersion.getVersionNumber()
      };
      await this.UpdateDeviceInformation(pushNotificationData);
    });
  }

  async updateNotificationCount() {
    try {
      const result : any = await this.SendReceiveRequestsService.GetNumberOfUnReadNotification();
      console.log(result);
      this.unreadNotifications = result.unreadNotification;
      this.notificationTrigger.next(result.unreadNotification);
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      // Optional: handle the error in the UI
    }
  }
}
