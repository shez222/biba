import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {AlertController, ToastController} from '@ionic/angular';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {StatusBar} from '@awesome-cordova-plugins/status-bar/ngx';
import {Device} from "@awesome-cordova-plugins/device";
import {environment} from '../../environments/environment';
import {ProfileService} from "../services/profile.service";

@Injectable({
  providedIn: 'root'
})

export class SendReceiveRequestsService
{
	public ApiUrl: string = environment.apiUrl;
  public ApiUrlV2: string = environment.apiUrl + "v2/";
	public serverResponse : any = [];
	public HasProfileCompletionDialogueDisplayed:any = [];
	private SubjectOnNetworkOnLineOffLine = new Subject<any>();//THIS OBSERVABLE IS USED ON CHECKING ONLINE/OFFLINE NETWORK AVAILIBILITY
	private SubjectOnNotificationReaded = new Subject<any>();//THIS OBSERVABLE IS USED TO REDUCE COUND OF PUSH NOTIFICATION READED
	constructor(private StatusBar: StatusBar,
              private http: HttpClient,
              private AlertCtrl: AlertController,
              public Router: Router,
              private ToastController: ToastController,
              private profileService: ProfileService)
	{

	}

	PublishOnNetworkOnLineOffLine(data: any)
	{
		this.SubjectOnNetworkOnLineOffLine.next(data);
	}//THIS OBSERVABLE IS USED ON CHECKING ONLINE/OFFLINE NETWORK AVAILIBILITY

	ObservableOnOnNetworkOnLineOffLine(): Subject<any>
	{
		return this.SubjectOnNetworkOnLineOffLine;
	}//THIS OBSERVABLE IS USED ON CHECKING ONLINE/OFFLINE NETWORK AVAILIBILITY

	PublishOnNotificationReaded(data: any)
	{
		this.SubjectOnNotificationReaded.next(data);
	}//THIS OBSERVABLE IS USED TO REDUCE COUND OF PUSH NOTIFICATION READED

	ObservableOnNotificationReaded(): Subject<any>
	{
		return this.SubjectOnNotificationReaded;
	}//THIS OBSERVABLE IS USED TO REDUCE COUND OF PUSH NOTIFICATION READED

  	GetHeaderOptions(): any
	{
		var headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded').set('Accept','application/json');
		return { headers }
	}

  GetUserLanguage() : string {
    const UserInformationData : any = this.profileService.GetUserProfileData();
    if (UserInformationData?.language){
      return UserInformationData.language;
    }

    // remove after a while, just keep detectUserLanguage
    let defaultUserLanguageData : any = localStorage.getItem("DefaultUserLanguage");
    defaultUserLanguageData = JSON.parse(defaultUserLanguageData);
    if (defaultUserLanguageData !== null){
      const userLanguage = defaultUserLanguageData.language == "english" ? "en" : "de"
      this.profileService.SaveLanguageToProfile(userLanguage);
      return userLanguage;
    }

    const detectedLanguage = this.detectUserLanguage();
    this.profileService.SaveLanguageToProfile(detectedLanguage);
    return detectedLanguage;
  }

  detectUserLanguage() : string {
    const supportedLanguages = ['en', 'de']; // add additional languages to prevent api call
    const browserLanguage = window.navigator.languages && window.navigator.languages[0] || window.navigator.language;

    let shortLang = browserLanguage.split(/[-_]/)[0];

    if (supportedLanguages.includes(shortLang)) {
      return shortLang;
    }

    // Fallback to 'en' if detected language is not supported
    return "en";
  }

	GetLocalStorageForProfileCompletion()
	{
		return localStorage.getItem("HasProfileCompletionDialogueDisplayed");
	}

  SetLocalStorageForProfileCompletion(value: string)
  {
    return localStorage.setItem("HasProfileCompletionDialogueDisplayed", value);
  }

  GetLocalStorageForIdentity()
  {
    return localStorage.getItem("HasIdentifyDialogueDisplayed");
  }

  SetLocalStorageForIdentity(value: string)
  {
    return localStorage.setItem("HasIdentifyDialogueDisplayed", value);
  }

	Translation()
  {
    return new Promise((resolve, reject) =>
    {
      this.http.get(this.ApiUrlV2 + "translation" , {}).subscribe((res: any) =>
        {
          resolve(res);
        },
        err =>
        {
          console.log(err);
          let errorMessage=this.getErrorMessage(err);
          this.showMessageToast(errorMessage);
          console.log()
          reject(errorMessage);
        });
    });
  }

