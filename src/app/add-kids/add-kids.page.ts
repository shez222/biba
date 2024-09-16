import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, NavParams } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';
import {TranslationService} from "../services/translation.service";

@Component({
  selector: 'app-add-kids',
  templateUrl: './add-kids.page.html',
  styleUrls: ['./add-kids.page.scss'],
})

export class AddKidsPage implements OnInit
{

	public ResultResponseData:any=[];
  public AddKidForm:any=[];
	public validation_messages =
	{
		'kid_name':
		[
			{ type: 'required', message: 'Name is required.' },
		],
		'kid_dob':
		[
			{ type: 'required', message: 'Selecting date is required.' }
		]
	};

	public CurrentDateForPicker:any=null;
	public KidID : any = 0;
	public KidNM : any = null;
	public KidDoB : any = null;

  	constructor(private SendReceiveRequestsService: SendReceiveRequestsService,
                private FB : FormBuilder,
                private ModalController: ModalController,
                private LoadingCtrl : LoadingController,
                private NavParams: NavParams,
                public translation: TranslationService)
  	{
    }

	ngOnInit()
	{
		this.KidID = this.NavParams.get('KidID');
		this.KidNM = this.NavParams.get('KidNM');
		this.KidDoB = this.NavParams.get('KidDoB');
		if(this.KidID > 0 && this.KidNM!=null && this.KidDoB!=null)
		{
			let CurrentDate=moment(this.KidDoB).format('DD.MM.YYYY');
			this.CurrentDateForPicker=moment(this.KidDoB).format('YYYY-MM-DD');

			this.AddKidForm = this.FB.group({
				'kid_name': [this.KidNM,Validators.required],
				'kid_dob': [CurrentDate,Validators.required]
			});
		}
		else
		{
			this.CurrentDateForPicker=moment().format('YYYY-MM-DD');

			this.AddKidForm = this.FB.group({
				'kid_name': ['',Validators.required],
				'kid_dob': ['',Validators.required]
			});
		}
		console.log("KID",this.KidID);
	}

  	DismissModal()
	{
		this.ModalController.dismiss({
			'dismissed': true
		});
	}

	async AddKid(Form:any)
	{
		let kid_id = (this.KidID > 0) ? this.KidID : 0;
		let kid_name = (Form.kid_name) ? Form.kid_name : "";
		let kid_dob = (Form.kid_dob) ? Form.kid_dob : "";
    let kid_dob_iso = moment(kid_dob, 'DD.MM.YYYY').format('YYYY-MM-DD');
		if(this.KidID > 0)
		{
			let ObjectKids =
			{
				kid_id:kid_id,
				kid_name:kid_name,
				kid_dob:kid_dob_iso
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
			await this.SendReceiveRequestsService.EditKid(ObjectKids).then(result =>
			{
				Loading.dismiss();//DISMISS LOADER
				this.ResultResponseData = result;
				if(this.ResultResponseData['result']==1)
				{
					this.SendReceiveRequestsService.showMessageToast(this.ResultResponseData['message']);
					//this.SendReceiveRequestsService.Router.navigate(['/kids']);
					this.DismissModal();
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
		else
		{
			let ObjectKids =
			{
				kid_name:kid_name,
				kid_dob:kid_dob_iso
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
			await this.SendReceiveRequestsService.AddKid(ObjectKids).then(result =>
			{
				Loading.dismiss();//DISMISS LOADER
				this.ResultResponseData = result;
				if(this.ResultResponseData['result']==1)
				{
					this.SendReceiveRequestsService.showMessageToast(this.ResultResponseData['message']);
					//this.SendReceiveRequestsService.Router.navigate(['/kids']);
					this.DismissModal();
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
	}

	DateSelected(ev:any)
	{
		let DateSelected = (ev.detail.value) ? ev.detail.value : "";
    let date = moment(DateSelected).format('DD.MM.YYYY');
    this.AddKidForm.controls['kid_dob'].setValue(date);
	}
}
