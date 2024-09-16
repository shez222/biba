import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';
import {TranslationService} from "../services/translation.service";
import {GroupMembersPage} from "../group-members/group-members.page";

@Component({
  selector: 'app-group-add',
  templateUrl: './group-add.page.html',
  styleUrls: ['./group-add.page.scss'],
})

export class GroupAddPage implements OnInit
{
	public ResultResponseData:any=[];
  public NewGroupForm:any=[];
	public validation_messages =
	{
		'group_name':
		[
			{ type: 'required', message: 'Group name is required.' },
		]
	};

  constructor(private SendReceiveRequestsService: SendReceiveRequestsService,
              private FB : FormBuilder,
              private ModalController: ModalController,
              private LoadingCtrl : LoadingController,
              public translation: TranslationService)
  { }

  ngOnInit()
  {
    this.NewGroupForm = this.FB.group({
			'group_name': ['', Validators.required],
		});
  }

  async AddGroup(Form:any)
  {
		let group_name = (Form.group_name) ? Form.group_name : "";
		let ObjectGroup =
		{
			group_name:group_name
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
		await this.SendReceiveRequestsService.AddGroup(ObjectGroup).then(async (result) =>
    {
    	Loading.dismiss();//DISMISS LOADER
      this.ResultResponseData = result;
      if(this.ResultResponseData['result']==1)
      {
      	this.SendReceiveRequestsService.showMessageToast(this.ResultResponseData['message']);
        let group : any = this.ResultResponseData['group'];
        const modal = await this.ModalController.create({
          component: GroupMembersPage,
          showBackdrop: false,
          componentProps:
            {
              GroupId : group.id,
              GroupName : group.name
            },
        });
        modal.onDidDismiss().then(() =>
        {
          this.DismissModal();
        });
        return await modal.present();
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

  DismissModal()
	{
		this.ModalController.dismiss({
			'dismissed': true
		});
	}
}
