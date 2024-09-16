import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoadingController, Platform } from '@ionic/angular';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';
import { MultiFileUploadPassportComponent } from '../components/multi-file-upload-passport/multi-file-upload-passport.component';
import { MultiFileUploadIdentificationFrontComponent } from '../components/multi-file-upload-identification-front/multi-file-upload-identification-front.component';
import { MultiFileUploadIdentificationBackComponent } from '../components/multi-file-upload-identification-back/multi-file-upload-identification-back.component';
import {ProfileService} from "../services/profile.service";
import {TranslationService} from "../services/translation.service";

@Component({
  selector: 'app-identification',
  templateUrl: './identification.page.html',
  styleUrls: ['./identification.page.scss'],
})
export class IdentificationPage implements OnInit
{
	public IdentificationForm:any=[];
	public ResultResponseData : any = [];
	public ResultResponseDataDocuments : any = [];
	public validation_messages =
	{
		'document_type':
		[
			{ type: 'required', message: 'Document type is required.' }
		],
	};
	public DocumentUploadResponseData:any=[];
	public FileChooserResponse:any=[];
	public ImageURI:any=null;
	public DirectoryPath:any=null;
	public FileName:any=null;
	public IsUserIdentified:any=0;
  public address_needed:boolean=false;
	public DocumentType:any=null;
	public IdentificationStatus:any=0;

	@ViewChild(MultiFileUploadPassportComponent) 'FileFieldPassport': MultiFileUploadPassportComponent;
	@ViewChild(MultiFileUploadIdentificationFrontComponent) 'FileFieldFront': MultiFileUploadIdentificationFrontComponent;
	@ViewChild(MultiFileUploadIdentificationBackComponent) 'FileFieldBack': MultiFileUploadIdentificationBackComponent;
	constructor(private Platform: Platform,
              private SendReceiveRequestsService: SendReceiveRequestsService,
              private FB : FormBuilder,
              private LoadingCtrl : LoadingController,
              private profileService : ProfileService,
              public translation: TranslationService)
	{ }

	async ngOnInit()
	{
		this.IdentificationForm = this.FB.group({
			'document_type' : ['', [Validators.required]],
		});
	}

	async ionViewWillEnter()
	{
		this.GetIdentificationDocuments();
	}

	async GetIdentificationDocuments()
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
		await this.SendReceiveRequestsService.GetIdentificationDocuments().then(result =>
		{
			Loading.dismiss();//DISMISS LOADER
			this.ResultResponseData = result;
			this.IdentificationStatus = this.ResultResponseData['identify'];
			if(this.ResultResponseData['result']==1)
			{
				this.ResultResponseData=this.ResultResponseData['userDocuments'];
				this.IsUserIdentified=1;
        if (this.ResultResponseData.length > 0) {
          this.ResultResponseDataDocuments = this.ResultResponseData.map((doc: any) => doc['document']);
        }
			}
      else if(this.ResultResponseData['result']==0) {
        //process not started
        this.address_needed = this.ResultResponseData["address_needed"]
      }
			else
			{
        //process finished
			}
		},
		error =>
		{
			Loading.dismiss();//DISMISS LOADER
			console.log(error);
		});
	}

  	async UploadDocument(Form:any)
	{
		let DocumentType = (Form.document_type) ? Form.document_type : "";
		let language = this.SendReceiveRequestsService.GetUserLanguage();
    let UserInformationData : any = this.profileService.GetUserProfileData();
		let ClassObj = this;
		let FormDataPost = new FormData();
		FormDataPost.append('session_token',UserInformationData['session_token']);
		FormDataPost.append('type','2');
		FormDataPost.append('document_name',DocumentType);
		FormDataPost.append('language',language);
		let CountP=0;
		let CountDF=0;
		let CountDB=0;
		if(DocumentType=="Passport")
		{
			let FilesP = this.FileFieldPassport.getFiles();
			FilesP.forEach((FileP:any) =>
			{
				CountP++;
			});
		}
		if(DocumentType=="Identification Card")
		{
			let FilesDF = this.FileFieldFront.getFiles();
			FilesDF.forEach((FilesDF:any) =>
			{
				CountDF++;
			});
			let FilesDB = this.FileFieldBack.getFiles();
			FilesDB.forEach((FilesDB:any) =>
			{
				CountDB++;
			});
		}
		let DoesFormCanBeSubmitted=1;
		if((DocumentType=="Passport" && CountP == 0) || (DocumentType=="Passport" && CountP > 1))
		{
			this.FileFieldPassport.clearObject();
			CountP=0;
			this.SendReceiveRequestsService.showMessageToast(this.translation.trans('identification','Error_1'));
			DoesFormCanBeSubmitted = 0;
		}
		if(((DocumentType=="Identification Card" && CountP == 0) || (DocumentType=="Identification Card" && CountP > 1)) && ((DocumentType=="Identification Card" && CountDB == 0) || (DocumentType=="Identification Card" && CountDB > 1)))
		{
			this.FileFieldFront.clearObject();
			CountDF=0;
			this.FileFieldBack.clearObject();
			CountDB=0;
			this.SendReceiveRequestsService.showMessageToast(this.translation.trans('identification','Error_2'));
			DoesFormCanBeSubmitted = 0;
		}
		if(DoesFormCanBeSubmitted == 1)
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
			if(DocumentType=="Passport")
			{
				let FilesP = this.FileFieldPassport.getFiles();
				FilesP.forEach((FileP:any) =>
				{
					FormDataPost.append('user_file[]', FileP.rawFile, FileP.name);
				});
			}
			if(DocumentType=="Identification Card")
			{
				let FilesF = this.FileFieldFront.getFiles();
				FilesF.forEach((FileF:any) =>
				{
					FormDataPost.append('user_file[]', FileF.rawFile, FileF.name);
				});
				let FilesB = this.FileFieldBack.getFiles();
				FilesB.forEach((FileB:any) =>
				{
					FormDataPost.append('user_file[]', FileB.rawFile, FileB.name);
				});
			}
			var xhr = new XMLHttpRequest();
			var url = this.SendReceiveRequestsService.ApiUrl+"fileUpload";
			xhr.open("POST", url, true);
			xhr.onload = function()
			{
				if (xhr.status == 200)
				{
					Loading.dismiss();//DISMISS LOADER
					ClassObj.DocumentUploadResponseData = JSON.parse(xhr.responseText);
					ClassObj.SendReceiveRequestsService.showMessageToast(ClassObj.translation.trans('identification', 'SuccessUploads'));
					console.log(ClassObj.DocumentUploadResponseData);
					//RESET
					if(DocumentType=="Passport")
					{
						ClassObj.FileFieldPassport.clearObject();
						CountP=0;
					}
					if(DocumentType=="Identification Card")
					{
						ClassObj.FileFieldFront.clearObject();
						CountDF=0;
						ClassObj.FileFieldBack.clearObject();
						CountDB=0;
					}
					DoesFormCanBeSubmitted = 0;
					//RESET
					ClassObj.GetIdentificationDocuments();
				}
				else
				{
					Loading.dismiss();//DISMISS LOADER
					console.log("Error");
				}
			};
			xhr.send(FormDataPost);
		}
	}

	SelectedDocumentType(Ev:any)
	{
		this.DocumentType = Ev.detail.value;
		console.log(this.DocumentType);
	}

  GoToPage(PageToGo:any)
  {
    this.SendReceiveRequestsService.Router.navigate(['/'+PageToGo]);
  }
}
