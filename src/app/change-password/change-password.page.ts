import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';
import {TranslationService} from "../services/translation.service";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})

export class ChangePasswordPage implements OnInit
{
	public ResultResponseData:any=[];
	public ChangePasswordForm:any=[];
	public validation_messages_change_password =
	{
		'old_password':
		[
			{ type: 'required', message: 'Password is required.' },
			{ type: 'minlength', message: 'Password must be 6 character long.' },
		],
		'new_password':
		[
			{ type: 'required', message: 'Password is required.' },
			{ type: 'minlength', message: 'Password must be 6 character long.' },
		],
		'confirm_password':
		[
			{ type: 'required', message: 'Password is required.' },
			{ type: 'minlength', message: 'Password must be 6 character long.' },
			{ type: 'notEquivalent', message: 'New and Confirm passwords are not matches!' },
		]
	};
  	public OldPasswordType: string = 'password';
	public OldPasswordIcon: string = 'eye-off';

  	public NewPasswordType: string = 'password';
	public NewPasswordIcon: string = 'eye-off';

	public ConfirmPasswordType: string = 'password';
	public ConfirmPasswordIcon: string = 'eye-off';

	constructor(private SendReceiveRequestsService: SendReceiveRequestsService,
              private FB : FormBuilder,
              private LoadingCtrl : LoadingController,
              public translation: TranslationService)
	{
  }

  	ngOnInit()
  	{
    	this.ChangePasswordForm = this.FB.group({
			'old_password': ['', [Validators.required, Validators.minLength(6)]],
			'new_password': ['', [Validators.required, Validators.minLength(6)]],
			'confirm_password': ['', [Validators.required, Validators.minLength(6)]],
			},{validator: this.checkPasswordMatches('new_password','confirm_password')});
  	}

	checkPasswordMatches(passwordMain: string, confirmPassword: string)
	{
		return (group: FormGroup) =>
		{
			let passwordInput = group.controls[passwordMain],
			passwordConfirmationInput = group.controls[confirmPassword];
			if(passwordInput.value!="" && passwordConfirmationInput.value!="")
			{
			if (passwordInput.value !== passwordConfirmationInput.value)
			{
				return passwordConfirmationInput.setErrors({notEquivalent: true});
			}
			else
			{
				return passwordConfirmationInput.setErrors(null);
			}
			}
		}
	}

  	hideOldShowPassword()
	{
		this.OldPasswordType = this.OldPasswordType === 'text' ? 'password' : 'text';
		this.OldPasswordIcon = this.OldPasswordIcon === 'eye-off' ? 'eye' : 'eye-off';
	}

  	hideNewShowPassword()
	{
		this.NewPasswordType = this.NewPasswordType === 'text' ? 'password' : 'text';
		this.NewPasswordIcon = this.NewPasswordIcon === 'eye-off' ? 'eye' : 'eye-off';
	}

	hideConfirmShowPassword()
	{
		this.ConfirmPasswordType = this.ConfirmPasswordType === 'text' ? 'password' : 'text';
		this.ConfirmPasswordIcon = this.ConfirmPasswordIcon === 'eye-off' ? 'eye' : 'eye-off';
	}

  	async ChangePassword(Form:any)
	{
		let old_password = (Form.old_password) ? Form.old_password : "";
		let new_password = (Form.new_password) ? Form.new_password : "";
		let confirm_password = (Form.confirm_password) ? Form.confirm_password : "";

		let ObjectChangePassword =
		{
			old_password:old_password,
			new_password:new_password,
			confirm_password:confirm_password
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
		await this.SendReceiveRequestsService.ChangePassword(ObjectChangePassword).then(result =>
		{
			Loading.dismiss();//DISMISS LOADER
			this.ResultResponseData = result;
			if(this.ResultResponseData['result']==1)
			{
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
