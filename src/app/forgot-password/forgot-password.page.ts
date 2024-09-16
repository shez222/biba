import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';
import {extendedEmail} from "../validators/extended-email.validator";
import {TranslationService} from "../services/translation.service";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})

export class ForgotPasswordPage implements OnInit
{
    public IsEmailValidated:boolean = false;
    public FPasswordForm:any=[];
    public ResetPasswordForm:any=[];
    messageSentTo : string = "Message was sent";
    public validation_messages =
    {
      'email':
      [
        { type: 'required', message: 'Email is required.' },
        { type: 'email', message: 'Please enter a valid email.' }
      ],
    };

    public validation_messages_change_password =
    {
      'verification_code':
      [
        { type: 'required', message: 'Verification code is required.' },
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

    public NewPasswordType: string = 'password';
    public NewPasswordIcon: string = 'eye-off';

    public ConfirmPasswordType: string = 'password';
    public ConfirmPasswordIcon: string = 'eye-off';
    public ResultResponseForActionData: any = [];

    constructor(private SendReceiveRequestsService: SendReceiveRequestsService,
                private FB : FormBuilder,
                private LoadingCtrl : LoadingController,
                public translation: TranslationService)
    { }

    ngOnInit()
    {
      this.FPasswordForm = this.FB.group({
        'email' : ['', {
          validators: [Validators.required, Validators.email, extendedEmail()],
          //updateOn: 'blur'
        }],
      });
      this.ResetPasswordForm = this.FB.group({
        'user_id': ['', [Validators.required]],
        'verification_code': ['', { validators: [Validators.required], updateOn: 'blur'}],
        'new_password': ['', { validators: [Validators.required, Validators.minLength(6)], updateOn: 'blur'}],
        'confirm_password': ['', [Validators.required]],
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

    async ValidateEmail(Form:any)
    {
      let Email = (Form.email) ? Form.email : "";
      let ObjectValidateEmail =
      {
        email:Email
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
      await this.SendReceiveRequestsService.ValidateEmail(ObjectValidateEmail).then(result =>
      {
        Loading.dismiss();//DISMISS LOADER
        this.ResultResponseForActionData = result;
        if(this.ResultResponseForActionData['result']==1)
        {
          this.SendReceiveRequestsService.showMessageToast(this.ResultResponseForActionData['message']);
          this.ResultResponseForActionData = this.ResultResponseForActionData['user'];
          this.ResetPasswordForm.controls['user_id'].setValue(this.ResultResponseForActionData['id']);
          let baseMessage = this.translation.trans('forgot-password','EmailSentTo');
          this.messageSentTo = baseMessage.replace("{email}", Email);
          this.IsEmailValidated = true;
        }
        else
        {
          this.SendReceiveRequestsService.showMessageToast(this.translation.trans('forgot-password','ErrorAccountExistance'));
          this.IsEmailValidated = false;
        }
        console.log(this.ResultResponseForActionData);
      },
      error =>
      {
        Loading.dismiss();//DISMISS LOADER
        console.log(error);
      });
    }

    async ResetPassword(Form:any)
    {
      let user_id = (Form.user_id) ? Form.user_id : "";
      let verification_code = (Form.verification_code) ? Form.verification_code : "";
      let new_password = (Form.new_password) ? Form.new_password : "";
      let confirm_password = (Form.confirm_password) ? Form.confirm_password : "";

      let ObjectChangePassword =
      {
        user_id:user_id,
        verification_code:verification_code,
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
      await this.SendReceiveRequestsService.ResetPassword(ObjectChangePassword).then(result =>
      {
        Loading.dismiss();//DISMISS LOADER
        this.ResultResponseForActionData = result;
        if(this.ResultResponseForActionData['result']==1)
        {
          this.SendReceiveRequestsService.showMessageToast(this.ResultResponseForActionData['message']);
          this.IsEmailValidated = false;
          this.SendReceiveRequestsService.Router.navigate(['/sign-in']);
        }
        else
        {
          this.SendReceiveRequestsService.showMessageToast(this.ResultResponseForActionData['message']);
        }
        console.log(this.ResultResponseForActionData);
      },
      error =>
      {
        Loading.dismiss();//DISMISS LOADER
        console.log(error);
      });
    }

    SignIn()
    {
      this.SendReceiveRequestsService.Router.navigate(['/sign-in']);
    }
}
