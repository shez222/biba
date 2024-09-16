import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalController, MenuController } from '@ionic/angular';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';
import * as moment from 'moment';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import {NativeGeocoder} from '@awesome-cordova-plugins/native-geocoder/ngx';
import { MultiFileUploadComponent } from '../components/multi-file-upload/multi-file-upload.component';
import {phoneNumberValidator} from "../validators/phone-number.validator";
import {AddressSearchService, UserAddress} from "../services/address-search.service";
import {ProfileService} from "../services/profile.service";
import {LoadingDialogService} from "../services/loading-dialog.service";
import {TranslationService} from "../services/translation.service";

declare var google: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})

export class ProfilePage implements OnInit
{
  public jumpedToPageFromExternal : boolean = false;
	public UserInformationData:any=[];
  public UserData : any = [];
	public ResultData : any = [];
  languages: any = [];
	//ADDRESS AUTO COMPLETE
	public address:string = '';
	public AutoCompleteItems: any = [];
	public AutoComplete: { input: string; } | undefined;
	public GoogleAutocomplete: any;
  public isAddressFieldSelected: boolean = false;
  public isAddressSearchActive: boolean = false;
	public PlaceID: any;
	//ADDRESS AUTO COMPLETE
	public CurrentDateForPicker:any=null;
	public ProfileForm:any=[];
	public validation_messages =
	{
    'profileType':
      [
        { type: 'required', message: 'Profile type is required.' },
      ],
    'language':
      [
        { type: 'required', message: 'Language is required.' },
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
			{ type: 'required', message: 'Phone number is required.' },
			{ type: 'invalidPhoneNumber', message: 'Invalid phone number entered.' }
		],
    'aboutme' : [
      { type: 'required', message: 'About me is required.' }, //it's not ;)
    ]
	};
	@ViewChild(MultiFileUploadComponent) 'fileField': MultiFileUploadComponent;
	constructor(private SendReceiveRequestsService: SendReceiveRequestsService,
              private FB : FormBuilder,
              private Menu: MenuController,
              private Geolocation: Geolocation,
              private NativeGeocoder: NativeGeocoder,
              private zone: NgZone,
              private ModalController : ModalController,
              private route: ActivatedRoute,
              private addressSearchService : AddressSearchService,
              private profileService : ProfileService,
              private loadingDialog: LoadingDialogService,
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
    const incompleteParam = this.route.snapshot.paramMap.get('incomplete');
    this.jumpedToPageFromExternal = incompleteParam === 'true';
		this.CurrentDateForPicker=moment().subtract(10, 'years').format('YYYY-MM-DD');
		this.ProfileForm = this.FB.group({
      'profileType': ['', Validators.required],
      'language': [this.SendReceiveRequestsService.GetUserLanguage(), Validators.required],
			'firstname': ['', Validators.required],
			'lastname': ['', Validators.required],
			'date_of_birth': ['', Validators.required],
      'aboutme': ['',],
			'phone': ['', [Validators.required, phoneNumberValidator()]],
      'address': ['',],
      'street': ['',],
      'zipcode': ['',],
      'city': ['',],
      'country_code': ['',],
      'latitude': ['',],
      'longitude': ['',],
		});

		this.UserInformationData=this.profileService.GetUserProfileData();
    await this.loadingDialog.showLoadingDialog();

    try {
      const result : any = await this.SendReceiveRequestsService.GetProfile();
      if (result['result'] == 1) {
        this.UserData = result['user'];
        this.setFormValues(this.UserData);
      } else {
        await this.SendReceiveRequestsService.showMessageToast(result['message']);
      }

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
	}

	/*
	ADDRESS AUTO COMPLETE STARTS
	*/
	UpdateSearchResults()
	{
		if (this.AutoComplete!.input == '')
		{
			this.AutoCompleteItems = [];
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
    this.isAddressSearchActive = false
	}//ADDRESS AUTO COMPLETE, SIMPLY LOAD THE PLACE USING GOOGLE PREDICTIONS AND RETURNING THE ARRAY.

	async SelectSearchResult(item:any)
	{
    this.AutoCompleteItems = [];
    this.AutoComplete!.input=item.description;
    let address = await this.addressSearchService.SelectSearchResult(item);
    if (address !== null) {
      this.setUserAddressFormValues(address);
    }
	}

	setUserAddressFormValues(address: UserAddress)
	{
    this.address = address.address;
    this.ProfileForm.controls['address'].setValue(address.address);
    this.ProfileForm.controls['street'].setValue(address.street);
    this.ProfileForm.controls['zipcode'].setValue(address.zip);
    this.ProfileForm.controls['city'].setValue(address.city);
    this.ProfileForm.controls['country_code'].setValue(address.country_code);
    this.ProfileForm.controls['latitude'].setValue(address.latitude);
    this.ProfileForm.controls['longitude'].setValue(address.longitude);
	}

  setFormValues(UserData: any){
    this.ProfileForm.patchValue({
      profileType: UserData['profile_type'],
      firstname: UserData['first_name'],
      lastname: UserData['surname'],
      phone: UserData['phone'],
      date_of_birth: UserData['date_of_birth'] ? moment(UserData['date_of_birth']).format('DD.MM.YYYY'): "",
      aboutme: UserData['aboutme']
    });
    if(UserData['date_of_birth'] && UserData['date_of_birth']!='')
    {
      this.CurrentDateForPicker=moment(UserData['date_of_birth']).format('YYYY-MM-DD');
    }
    if (UserData.address) {
      this.setUserAddressFormValues(UserData);
      this.AutoComplete!.input = UserData['address'];
    }
  }

	ClearAutocomplete()
	{
		this.AutoCompleteItems = [];
		this.AutoComplete!.input = '';
    this.ProfileForm.controls['address'].setValue('');
		this.ProfileForm.controls['street'].setValue('');
		this.ProfileForm.controls['zipcode'].setValue('');
		this.ProfileForm.controls['city'].setValue('');
    this.ProfileForm.controls['country_code'].setValue('');
		this.ProfileForm.controls['latitude'].setValue('');
		this.ProfileForm.controls['longitude'].setValue('');
    this.isAddressSearchActive = false;
	}//ADDRESS AUTO COMPLETE::lET'S BE CLEAN! THIS WILL JUST CLEAN THE LIST WHEN WE CLOSE THE SEARCH BAR.
	/*
	ADDRESS AUTO COMPLETE ENDS
	*/

	async UpdateProfile(Form:any)
	{
    if(this.isAddressFieldSelected){
      // workaround because after hitting "Enter" in the search field the form is submitted
      return;
    }
		let firstname = (Form.firstname) ? Form.firstname : "";
		let lastname = (Form.lastname) ? Form.lastname : "";
		let phone = (Form.phone) ? Form.phone : "";
		let date_of_birth = (Form.date_of_birth) ? Form.date_of_birth : "";
    let date_of_birth_iso = moment(date_of_birth, 'DD.MM.YYYY').format('YYYY-MM-DD');
		let address = (Form.address) ? Form.address : "";
    let street = (Form.street) ? Form.street : "";
		let zipcode = (Form.zipcode) ? Form.zipcode : "";
		let city = (Form.city) ? Form.city : "";
    let country_code = (Form.country_code) ? Form.country_code : "";
		let latitude = (Form.latitude) ? Form.latitude : "";
		let longitude = (Form.longitude) ? Form.longitude : "";
		let aboutme = (Form.aboutme) ? Form.aboutme : "";

    await this.loadingDialog.showLoadingDialog();

		let ClassObj = this;
		let FormDataPost = new FormData();
		//FormDataPost.append('type','1');
		//FormDataPost.append('document_name','');
		FormDataPost.append('session_token',this.UserInformationData['session_token']);
    FormDataPost.append('profile_type',Form.profileType);
    FormDataPost.append('language',Form.language);
		FormDataPost.append('first_name',firstname);
		FormDataPost.append('surname',lastname);
		FormDataPost.append('address',address);
		FormDataPost.append('street',street);
		FormDataPost.append('zip',zipcode);
		FormDataPost.append('city',city);
    FormDataPost.append('country_code',country_code);
		FormDataPost.append('latitude',latitude);
		FormDataPost.append('longitude',longitude);
		FormDataPost.append('phone',phone);
		FormDataPost.append('date_of_birth',date_of_birth_iso);
		FormDataPost.append('aboutme',aboutme);
		//FormDataPost.append('document','');
		let files = this.fileField.getFiles();
		files.forEach((file:any) =>
		{
			FormDataPost.append('image', file.rawFile, file.name);
		});
		var xhr = new XMLHttpRequest();
		var url = this.SendReceiveRequestsService.ApiUrl+"updateProfile";
		xhr.open("POST", url, true);
		xhr.onload = function()
		{
      let responseData = JSON.parse(xhr.responseText);
			if (xhr.status == 200)
			{
        ClassObj.loadingDialog.dismissLoadingDialog();
				ClassObj.SendReceiveRequestsService.showMessageToast(responseData['message']);
				ClassObj.ResultData = responseData['user'];
        ClassObj.profileService.SaveUserInformation(ClassObj.ResultData, ClassObj.UserInformationData['session_token']);
        if (ClassObj.jumpedToPageFromExternal) {
          ClassObj.SendReceiveRequestsService.Router.navigate(['/open-requests-main']);
        } else {
          ClassObj.SendReceiveRequestsService.Router.navigate(['/settings']);
        }
				console.log(responseData);
			}
			else
			{
        ClassObj.SendReceiveRequestsService.showMessageToast(responseData['message']);
        ClassObj.loadingDialog.dismissLoadingDialog();
			}
		};
		xhr.send(FormDataPost);
	}

  changeLanguage()
  {
    this.profileService.SaveLanguageToProfile(this.ProfileForm.value.language);
    this.translation.init(this.ProfileForm.value.language);
  }

	DateSelected(ev:any)
	{
		let DateSelected = (ev.detail.value) ? ev.detail.value : "";
		let date = moment(DateSelected).format('DD.MM.YYYY');
		this.ProfileForm.controls['date_of_birth'].setValue(date);
	}
}
