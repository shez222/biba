import { Injectable } from '@angular/core';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';
import {PushNotificationService} from "./push-notification.service";
import {ProfileService} from "./profile.service";
import { MenuController, Platform} from "@ionic/angular";
import { Facebook, FacebookLoginResponse } from '@awesome-cordova-plugins/facebook/ngx';
import { GooglePlus } from '@awesome-cordova-plugins/google-plus/ngx';
import { SignInWithApple, AppleSignInResponse, AppleSignInErrorResponse, ASAuthorizationAppleIDRequest } from '@awesome-cordova-plugins/sign-in-with-apple/ngx';
import {LoadingDialogService} from "./loading-dialog.service";
import {UtilService} from "./util.service";

@Injectable({
  providedIn: 'root'
})
export class SocialLoginService {

  constructor(private Platform: Platform,
              private Menu: MenuController,
              private GooglePlus: GooglePlus,
              private SignInWithApple: SignInWithApple,
              private Facebook: Facebook,
              private SendReceiveRequestsService: SendReceiveRequestsService,
              private profileService: ProfileService,
              private PushNotificationService : PushNotificationService,
              private loadingDialogService: LoadingDialogService,
              private utils: UtilService)
  {

  }

  async GoogleLoginORSignup()
  {
    await this.loadingDialogService.showLoadingDialog();
    let params = {
      //optional clientId of your Web application from Credentials settings of your project
      // - On Android, this MUST be included to get an idToken. On iOS, it is not required
        webClientId: '2334194827-d22qe422uan7ruqkbkrkjc6od0eqfivs.apps.googleusercontent.com',
        offline: true
    }
    await this.GooglePlus.login(params).then(async (UserInfo) => {
        let userData : any = UserInfo;
        // on Apple devices UserInfo is a string
        if (typeof UserInfo === 'string') {
          userData = JSON.parse(UserInfo);
        }
        let ObjectSocialSignin =
          {
            email: userData.email,
            firstname: userData.givenName,
            surname: userData.familyName,
            socialType: "google",
            token:userData.id_token
          }
        await this.HandleLogin(ObjectSocialSignin);
      },
      async(err) => {
        await this.loadingDialogService.dismissLoadingDialog();
        console.log(err);
      });
  }

  async FaceBookLoginORSignup()
  {
    await this.loadingDialogService.showLoadingDialog();
    await this.Facebook.login(['public_profile','email']).then(async (Res:FacebookLoginResponse) =>
    {
      if(Res.status == "connected")
      {
        let accessToken = Res.authResponse.accessToken;
        await this.Facebook.api("/me?fields=name,email", ['public_profile','email']).then(async(User) =>
        {
          let splitName = User.name.split(" ");
          let FirstName = splitName[0];
          let LastName = splitName[1];

          let ObjectSocialSignin= {
              email:User.email,
              firstname:FirstName,
              surname:LastName,
              socialType:"facebook",
              token:accessToken,
            }
          await this.HandleLogin(ObjectSocialSignin);
        }).catch(async(error) =>
        {
          await this.loadingDialogService.dismissLoadingDialog();
          console.log(error);
        });
      }
    }).catch(async(error) =>
    {
      await this.loadingDialogService.dismissLoadingDialog();
      console.log(error);
    });
  }

  async AppleLoginORSignup()
  {
    await this.loadingDialogService.showLoadingDialog();
    await this.SignInWithApple.signin({
      requestedScopes: [ASAuthorizationAppleIDRequest.ASAuthorizationScopeFullName,ASAuthorizationAppleIDRequest.ASAuthorizationScopeEmail]}).then(async (res: AppleSignInResponse) =>
    {
      // there is only identityToken set in AppleSignInResponse
      let AppleTokenData = this.utils.DecryptAppleIdToken(res.identityToken);

      let ObjectSocialSignin = {
          email:AppleTokenData.email,
          firstname:"",
          surname:"",
          socialType:"apple",
          token:res.identityToken
        }
      await this.HandleLogin(ObjectSocialSignin);
    })
      .catch(async (error: AppleSignInErrorResponse) =>
      {
        await this.SendReceiveRequestsService.showMessageToast("Something went wrong");
        await this.loadingDialogService.dismissLoadingDialog();
      });
  }

  async HandleLogin(ObjectSocialSignin:any)
  {
    if(ObjectSocialSignin.hasOwnProperty('email'))
    {
      //LOADER
      await this.SendReceiveRequestsService.SocialSignup(ObjectSocialSignin).then(async (result) =>
        {
          await this.loadingDialogService.dismissLoadingDialog();
          await this.HandleLoginResponse(result);
        },
        async(error) =>
        {
          await this.loadingDialogService.dismissLoadingDialog();
          await this.SendReceiveRequestsService.showMessageToast("Something went wrong - could not login");
        });
    } else {
      await this.SendReceiveRequestsService.showMessageToast("Something went wrong - no email received");
    }
  }

  async HandleLoginResponse(result:any)
  {
    let ResultResponseData : any = result;
    if(ResultResponseData['result']==1)
    {
      let ResultData : any = ResultResponseData['user'];
      let SessionToken = ResultResponseData['session_token'];
      this.profileService.SaveUserInformation(ResultData, SessionToken);
      this.Menu.enable(true);
      //PUSH NOTIFICATION
      await this.PushNotificationService.RegisterPushNotification();
      await this.PushNotificationService.updateNotificationCount();
      //PUSH NOTIFICATION
      if (ResultResponseData['registration']) {
        this.SendReceiveRequestsService.Router.navigate(['profile']);
      } else {
        this.SendReceiveRequestsService.Router.navigate(['open-requests-main']);
      }
    }
    await this.SendReceiveRequestsService.showMessageToast(ResultResponseData['message']);
  }

}
