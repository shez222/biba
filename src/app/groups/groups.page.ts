import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, LoadingController } from '@ionic/angular';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';
import { GroupAddPage } from '../group-add/group-add.page';
import { GroupMembersPage} from '../group-members/group-members.page';
import {TranslationService} from "../services/translation.service";

type GroupElement = {
  id: number;
  inviteeName: string;
}

@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
})
export class GroupsPage implements OnInit
{
	public ResultResponseDeleting:any=[];
	public ResultResponseData:any=[];
	public ResponseData:any=[];

	public MemberInvitationResultResponseData:any=[];
	public MemberOfGroups:GroupElement[]=[];
	public InvitationOfGroups:GroupElement[]=[];

	constructor(private SendReceiveRequestsService: SendReceiveRequestsService,
              private ModalController: ModalController,
              private AlertController: AlertController,
              private LoadingCtrl : LoadingController,
              public translation: TranslationService)
	{}

	ngOnInit()
	{
	}

	async ionViewWillEnter()
	{
		this.GroupInformation();
	}

	async GroupInformation()
	{
		//LOADER
		const Loading = await this.LoadingCtrl.create({
			spinner: 'circles',
			message: 'Please Wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await Loading.present();
		//LOADER
		await this.SendReceiveRequestsService.Groups().then(result =>
		{
			//Loading.dismiss();//DISMISS LOADER
			this.ResultResponseData = result;
			if(this.ResultResponseData['result']==1)
			{
				this.ResponseData=this.ResultResponseData['myGroups'];
			}
			else
			{
				this.SendReceiveRequestsService.showMessageToast(this.ResultResponseData['message']);
			}
			console.log("Groups",this.ResponseData);
		},
		error =>
		{
			Loading.dismiss();//DISMISS LOADER
			console.log(error);
		});//GROUPS

		await this.SendReceiveRequestsService.memberInGroup().then(result =>
		{
			Loading.dismiss();//DISMISS LOADER
			this.MemberInvitationResultResponseData = result;
			if(this.MemberInvitationResultResponseData['result']==1)
			{
				this.MemberOfGroups=this.MemberInvitationResultResponseData['inGroups'];
				this.InvitationOfGroups=this.MemberInvitationResultResponseData['requestedGroups'];
			}
			else
			{
				this.SendReceiveRequestsService.showMessageToast(this.MemberInvitationResultResponseData['message']);
			}
			console.log("MemberOfGroups",this.MemberOfGroups);
			console.log("InvitationOfGroups",this.InvitationOfGroups);
		},
		error =>
		{
			Loading.dismiss();//DISMISS LOADER
			console.log(error);
		});//MEMBER IN GROUPS/INVITATION OF GROUPS
	}

	async AddGroup()
	{
		const modal = await this.ModalController.create({
			component: GroupAddPage,
			showBackdrop: false,
		});
		modal.onDidDismiss().then(() =>
		{
			this.GroupInformation();
		});
		return await modal.present();
	}

	async AddGroupMember(ForGroup:any,GroupID:any)
	{
		const modal = await this.ModalController.create({
		component: GroupMembersPage,
		showBackdrop: false,
		componentProps:
			{
				GroupId : GroupID,
				GroupName : ForGroup
			},
		});
		modal.onDidDismiss().then(() =>
		{
			this.GroupInformation();
		});
		return await modal.present();
	}

  	async ConfirmedDeletingGroup(GroupID:any,UserID:any)
	{
		const alert = await this.AlertController.create({
		cssClass: 'my-custom-alert',
		header: this.translation.trans('common-requests-block','Decline_1'),
		subHeader: this.translation.trans('groups','DeleteMessage'),
		//message: 'Are you sure to remove group ?',
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
					this.DeletingGroup(GroupID,UserID);
					console.log('Confirm Okay');
				}
			}
		]
		});
		await alert.present();
	}

	async DeletingGroup(GroupID:any,UserID:any)
	{
		let ObjectGroup =
		{
			group_id:GroupID
		}
		await this.SendReceiveRequestsService.DeleteGroup(ObjectGroup).then(result =>
		{
			this.ResultResponseDeleting = result;
			if(this.ResultResponseDeleting['result']==1)
			{
				this.SendReceiveRequestsService.showMessageToast(this.ResultResponseDeleting['message']);
				this.GroupInformation();
			}
		},
		error =>
		{
			console.log(error);
		});
	}

	async ConfirmLeavingTheGroup(GroupID:any)
	{
		const alert = await this.AlertController.create({
		cssClass: 'my-custom-alert',
		header: this.translation.trans('common-requests-block','Decline_1'),
		subHeader: this.translation.trans('groups','LeavingGroupMessage'),
		//message: 'Are you sure to remove group ?',
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
					this.LeavingTheGroup(GroupID);
					console.log('Confirm Okay');
				}
			}
		]
		});
		await alert.present();
	}

	async LeavingTheGroup(GroupID:any)
	{
		let ObjLeaving =
		{
			group_id:GroupID,
			type:0
		}
		await this.SendReceiveRequestsService.AcceptingOrLeavingTheGroup(ObjLeaving).then(result =>
		{
			this.ResultResponseDeleting = result;
			if(this.ResultResponseDeleting['result']==1)
			{
				this.SendReceiveRequestsService.showMessageToast(this.ResultResponseDeleting['message']);
				this.GroupInformation();
			}
		},
		error =>
		{
			console.log(error);
		});
	}

	async ConfirmAcceptToBeAPartOfGroup(GroupID:any)
	{
		const alert = await this.AlertController.create({
			cssClass: 'my-custom-alert',
			header: this.translation.trans('common-requests-block','Decline_1'),
			subHeader: this.translation.trans('groups','AcceptingGroupRequestMessage'),
			//message: 'Are you sure to remove group ?',
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
						this.AcceptToBeAPartOfGroup(GroupID);
						console.log('Confirm Okay');
					}
				}
			]
			});
			await alert.present();
	}

	async AcceptToBeAPartOfGroup(GroupID:any)
	{
		let ObjLeaving =
		{
			group_id:GroupID,
			type:1
		}
		await this.SendReceiveRequestsService.AcceptingOrLeavingTheGroup(ObjLeaving).then(result =>
		{
			this.ResultResponseDeleting = result;
			if(this.ResultResponseDeleting['result']==1)
			{
				this.SendReceiveRequestsService.showMessageToast(this.ResultResponseDeleting['message']);
				this.GroupInformation();
			}
		},
		error =>
		{
			console.log(error);
		});
	}

	async ConfirmDeclineToBeAPartOfGroup(GroupID:any)
	{
		const alert = await this.AlertController.create({
			cssClass: 'my-custom-alert',
			header: this.translation.trans('common-requests-block','Decline_1'),
			subHeader: this.translation.trans('groups','DeclingGroupRequestMessage'),
			//message: 'Are you sure to remove group ?',
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
						this.DeclineToBeAPartOfGroup(GroupID);
						console.log('Confirm Okay');
					}
				}
			]
			});
			await alert.present();
	}

	async DeclineToBeAPartOfGroup(GroupID:any)
	{
		let ObjLeaving =
		{
			group_id:GroupID,
			type:0
		}
		await this.SendReceiveRequestsService.AcceptingOrLeavingTheGroup(ObjLeaving).then(result =>
		{
			this.ResultResponseDeleting = result;
			if(this.ResultResponseDeleting['result']==1)
			{
				this.SendReceiveRequestsService.showMessageToast(this.ResultResponseDeleting['message']);
				this.GroupInformation();
			}
		},
		error =>
		{
			console.log(error);
		});
	}

	ShowUpdatedContent(ev:any)
	{
		setTimeout(() =>
	    {
			this.GroupInformation();
	      	ev.target.complete();
	    }, 2000);
	}
}
