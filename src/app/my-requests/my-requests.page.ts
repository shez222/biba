import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';
import { RequestAddPage } from '../request-add/request-add.page';
import { ShowAppliesPage } from '../show-applies/show-applies.page';
import * as moment from 'moment';
import {ActivatedRoute} from "@angular/router";
import {TranslationService} from "../services/translation.service";
import {UtilService} from "../services/util.service";

@Component({
  selector: 'app-my-requests',
  templateUrl: './my-requests.page.html',
  styleUrls: ['./my-requests.page.scss'],
})

export class MyRequestsPage implements OnInit
{
	public ResultResponseAction:any=[];
	public ResultResponseData:any=[];
	public ResultDataAcceptedRequestCounts:any=[];
	public ResponseDataUser:any=[];
	public RequestsVisibility:any=[];
  public RequestId : string|null = null;

	constructor(private SendReceiveRequestsService: SendReceiveRequestsService,
              private AlertController: AlertController,
              private LoadingCtrl : LoadingController,
              private ModalController : ModalController,
              private route: ActivatedRoute,
              private utils: UtilService,
              public translation: TranslationService)
	{}

	async ngOnInit()
	{
    this.RequestId = this.route.snapshot.queryParamMap.get('requestId');

		await this.SendReceiveRequestsService.GetProfile().then(result =>
		{
			this.ResponseDataUser = result;
			if(this.ResponseDataUser['result']==1)
			{
				this.ResponseDataUser=this.ResponseDataUser['user'];
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

	}

	ionViewWillEnter()
	{
		this.MyRequests();
	}

	async MyRequests()
	{
		this.ResultResponseData = [];
		this.ResultDataAcceptedRequestCounts = [];
    this.RequestsVisibility = [];
		//LOADER
		const Loading = await this.LoadingCtrl.create({
			spinner: 'circles',
			message: 'Please Wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await Loading.present();
		//LOADER
		await this.SendReceiveRequestsService.MyRequests().then(result =>
		{
			Loading.dismiss();//DISMISS LOADER
			this.ResultResponseData = result;
			if(this.ResultResponseData['result']==1)
			{
				this.ResultResponseData=this.ResultResponseData['myRequests'];
				if(this.ResultResponseData.length > 0)
				{
					for(let i = 0; i < this.ResultResponseData.length; i++)
					{
						let FormatedFromDate_1 = moment(this.ResultResponseData[i]['from_date']).format('DD MMM YYYY HH:mm');
						let FormatedToDate_1 = moment(this.ResultResponseData[i]['to_date']).format('DD MMM YYYY HH:mm');
						let FormatedFromDate_2 = moment(this.ResultResponseData[i]['from_date'],'YYYY-MM-DD HH:mm:ss');
						let FormatedToDate_2 = moment(this.ResultResponseData[i]['to_date'],'YYYY-MM-DD HH:mm:ss');

						let FromDateISO = moment(this.ResultResponseData[i]['from_date']).toISOString();
						let ToDateISO = moment(this.ResultResponseData[i]['to_date']).toISOString();
						let GetDateDifference = this.utils.DateDifference(FromDateISO,ToDateISO,FormatedFromDate_2,FormatedToDate_2);

						this.ResultResponseData[i]['formatted_from_date']=FormatedFromDate_1;
						this.ResultResponseData[i]['formatted_to_date']=FormatedToDate_1;
						this.ResultResponseData[i]['day_difference']=GetDateDifference;
						this.ResultResponseData[i]['expanded']=false;
            if (this.RequestId == null || this.ResultResponseData[i]['id'] != this.RequestId) {
              this.ResultResponseData[i]['expanded'] = false;
            } else {
              this.ResultResponseData[i]['expanded'] = true;
            }
						if(this.ResponseDataUser.hasOwnProperty('latitude') && this.ResponseDataUser.hasOwnProperty('longitude') && this.ResultResponseData[i].hasOwnProperty('latitude') && this.ResultResponseData[i].hasOwnProperty('longitude'))
						{
							if(this.ResultResponseData[i]['latitude']!=null && this.ResultResponseData[i]['longitude']!=null)
							{
								let DistanceInKM=this.utils.CalculateDistanceBetweenLatLon(this.ResponseDataUser['latitude'],this.ResponseDataUser['longitude'],this.ResultResponseData[i]['latitude'],this.ResultResponseData[i]['longitude']);
								this.ResultResponseData[i]['distance_in_km']=DistanceInKM;
							}
							else
							{
								this.ResultResponseData[i]['distance_in_km']=0;
							}
						}
						else
						{
							this.ResultResponseData[i]['distance_in_km']=0;
						}

						if(this.ResultResponseData[i]['accepted_request'].length > 0)
						{
							let Count = 0;
							for(let R = 0; R < this.ResultResponseData[i]['accepted_request'].length; R++)
							{
								if(this.ResultResponseData[i]['accepted_request'][R]['status']==0)
								{
									Count ++;
								}
							}

							this.ResultDataAcceptedRequestCounts[i]=Count;
						}
						else
						{
							this.ResultDataAcceptedRequestCounts[i]=0;
						}
            let parts = [];
            if (this.ResultResponseData[i]["public_visibility"]){
              parts.push(this.translation.trans('common-requests-block','RequestType_2'));
            }
            if (this.ResultResponseData[i]["group_visibility"]) {
              const groups: any = this.ResultResponseData[i]['groups'];
              let groupNames = "";
              if (groups.length > 0) {
                groupNames = " (" + groups.map((group: any) => group['name']).join(', ') + ")";
              }
              parts.push(this.translation.trans('common-requests-block','RequestType_1') + groupNames);
            }
            this.RequestsVisibility.push(parts.join(', '));
					}
				}
			}
			else
			{
				this.SendReceiveRequestsService.showMessageToast(this.ResultResponseData['message']);
			}
			console.log(this.ResultResponseData);
		},
		error =>
		{
			Loading.dismiss();//DISMISS LOADER
			console.log(error);
		});
	}

  	async ConfirmedDeletingRequest(RequestID:any)
	{
		const alert = await this.AlertController.create({
		cssClass: 'my-custom-alert',
		header: this.translation.trans('common-requests-block','Decline_1'),
		subHeader: this.translation.trans('my-requests','RemoveRequest'),
		//message: 'Are you sure to remove request ?',
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
					this.DeletingRequest(RequestID);
					console.log('Confirm Okay');
				}
			}
		]
		});
		await alert.present();
	}

	async DeletingRequest(RequestID:any)
	{
		let ObjectRequest =
		{
			request_id:RequestID
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
		await this.SendReceiveRequestsService.DeleteRequestByID(ObjectRequest).then(result =>
		{
			Loading.dismiss();//DISMISS LOADER
			this.ResultResponseAction = result;
			if(this.ResultResponseAction['result']==1)
			{
				this.SendReceiveRequestsService.showMessageToast(this.ResultResponseAction['message']);
				this.MyRequests();
			}
		},
		error =>
		{
			Loading.dismiss();//DISMISS LOADER
			console.log(error);
		});
	}

  	async ConfirmedApproveDisapproveApplies(ApproveDisApproveOption:any,RowID:any,PaymentType:any,Amount:any)
	{
		let Message = "";
		if(ApproveDisApproveOption == 1)
		{
			Message += this.translation.trans('my-requests','AcceptApplies');
			/*
			Message += "\n\n";
			if(PaymentType == 1)
			{
				Message += "For FREE!!";
			}
			if(PaymentType == 2)
			{
				Message += "Will costs you "+Amount+" CHF / HOURLY";
			}
			*/
		}
		if(ApproveDisApproveOption == 2)
		{
			Message += this.translation.trans('my-requests','DeclineApplies');
		}
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
					this.ApproveDisapproveApplies(ApproveDisApproveOption,RowID);
					console.log('Confirm Okay');
				}
			}
		]
		});
		await alert.present();
	}

	async ApproveDisapproveApplies(ApproveDisApproveOption:any,RowID:any)
	{
		let ObjectRequest =
		{
			accepted_requests_id:RowID,
			approve:ApproveDisApproveOption
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
		await this.SendReceiveRequestsService.ApproveDisapproveApplies(ObjectRequest).then(result =>
		{
			Loading.dismiss();//DISMISS LOADER
			this.ResultResponseAction = result;
			if(this.ResultResponseAction['result']==1)
			{
				this.SendReceiveRequestsService.showMessageToast(this.ResultResponseAction['message']);
				this.MyRequests();
			}
		},
		error =>
		{
			Loading.dismiss();//DISMISS LOADER
			console.log(error);
		});
	}

	async NewRequest()
	{
		const modal = await this.ModalController.create({
		component: RequestAddPage,
			showBackdrop: false,
		});
		modal.onDidDismiss().then(() =>
		{
			this.MyRequests();
		});
		return await modal.present();
	}

	async EditingRequest(RequestID:any)
	{
		const modal = await this.ModalController.create({
			component: RequestAddPage,
			showBackdrop: false,
			componentProps:
			{
				RequestID: RequestID
			}
		});
		modal.onDidDismiss().then(() =>
		{
			this.MyRequests();
		});
		return await modal.present();
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
		for(let i = 0; i < this.ResultResponseData.length; i++)
		{
			if(i == ArrayIndex)
			{
				this.ResultResponseData[ArrayIndex]['expanded'] = Flag;
			}
			else
			{
				this.ResultResponseData[i]['expanded'] = false;
			}
		}
	}

	ShowUpdatedContent(ev:any)
	{
		setTimeout(() =>
	    {
			this.MyRequests();
	      	ev.target.complete();
	    }, 2000);
	}
}
