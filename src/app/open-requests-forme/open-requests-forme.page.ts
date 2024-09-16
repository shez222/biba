import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';
import { RequestToApplyPage } from '../request-to-apply/request-to-apply.page';
import * as moment from 'moment';
import { ShowAppliesPage } from '../show-applies/show-applies.page';
import { AlertToShowPage } from '../alert-to-show/alert-to-show.page';
import {ActivatedRoute} from "@angular/router";
import {TranslationService} from "../services/translation.service";
import {UtilService} from "../services/util.service";

@Component({
  selector: 'app-open-requests-forme',
  templateUrl: './open-requests-forme.page.html',
  styleUrls: ['./open-requests-forme.page.scss'],
})

export class OpenRequestsForMePage implements OnInit
{
	public ResultResponseAnyAction:any=[];
	public ResultResponseData:any=[];
	public ResponseData:any=[];
	public ResponseDataUser:any=[];
  public RequestId : string|null = null;
	constructor(private SendReceiveRequestsService: SendReceiveRequestsService,
              private ModalController: ModalController,
              private AlertController: AlertController,
              private LoadingCtrl : LoadingController,
              private route: ActivatedRoute,
              private utils: UtilService,
              public translation: TranslationService)
	{ }

	async ngOnInit()
	{
    this.RequestId = this.route.snapshot.queryParamMap.get('requestId');
	}

	async ionViewWillEnter()
	{
		let HasProfileCompletionDialogueDisplayed = this.SendReceiveRequestsService.GetLocalStorageForProfileCompletion();
    let HasIdentifyDialogueDisplayed = this.SendReceiveRequestsService.GetLocalStorageForIdentity();
		this.ResponseDataUser = [];
		await this.SendReceiveRequestsService.GetProfile().then(async (result) =>
		{
			this.ResponseDataUser = result;
			if(this.ResponseDataUser['result']==1)
			{
				this.ResponseDataUser=this.ResponseDataUser['user'];
        let showReminder = 0;
        let incompleteProfile = this.ResponseDataUser.first_name == null || this.ResponseDataUser.surname == null || this.ResponseDataUser.date_of_birth == null || this.ResponseDataUser.profile_type == null;
        if (incompleteProfile){
          showReminder++;
          /*
          INCOMPLETE PROFILE ALERT
          */
          const modal = await this.ModalController.create({
            component: AlertToShowPage,
            showBackdrop: false,
            componentProps:
              {
                AlertType: "IncompleteProfile",
              }
          });
          return await modal.present();
          /*
          INCOMPLETE PROFILE ALERT
          */
        }
        if(HasProfileCompletionDialogueDisplayed == null && showReminder == 0)
        {
          this.SendReceiveRequestsService.SetLocalStorageForProfileCompletion('yes');
          if(this.ResponseDataUser['aboutme']=='' || this.ResponseDataUser['image']=='')
          {
            showReminder++;
            /*
            INCOMPLETE PROFILE ALERT
            */
            const modal = await this.ModalController.create({
              component: AlertToShowPage,
              showBackdrop: false,
              componentProps:
              {
                AlertType: "IncompleteProfile",
              }
            });
            return await modal.present();
            /*
            INCOMPLETE PROFILE ALERT
            */
          }
        }
        if(HasIdentifyDialogueDisplayed == null && showReminder == 0) {
          this.SendReceiveRequestsService.SetLocalStorageForIdentity('yes');
          if (this.ResponseDataUser['identify'] == 0) {
            /*
            INCOMPLETE IDENTIFICATION ALERT
            */
            const modal = await this.ModalController.create({
              component: AlertToShowPage,
              showBackdrop: false,
              componentProps:
                {
                  AlertType: "Identification",
                }
            });
            return await modal.present();
            /*
            INCOMPLETE IDENTIFICATION ALERT
            */
          }
        }
			}
			else
			{
				this.SendReceiveRequestsService.showMessageToast(this.ResponseDataUser['message']);
			}
			console.log(this.ResponseDataUser);
		},
		error =>
		{
			console.log(error);
		});
		this.ShowRequestsForMe();
	}

