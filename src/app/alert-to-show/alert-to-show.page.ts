import { Component, OnInit } from '@angular/core';
import { LoadingController, MenuController, ModalController, NavParams } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';
import * as moment from 'moment';
import {CalendarService} from "../services/calendar.service";
import {TranslationService} from "../services/translation.service";
import {UtilService} from "../services/util.service";

@Component({
  selector: 'app-alert-to-show',
  templateUrl: './alert-to-show.page.html',
  styleUrls: ['./alert-to-show.page.scss'],
})
export class AlertToShowPage implements OnInit
{
  public AlertType : any = null;

  public ResultResponseDataRequest:any=[];
  public RequestID : any = null;
  public RequestCalendars = [];

  public SignUpVerificationForm:any=[];
  public ResultData : any = [];
  public RequestResultData : any = [];
  public NotificationID : any = null;
  public NotificationPG : any = [];
  public signup_validation_messages =
  {
    'verification_code':
    [
      { type: 'required', message: 'Code is required.' },
    ]
  };
  public IS_NEWWORK_OFFLINE : boolean = false;//THIS OBSERVABLE IS USED ON CHECKING ONLINE/OFFLINE NETWORK AVAILIBILITY

  constructor(
    private SendReceiveRequestsService: SendReceiveRequestsService,
    private Menu: MenuController,
    private FBA : FormBuilder,
    private LoadingCtrl : LoadingController,
    private ModalController: ModalController,
    private NavParams: NavParams,
    private calendar: CalendarService,
    private utils: UtilService,
    public translation: TranslationService)
  {
    this.SendReceiveRequestsService.ObservableOnOnNetworkOnLineOffLine().subscribe(async(data) =>
    {
      this.IS_NEWWORK_OFFLINE = data.IS_NEWWORK_OFFLINE;
      if(this.IS_NEWWORK_OFFLINE == false)
      {
        this.DismissModal();
      }
      console.log('Data received', data);
    });//THIS OBSERVABLE IS USED ON CHECKING ONLINE/OFFLINE NETWORK AVAILIBILITY
  }

  ngOnInit()
  {
    this.SignUpVerificationForm = this.FBA.group({
      'verification_code': ['', Validators.required],
    });
  }

  async ionViewWillEnter()
  {
    this.AlertType = this.NavParams.get('AlertType');
    switch(this.AlertType)
    {
      case 'SignUp':
        break;
      case 'Applied':
        this.RequestID = this.NavParams.get('RequestID');
        await this.GetRequestDetail();
        // code block
        break;
      case 'VisibilityInformation':
        // code block
        break;
      case 'Identification':
        // code block
        break;
      case 'IncompleteProfile':
        // code block
        break;
      case 'NotificationDetail':
        this.NotificationID = this.NavParams.get('NotificationID');
        await this.GetNotificationDetail();
        // code block
        break;
      case 'OFFLINE':
        // code block
        break;
      default:
        this.DismissModal();
        // code block
    }
  }

