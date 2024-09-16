import { Component, OnInit } from '@angular/core';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';
import { LoadingController, AlertController, NavController } from '@ionic/angular';
import {ProfileService} from "../services/profile.service";
import {TranslationService} from "../services/translation.service";
import {UtilService} from "../services/util.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})

export class SettingsPage implements OnInit
{
	public UserInformationData:any=[];
	public ResultAnyAction:any=[];
	public DoesItHasImage:boolean=false;

	constructor(private LoadingCtrl: LoadingController,
              private SendReceiveRequestsService: SendReceiveRequestsService,
              private AlertController: AlertController,
              private NavController: NavController,
              private profileService: ProfileService,
              private utils: UtilService,
              public translation: TranslationService)
	{
  }

	ngOnInit()
	{
	}

	ionViewWillEnter()
	{
		this.UserInformationData=this.profileService.GetUserProfileData();
		//this.DoesItHasImage=(this.UserInformationData.hasOwnProperty('image')) ? true : false;
		this.DoesItHasImage=(this.UserInformationData['image']!="") ? true : false;
	}

	GoToPage(PageToGo:any)
	{
		this.SendReceiveRequestsService.Router.navigate(['/'+PageToGo]);
	}

	async ShareOnSocialNetwork()
	{
		let ShareURL = "https://babysitter-app.com/#appStoreMain";
		let Message = this.translation.trans('settings','ShareText');
		await this.utils.ShareOnSocialNetwork("none","Share","none",Message,"Babysitter-App","",ShareURL);
	}

	async ConfirmDeletingAccount()
	{
		let Message = "";
		Message += this.translation.trans('settings','DeleteMessage');
		const alert = await this.AlertController.create({
			cssClass: 'my-custom-alert',
			header: this.translation.trans('common-requests-block','Decline_1'),
			subHeader: Message,
			//message: 'Are you sure to remove applies ?',
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
						this.DeletingAccount();
						console.log('Confirm Okay');
					}
				}
			]
			});
			await alert.present();
	}

	async DeletingAccount()
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
		await this.SendReceiveRequestsService.DeletingAccount().then(result =>
		{
			Loading.dismiss();//DISMISS LOADER
			this.ResultAnyAction = result;
			if(this.ResultAnyAction['result']==1)
			{
				this.SendReceiveRequestsService.showMessageToast(this.ResultAnyAction['message']);
				localStorage.clear();
				this.NavController.setDirection("root");
				this.SendReceiveRequestsService.Router.navigate(['/sign-in']);
			}
		},
		error =>
		{
			Loading.dismiss();//DISMISS LOADER
			console.log(error);
		});
	}
}
