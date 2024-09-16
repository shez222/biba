import { Component } from '@angular/core';
import { SendReceiveRequestsService } from './providers/send-receive-requests.service';
import { Platform, MenuController, NavController, ModalController } from '@ionic/angular';
import { AlertToShowPage } from './alert-to-show/alert-to-show.page';
import { Deeplinks } from '@awesome-cordova-plugins/deeplinks/ngx';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import {BehaviorSubject, Observable} from 'rxjs';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import {PushNotificationService} from "./services/push-notification.service";
import {MyAppliesPage} from "./my-applies/my-applies.page";
import {ProfileService} from "./services/profile.service";
import {TranslationService} from "./services/translation.service";

export enum ConnectionStatus
{
  Online,
  Offline
}//CHECKING ONLINE/OFFLINE NETWORK AVAILIBILITY

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public UserInformationData:any=[];
  public DoesItHasImage:boolean=false;
  private status = new BehaviorSubject(ConnectionStatus.Offline);//CHECKING ONLINE/OFFLINE NETWORK AVAILIBILITY

  constructor(private StatusBar: StatusBar,
              private Network: Network,
              private ModalController : ModalController,
              private Menu: MenuController,
              private SendReceiveRequestsService: SendReceiveRequestsService,
              private Platform: Platform,
              private NavController: NavController,
              private Deeplinks: Deeplinks,
              private PushNotificationService: PushNotificationService,
              private profileService: ProfileService,
              public translation: TranslationService)
  {
    this.Platform.ready().then(async () =>
    {
      this.initializeNetworkEvents();
      let status =  this.Network.type !== 'none' ? ConnectionStatus.Online : ConnectionStatus.Offline;//CHECKING ONLINE/OFFLINE NETWORK AVAILIBILITY
      this.status.next(status);//CHECKING ONLINE/OFFLINE NETWORK AVAILIBILITY
    });

    this.profileService.observableOnProfileDataChanged().subscribe(() =>
    {
      this.UserInformationData=this.profileService.GetUserProfileData();
      if(this.UserInformationData!=null)
      {
        this.DoesItHasImage=(this.UserInformationData['image'] != "");
      }
    });
  }

  public initializeNetworkEvents()
  {
    this.Network.onDisconnect().subscribe(async () =>
    {
      if(this.status.getValue() === ConnectionStatus.Online)
      {
        console.log('WE ARE OFFLINE');
        this.SendReceiveRequestsService.PublishOnNetworkOnLineOffLine({
					IS_NEWWORK_OFFLINE: true
				});//THIS OBSERVABLE IS USED ON CHECKING ONLINE/OFFLINE NETWORK AVAILIBILITY
        this.InitilizeAPP();
        this.updateNetworkStatus(ConnectionStatus.Offline);
        /*
        OFFLINE ALERT
        */
        const modal = await this.ModalController.create({
          component: AlertToShowPage,
          showBackdrop: false,
          componentProps:
          {
            AlertType: "OFFLINE",
          }
        });
        return await modal.present();
        /*
        OFFLINE ALERT
        */
      }
    });

    this.Network.onConnect().subscribe(() =>
    {
      if(this.status.getValue() === ConnectionStatus.Offline)
      {
        this.SendReceiveRequestsService.PublishOnNetworkOnLineOffLine({
					IS_NEWWORK_OFFLINE: false
				});//THIS OBSERVABLE IS USED ON CHECKING ONLINE/OFFLINE NETWORK AVAILIBILITY
        console.log('WE ARE ONLINE');
        this.InitilizeAPP();
        this.updateNetworkStatus(ConnectionStatus.Online);
      }
    });

    if(this.status.getValue() === ConnectionStatus.Offline)
    {
      this.InitilizeAPP();
    }
  }//CHECKING ONLINE/OFFLINE NETWORK AVAILIBILITY

  private async updateNetworkStatus(status: ConnectionStatus)
  {
    this.status.next(status);
    let connection = status == ConnectionStatus.Offline ? 'Offline' : 'Online';
  }//CHECKING ONLINE/OFFLINE NETWORK AVAILIBILITY

  public onNetworkChange(): Observable<ConnectionStatus>
  {
    return this.status.asObservable();
  }//CHECKING ONLINE/OFFLINE NETWORK AVAILIBILITY

  public getCurrentNetworkStatus(): ConnectionStatus
  {
    return this.status.getValue();
  }//CHECKING ONLINE/OFFLINE NETWORK AVAILIBILITY

  async InitilizeAPP()
  {
    this.StatusBar.overlaysWebView(false);
    this.StatusBar.backgroundColorByHexString('#f5f5f5');

    //DEEP LINK
    this.Deeplinks.routeWithNavController(this.NavController, {
      '/my-applies/:id': MyAppliesPage
      }).subscribe(match =>
    {
      console.log('Successfully matched route', match);
      this.SendReceiveRequestsService.Router.navigate([match.$route], { queryParams: { requestId: match.$args['id']}});
    },nomatch =>
    {
      this.SendReceiveRequestsService.showMessageToast("Could not open link correctly");
      // nomatch.$link - the full link data
      console.log('NoMatch=', nomatch);
    });
    //DEEP LINK



    this.UserInformationData=this.profileService.GetUserProfileData();
    if(this.UserInformationData!=null)
    {
      this.Menu.enable(true);
      this.PushNotificationService.updateNotificationCount();
      this.DoesItHasImage=(this.UserInformationData['image'] != "");
      this.SendReceiveRequestsService.Router.navigate(['/open-requests-main']);
    }
    else
    {
      this.Menu.enable(false);
      this.NavController.setDirection("root");
      this.SendReceiveRequestsService.Router.navigate(['/sign-in']);
    }
    console.log("UserInfo",this.UserInformationData);
  }

  GoToProfile()
  {
    this.Menu.close();
    this.SendReceiveRequestsService.Router.navigate(['/profile']);
  }

  async Logout()
  {
    await this.SendReceiveRequestsService.Logout().then(async (result) =>
		{
      console.log(result);
    }).catch(error =>
    {
      console.log(error);
    });
    //localStorage.clear();
    this.Menu.enable(false);
    this.StatusBar.backgroundColorByHexString('#f5f5f5');
    localStorage.clear();
    this.NavController.setDirection("root");
    this.SendReceiveRequestsService.Router.navigate(['/sign-in']);
  }
}
