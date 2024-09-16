import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { AlertToShowPage } from '../alert-to-show/alert-to-show.page';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';
import {TranslationService} from "../services/translation.service";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})

export class NotificationsPage implements OnInit
{
	public ResultResponseData:any=[];
	public ResponseData:any=[];
	constructor(private SendReceiveRequestsService : SendReceiveRequestsService,
              private LoadingCtrl : LoadingController,
              private ModalController: ModalController,
              public translation: TranslationService)
	{ }

	ngOnInit()
	{
		this.GetAllNotifications();
	}

	async GetAllNotifications()
	{
		//LOADER
		const Loading = await this.LoadingCtrl.create({
			spinner: 'circles',
			message: 'Please Wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await Loading.present();
		//LOADER
		await this.SendReceiveRequestsService.GetAllNotifications().then(result =>
		{
			Loading.dismiss();//DISMISS LOADER
			this.ResultResponseData = result;
			if(this.ResultResponseData['result']==1)
			{
				this.ResponseData=this.ResultResponseData['notification'];
			}
			else
			{
				this.SendReceiveRequestsService.showMessageToast(this.ResultResponseData['message']);
			}
			console.log(this.ResponseData);
		},
		error =>
		{
			Loading.dismiss();//DISMISS LOADER
			console.log(error);
		});
	}

	ShowUpdatedContent(ev:any)
	{
		setTimeout(() =>
	    {
			this.GetAllNotifications();
	      	ev.target.complete();
	    }, 2000);
	}

	async ShowNotification(NotificationID:any)
	{
		const modal = await this.ModalController.create({
			component: AlertToShowPage,
			showBackdrop: false,
			componentProps:
			{
				AlertType: "NotificationDetail",
				NotificationID:NotificationID,
			}
		});
		modal.onDidDismiss().then(() =>
		{
			this.GetAllNotifications();
		});
		return await modal.present();
	}
}
