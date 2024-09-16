import { Component, OnInit, NgZone } from '@angular/core';
import { AlertController, ModalController, LoadingController, NavParams } from '@ionic/angular';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';
import * as moment from 'moment';
import {TranslationService} from "../services/translation.service";

@Component({
  selector: 'app-show-applies',
  templateUrl: './show-applies.page.html',
  styleUrls: ['./show-applies.page.scss'],
})
export class ShowAppliesPage implements OnInit
{
	public UserID : any = null;
	public ResultResponseData : any = [];
	constructor(private SendReceiveRequestsService: SendReceiveRequestsService,
              private LoadingCtrl : LoadingController,
              private ModalController: ModalController,
              private AlertController: AlertController,
              private NavParams: NavParams,
              public translation: TranslationService)
	{ }

	async ngOnInit()
	{
		this.UserID = (this.NavParams.get('UserID')) ? this.NavParams.get('UserID') : 0;
    let ObjectProfile =
    {
      user_id:this.UserID
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
    await this.SendReceiveRequestsService.GetProfileByID(ObjectProfile).then(result =>
    {
      Loading.dismiss();//DISMISS LOADER
      this.ResultResponseData = result;
      if(this.ResultResponseData['result']==1)
      {
        this.ResultResponseData=this.ResultResponseData['user'];
        let FormatedDOB = moment(this.ResultResponseData['date_of_birth']).locale(this.SendReceiveRequestsService.GetUserLanguage()).format('DD MMM, YYYY');//YYYY-MM-DD HH:mm:ss
        this.ResultResponseData['formated_date_of_birth']=FormatedDOB;
        //console.log(FormatedDOB);
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

  	DismissModal()
	{
		this.ModalController.dismiss({
			'dismissed': true
		});
	}
}
