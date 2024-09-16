import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';
import * as moment from 'moment';
import { ShowAppliesPage } from '../show-applies/show-applies.page';
import {ActivatedRoute} from "@angular/router";
import {CalendarService} from "../services/calendar.service";
import {TranslationService} from "../services/translation.service";
import {UtilService} from "../services/util.service";

@Component({
  selector: 'app-my-applies',
  templateUrl: './my-applies.page.html',
  styleUrls: ['./my-applies.page.scss'],
})

export class MyAppliesPage implements OnInit
{
	public ResultResponseAction:any=[];
  public ResultMyAppliesData:any=[];
	public ResponseDataUser:any=[];
  public RequestId : string|null = null;

	constructor(private SendReceiveRequestsService: SendReceiveRequestsService,
              private AlertController: AlertController,
              private LoadingCtrl : LoadingController,
              private ModalController: ModalController,
              private route: ActivatedRoute,
              private calendar: CalendarService,
              private utils: UtilService,
              public translation: TranslationService)
	{ }

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
		this.MyApplies();
	}

	async MyApplies()
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
		await this.SendReceiveRequestsService.MyApplies().then(result =>
		{
			Loading.dismiss();//DISMISS LOADER
			let ResultMyAppliesDataResult : any = result;
			if(ResultMyAppliesDataResult['result']==1)
			{
				this.ResultMyAppliesData=ResultMyAppliesDataResult['myApplies'];
        for(let i = 0; i < this.ResultMyAppliesData.length; i++)
        {
          let FormatedFromDate_1 = moment(this.ResultMyAppliesData[i]['request']['from_date']).format('DD MMM YYYY HH:mm');
          let FormatedToDate_1 = moment(this.ResultMyAppliesData[i]['request']['to_date']).format('DD MMM YYYY HH:mm');
          let FormatedFromDate_2 = moment(this.ResultMyAppliesData[i]['request']['from_date'],'YYYY-MM-DD HH:mm:ss');
          let FormatedToDate_2 = moment(this.ResultMyAppliesData[i]['request']['to_date'],'YYYY-MM-DD HH:mm:ss');

          let FromDateISO = moment(this.ResultMyAppliesData[i]['request']['from_date']).toISOString();
          let ToDateISO = moment(this.ResultMyAppliesData[i]['request']['to_date']).toISOString();
          let GetDateDifference = this.utils.DateDifference(FromDateISO,ToDateISO,FormatedFromDate_2,FormatedToDate_2);

          this.ResultMyAppliesData[i]['request']['formatted_from_date']=FormatedFromDate_1;
          this.ResultMyAppliesData[i]['request']['formatted_to_date']=FormatedToDate_1;
          this.ResultMyAppliesData[i]['request']['day_difference']=GetDateDifference;
          if (this.RequestId == null || this.ResultMyAppliesData[i]['request']['id'] != this.RequestId) {
            this.ResultMyAppliesData[i]['expanded'] = false;
          } else {
            this.ResultMyAppliesData[i]['expanded'] = true;
          }

          if(this.ResponseDataUser.hasOwnProperty('latitude') &&
            this.ResponseDataUser.hasOwnProperty('longitude') &&
            this.ResultMyAppliesData[i]['request'].hasOwnProperty('latitude') &&
            this.ResultMyAppliesData[i]['request'].hasOwnProperty('longitude'))
          {
            if(this.ResultMyAppliesData[i]['request']['latitude']!=null && this.ResultMyAppliesData[i]['request']['longitude']!=null)
            {
              let DistanceInKM=this.utils.CalculateDistanceBetweenLatLon(this.ResponseDataUser['latitude'],this.ResponseDataUser['longitude'],this.ResultMyAppliesData[i]['request']['latitude'],this.ResultMyAppliesData[i]['request']['longitude']);
              this.ResultMyAppliesData[i]['request']['distance_in_km']=DistanceInKM;
            }
            else
            {
              this.ResultMyAppliesData[i]['request']['distance_in_km']=0;
            }
          }
          else
          {
            this.ResultMyAppliesData[i]['request']['distance_in_km']=0;
          }
        }
			}
			else
			{
				this.SendReceiveRequestsService.showMessageToast(ResultMyAppliesDataResult['message']);
			}
			console.log(ResultMyAppliesDataResult);
		},
		error =>
		{
			Loading.dismiss();//DISMISS LOADER
			console.log(error);
		});
	}

  	async ConfirmedDeletingApplies(AppliesID:any)
	{
		const alert = await this.AlertController.create({
		cssClass: 'my-custom-alert',
		header: this.translation.trans('common-requests-block','Decline_1'),
		subHeader: this.translation.trans('my-applies','RemoveApplies'),
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
					this.DeletingApplies(AppliesID);
					console.log('Confirm Okay');
				}
			}
		]
		});
		await alert.present();
	}

	async DeletingApplies(AppliesID:any)
	{
		let ObjectApplies =
		{
			id:AppliesID
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
		await this.SendReceiveRequestsService.DeletingApplies(ObjectApplies).then(result =>
		{
			Loading.dismiss();//DISMISS LOADER
			this.ResultResponseAction = result;
			if(this.ResultResponseAction['result']==1)
			{
				this.SendReceiveRequestsService.showMessageToast(this.ResultResponseAction['message']);
				this.MyApplies();
			} else {
        this.SendReceiveRequestsService.showMessageToast(this.ResultResponseAction['message']);
      }
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

	ExpandItem(Item:any,MainArrayIndex:any): void
	{
		let Flag = Item.expanded;
		Flag = !Flag;
    for(let i = 0; i < this.ResultMyAppliesData.length; i++)
    {
      if(i == MainArrayIndex)
      {
        this.ResultMyAppliesData[MainArrayIndex]['expanded']=Flag;
      }
      else
      {
        this.ResultMyAppliesData[i]['expanded']=false;
      }
		}
	}

  async addToCalendar(requestId: number) {
    await this.calendar.addToCalendar(requestId);
  }

	ShowUpdatedContent(ev:any)
	{
		setTimeout(() =>
	    {
			this.MyApplies();
	      	ev.target.complete();
	    }, 2000);
	}

}
