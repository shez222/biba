import { Component, OnInit, NgZone } from '@angular/core';
import { AlertController, ModalController, LoadingController, NavParams } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { AlertToShowPage } from '../alert-to-show/alert-to-show.page';
import { AddKidsPage } from '../add-kids/add-kids.page';
import {AddressSearchService, UserAddress} from "../services/address-search.service";
import {TranslationService} from "../services/translation.service";
import {atLeastOneCheckboxCheckedValidator} from "../validators/checkbox-completion.validator";
import {GroupAddPage} from "../group-add/group-add.page";

declare var google: any;

@Component({
  selector: 'app-request-add',
  templateUrl: './request-add.page.html',
  styleUrls: ['./request-add.page.scss'],
})

export class RequestAddPage implements OnInit
{
  	public NewRequestForm:any=[];
  	public ResultResponseData : any = [];
	public validation_messages =
	{
		'title':
		[
			{ type: 'required', message: 'Title is required.' },
		],
		'max_amount':
		[
			{ type: 'required', message: 'Max amount you willing to pay is required.' },
		],
		'from_date':
		[
			{ type: 'required', message: 'From date is required.' }
		],
		'to_date':
		[
			{ type: 'required', message: 'To date is required.' }
		],
		'visibility':
		[
			{ type: 'required', message: 'Visibility is required.' }
		]
	};
	//ADDRESS AUTO COMPLETE
  public loadedAddress:string = '';
	public address:string = '';
	public AutoCompleteItems: any = [];
	public AutoComplete: { input: string; } | undefined;
	public GoogleAutocomplete: any;
  isSearchActive: boolean = false;
	//ADDRESS AUTO COMPLETE
	public CurrentDateForPicker:any=null;
	public DayAfterCurrentDateForPicker:any=null;
	public MinimumDateForPicker:any=null;
	public MaximumDateForPicker:any=null;

  hasGroups: boolean | null = null;
	public Groups:any=[];
	public ResultResponseDataGroup:any=[];
	public ResponseDataGroup:any=[];
	public ResponseDataGroupOnEdit:any=[];

	public CountSelectionToTrue:number = 0;
	public ResponseDataKids:any=[];
  hasKids: boolean | null = null;
  public ResultResponseDataProfile:any=[];
	public ResponseDataProfile:any=[];
	public ResponseDataRequest:any=[];
	public SelectedLocationValue:any = null;
	public IsSelectedLocationIsOtherAndAddressFilled:boolean=false;
	public RequestID : any = 0;
  public RequestAddressType : any = "home";
  public UserLanguage:string='en';

	constructor(private SendReceiveRequestsService: SendReceiveRequestsService,
              private LoadingCtrl : LoadingController,
              private FB : FormBuilder,
              private ModalController: ModalController,
              private AlertController: AlertController,
              private Geolocation: Geolocation,
              private NativeGeocoder: NativeGeocoder,
              private zone: NgZone,
              private NavParams: NavParams,
              private addressSearchService : AddressSearchService,
              public translation: TranslationService)
	{
    if (typeof google !== 'undefined') {
      this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    }
    	this.AutoComplete = { input: '' };
    	this.AutoCompleteItems = [];
	}

