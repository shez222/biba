import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, NavParams } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertToShowPage } from '../alert-to-show/alert-to-show.page';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';
import {TranslationService} from "../services/translation.service";

@Component({
  selector: 'app-request-to-apply',
  templateUrl: './request-to-apply.page.html',
  styleUrls: ['./request-to-apply.page.scss'],
})

export class RequestToApplyPage implements OnInit
{
  	public ApplyToRequestForm:any=[];
	public validation_messages =
	{
		'text_to_apply':
		[
			{ type: 'required', message: 'Text is required.' },
		],
		'free_or_paid':
		[
			{ type: 'required', message: 'Selecting option is required.' }
		],
		'amount':
		[
			{ type: 'required', message: 'Amount is required.' }
		]
	};
	public AmountNeedToShow: boolean = false;
	public RequestID : any = 0;
	public RequestStatus : any = 0;
	public RequestAddedByUserId : any = 0;
	public ResultResponseAnyAction : any = [];

	constructor(private SendReceiveRequestsService: SendReceiveRequestsService,
              private FB : FormBuilder,
              private ModalController: ModalController,
              private LoadingCtrl : LoadingController,
              private NavParams: NavParams,
              public translation: TranslationService)
	{ }

	ngOnInit()
	{
		this.ApplyToRequestForm = this.FB.group({
			'text_to_apply': [''],
			'free_or_paid': ['',Validators.required],
			'amount': ['']
		});
	}

	ionViewWillEnter()
	{
		this.RequestID = this.NavParams.get('RequestID');
		this.RequestStatus = this.NavParams.get('RequestStatus');
		//this.UserId = this.NavParams.get('UserId');
		this.RequestAddedByUserId = this.NavParams.get('RequestAddedByUserId');
	}

	SelectedFinancial(Ev:any)
	{
		let SelectedFinancial = Ev.detail.value;
		if(SelectedFinancial == 2)
		{
			this.AmountNeedToShow = true;
			this.ApplyToRequestForm.get('amount').setValidators([Validators.required]);
			this.ApplyToRequestForm.get('amount').updateValueAndValidity();
		}
		if(SelectedFinancial == 1)
		{
			this.AmountNeedToShow = false;
			this.ApplyToRequestForm.get('amount').setValidators([]);
			this.ApplyToRequestForm.get('amount').updateValueAndValidity();
			this.ApplyToRequestForm.setValue({
				text_to_apply: (this.ApplyToRequestForm.get('text_to_apply').value) ? this.ApplyToRequestForm.get('text_to_apply').value : "",
				free_or_paid: (this.ApplyToRequestForm.get('free_or_paid').value) ? this.ApplyToRequestForm.get('free_or_paid').value : "",
				amount: ""
			});
		}
	}

	async ApplyToRequest(Form:any)
	{
		let TextToApply = (Form.text_to_apply) ? Form.text_to_apply : "";
		let FreeORPaid = (Form.free_or_paid) ? Form.free_or_paid : "";
		let Amount = (Form.amount) ? Form.amount : 0;

		let ObjectRequest =
		{
			request_id:this.RequestID,
			request_status:this.RequestStatus,
			description:TextToApply,
			payment_type:FreeORPaid,
			amount:Amount
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
		await this.SendReceiveRequestsService.AcceptingOrDecliningRequest(ObjectRequest).then(async (result) =>
		{
			Loading.dismiss();//DISMISS LOADER
			this.ResultResponseAnyAction = result;
			if(this.ResultResponseAnyAction['result']==1)
			{
				//this.SendReceiveRequestsService.showMessageToast(this.ResultResponseAnyAction['message']);
				this.ModalController.dismiss({
					'dismissed': true
				});
				const modal = await this.ModalController.create({
					component: AlertToShowPage,
					showBackdrop: false,
					componentProps:
					{
						AlertType: "Applied",
						RequestID:this.RequestID,
					}
				});
				return await modal.present();
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
		/*
		let text_to_apply = (Form.text_to_apply) ? Form.text_to_apply : "";
		let free_or_paid = (Form.free_or_paid) ? Form.free_or_paid : "";
		let amount = (Form.amount) ? Form.amount : 0;

		let ObjApplyToRequest =
		{
			text_to_apply:text_to_apply,
			free_or_paid:free_or_paid,
			amount:amount
		}
		console.log(ObjApplyToRequest);
		const modal = await this.ModalController.create({
			component: AlertToShowPage,
			showBackdrop: false,
			componentProps:
			{
				AlertType: "Applied",
			}
		});
		return await modal.present();
		*/
	}

  	DismissModal()
	{
		this.ModalController.dismiss({
			'dismissed': true
		});
	}
}
