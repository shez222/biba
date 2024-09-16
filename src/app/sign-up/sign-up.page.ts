import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoadingController, ModalController, MenuController, Platform } from '@ionic/angular';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';
import * as moment from 'moment';
import {phoneNumberValidator} from "../validators/phone-number.validator";
import {extendedEmail} from "../validators/extended-email.validator";
import {SocialLoginService} from "../services/social-login.service";
import {LoadingDialogService} from "../services/loading-dialog.service";
import {ProfileService} from "../services/profile.service";
import {TranslationService} from "../services/translation.service";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})

export class SignUpPage implements OnInit
{
	public ResultResponseData : any = [];
	AcceptTerms:boolean = false;
	public CurrentDateForPicker:any=null;
	public SignUpForm:any=[];
	public validation_messages = {
    'language':
      [
        { type: 'required', message: 'Language is required.' },
      ],
    'profileType':
      [
        { type: 'required', message: 'Profile type is required.' },
      ],
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
    'firstname':
      [
        { type: 'required', message: 'Firstname is required.' },
      ],
    'lastname':
      [
        { type: 'required', message: 'Lastname is required.' },
      ],
    'date_of_birth':
      [
        { type: 'required', message: 'Date of birth is required.' },
      ],
    'phone':
      [
        { type: 'required', message: 'is required' },
        // { type: 'invalidPhoneNumber', message: 'Invalid phone number.' }
      ]
  };
  public PasswordType: string = 'password';
	public PasswordIcon: string = 'eye-off';
	public CurrentPlatform : any = '';
  languages : any = [];
	constructor(private Platform: Platform,
              private SendReceiveRequestsService: SendReceiveRequestsService,
              private FBS : FormBuilder,
              private Menu: MenuController,
              private LoadingCtrl : LoadingController,
              private zone: NgZone,
              private ModalController : ModalController,
              private SocialLoginService : SocialLoginService,
              private loadingDialog: LoadingDialogService,
              private profileService: ProfileService,
              public translation: TranslationService)
	{
  }

	async ngOnInit()
	{
		//TRANSLATION RELATED
		//TRANSLATION RELATED
		this.CurrentPlatform = (this.Platform.is("android")) ? "android" : "ios";
		this.CurrentDateForPicker=moment().subtract(10, 'years').format('YYYY-MM-DD');
		this.SignUpForm = this.FBS.group({
      'language' : [this.SendReceiveRequestsService.GetUserLanguage(), [Validators.required]],
      'profileType' : ['', [Validators.required]],
			'email' : ['', [Validators.required, Validators.email, extendedEmail()]],
			'password': ['', [Validators.required, Validators.minLength(6)]],
			'firstname': ['', Validators.required],
			'lastname': ['', Validators.required],
			'date_of_birth': ['', Validators.required],
			'phone': ['', [Validators.required, phoneNumberValidator()]],
		});

    this.validation_messages =
      {
        'language':
          [
            { type: 'required', message: this.translation.trans('form','IsRequired')},
          ],
        'profileType':
          [
            { type: 'required', message: this.translation.trans('form','IsRequired') },
          ],
        'email':
          [
            { type: 'required', message: this.translation.trans('form','IsRequired') },
            { type: 'pattern', message: this.translation.trans('form','InvalidMail') }
          ],
        'password':
          [
            { type: 'required', message: this.translation.trans('form','IsRequired') },
            { type: 'minlength', message: this.translation.trans('form','Min6Chars') },
          ],
        'firstname':
          [
            { type: 'required', message: this.translation.trans('form','IsRequired') },
          ],
        'lastname':
          [
            { type: 'required', message: this.translation.trans('form','IsRequired')},
          ],
        'date_of_birth':
          [
            { type: 'required', message: this.translation.trans('form','IsRequired') },
          ],
        'phone':
          [
            { type: 'required', message: this.translation.trans('form','IsRequired') },
            // { type: 'invalidPhoneNumber', message: this.translation.trans('form','InvalidPhone') }
          ]
      };

    await this.loadingDialog.showLoadingDialog();

    try {
      const langResult : any = await this.SendReceiveRequestsService.languages(this.SendReceiveRequestsService.GetUserLanguage());
      if (langResult['result'] == 1) {
        this.languages = langResult['languages'];
      } else {
        await this.SendReceiveRequestsService.showMessageToast(langResult['message']);
      }
    } catch (error) {
      await this.SendReceiveRequestsService.showMessageToast('An error occurred');
    } finally {
      await this.loadingDialog.dismissLoadingDialog();
    }

		this.Menu.enable(false);
	}

  	hideShowPassword()
	{
		this.PasswordType = this.PasswordType === 'text' ? 'password' : 'text';
		this.PasswordIcon = this.PasswordIcon === 'eye-off' ? 'eye' : 'eye-off';
	}

	DateSelected(ev:any)
	{
		let DateSelected = (ev.detail.value) ? ev.detail.value : "";
		let date = moment(DateSelected).format('DD.MM.YYYY');
		this.SignUpForm.controls['date_of_birth'].setValue(date);
	}

	async SignUp(Form:any)
	{
    let language = (Form.language) ? Form.language : "";
    let profile_type = (Form.profileType) ? Form.profileType : "";
		let email = (Form.email) ? Form.email : "";
		let password = (Form.password) ? Form.password : "";
		let firstname = (Form.firstname) ? Form.firstname : "";
		let lastname = (Form.lastname) ? Form.lastname : "";
		let date_of_birth = (Form.date_of_birth) ? Form.date_of_birth : "";
    let date_of_birth_iso = moment(date_of_birth, 'DD.MM.YYYY').format('YYYY-MM-DD');
		let phone = (Form.phone) ? Form.phone : "";

		let ObjSignUp =
		{
      language:language,
      profile_type:profile_type,
			email:email,
			password:password,
			firstname:firstname,
			lastname:lastname,
			date_of_birth:date_of_birth_iso,
			phone:phone,
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
		await this.SendReceiveRequestsService.SignUp(ObjSignUp).then(async(result) =>
    	{
			Loading.dismiss();//DISMISS LOADER
			this.ResultResponseData = result;
			if(this.ResultResponseData['result']==1)
			{
        this.Login();
			}
      await this.SendReceiveRequestsService.showMessageToast(this.ResultResponseData['message']);
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

	Login()
	{
		this.SendReceiveRequestsService.Router.navigate(['/sign-in']);
	}

  changeLanguage()
  {
    this.profileService.SaveLanguageToProfile(this.SignUpForm.value.language);
    this.translation.init(this.SignUpForm.value.language);
  }
}
