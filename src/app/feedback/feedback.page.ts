import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';
import {TranslationService} from "../services/translation.service";

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})

export class FeedbackPage implements OnInit
{
	public ResultResponseData:any=[];
	public FeedBackForm:any=[];
	public validation_messages =
	{
		'subject':
		[
			{ type: 'required', message: 'Subject is required.' },
		],
		'description':
		[
			{ type: 'required', message: 'Description is required.' }
		]
	};

	constructor(private SendReceiveRequestsService: SendReceiveRequestsService,
              private FB : FormBuilder,
              private LoadingCtrl : LoadingController,
              public translation: TranslationService)
	{ }

	ngOnInit()
	{
		this.FeedBackForm = this.FB.group({
			'subject': ['', Validators.required],
			'description': ['', Validators.required]
		});
	}

	async FeedBack(Form:any)
	{
		let subject = (Form.subject) ? Form.subject : "";
		let description = (Form.description) ? Form.description : "";
		let FeedBack =
		{
			subject:subject,
			description:description
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
		await this.SendReceiveRequestsService.FeedBack(FeedBack).then(result =>
		{
			Loading.dismiss();//DISMISS LOADER
			this.ResultResponseData = result;
			if(this.ResultResponseData['result']==1)
			{
				this.FeedBackForm.setValue({
					subject: "",
					description: ""
				});
				this.SendReceiveRequestsService.showMessageToast(this.ResultResponseData['message']);
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
