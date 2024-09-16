import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavParams, LoadingController } from '@ionic/angular';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';
import { FormBuilder, Validators } from '@angular/forms';
import {extendedEmail} from "../validators/extended-email.validator";
import {GroupMember} from "../interfaces/group-member.interface";
import {parsePhoneNumberFromString} from "libphonenumber-js";
import {TranslationService} from "../services/translation.service";
import {UtilService} from "../services/util.service";

@Component({
  selector: 'app-group-members',
  templateUrl: './group-members.page.html',
  styleUrls: ['./group-members.page.scss'],
})
export class GroupMembersPage implements OnInit
{
	public MemberInvitationForm:any=[];
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
	public GroupId: any = null;
  public GroupName: any = null;
	public AutoComplete: { input: string; } | undefined;
	public AutoCompleteItemsResponse: any = [];
	public AutoCompleteItems: any = [];
	public AutoCompleteMemberSelected: any = [];
	public AddMemberResult: any = [];
	public InviteMemberResult: any = [];
	public MemberResult: GroupMember[] = [];
	public MemberDeletingResultData: any = [];

  searchType: string = 'email';
  isSearchActive: boolean = false;

	constructor(private FB : FormBuilder,
              private SendReceiveRequestsService: SendReceiveRequestsService,
              private ModalController: ModalController,
              public NavParams: NavParams,
              private AlertController: AlertController,
              private LoadingCtrl: LoadingController,
              private utils: UtilService,
              public translation: TranslationService)
	{
		this.AutoComplete = { input: '' };
    this.AutoCompleteItems = [];
		this.AutoCompleteItemsResponse = [];
		this.AutoCompleteMemberSelected = [];
	}

	ngOnInit()
	{
		this.MemberInvitationForm = this.FB.group({
			'email' : ['', [Validators.required, Validators.email, extendedEmail()]],
		});
	}

	ionViewWillEnter()
	{
    this.GroupId = this.NavParams.get('GroupId');
		this.GroupName = this.NavParams.get('GroupName');
		console.log(this.GroupName+"@"+this.GroupId);
		this.GetMembersListForGroup();
	}

