import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, LoadingController } from '@ionic/angular';
import { AddKidsPage } from '../add-kids/add-kids.page';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';
import {TranslationService} from "../services/translation.service";

@Component({
  selector: 'app-kids',
  templateUrl: './kids.page.html',
  styleUrls: ['./kids.page.scss'],
})

export class KidsPage implements OnInit
{
	public ResultResponseDeleting:any=[];
	public ResultResponseData:any=[];
	public ResponseData:any=[];

  	constructor(private SendReceiveRequestsService: SendReceiveRequestsService,
                private ModalController: ModalController,
                private AlertController: AlertController,
                private LoadingCtrl : LoadingController,
                public translation: TranslationService)
  	{ }

	ngOnInit()
	{
		this.KidsInformation();
	}

	async KidsInformation()
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
		await this.SendReceiveRequestsService.Kids().then(result =>
		{
			Loading.dismiss();//DISMISS LOADER
			this.ResultResponseData = result;
			if(this.ResultResponseData['result']==1)
			{
				this.ResponseData=this.ResultResponseData['kids'];
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

  	async ConfirmedDeletingKid(KidID:any)
	{
		const alert = await this.AlertController.create({
		cssClass: 'my-custom-alert',
		header: this.translation.trans('common-requests-block','Decline_1'),
		subHeader: this.translation.trans('kids','DeleteMessage'),
		//message: 'Are you sure to remove kid ?',
		buttons: [
			{
				text: this.translation.trans('common-requests-block','Decline_3'),
				role: 'cancel',
				cssClass: 'alert-button-cancel',
				handler: (blah) =>
				{
					console.log('Confirm Cancel: blah');
				}
			},
			{
				text: this.translation.trans('common-requests-block','Decline_2'),
				cssClass: 'alert-button-confirm',
				handler: () =>
				{
					this.DeletingKid(KidID);
					console.log('Confirm Okay');
				}
			}
		]
		});
		await alert.present();
	}

	async DeletingKid(KidID:any)
	{
		let ObjectGroup =
		{
			KidID:KidID
		}
		await this.SendReceiveRequestsService.DeleteKid(ObjectGroup).then(result =>
		{
			this.ResultResponseDeleting = result;
			if(this.ResultResponseDeleting['result']==1)
			{
				this.SendReceiveRequestsService.showMessageToast(this.ResultResponseDeleting['message']);
				this.KidsInformation();
			}
		},
		error =>
		{
		console.log(error);
		});
	}

	async AddKid(KidID:any,KidNM:any,KidDoB:any)
	{
		const modal = await this.ModalController.create({
			component: AddKidsPage,
			showBackdrop: false,
			componentProps:
			{
				KidID: KidID,
				KidNM: KidNM,
				KidDoB: KidDoB
			}
		});
		modal.onDidDismiss().then(() =>
		{
			this.KidsInformation();
		});
		return await modal.present();
	}

	ShowUpdatedContent(ev:any)
	{
		setTimeout(() =>
	    {
			this.KidsInformation();
	      	ev.target.complete();
	    }, 2000);
	}
}