	async ngOnInit()
	{
		this.UserLanguage=this.SendReceiveRequestsService.GetUserLanguage();

		this.RequestID = (this.NavParams.get('RequestID')) ? this.NavParams.get('RequestID') : 0;

		let currentDate = moment().format('YYYY-MM-DDTHH:mm');
		this.CurrentDateForPicker = currentDate;
		this.MinimumDateForPicker = currentDate;
		let CurrentYearFirstDay = moment().endOf('year').format('YYYY-MM-DDTHH:mm');
		this.MaximumDateForPicker = moment(CurrentYearFirstDay).add(3, 'years').format('YYYY-MM-DDTHH:mm');
		this.DayAfterCurrentDateForPicker = moment().add(1, 'hour').format('YYYY-MM-DDTHH:mm');

		this.NewRequestForm = this.FB.group({
			'title': ['', Validators.required],
			'description': [''],
			'max_amount': [''],
			'from_date': ['', Validators.required],
			'to_date': ['', Validators.required],
      'public_visibility': [false],
      'group_visibility': [true],
			'location': ['', Validators.required],
      'address': ['', Validators.required],
			'street': ['', ],
			'zipcode': ['', ],
			'city': ['', Validators.required],
      'country_code': ['', ],
			'latitude': ['', Validators.required],
			'longitude': ['', Validators.required],
		},{
      validators: atLeastOneCheckboxCheckedValidator('public_visibility', 'group_visibility')
    });

		//LOADER
		const Loading = await this.LoadingCtrl.create({
			spinner: 'circles',
			message: 'Please Wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await Loading.present();
		//LOADER

    await this.loadKids(true);

		//PROFILE
		await this.SendReceiveRequestsService.GetProfile().then(result =>
		{
			//LoadingP.dismiss();//DISMISS LOADER
			this.ResultResponseDataProfile = result;
			if(this.ResultResponseDataProfile['result']==1)
			{
				this.ResponseDataProfile=this.ResultResponseDataProfile['user'];

			}
			else
			{
				this.SendReceiveRequestsService.showMessageToast(this.ResultResponseDataProfile['message']);
			}
			console.log(this.ResponseDataProfile);
		},
		error =>
		{
			//LoadingP.dismiss();//DISMISS LOADER
			Loading.dismiss();//DISMISS LOADER
			console.log(error);
		});

    await this.loadGroups(true);

		//REQUEST DETAIL
		if(this.RequestID > 0)
		{
			this.ResponseDataGroupOnEdit = [];
			let ObjectRequest =
			{
				request_id:this.RequestID
			}
			await this.SendReceiveRequestsService.GetRequestByID(ObjectRequest).then(result =>
			{
				Loading.dismiss();//DISMISS LOADER
				let ResultResponseDataRequest : any = result;
				if(ResultResponseDataRequest['result']==1)
				{
          this.FillUPTheRequestForm(result);
				}
				else
				{
					this.SendReceiveRequestsService.showMessageToast(ResultResponseDataRequest['message']);
				}
				console.log(this.ResponseDataRequest);
			},
			error =>
			{
				//LoadingR.dismiss();//DISMISS LOADER
				Loading.dismiss();//DISMISS LOADER
				console.log(error);
			});

		}
		else
		{
			this.NewRequestForm.controls['location'].setValue('home');
      this.loadedAddress = this.ResponseDataProfile['address'];
      this.setUserAddressFormValues(this.ResponseDataProfile)
			this.AutoComplete!.input = this.ResponseDataProfile['address'];
			Loading.dismiss();//DISMISS LOADER
		}
	}

	async FillUPTheRequestForm(result: any)
	{
		//LOADER
		const LoadingF = await this.LoadingCtrl.create({
			spinner: 'circles',
			message: 'Please Wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await LoadingF.present();
		//LOADER
    let requestResult = result['myRequests'];
		this.CurrentDateForPicker = moment(requestResult['from_date']).format('YYYY-MM-DDTHH:mm');
		this.DayAfterCurrentDateForPicker = moment(requestResult['to_date']).format('YYYY-MM-DDTHH:mm');

		this.NewRequestForm.controls['title'].setValue(requestResult['title']);
		this.NewRequestForm.controls['description'].setValue(requestResult['description']);
		this.NewRequestForm.controls['max_amount'].setValue(requestResult['max_amount']);
    let from_date = moment(requestResult['from_date']).locale(this.UserLanguage).format('dd DD.MM.YYYY HH:mm');
		this.NewRequestForm.controls['from_date'].setValue(from_date);
    let to_date = moment(requestResult['to_date']).locale(this.UserLanguage).format('dd DD.MM.YYYY HH:mm');
		this.NewRequestForm.controls['to_date'].setValue(to_date);
    let group_visibility = requestResult['group_visibility'];
    this.NewRequestForm.controls['group_visibility'].setValue(group_visibility);
    let public_visibility = requestResult['public_visibility'];
    this.NewRequestForm.controls['public_visibility'].setValue(public_visibility);

		this.IsSelectedLocationIsOtherAndAddressFilled=false;
		this.AutoCompleteItems = [];
    this.setUserAddressFormValues(requestResult);
		this.AutoComplete!.input = requestResult['address'];
    this.loadedAddress = requestResult['address'];
		this.RequestAddressType = requestResult['address_type'];
		if(requestResult['address_type']=='home')
		{
			this.NewRequestForm.controls['location'].setValue('home');
		}
		if(requestResult['address_type']=='other')
		{
			this.NewRequestForm.controls['location'].setValue('other');
		}

    this.ResponseDataGroupOnEdit = requestResult['groups']
		if(public_visibility)
		{
			this.CountSelectionToTrue = 0;
			for(let g = 0; g < this.ResponseDataGroup.length; g ++)
			{
				this.ResponseDataGroup[g]['checked'] = false;
			}
		}
		if(group_visibility)
		{
			if(this.ResponseDataGroup.length > 0)
			{
				for(let g_1 = 0; g_1 < this.ResponseDataGroupOnEdit.length; g_1++)
				{
					for(let g = 0; g < this.ResponseDataGroup.length; g ++)
					{
						if(this.ResponseDataGroupOnEdit[g_1]['id'] == this.ResponseDataGroup[g]['id'])
						{
							this.ResponseDataGroup[g]['checked'] = true;
							this.CountSelectionToTrue++;
						}
					}
				}
			}
		}

    const selectedKidIds = requestResult['kids'].map((kid: any) => kid['id']);
    if (this.ResponseDataKids.length > 0) {
      for (const kid of this.ResponseDataKids) {
        if (selectedKidIds.includes(kid['id'])) {
          kid['selected'] = true;
        }
      }
    }

		LoadingF.dismiss();//DISMISS LOADER
	}

	async AddRequest(Form:any)
	{
		let title = (Form.title) ? Form.title : "";
		let description = (Form.description) ? Form.description : "";
		let max_amount = (Form.max_amount) ? Form.max_amount : "";
    let from_date = moment(Form.from_date, 'dd DD.MM.YYYY HH:mm', this.UserLanguage).format('YYYY-MM-DD HH:mm')
    let to_date = moment(Form.to_date, 'dd DD.MM.YYYY HH:mm', this.UserLanguage).format('YYYY-MM-DD HH:mm')
		let group_visibility = (Form.group_visibility) ? Form.group_visibility : false;
    let public_visibility = (Form.public_visibility) ? Form.public_visibility : false;
		let location = (Form.location) ? Form.location : "";
		let address = (Form.address) ? Form.address : "";
		let street = (Form.street) ? Form.street : "";
		let zipcode = (Form.zipcode) ? Form.zipcode : "";
		let city = (Form.city) ? Form.city : "";
    let country_code = (Form.country_code) ? Form.country_code : "";
		let latitude = (Form.latitude) ? Form.latitude : "";
		let longitude = (Form.longitude) ? Form.longitude : "";

		let SelectedGroupsToPostArray = [];
		let SelectedGroupsToPost = "";
    if (group_visibility) {
      for (let g = 0; g < this.ResponseDataGroup.length; g++) {
        if (this.ResponseDataGroup[g]['checked'] == true) {
          SelectedGroupsToPostArray.push(this.ResponseDataGroup[g]['id']);
        }
        SelectedGroupsToPost = SelectedGroupsToPostArray.join(",");
      }
    }
		let to_group = SelectedGroupsToPost;

    const selectedKidIds = this.ResponseDataKids.filter((kid: any) => kid['selected']).map((kid: any) => kid['id']);
		let kids = selectedKidIds.join(",");

		//LOADER
		const Loading = await this.LoadingCtrl.create({
			spinner: 'circles',
			message: 'Please Wait...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await Loading.present();
		//LOADER

    let ObjAddRequest =
      {
        request_id:this.RequestID,
        title:title,
        description:description,
        max_amount:(max_amount) ? max_amount : 0,
        from_date:from_date,
        to_date:to_date,
        group_visibility:group_visibility,
        public_visibility:public_visibility,
        location:location,
        address:address,
        street:street,
        zipcode:zipcode,
        city:city,
        country_code:country_code,
        latitude:latitude,
        longitude:longitude,
        to_group:(SelectedGroupsToPostArray.length > 0) ? to_group : null,
        kids_id:(selectedKidIds.length > 0) ? kids : null
      }
		if(this.RequestID > 0)
		{
			await this.SendReceiveRequestsService.EditRequest(ObjAddRequest).then(result =>
			{
				Loading.dismiss();//DISMISS LOADER
				this.ResultResponseData = result;
				this.ModalController.dismiss({
					'dismissed': true
				});
				if(this.ResultResponseData['result']==1)
				{
					this.SendReceiveRequestsService.showMessageToast(this.ResultResponseData['message']);
					this.SendReceiveRequestsService.Router.navigate(['/my-requests']);
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
		else
		{
			await this.SendReceiveRequestsService.AddRequest(ObjAddRequest).then(result =>
			{
				Loading.dismiss();//DISMISS LOADER
				this.ResultResponseData = result;
				this.ModalController.dismiss({
					'dismissed': true
				});
				if(this.ResultResponseData['result']==1)
				{
					this.SendReceiveRequestsService.showMessageToast(this.ResultResponseData['message']);
					this.SendReceiveRequestsService.Router.navigate(['/my-requests']);
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
				console.log("Error: " + error);
			});
		}
	}

  async loadKids(initialLoad: boolean){
    await this.SendReceiveRequestsService.Kids().then(result =>
      {
        let ResultResponseDataKids : any = result;
        if(ResultResponseDataKids['result']==1)
        {
          let ResponseDataKids=ResultResponseDataKids['kids'];
          if (initialLoad) {
            this.hasKids = ResponseDataKids.length > 0;
          }
          const selectedKidIds = this.ResponseDataKids.filter((kid: any) => kid['selected']).map((kid: any) => kid['id']);
          ResponseDataKids.forEach((kid : any) => {
            kid['selected'] = selectedKidIds.includes(kid['id']);
          });
          this.ResponseDataKids = ResponseDataKids;
        }
        else
        {
          this.SendReceiveRequestsService.showMessageToast(ResultResponseDataKids['message']);
        }
        console.log(this.ResponseDataKids);
      },
      error =>
      {
        console.log(error);
      });
  }

  async loadGroups(initialLoad: boolean){
    await this.SendReceiveRequestsService.Groups().then(result =>
      {
        //LoadingG.dismiss();//DISMISS LOADER
        let ResultResponseDataGroup: any = result;
        if(ResultResponseDataGroup['result']==1)
        {
          let ResponseDataGroup : any = ResultResponseDataGroup['myGroups'];
          if (initialLoad) {
            this.hasGroups = ResponseDataGroup.length > 0;
          }
          const selectedGroupIds = this.ResponseDataGroup.filter((group: any) => group['selected']).map((group: any) => group['id']);
          ResponseDataGroup.forEach((group : any) => {
            group['selected'] = selectedGroupIds.includes(group['id']);
          });
          this.ResponseDataGroup = ResponseDataGroup;
        }
        else
        {
          this.SendReceiveRequestsService.showMessageToast(this.ResultResponseDataGroup['message']);
        }
      },
      error =>
      {
        console.log(error);
      });
  }

  handleKidClick(kidId : number)
  {
    for (const kid of this.ResponseDataKids) {
      if (kid['id'] === kidId) {
        kid['selected'] = !kid['selected'];
      }
    }
  }

	DateSelectedFrom(ev:any)
	{
		let DateSelected = (ev.detail.value) ? ev.detail.value : "";
		let date = moment(DateSelected).locale(this.UserLanguage).format('dd DD.MM.YYYY HH:mm');
		this.NewRequestForm.controls['from_date'].setValue(date);
	}

	DateSelectedTo(ev:any)
	{
		let DateSelected = (ev.detail.value) ? ev.detail.value : "";
		let date = moment(DateSelected).locale(this.UserLanguage).format('dd DD.MM.YYYY HH:mm');
		this.NewRequestForm.controls['to_date'].setValue(date);
	}

	SelectedLocation(Ev:any)
	{
		this.SelectedLocationValue = Ev.detail.value;
		this.IsSelectedLocationIsOtherAndAddressFilled=false;

		this.AutoCompleteItems = [];
		this.AutoComplete!.input = '';

		this.RequestAddressType = this.SelectedLocationValue;
		if(this.SelectedLocationValue == 'home')
		{
			this.NewRequestForm.controls['location'].setValue('home');

      this.setUserAddressFormValues(this.ResponseDataProfile);
			this.AutoComplete!.input = this.ResponseDataProfile['address'];
		}
		if(this.SelectedLocationValue == 'other')
		{
			this.IsSelectedLocationIsOtherAndAddressFilled=true;
      this.address = '';
		}
	}

	SelectedGroups(Index:any,Ev:any)
	{
		let SelectedGroup = Ev.detail;
		if(SelectedGroup.checked == true)
		{
			this.ResponseDataGroup[Index]['checked'] = true;
			this.CountSelectionToTrue++;
		}
		if(SelectedGroup.checked == false)
		{
			this.ResponseDataGroup[Index]['checked'] = false;
			this.CountSelectionToTrue--;
		}
	}

	/*
	ADDRESS AUTO COMPLETE STARTS
	*/
	UpdateSearchResults()
	{
		if (this.AutoComplete!.input == '')
		{
			this.AutoCompleteItems = [];
      this.isSearchActive = false;
			return;
		}

		//types: ["establishment"]::THIS COULD BE "address","establishment","geocode" ANY OF ONE. LEAVE IT [] FOR ALL OPTION
		this.GoogleAutocomplete.getPlacePredictions({ input: this.AutoComplete!.input, componentRestrictions: {country: ''}, fields: ["formatted_address", "geometry"],types: ["address"]},(predictions:any, status:any) =>
		{
			this.AutoCompleteItems = [];
			if(predictions)
			{
				this.zone.run(() =>
				{
					predictions.forEach((prediction:any) =>
					{
						this.AutoCompleteItems.push(prediction);
					});
				});
			}
		});
    this.isSearchActive = false;
	}//ADDRESS AUTO COMPLETE, SIMPLY LOAD THE PLACE USING GOOGLE PREDICTIONS AND RETURNING THE ARRAY.

	async SelectSearchResult(item:any)
	{
    this.AutoCompleteItems = [];
    this.AutoComplete!.input=item.description;
    let address = await this.addressSearchService.SelectSearchResult(item);
    if (address !== null) {
      this.IsSelectedLocationIsOtherAndAddressFilled=false;
      this.setUserAddressFormValues(address);
    }
	}//ADDRESS AUTO COMPLETE WE CALL THIS FROM EACH ITEM.

  setUserAddressFormValues(address: UserAddress)
  {
    this.address = address.address;
    this.NewRequestForm.controls['address'].setValue(address.address);
    this.NewRequestForm.controls['street'].setValue(address.street);
    this.NewRequestForm.controls['zipcode'].setValue(address.zip);
    this.NewRequestForm.controls['city'].setValue(address.city);
    this.NewRequestForm.controls['country_code'].setValue(address.country_code);
    this.NewRequestForm.controls['latitude'].setValue(address.latitude);
    this.NewRequestForm.controls['longitude'].setValue(address.longitude);
  }

	ClearAutocomplete()
	{
		this.IsSelectedLocationIsOtherAndAddressFilled=true;
		this.AutoCompleteItems = [];
		this.AutoComplete!.input = '';
    this.NewRequestForm.controls['address'].setValue('');
		this.NewRequestForm.controls['street'].setValue('');
		this.NewRequestForm.controls['zipcode'].setValue('');
		this.NewRequestForm.controls['city'].setValue('');
    this.NewRequestForm.controls['country_code'].setValue('');
		this.NewRequestForm.controls['latitude'].setValue('');
		this.NewRequestForm.controls['longitude'].setValue('');
    this.isSearchActive = false;
	}//ADDRESS AUTO COMPLETE::lET'S BE CLEAN! THIS WILL JUST CLEAN THE LIST WHEN WE CLOSE THE SEARCH BAR.
	/*
	ADDRESS AUTO COMPLETE ENDS
	*/

	async ShowInfo()
	{
		/*
		VERIFICATION ALERT
		*/
		const modal = await this.ModalController.create({
			component: AlertToShowPage,
			showBackdrop: false,
			componentProps:
			{
				AlertType: "VisibilityInformation"
			}
		});
		return await modal.present();
		/*
		VERIFICATION ALERT
		*/
	}

	async AddKid(KidID:any,KidNM:any,KidDoB:any)
	{
		const modal = await this.ModalController.create({
			component: AddKidsPage,
			showBackdrop: false,
			componentProps:
			{
				KidID: KidID,
				KidNM: KidNM,
				KidDoB: KidDoB
			}
		});
		modal.onDidDismiss().then(() =>
		{
			this.loadKids(false);
		});
		return await modal.present();
	}

  async AddGroup()
  {
    const modal = await this.ModalController.create({
      component: GroupAddPage,
      showBackdrop: false,
    });
    modal.onDidDismiss().then(() =>
    {
      this.loadGroups(false);
    });
    return await modal.present();
  }

	DismissModal()
	{
		this.ModalController.dismiss({
			'dismissed': true
		});
	}
}