	SignIn(data:any)
	{
		let language = this.GetUserLanguage();
		return new Promise((resolve, reject) =>
		{
			let dataToPost = new HttpParams()
        .set("email",data.email)
        .set("password", data.password)
        .set("social_type", data.socialType)
        .set("language", language);
			this.http.post(this.ApiUrl + "login",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				this.StatusBar.backgroundColorByHexString('#ffffff');
				this.serverResponse=res;
				resolve(this.serverResponse);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

  SocialSignup(data:any)
	{
		let language = this.GetUserLanguage();
		return new Promise((resolve, reject) =>
		{
			let dataToPost = new HttpParams()
        .set("email",data.email)
        .set("first_name", data.firstname)
        .set("surname", data.surname)
        .set("social_type", data.socialType)
        .set("token", data.token)
        .set("language", language);
			this.http.post(this.ApiUrl + "socialSignup",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				this.StatusBar.backgroundColorByHexString('#ffffff');
				this.serverResponse=res;
				resolve(this.serverResponse);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

	SignUp(data:any)
	{
		return new Promise((resolve, reject) =>
		{
			let dataToPost = new HttpParams()
        .set("email",data.email)
        .set("password", data.password)
        .set("first_name", data.firstname)
        .set("surname", data.lastname)
        .set("date_of_birth", data.date_of_birth)
        .set("password_confirmation", data.password)
        .set("phone", data.phone)
        .set("social_type", data.socialType)
        .set("profile_type", data.profile_type)
        .set("language", data.language);
			this.http.post(this.ApiUrl + "register",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				this.serverResponse=res;
				resolve(this.serverResponse);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

	SignupVerification(data:any)
	{
		return new Promise((resolve, reject) =>
		{
      let dataToPost = this.getDefaultParam()
        .set("code", data.verification_code);
			this.http.post(this.ApiUrl + "emailVerify",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				this.serverResponse=res;
				resolve(this.serverResponse);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

  languages(language: string | null = null)
  {
    return new Promise((resolve, reject) =>
    {
      if (!language) {
        language = "en";
      }
      const dataToPost = new HttpParams()
        .set("language", language);
      this.http.post(this.ApiUrl + "languages",  dataToPost , {}).subscribe((res: any) =>
        {
          this.serverResponse=res;
          resolve(this.serverResponse);
        },
        err =>
        {
          console.log(err);
          let errorMessage=this.getErrorMessage(err);
          this.showMessageToast(errorMessage);
          console.log()
          reject(errorMessage);
        });
    });
  }

  resendVerifyCode()
  {
    return new Promise((resolve, reject) =>
    {
      let dataToPost = this.getDefaultParam();
      this.http.post(this.ApiUrl + "resendVerifyCode",  dataToPost , {}).subscribe((res: any) =>
        {
          this.serverResponse=res;
          resolve(this.serverResponse);
        },
        err =>
        {
          console.log(err);
          let errorMessage=this.getErrorMessage(err);
          this.showMessageToast(errorMessage);
          console.log()
          reject(errorMessage);
        });
    });
  }

	ValidateEmail(data:any)
	{
		let language = this.GetUserLanguage();
		return new Promise((resolve, reject) =>
		{
			let dataToPost = new HttpParams()
        .set("email",data.email)
        .set("language", language);
			this.http.post(this.ApiUrl + "forgotPassword",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				this.serverResponse=res;
				resolve(this.serverResponse);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

	ResetPassword(data:any)
	{
    let language = this.GetUserLanguage();
		return new Promise((resolve, reject) =>
		{
      let dataToPost = new HttpParams()
        .set("fp_code",data.verification_code)
        .set("password", data.confirm_password)
        .set("language", language);
			this.http.post(this.ApiUrl + "resetPassword",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				this.serverResponse=res;
				resolve(this.serverResponse);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

	ChangePassword(data:any)
	{
		return new Promise((resolve, reject) =>
		{
      let dataToPost = this.getDefaultParam()
        .set("old_password", data.old_password)
        .set("password", data.new_password)
        .set("password_confirmation", data.confirm_password);
			this.http.post(this.ApiUrl + "changePassword",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				this.serverResponse=res;
				resolve(this.serverResponse);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

	GetProfile()
	{
		return new Promise((resolve, reject) =>
		{
      let dataToPost = this.getDefaultParam();
			this.http.post(this.ApiUrl + "getProfile",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				this.serverResponse=res;
				resolve(this.serverResponse);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

	GetProfileByID(data:any)
	{
		return new Promise((resolve, reject) =>
		{
      let dataToPost = this.getDefaultParam()
        .set("user_id",data.user_id);
			this.http.post(this.ApiUrl + "getProfileById",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				this.serverResponse=res;
				resolve(this.serverResponse);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

	Groups()
	{
		return new Promise((resolve, reject) =>
		{
      let dataToPost = this.getDefaultParam();
			this.http.post(this.ApiUrl + "myGroups",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				this.serverResponse=res;
				resolve(this.serverResponse);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

	memberInGroup()
	{
		return new Promise((resolve, reject) =>
		{
      let dataToPost = this.getDefaultParam();
			this.http.post(this.ApiUrl + "memberInGroup",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				this.serverResponse=res;
				resolve(this.serverResponse);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

	AddGroup(data:any)
	{
		return new Promise((resolve, reject) =>
		{
      let dataToPost = this.getDefaultParam()
        .set("name", data.group_name);
			this.http.post(this.ApiUrl + "newGroup",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				this.serverResponse=res;
				resolve(this.serverResponse);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

	DeleteGroup(data:any)
	{
		return new Promise((resolve, reject) =>
		{
      let dataToPost = this.getDefaultParam()
        .set("group_id", data.group_id);
			this.http.post(this.ApiUrl + "deleteGroup",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				this.serverResponse=res;
				resolve(this.serverResponse);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

	AcceptingOrLeavingTheGroup(data:any)
	{
		return new Promise((resolve, reject) =>
		{
      let dataToPost = this.getDefaultParam()
        .set("group_id", data.group_id)
        .set("type", data.type);
			this.http.post(this.ApiUrl + "groupInvitation",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				this.serverResponse=res;
				resolve(this.serverResponse);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

	GetAllNotifications()
	{
		return new Promise((resolve, reject) =>
		{
      let dataToPost = this.getDefaultParam();
			this.http.post(this.ApiUrl + "myNotification",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				this.serverResponse=res;
				resolve(this.serverResponse);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

	Kids()
	{
		return new Promise((resolve, reject) =>
		{
      let dataToPost = this.getDefaultParam();
			this.http.post(this.ApiUrl + "myKids",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				this.serverResponse=res;
				resolve(this.serverResponse);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

	AddKid(data:any)
	{
		return new Promise((resolve, reject) =>
		{
      let dataToPost = this.getDefaultParam()
        .set("name", data.kid_name)
        .set("date_of_birth", data.kid_dob);
			this.http.post(this.ApiUrl + "addKids",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				this.serverResponse=res;
				resolve(this.serverResponse);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

	EditKid(data:any)
	{
		return new Promise((resolve, reject) =>
		{
      let dataToPost = this.getDefaultParam()
        .set("kids_id",data.kid_id)
        .set("name", data.kid_name)
        .set("date_of_birth", data.kid_dob);
			this.http.post(this.ApiUrl + "editKids",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				this.serverResponse=res;
				resolve(this.serverResponse);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

	DeleteKid(data:any)
	{
		return new Promise((resolve, reject) =>
		{
      let dataToPost = this.getDefaultParam()
        .set("kids_id", data.KidID);
			this.http.post(this.ApiUrl + "deleteKids",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				this.serverResponse=res;
				resolve(this.serverResponse);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

	MyRequests()
	{
		return new Promise((resolve, reject) =>
		{
      let dataToPost = this.getDefaultParam();
			this.http.post(this.ApiUrl + "myRequests",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				this.serverResponse=res;
				resolve(this.serverResponse);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

	AddRequest(data:any)
	{
		return new Promise((resolve, reject) =>
		{
      let dataToPost = this.getDefaultParam()
        .set("title", data.title)
        .set("description", data.description)
        .set("max_amount", data.max_amount)
        .set("from_date", data.from_date)
        .set("to_date", data.to_date)
        .set("group_visibility", data.group_visibility)
        .set("public_visibility", data.public_visibility)
        .set("group_id", data.to_group)
        .set("kids_id", data.kids_id)
        .set("address_type", data.location)
        .set("address", data.address)
        .set("street", data.street)
        .set("zip", data.zipcode)
        .set("city", data.city)
        .set("country_code", data.country_code)
        .set("latitude", data.latitude)
        .set("longitude", data.longitude);
			this.http.post(this.ApiUrlV2 + "newRequest",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				this.serverResponse=res;
				resolve(this.serverResponse);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

	EditRequest(data:any)
	{
		return new Promise((resolve, reject) =>
		{
      let dataToPost = this.getDefaultParam()
        .set("request_id",data.request_id)
        .set("title", data.title)
        .set("description", data.description)
        .set("max_amount", data.max_amount)
        .set("from_date", data.from_date)
        .set("to_date", data.to_date)
        .set("group_visibility", data.group_visibility)
        .set("public_visibility", data.public_visibility)
        .set("group_id", data.to_group)
        .set("kids_id", data.kids_id)
        .set("address_type", data.location)
        .set("address", data.address)
        .set("street", data.street)
        .set("zip", data.zipcode)
        .set("city", data.city)
        .set("country_code", data.country_code)
        .set("latitude", data.latitude)
        .set("longitude", data.longitude);
			this.http.post(this.ApiUrlV2 + "editRequest",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				this.serverResponse=res;
				resolve(this.serverResponse);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

	GetRequestByID(data:any)
	{
		return new Promise((resolve, reject) =>
		{
      let dataToPost = this.getDefaultParam()
        .set("request_id",data.request_id);
			this.http.post(this.ApiUrl + "requestDetails",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				this.serverResponse=res;
				resolve(this.serverResponse);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

	DeleteRequestByID(data:any)
	{
		return new Promise((resolve, reject) =>
		{
      let dataToPost = this.getDefaultParam()
        .set("request_id", data.request_id);
			this.http.post(this.ApiUrl + "requestDelete",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				this.serverResponse=res;
				resolve(this.serverResponse);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

	MyApplies()
	{
		return new Promise((resolve, reject) =>
		{
      let dataToPost = this.getDefaultParam();
			this.http.post(this.ApiUrl + "myAppliedRequestList",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				this.serverResponse=res;
				resolve(this.serverResponse);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

	DeletingApplies(data:any)
	{
		return new Promise((resolve, reject) =>
		{
      let dataToPost = this.getDefaultParam()
        .set("id", data.id);
			this.http.post(this.ApiUrl + "deleteAppliedRequest",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				this.serverResponse=res;
				resolve(this.serverResponse);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

	GetIdentificationDocuments()
	{
		return new Promise((resolve, reject) =>
		{
      let dataToPost = this.getDefaultParam();
			this.http.post(this.ApiUrl + "getDocument",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				this.serverResponse=res;
				resolve(this.serverResponse);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

	FeedBack(data:any)
	{
		return new Promise((resolve, reject) =>
		{
      let dataToPost = this.getDefaultParam()
        .set("subject", data.subject)
        .set("description", data.description);
			this.http.post(this.ApiUrl + "addFeedback",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				this.serverResponse=res;
				resolve(this.serverResponse);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

	SearchForMember(data:any)
	{
		return new Promise((resolve, reject) =>
		{
      let dataToPost = this.getDefaultParam()
        .set("search",data.SearchedText)
        .set("searchType",data.searchType);
			this.http.post(this.ApiUrlV2 + "searchMember",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				this.serverResponse=res;
				resolve(this.serverResponse);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

	GetMembersListForGroup(data:any)
	{
		return new Promise((resolve, reject) =>
		{
      let dataToPost = this.getDefaultParam()
        .set("group_id",data.group_id);
			this.http.post(this.ApiUrlV2 + "groupMember",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				this.serverResponse=res;
				resolve(this.serverResponse);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

	AddMember(data:any)
	{
		return new Promise((resolve, reject) =>
		{
      let dataToPost = this.getDefaultParam()
        .set("group_id",data.group_id)
        .set("member_id",data.member_id);
			this.http.post(this.ApiUrl + "addToList",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				this.serverResponse=res;
				resolve(this.serverResponse);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

	InviteMember(data:any)
	{
		return new Promise((resolve, reject) =>
		{
      let dataToPost = this.getDefaultParam()
        .set("group_id",data.group_id)
        .set("member_email",data.member_email);
			this.http.post(this.ApiUrl + "sendInvitation",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				this.serverResponse=res;
				resolve(this.serverResponse);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

	DeleteMembersFormGroup(data:any)
	{
		return new Promise((resolve, reject) =>
		{
      let dataToPost = this.getDefaultParam()
        .set("id",data.record_id);
			this.http.post(this.ApiUrl + "deleteMember",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				this.serverResponse=res;
				resolve(this.serverResponse);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

	ShowRequestsForMe()
	{
		return new Promise((resolve, reject) =>
		{
      let dataToPost = this.getDefaultParam();
			this.http.post(this.ApiUrl + "forMeRequests",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				this.StatusBar.backgroundColorByHexString('#ffffff');
				this.serverResponse=res;
				resolve(this.serverResponse);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

	ShowNearByRequests(data:any)
	{
		return new Promise((resolve, reject) =>
		{
      let dataToPost = this.getDefaultParam()
        .set("distance",data.distance)
        .set("kids_type",data.kids_type)
        .set("price_range",data.price_range)
        .set("latitude",data.latitude)
        .set("longitude",data.longitude);
			this.http.post(this.ApiUrl + "nearMeRequests",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				this.serverResponse=res;
				resolve(this.serverResponse);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

	AcceptingOrDecliningRequest(data:any)
	{
		return new Promise((resolve, reject) =>
		{
      let dataToPost = this.getDefaultParam()
        .set("request_id", data.request_id)
        .set("request_status", data.request_status)
        .set("description", data.description)
        .set("payment_type", data.payment_type)
        .set("amount", data.amount);
			this.http.post(this.ApiUrl + "acceptedRequest",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				this.serverResponse=res;
				resolve(this.serverResponse);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

	ApproveDisapproveApplies(data:any)
	{
		return new Promise((resolve, reject) =>
		{
      let dataToPost = this.getDefaultParam()
        .set("accepted_requests_id", data.accepted_requests_id)
        .set("approve", data.approve);
			this.http.post(this.ApiUrl + "updateAwardedBy",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				this.serverResponse=res;
				resolve(this.serverResponse);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

	DeletingAccount()
	{
		return new Promise((resolve, reject) =>
		{
      let dataToPost = this.getDefaultParam();
			this.http.post(this.ApiUrl + "deleteAccount",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				this.serverResponse=res;
				resolve(this.serverResponse);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

	RegisterPushToken(data:any)
	{
		return new Promise((resolve, reject) =>
		{
      let dataToPost = this.getDefaultParam()
        .set("device_type",data.device_type)
        .set("token",data.token)
        .set("device_key",data.device_key)
        .set("app_version",data.app_version);
			this.http.post(this.ApiUrl + "updateDeviceDetails",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				this.serverResponse=res;
				resolve(this.serverResponse);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

	GetNotificationDetail(data:any)
	{
		return new Promise((resolve, reject) =>
		{
      let dataToPost = this.getDefaultParam()
        .set("notification_id",data.NotificationID)
			this.http.post(this.ApiUrl + "notificationDetail",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				this.serverResponse=res;
				resolve(this.serverResponse);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

	async GetNumberOfUnReadNotification()
	{
		return new Promise((resolve, reject) =>
		{
      let dataToPost = this.getDefaultParam();
			this.http.post(this.ApiUrl + "unreadNotification",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				resolve(res);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

	Logout()
	{
    const deviceKey = Device.uuid;
		return new Promise((resolve, reject) =>
		{
			let dataToPost = this.getDefaultParam();
      if (deviceKey != null) {
        dataToPost = this.getDefaultParam()
          .set("device_key", deviceKey);
      }
			this.http.post(this.ApiUrl + "logout",  dataToPost , {}).subscribe((res: any) =>
			{
				//this.showMessageToast(res.message);
				resolve(res);
			},
			err =>
			{
				console.log(err);
				let errorMessage=this.getErrorMessage(err);
				this.showMessageToast(errorMessage);
				console.log()
				reject(errorMessage);
			});
		});
	}

  getDefaultParam(){
    let headers = this.GetHeaderOptions();
    let language = this.GetUserLanguage();
    let userData:any = this.profileService.GetUserProfileData()
    return new HttpParams()
        .set("session_token",userData.session_token)
      // use userData.language after a while
        .set("language", language);
  }

	async showMessageToast(message:any)
	{
		if(message != '' && message !='undefined' && message != undefined && message !='null' && message != null)
		{
			const toast = await this.ToastController.create({
				message: message,
				duration: 3000,
				icon: 'information-circle',
				cssClass: 'custom-toast',
				buttons: [
					{
						text: 'Dismiss',
						role: 'cancel',
						handler: () => {  }
					}
				]
			});
			await toast.present();
			await toast.onDidDismiss();
		}
	}

	getErrorMessage(err:any)
	{
		if(err.error == null)
		{
			return err.message;
		}
		else if(err.error.message)
		{
			return err.error.message;
		}
		else
		{
			return err.error.status;
		}
	}
}