  async GetRequestDetail()
  {
    //LOADER
    const LoadingR = await this.LoadingCtrl.create({
      spinner: 'circles',
      message: 'Please Wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    await LoadingR.present();
    //LOADER
    let ObjectRequest =
    {
      request_id:this.RequestID
    }
    await this.SendReceiveRequestsService.GetRequestByID(ObjectRequest).then(result =>
    {
      LoadingR.dismiss();//DISMISS LOADER
      this.ResultResponseDataRequest = result;
      if(this.ResultResponseDataRequest['result']==1)
      {
        this.ResultResponseDataRequest = this.ResultResponseDataRequest['myRequests'];
      }
      console.log("Request Detail",this.ResultResponseDataRequest);
    },
    error =>
    {
      LoadingR.dismiss();//DISMISS LOADER
      console.log(error);
    });
  }

  async addToCalendar(requestId: number)
  {
    await this.calendar.addToCalendar(requestId);
  }

  async SignupVerification(Form:any)
  {
    let verification_code = (Form.verification_code) ? Form.verification_code : null;
    let ObjVerification =
    {
      verification_code : verification_code
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
    await this.SendReceiveRequestsService.SignupVerification(ObjVerification).then(async(result) =>
    {
      Loading.dismiss();//DISMISS LOADER
      let ResultDataVerification : any = result;
      if(ResultDataVerification['result']==1)
      {
        this.Menu.enable(true);
        this.DismissModal();
        this.SendReceiveRequestsService.Router.navigate(['/open-requests-main']);
      }
      else
      {
        this.SendReceiveRequestsService.showMessageToast(ResultDataVerification['message']);
      }
      //console.log(this.ResultDataVerification);
    },
    error =>
    {
      Loading.dismiss();//DISMISS LOADER
      console.log(error);
    });

    console.log(Form);

  }

  async resendCode(){
    try {
      const response: any = await this.SendReceiveRequestsService.resendVerifyCode();
      await this.SendReceiveRequestsService.showMessageToast(response['message']);
    } catch (error) {
        console.error('Error:', error);
    }
  }

  async GetNotificationDetail()
  {
    let ObjNotification =
    {
      NotificationID : this.NotificationID
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
    await this.SendReceiveRequestsService.GetNotificationDetail(ObjNotification).then(result =>
    {
      Loading.dismiss();//DISMISS LOADER
      let ResultDataVerification : any = result;
      if(ResultDataVerification['result']==1)
      {
        this.SendReceiveRequestsService.PublishOnNotificationReaded({
					IS_PUSH_READED: true
				});//THIS OBSERVABLE IS USED TO REDUCE COUND OF PUSH NOTIFICATION READED
        this.ResultData = ResultDataVerification['notification'];
        if (this.ResultData['userRequest'])
        {
          this.RequestResultData = this.ResultData['userRequest'];
          if (this.RequestResultData) {
            let FormatedFromDate_1 = moment(this.RequestResultData['from_date']).format('DD MMM YYYY HH:mm');
            let FormatedToDate_1 = moment(this.RequestResultData['to_date']).format('DD MMM YYYY HH:mm');
            let FormatedFromDate_2 = moment(this.RequestResultData['from_date'], 'YYYY-MM-DD HH:mm:ss');
            let FormatedToDate_2 = moment(this.RequestResultData['to_date'], 'YYYY-MM-DD HH:mm:ss');
            let FromDateISO = moment(this.RequestResultData['from_date']).toISOString();
            let ToDateISO = moment(this.RequestResultData['to_date']).toISOString();
            let GetDateDifference = this.utils.DateDifference(FromDateISO, ToDateISO, FormatedFromDate_2, FormatedToDate_2);
            this.RequestResultData['formatted_from_date'] = FormatedFromDate_1;
            this.RequestResultData['formatted_to_date'] = FormatedToDate_1;
            this.RequestResultData['day_difference'] = GetDateDifference;
          }
        }
        console.log("ResultData",this.ResultData);
      }
      //console.log(this.ResultDataVerification);
    },
    error =>
    {
      Loading.dismiss();//DISMISS LOADER
      console.log(error);
    });
  }

  TakeMeThere()
  {
    this.DismissModal();
    this.SendReceiveRequestsService.Router.navigate(['/identification']);
  }

  TakeMeToPage(Event:any, requestId:string|null)
  {
    let OBJNotificationScreens = {
      'create_a_request_for_a_specific_group':'open-requests-main',
      'reward_a_application':'my-applies',
      'reject_a_application':'my-applies',
      'delete_a_request':'my-requests',
      'request_accepted':'my-requests',
      'new_group_invitation':'groups',
      'invitee_have_been_added':'groups',
      'group_invitation_rejected':'not-need-to-redirect',
      'update_document_status':'identification'
    }
    this.NotificationPG = JSON.stringify(OBJNotificationScreens);
    this.NotificationPG = JSON.parse(this.NotificationPG);
    this.DismissModal();
    this.SendReceiveRequestsService.Router.navigate([this.NotificationPG[Event]], { queryParams: { requestId: requestId}});
  }

  CompleteProfile()
  {
    this.DismissModal();
    this.SendReceiveRequestsService.Router.navigate(['/profile', {incomplete: false}]);
  }

  CompleteAddress()
  {
    this.DismissModal();
    this.SendReceiveRequestsService.Router.navigate(['/profile', {incomplete: true}]);
  }

  DoItLater()
  {
    this.DismissModal();
    this.SendReceiveRequestsService.Router.navigate(['/open-requests-main']);
  }

  DismissModal()
  {
    this.ModalController.dismiss({
      'dismissed': true
    });
  }
}