	async ShowRequestsForMe()
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
		this.ResultResponseData = [];
		this.ResponseData = [];
		await this.SendReceiveRequestsService.ShowRequestsForMe().then(result =>
		{
			Loading.dismiss();//DISMISS LOADER
			this.ResultResponseData = result;
			if(this.ResultResponseData['result']==1)
			{
				this.ResponseData=this.ResultResponseData['myRequests'];
				if(this.ResponseData.length > 0)
				{
					for(let i = 0; i < this.ResponseData.length; i++)
					{
						let FormatedFromDate_1 = moment(this.ResponseData[i]['from_date']).format('DD MMM YYYY HH:mm');
						let FormatedToDate_1 = moment(this.ResponseData[i]['to_date']).format('DD MMM YYYY HH:mm');
						let FormatedFromDate_2 = moment(this.ResponseData[i]['from_date'],'YYYY-MM-DD HH:mm:ss');
						let FormatedToDate_2 = moment(this.ResponseData[i]['to_date'],'YYYY-MM-DD HH:mm:ss');

						let FromDateISO = moment(this.ResponseData[i]['from_date']).toISOString();
						let ToDateISO = moment(this.ResponseData[i]['to_date']).toISOString();
						//let GetDateDifference = this.SendReceiveRequestsService.DateDifference(FromDateISO,ToDateISO);
						let GetDateDifference = this.utils.DateDifference(FromDateISO,ToDateISO,FormatedFromDate_2,FormatedToDate_2);

						this.ResponseData[i]['formatted_from_date']=FormatedFromDate_1;
						this.ResponseData[i]['formatted_to_date']=FormatedToDate_1;
						this.ResponseData[i]['day_difference']=GetDateDifference;
            if (this.RequestId == null || this.ResponseData[i]['id'] != this.RequestId) {
              this.ResponseData[i]['expanded'] = false;
            } else {
              this.ResponseData[i]['expanded'] = true;
            }

						if(this.ResponseDataUser.hasOwnProperty('latitude') && this.ResponseDataUser.hasOwnProperty('longitude') && this.ResponseData[i].hasOwnProperty('latitude') && this.ResponseData[i].hasOwnProperty('longitude'))
						{
							if(this.ResponseData[i]['latitude']!=null && this.ResponseData[i]['longitude']!=null)
							{
								let DistanceInKM=this.utils.CalculateDistanceBetweenLatLon(this.ResponseDataUser['latitude'],this.ResponseDataUser['longitude'],this.ResponseData[i]['latitude'],this.ResponseData[i]['longitude']);
								this.ResponseData[i]['distance_in_km']=DistanceInKM;
							}
							else
							{
								this.ResponseData[i]['distance_in_km']=0;
							}
						}
						else
						{
							this.ResponseData[i]['distance_in_km']=0;
						}
					}
				}
			}
			else
			{
				//this.SendReceiveRequestsService.showMessageToast(this.ResultResponseData['message']);
			}
			console.log(this.ResponseData);
		},
		error =>
		{
			Loading.dismiss();//DISMISS LOADER
			console.log(error);
		});
	}

	async AcceptRequest(RequestID:any,RequestAddedByUserId:any,RequestStatus:any)
	{
		const modal = await this.ModalController.create({
		component: RequestToApplyPage,
			showBackdrop: false,
			componentProps:
			{
				RequestID: RequestID,
				RequestStatus: RequestStatus,
				RequestAddedByUserId:RequestAddedByUserId
			}
		});
		modal.onDidDismiss().then(() =>
		{
			this.ShowRequestsForMe();
		});
		return await modal.present();
	}

	async ConfirmeDeclineRequest(RequestID:any,RequestStatus:any)
	{
		let Message = (RequestStatus == 1) ? this.translation.trans('open-requests-forme','MessageAccept') : this.translation.trans('open-requests-forme','MessageDecline');
		const alert = await this.AlertController.create({
		cssClass: 'my-custom-alert',
		header: this.translation.trans('common-requests-block','Decline_1'),
		subHeader: Message,
		//message: 'Are you sure to decline request ?',
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
					this.DeclineRequest(RequestID,RequestStatus);
					console.log('Confirm Okay');
				}
			}
		]
		});
		await alert.present();
	}

	async DeclineRequest(RequestID:any,RequestStatus:any)
	{
		let ObjectRequest =
		{
			request_id:RequestID,
			request_status:RequestStatus,
			description:"",
			payment_type:0,
			amount:0
		}
		//LOADER
		const Loading = await this.LoadingCtrl.create({
		spinner: 'circles',
		message: 'Please Wait...',
		translucent: true,
		cssClass: 'custom-class custom-loading'
		});
		await Loading.present();
		//LOADER
		await this.SendReceiveRequestsService.AcceptingOrDecliningRequest(ObjectRequest).then(result =>
		{
			Loading.dismiss();//DISMISS LOADER
			this.ResultResponseAnyAction = result;
			if(this.ResultResponseAnyAction['result']==1)
			{
				this.SendReceiveRequestsService.showMessageToast(this.ResultResponseAnyAction['message']);
				this.ShowRequestsForMe();
			}
			else
			{
				this.SendReceiveRequestsService.showMessageToast(this.ResultResponseAnyAction['message']);
			}
			console.log(this.ResultResponseAnyAction);
		},
		error =>
		{
			Loading.dismiss();//DISMISS LOADER
			console.log(error);
		});
	}

	async ShowApplie(UserID:any)
	{
		const modal = await this.ModalController.create({
			component: ShowAppliesPage,
			showBackdrop: false,
			componentProps:
			{
				UserID: UserID
			}
		});
		return await modal.present();
	}

	ExpandItem(Item:any,ArrayIndex:any): void
	{
		let Flag = Item.expanded;
		Flag = !Flag;
		for(let i = 0; i < this.ResponseData.length; i++)
		{
			if(i == ArrayIndex)
			{
				this.ResponseData[ArrayIndex]['expanded'] = Flag;
			}
			else
			{
				this.ResponseData[i]['expanded'] = false;
			}
		}
	}

	ShowUpdatedContent(ev:any)
	{
		setTimeout(() =>
	    {
			this.ShowRequestsForMe();
	      	ev.target.complete();
	    }, 2000);
	}
}
