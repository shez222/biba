import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoadingController, MenuController, ModalController, Platform } from '@ionic/angular';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';
import { AlertToShowPage } from '../alert-to-show/alert-to-show.page';
import {PushNotificationService} from "../services/push-notification.service";
import {extendedEmail} from "../validators/extended-email.validator";
import {SocialLoginService} from "../services/social-login.service";
import {ProfileService} from "../services/profile.service";
import {TranslationService} from "../services/translation.service";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})

export class SignInPage implements OnInit
{
	public SignInForm:any=[];
	public validation_messages =
	{
		'email':
		[
			{ type: 'required', message: 'Email is required.' },
			{ type: 'email', message: 'Please enter a valid email.' }
		],
		'password':
		[
			{ type: 'required', message: 'Password is required.' },
			{ type: 'minlength', message: 'Password must be 6 character long.' },
		],
	};
  	public PasswordType: string = 'password';
	public PasswordIcon: string = 'eye-off';
	public CurrentPlatform : any = '';

	constructor(private Platform: Platform,
              private SendReceiveRequestsService: SendReceiveRequestsService,
              private FB : FormBuilder,
              private Menu: MenuController,
              private LoadingCtrl : LoadingController,
              private ModalController: ModalController,
              private PushNotificationService: PushNotificationService,
              private profileService : ProfileService,
              private SocialLoginService : SocialLoginService,
              public translation: TranslationService)
	{ }

	async ngOnInit()
	{
		this.SignInForm = this.FB.group({
			'email' : ['', [Validators.required, Validators.email, extendedEmail()]],
			'password': ['', [Validators.required, Validators.minLength(6)]],
		});
		this.CurrentPlatform = (this.Platform.is("android")) ? "android" : "ios";
	}

	hideShowPassword()
	{
		this.PasswordType = this.PasswordType === 'text' ? 'password' : 'text';
		this.PasswordIcon = this.PasswordIcon === 'eye-off' ? 'eye' : 'eye-off';
	}

	async SignIn(Form:any)
	{
		let email = (Form.email) ? Form.email : null;
		let password = (Form.password) ? Form.password : null;
		let ObjSignIn =
		{
			email : email,
			password : password,
			socialType:"password"
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
		await this.SendReceiveRequestsService.SignIn(ObjSignIn).then(async (result) =>
		{
			Loading.dismiss();//DISMISS LOADER
			let ResultResponseData : any = result;
			if(ResultResponseData['result'] == 1 || ResultResponseData['result'] == 9)
			{
				let UserData = ResultResponseData['user'];
        let SessionToken = ResultResponseData['session_token'];
        this.profileService.SaveUserInformation(UserData, SessionToken);
				//PUSH NOTIFICATION
        await this.PushNotificationService.RegisterPushNotification();
        await this.PushNotificationService.updateNotificationCount();
				//PUSH NOTIFICATION
        this.SignInForm.reset();
        if(ResultResponseData['result'] == 1) {
          //logged in
          this.Menu.enable(true);
          this.SendReceiveRequestsService.Router.navigate(['open-requests-main']);
        } else {
          //verification needed
          const modal = await this.ModalController.create({
            component: AlertToShowPage,
            showBackdrop: false,
            componentProps:
              {
                AlertType: "SignUp",
              }
          });
          return await modal.present();
        }
			}
			else
			{
        this.SendReceiveRequestsService.showMessageToast(ResultResponseData['message']);
			}
		},
		error =>
		{
			Loading.dismiss();//DISMISS LOADER
			console.log(error);
		});
	}

	async GoogleLoginORSignup()
	{
    await this.SocialLoginService.GoogleLoginORSignup();
	}

	async FaceBookLoginORSignup()
	{
    await this.SocialLoginService.FaceBookLoginORSignup();
	}

	async AppleLoginORSignup()
	{
    await this.SocialLoginService.AppleLoginORSignup();
	}

	Register()
	{
		this.SendReceiveRequestsService.Router.navigate(['/sign-up']);
	}

	ForgotPassword()
	{
		this.SendReceiveRequestsService.Router.navigate(['/forgot-password']);
	}

}