	async GetMembersListForGroup()
	{
		let ObjGroupMember = {
      group_id:this.GroupId,
    }
		this.MemberResult = [];
		//LOADER
		const Loading = await this.LoadingCtrl.create({
			spinner: 'circles',
			message: 'Please Wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await Loading.present();
		//LOADER
		await this.SendReceiveRequestsService.GetMembersListForGroup(ObjGroupMember).then(async(result) =>
		{
			Loading.dismiss();//DISMISS LOADER
			let MemberResultData:any = result;
			if(MemberResultData['result'] == 1)
			{
				this.MemberResult = MemberResultData['members'];
			}
		},
		error =>
		{
			Loading.dismiss();//DISMISS LOADER
			console.log(error);
		});
	}

  getDisplayName(groupMember: GroupMember): string {
    let pendingLabel = this.translation.trans('group-members','Pending');
    pendingLabel = " (" + pendingLabel + ")";
    if (!groupMember.member) {
      return groupMember.member_email + pendingLabel;
    } else {
      let fullName = `${groupMember.member.first_name} ${groupMember.member.surname}`;
      if (groupMember.status == 1) {
        return fullName;
      } else {
        return fullName + pendingLabel;
      }
    }
  }

	async ConfirmedDeletingMember(RecordID:any)
	{
		const alert = await this.AlertController.create({
		cssClass: 'my-custom-alert',
		header: this.translation.trans('common-requests-block','Decline_1'),
		subHeader: this.translation.trans('group-members','DeleteMessage'),
		buttons: [
			{
				text: this.translation.trans('common-requests-block','Decline_3'),
				role: 'cancel',
				cssClass: 'alert-button-cancel',
				handler: (blah) =>
				{
					console.log('Confirm Cancel: blah');
				}
			},
			{
				text: this.translation.trans('common-requests-block','Decline_2'),
				cssClass: 'alert-button-confirm',
				handler: () =>
				{
					this.DeletingMember(RecordID);
					console.log('Confirm Okay');
				}
			}
		]
		});
		await alert.present();
	}

	async DeletingMember(RecordID:any)
	{
		let ObjDeleteMember =
		{
			record_id:RecordID
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
		await this.SendReceiveRequestsService.DeleteMembersFormGroup(ObjDeleteMember).then(async(result) =>
		{
			Loading.dismiss();//DISMISS LOADER
			this.MemberDeletingResultData = result;
			if(this.MemberDeletingResultData['result'] == 1)
			{
				this.SendReceiveRequestsService.showMessageToast(this.MemberDeletingResultData['message']);
				this.GetMembersListForGroup();
			}
			else
			{
				this.SendReceiveRequestsService.showMessageToast(this.MemberDeletingResultData['message']);
			}
		},
		error =>
		{
			Loading.dismiss();//DISMISS LOADER
			console.log(error);
		});
	}

  	DismissModal()
	{
		this.ModalController.dismiss({
			'dismissed': true
		});
	}

	async UpdateSearchResults()
  	{
		if(this.AutoComplete!.input == '')
		{
			this.AutoCompleteItems = [];
			this.AutoCompleteItemsResponse = [];
			this.AutoCompleteMemberSelected = [];
			return;
		}
			let SearchedText = this.AutoComplete!.input;
			let validRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
			if (this.searchType == "email" && !SearchedText.match(validRegex))
      {
        this.SendReceiveRequestsService.showMessageToast(this.translation.trans('group-members','ValidateEmailError'));
        this.isSearchActive = false;
        this.ClearAutocomplete(false);
        return;
      }

      if (this.searchType == "phone")
      {
        const phoneNumber = parsePhoneNumberFromString(SearchedText);
        const isValid = phoneNumber ? phoneNumber.isValid() : false;
        if (!isValid) {
          this.SendReceiveRequestsService.showMessageToast(this.translation.trans('group-members','ValidatePhoneError'));
          this.isSearchActive = false;
          this.ClearAutocomplete(false);
          return;
        }
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

      let ObjSearch = {
        searchType : this.searchType,
        SearchedText : SearchedText
      }
      await this.SendReceiveRequestsService.SearchForMember(ObjSearch).then(async(result) =>
      {
        Loading.dismiss();//DISMISS LOADER
        this.AutoCompleteItemsResponse = result;
        if(this.AutoCompleteItemsResponse['result'] == 1)
        {
          this.AutoCompleteItems = this.AutoCompleteItemsResponse['members'][0];
          console.log(this.AutoCompleteItems);
        }
      },
      error =>
      {
        Loading.dismiss();//DISMISS LOADER
        console.log(error);
      });
	}

	SelectSearchResult(item:any)
	{
		this.AutoComplete!.input = item.email;
		this.AutoCompleteMemberSelected = item;
		this.AutoCompleteItems = [];
		//console.log(item);
	}

	async AddToList()
	{
		console.log(this.AutoCompleteItems['id']);
		let member_id = this.AutoCompleteItems['id'];
		let group_id = this.GroupId;
		if(member_id > 0)
		{
			let ObjAdd = {
        group_id:group_id,
        member_id:member_id
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
			await this.SendReceiveRequestsService.AddMember(ObjAdd).then(async(result) =>
			{
				Loading.dismiss();//DISMISS LOADER
				this.AddMemberResult = result;
				if(this.AddMemberResult['result'] == 1)
				{
					await this.GetMembersListForGroup();
          this.ClearAutocomplete();
				}
        this.SendReceiveRequestsService.showMessageToast(this.InviteMemberResult['message']);
			},
			error =>
			{
				Loading.dismiss();//DISMISS LOADER
				console.log(error);
			});
		}
		else
		{
			this.SendReceiveRequestsService.showMessageToast(this.translation.trans('group-members','SelectingMemberError'));
		}
	}

	ClearAutocomplete(inputField : boolean = true)
	{
		this.AutoCompleteItems = [];
		this.AutoCompleteItemsResponse = [];
		this.AutoCompleteMemberSelected = [];
    if (inputField) {
      this.AutoComplete!.input = '';
    }
    this.isSearchActive = false;
	}

	async SendAnInvitation()
	{
    if (this.searchType == "phone"){
      await this.ShareOnSocialNetwork();
    }

    if (this.searchType == "email") {
      let member_email = (this.AutoComplete!.input) ? this.AutoComplete!.input : "";
      let group_id = this.GroupId;
      let ObjInvite = {
        group_id:group_id,
        member_email:member_email
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
      await this.SendReceiveRequestsService.InviteMember(ObjInvite).then(async (result) => {
          Loading.dismiss();//DISMISS LOADER
          this.InviteMemberResult = result;
          if (this.InviteMemberResult['result'] == 1) {
            await this.GetMembersListForGroup();
            this.ClearAutocomplete();
          }
          this.SendReceiveRequestsService.showMessageToast(this.InviteMemberResult['message']);
        },
        error => {
          Loading.dismiss();//DISMISS LOADER
          console.log(error);
        });
    }
	}

  async ShareOnSocialNetwork()
  {
    let ShareURL = "https://babysitter-app.com/#appStoreMain";
    let Message = this.translation.trans('group-members','ShareText');
    await this.utils.ShareOnSocialNetwork("none","Share","none",Message,"Babysitter-App","",ShareURL);
  }
}
