import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Platform, ModalController, AlertController, LoadingController, IonAccordionGroup } from '@ionic/angular';
import { RequestToApplyPage } from '../request-to-apply/request-to-apply.page';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';
import { ShowAppliesPage } from '../show-applies/show-applies.page';
import * as moment from 'moment';
import { FormBuilder, Validators } from '@angular/forms';
import {TranslationService} from "../services/translation.service";
import {UtilService} from "../services/util.service";

declare var google: any;

@Component({
  selector: 'app-open-requests-nearby',
  templateUrl: './open-requests-nearby.page.html',
  styleUrls: ['./open-requests-nearby.page.scss'],
})

export class OpenRequestsNearbyPage implements OnInit
{
  @ViewChild('AccordionGroup', { static: true }) AccordionGroup? : IonAccordionGroup;
  @ViewChild('MAP', { static: false }) mapElement?: ElementRef;
  public SignInForm:any=[];
  public MapNearBy:any = google.map;
  public LocationCordinates: any = [];
  public CurrentLatitude:any = null;
  public CurrentLongitude:any = null;
  public ResponseDataUser:any=[];
  public ResultResponseData:any=[];
	public ResponseData:any=[];
  public LocationsMarkersLive:any=[];
  public ResultResponseAnyAction:any=[];
  public LocationSubscription:any=null;
  public Distance:any=null;
  public PriceRange:any=null;
  public KidsType:any=null;

  constructor(private FB : FormBuilder,
              private Platform: Platform,
              private AndroidPermissions: AndroidPermissions,
              private LocationAccuracy: LocationAccuracy,
              private Geolocation: Geolocation,
              private NativeGeocoder: NativeGeocoder,
              private SendReceiveRequestsService: SendReceiveRequestsService,
              private ModalController: ModalController,
              private AlertController: AlertController,
              private LoadingCtrl : LoadingController,
              private utils: UtilService,
              public translation: TranslationService)
  { }

  async ngOnInit()
  {
    this.SignInForm = this.FB.group({
			'range_in_km' : [''],
			'min_price': [''],
      'kids_creteria': [''],
		});
  }

  async ionViewWillEnter()
  {
    this.LocationCordinates =
    {
      latitude: "",
      longitude: "",
      accuracy: "",
      timestamp: ""
    };
    //await this.CurrentLocPosition();//COMMENT THIS LINE WHEN LIVE
    await this.Platform.ready().then(async () =>
    {
      if(this.Platform.is("android") == true)
      {
        await this.CheckPermission();
      }
      else
      {
        await this.CurrentLocPosition();
      }
    });
		this.ResponseDataUser = [];
		await this.SendReceiveRequestsService.GetProfile().then(async (result) =>
		{
      this.ResponseDataUser = result;
    },
		error =>
		{
			console.log(error);
		});
  }

  async ShowNearByRequests()
  {
    var stylers = [
      {
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#FFFFFF"
          }
        ]
      },
      {
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#616161"
          }
        ]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#e6e6e6"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#bdbdbd"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#eeeeee"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e5e5e5"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#EBEBEB"//BEFORE::#FFFFFF
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dadada"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#616161"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      },
      {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e5e5e5"
          }
        ]
      },
      {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#eeeeee"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#c9c9c9"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      }
    ];
    this.MapNearBy = new google.maps.Map(document.getElementById('MAP'), {
      zoom: 13,
      center: new google.maps.LatLng(this.LocationCordinates.latitude, this.LocationCordinates.longitude),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      draggable: true,//THIS WILL NOW ALLOW MAP TO DRAG
      mapTypeControl: false,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_CENTER,
      },
      zoomControl: false,//THIS WILL REMOVE THE ZOOM OPTION +/-
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM,
      },
      scaleControl: false,
      streetViewControl: false,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_TOP,
      },
      fullscreenControl: false,
      styles: stylers
    });
    this.AddDynamicMarkers();
  }

  async AddDynamicMarkers()
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
		this.ResultResponseData = [];
		this.ResponseData = [];
    let ObjectRequest =
		{
      distance:(this.Distance!=null) ? this.Distance : 0,
      price_range:(this.PriceRange!=null) ? this.PriceRange : 0,
      kids_type:(this.KidsType!=null) ? this.KidsType : 0,
      latitude:this.LocationCordinates.latitude,
      longitude:this.LocationCordinates.longitude
		}
		await this.SendReceiveRequestsService.ShowNearByRequests(ObjectRequest).then(result =>
		{
			Loading.dismiss();//DISMISS LOADER
			this.ResultResponseData = result;
			if(this.ResultResponseData['result']==1)
			{
				this.ResponseData=this.ResultResponseData['myRequests'];
				if(this.ResponseData.length > 0)
				{
					for(let i = 0; i < this.ResponseData.length; i++)
					{
						let FormatedFromDate_1 = moment(this.ResponseData[i]['from_date']).format('DD MMM YYYY HH:mm');
						let FormatedToDate_1 = moment(this.ResponseData[i]['to_date']).format('DD MMM YYYY HH:mm');
						let FormatedFromDate_2 = moment(this.ResponseData[i]['from_date'],'YYYY-MM-DD HH:mm:ss');
						let FormatedToDate_2 = moment(this.ResponseData[i]['to_date'],'YYYY-MM-DD HH:mm:ss');

						let FromDateISO = moment(this.ResponseData[i]['from_date']).toISOString();
						let ToDateISO = moment(this.ResponseData[i]['to_date']).toISOString();
						let GetDateDifference = this.utils.DateDifference(FromDateISO,ToDateISO,FormatedFromDate_2,FormatedToDate_2);

						this.ResponseData[i]['formatted_from_date']=FormatedFromDate_1;
						this.ResponseData[i]['formatted_to_date']=FormatedToDate_1;
						this.ResponseData[i]['day_difference']=GetDateDifference;

						if(this.ResponseDataUser.hasOwnProperty('latitude') && this.ResponseDataUser.hasOwnProperty('longitude') && this.ResponseData[i].hasOwnProperty('latitude') && this.ResponseData[i].hasOwnProperty('longitude'))
						{
							if(this.ResponseData[i]['latitude']!=null && this.ResponseData[i]['longitude']!=null)
							{
								let DistanceInKM=this.utils.CalculateDistanceBetweenLatLon(this.ResponseDataUser['latitude'],this.ResponseDataUser['longitude'],this.ResponseData[i]['latitude'],this.ResponseData[i]['longitude']);
								this.ResponseData[i]['distance_in_km']=DistanceInKM;
							}
							else
							{
								this.ResponseData[i]['distance_in_km']=0;
							}
						}
						else
						{
							this.ResponseData[i]['distance_in_km']=0;
						}
					}
          /*
          SELF CENTER STARTS
          */
          if(this.ResponseData.length > 0)
          {
            var marker, i;
            let ClassObj = this;
            if(this.LocationsMarkersLive.length > 0)
            {
              for (let m = 0; m < this.LocationsMarkersLive.length; m++)
              {
                this.LocationsMarkersLive[m].setMap(null);
              }
              this.LocationsMarkersLive=[];
            }
            for (i = 0; i < this.ResponseData.length; i++)
            {
              let image =
              {
                url: "https://babysitter-app.com/public/assets/website/images/pin_1.png", // image is 512 x 512
                scaledSize: new google.maps.Size(50, 50),
              };
              marker = new google.maps.Marker({
                position: new google.maps.LatLng(this.ResponseData[i]['latitude'], this.ResponseData[i]['longitude']),
                map: this.MapNearBy,
                icon: image,
                draggable: false,
              });
              this.LocationsMarkersLive.push(marker);
            }
            if(this.LocationsMarkersLive.length > 0)
            {
              //let bounds = new google.maps.LatLngBounds();::BEFORE WE USED
              let infowindow = new google.maps.InfoWindow({minWidth: 300});
              var marker, i;
              let ClassObj = this;
              for (i = 0; i < this.LocationsMarkersLive.length; i++)
              {
                let marker = this.LocationsMarkersLive[i];
                //bounds.extend(marker.position);::BEFORE WE USED
                //if(i > 0)
                {
                  let InfoWindowContent = '';
                  InfoWindowContent += '<ion-grid class="info-window">';
                  InfoWindowContent += '<ion-row class="border-below">';
                    InfoWindowContent += '<ion-col size="3">';
                      if(this.ResponseData[i]['user']['image']!="")
                      {
                        InfoWindowContent += '<ion-img class="profile-pic" id="Photos-'+i+'" src="'+this.ResponseData[i]['user']['image']+'"></ion-img>';
                      }
                      else
                      {
                        InfoWindowContent += '<ion-img class="profile-pic" id="Photos-'+i+'" src="../assets/images/no-image-available.png"></ion-img>';
                      }
                      InfoWindowContent += '</ion-col>';
                    InfoWindowContent += '<ion-col size="9">';
                      InfoWindowContent += '<ion-label text-wrap class="ion-text-wrap location-name">'+this.ResponseData[i]['title']+'</ion-label><ion-text>'+this.ResponseData[i]['formatted_from_date']+'&nbsp;('+this.ResponseData[i]['day_difference']+')<br/>'+this.ResponseData[i]['user']['first_name']+'&nbsp;'+this.ResponseData[i]['user']['surname']+'&nbsp;&dash;&nbsp;'+this.ResponseData[i]['city']+'</ion-text>';
                    InfoWindowContent += '</ion-col>';
                  InfoWindowContent += '</ion-row>';
                  /*
                  InfoWindowContent += '<ion-row>';
                    InfoWindowContent += '<ion-col size="2" class="icon yellowBox">';
                    InfoWindowContent += '<ion-icon name="text"></ion-icon>';
                    InfoWindowContent += '</ion-col>';
                    InfoWindowContent += '<ion-col size="10">';
                      InfoWindowContent += '<ion-label class="make-bold">'+this.translation.trans('common-requests-block','Title')+'</ion-label>'+this.ResponseData[i]['title'];
                    InfoWindowContent += '</ion-col>';
                  InfoWindowContent += '</ion-row>';
                  */
                  InfoWindowContent += '<ion-row>';
                    InfoWindowContent += '<ion-col size="2" class="icon greenBox">';
                    InfoWindowContent += '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.6889 5.63889C11.6889 7.12392 10.485 8.32778 9 8.32778C7.51497 8.32778 6.31111 7.12392 6.31111 5.63889C6.31111 4.15385 7.51497 2.95 9 2.95C10.485 2.95 11.6889 4.15385 11.6889 5.63889Z" stroke="#038308" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 10.5278C6.4012 10.5278 4.29445 12.6345 4.29445 15.2333H13.7056C13.7056 12.6345 11.5988 10.5278 9 10.5278Z" stroke="#038308" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                    InfoWindowContent += '</ion-col>';
                    InfoWindowContent += '<ion-col size="10">';
                      InfoWindowContent += '<ion-label class="make-bold">'+this.translation.trans('common-requests-block','Requester')+'</ion-label>'+this.ResponseData[i]['user']['first_name']+'&nbsp;'+this.ResponseData[i]['user']['surname'];
                    InfoWindowContent += '</ion-col>';
                  InfoWindowContent += '</ion-row>';
                  InfoWindowContent += '<ion-row>';
                    InfoWindowContent += '<ion-col size="2" class="icon blueBox">';
                    InfoWindowContent += '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.666672 5.55556H15.3333M3.92593 0.666672V2.2963M12.0741 0.666672V2.2963M3.11112 8.00001H4.74075M7.18519 8.00001H8.81482M11.2593 8.00001H12.8889M3.11112 10.4445H4.74075M7.18519 10.4445H8.81482M11.2593 10.4445H12.8889M3.11112 12.8889H4.74075M7.18519 12.8889H8.81482M11.2593 12.8889H12.8889M3.27408 15.3333H12.7259C13.6386 15.3333 14.095 15.3333 14.4436 15.1557C14.7502 14.9995 14.9995 14.7502 15.1557 14.4436C15.3333 14.095 15.3333 13.6386 15.3333 12.7259V4.90371C15.3333 3.99103 15.3333 3.53469 15.1557 3.1861C14.9995 2.87946 14.7502 2.63016 14.4436 2.47392C14.095 2.2963 13.6386 2.2963 12.7259 2.2963H3.27408C2.36141 2.2963 1.90506 2.2963 1.55647 2.47392C1.24983 2.63016 1.00053 2.87946 0.844293 3.1861C0.666672 3.53469 0.666672 3.99103 0.666672 4.90371V12.7259C0.666672 13.6386 0.666672 14.095 0.844293 14.4436C1.00053 14.7502 1.24983 14.9995 1.55647 15.1557C1.90506 15.3333 2.3614 15.3333 3.27408 15.3333Z" stroke="#004FAC" stroke-linecap="round"/></svg>';
                    InfoWindowContent += '</ion-col>';
                    InfoWindowContent += '<ion-col size="10">';
                      InfoWindowContent += '<ion-label class="make-bold">'+this.translation.trans('common-requests-block','Duration')+'</ion-label>'+this.ResponseData[i]['formatted_from_date']+'&nbsp;('+this.ResponseData[i]['day_difference']+')';
                    InfoWindowContent += '</ion-col>';
                  InfoWindowContent += '</ion-row>';
                  if(this.ResponseData[i]['description']!=null && this.ResponseData[i]['description']!='')
                  {
                    InfoWindowContent += '<ion-row>';
                      InfoWindowContent += '<ion-col size="2" class="icon grayBox">';
                      InfoWindowContent += '<ion-icon name="information"></ion-icon>';
                      InfoWindowContent += '</ion-col>';
                      InfoWindowContent += '<ion-col size="10">';
                      InfoWindowContent += '<ion-label class="make-bold">'+this.translation.trans('common-requests-block','Detail')+'</ion-label>'+this.ResponseData[i]['description'];
                      InfoWindowContent += '</ion-col>';
                    InfoWindowContent += '</ion-row>';
                  }

                  if(this.ResponseData[i]['kids'].length > 0)
                  {
                    InfoWindowContent += '<ion-row>';
                      InfoWindowContent += '<ion-col size="2" class="icon purpleBox">';
                      InfoWindowContent += '<svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.10555 4.9H6.11227M10.1389 4.9H10.1456M5.79307 7.58889C6.258 8.3926 7.12699 8.93334 8.12222 8.93334C9.11751 8.93334 9.98649 8.3926 10.4514 7.58889M8.12222 11.6222C10.6281 11.6222 12.7336 9.90839 13.3306 7.58889H13.5C14.2425 7.58889 14.8444 6.98698 14.8444 6.24445C14.8444 5.50191 14.2425 4.9 13.5 4.9H13.3306C12.7336 2.58053 10.6281 0.866669 8.12222 0.866669C5.61639 0.866669 3.51085 2.58053 2.91387 4.9H2.74444C2.00192 4.9 1.39999 5.50191 1.39999 6.24445C1.39999 6.98698 2.00192 7.58889 2.74444 7.58889H2.91387C3.51085 9.90839 5.61639 11.6222 8.12222 11.6222Z" stroke="#B500B9" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                      InfoWindowContent += '</ion-col>';
                      InfoWindowContent += '<ion-col size="10">';
                      InfoWindowContent += '<ion-label class="make-bold">'+this.translation.trans('common-requests-block','Kids')+'</ion-label>';
                        InfoWindowContent += '<ion-grid>';
                          for(let K = 0 ; K < this.ResponseData[i]['kids'].length; K ++)
                          {
                            InfoWindowContent += '<ion-row class="no-padding">';
                              InfoWindowContent += '<ion-col>';
                              InfoWindowContent += this.ResponseData[i]['kids'][K]['name'];
                              InfoWindowContent += '(<span>'+this.ResponseData[i]['kids'][K]['age']+'</span>)';
                              InfoWindowContent += '</ion-col>';
                            InfoWindowContent += '</ion-row>';
                          }
                        InfoWindowContent += '</ion-grid>';
                      InfoWindowContent += '</ion-col>';
                    InfoWindowContent += '</ion-row>';
                  }
                  /*
                  InfoWindowContent += '<ion-row>';
                    InfoWindowContent += '<ion-col size="2" class="icon orangeBox">';
                    InfoWindowContent += '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 15.05C11.3528 12.63 13.7056 10.463 13.7056 7.79C13.7056 5.11694 11.5988 2.95 9 2.95C6.4012 2.95 4.29445 5.11694 4.29445 7.79C4.29445 10.463 6.64723 12.63 9 15.05Z" stroke="#DC8600" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 9.67222C10.1138 9.67222 11.0167 8.76936 11.0167 7.65556C11.0167 6.54178 10.1138 5.63889 9 5.63889C7.8862 5.63889 6.98334 6.54178 6.98334 7.65556C6.98334 8.76936 7.8862 9.67222 9 9.67222Z" stroke="#DC8600" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                    InfoWindowContent += '</ion-col>';
                    InfoWindowContent += '<ion-col size="10">';
                    InfoWindowContent += '<ion-label class="make-bold">'+this.translation.trans('common-requests-block','Location')+'</ion-label>'+this.ResponseData[i]['address']+'&nbsp;'+this.ResponseData[i]['city']+'&nbsp;'+this.ResponseData[i]['zip']+'<br />\n'+this.ResponseData[i]['distance_in_km']+'&nbsp;KM';
                    InfoWindowContent += '</ion-col>';
                  InfoWindowContent += '</ion-row>';
                  */
                  InfoWindowContent += '<ion-row>';
                    InfoWindowContent += '<ion-col size="6">';
                      InfoWindowContent += '<ion-button color="success" id="Accept-'+i+'" shape="round" size="full">'+this.translation.trans('common-requests-block','Accept')+'</ion-button>';
                    InfoWindowContent += '</ion-col>';
                    InfoWindowContent += '<ion-col size="6">';
                      InfoWindowContent += '<ion-button color="danger" id="Decline-'+i+'" shape="round" size="full">'+this.translation.trans('common-requests-block','Decline')+'</ion-button>';
                    InfoWindowContent += '</ion-col>';
                  InfoWindowContent += '</ion-row>';
                  InfoWindowContent += '</ion-grid>';

                  google.maps.event.addListener(marker, 'click', (function(marker, i)
                  {
                    return function()
                    {
                      //infowindow.setContent(ClassObj.ResponseData[i]['name']);
                      infowindow.setContent(InfoWindowContent);
                      infowindow.open(ClassObj.MapNearBy, marker);
                    }
                  })(marker, i));

                  google.maps.event.addListener(infowindow, 'domready', (function (i)
                  {
                    return function()
                    {
                      const EVPhotos = document.querySelector('#Photos-'+i);
                      EVPhotos?.addEventListener('click', (event) => ClassObj.ShowApplie(ClassObj.ResponseData[i]['user']['id']));

                      const EVAccept = document.querySelector('#Accept-'+i);
                      EVAccept?.addEventListener('click', (event) => ClassObj.AcceptRequest(ClassObj.ResponseData[i]['id'],ClassObj.ResponseData[i]['user']['id'],1));

                      const EVDecline = document.querySelector('#Decline-'+i);
                      EVDecline?.addEventListener('click', (event) => ClassObj.ConfirmeDeclineRequest(ClassObj.ResponseData[i]['id'],2));
                    }
                  })(i));
                }
              }
              //this.MapNearBy.fitBounds(bounds);::BEFORE WE USED
            }
            ClassObj.MapNearBy.setCenter({
              lat : this.LocationCordinates.latitude,
              lng : this.LocationCordinates.longitude
            });
          }
          else
          {
            //this.SendReceiveRequestsService.showMessageToast("No PIN's available.");
          }
          /*
          SELF CENTER ENDS
          */
				}
			}
			else
			{
				//this.SendReceiveRequestsService.showMessageToast(this.ResultResponseData['message']);
			}
			console.log(this.ResponseData);
		},
		error =>
		{
			Loading.dismiss();//DISMISS LOADER
			console.log(error);
		});
  }

  async AcceptRequest(RequestID:any,RequestAddedByUserId:any,RequestStatus:any)
	{
		const modal = await this.ModalController.create({
		component: RequestToApplyPage,
			showBackdrop: false,
			componentProps:
			{
				RequestID: RequestID,
				RequestStatus: RequestStatus,
				RequestAddedByUserId:RequestAddedByUserId
			}
		});
		modal.onDidDismiss().then(() =>
		{
			this.ShowNearByRequests();
		});
		return await modal.present();
	}

  async ConfirmeDeclineRequest(RequestID:any,RequestStatus:any)
	{
		let Message = (RequestStatus == 1) ? this.translation.trans('open-requests-nearby','MessageAccept') : this.translation.trans('open-requests-nearby','MessageDecline');
		const alert = await this.AlertController.create({
		cssClass: 'my-custom-alert',
		header: this.translation.trans('common-requests-block','Decline_1'),
		subHeader: Message,
		//message: 'Are you sure to decline request ?',
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
					this.DeclineRequest(RequestID,RequestStatus);
					console.log('Confirm Okay');
				}
			}
		]
		});
		await alert.present();
	}

	async DeclineRequest(RequestID:any,RequestStatus:any)
	{
		let ObjectRequest =
		{
			request_id:RequestID,
			request_status:RequestStatus,
			description:"",
			payment_type:0,
			amount:0
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
		await this.SendReceiveRequestsService.AcceptingOrDecliningRequest(ObjectRequest).then(result =>
		{
			Loading.dismiss();//DISMISS LOADER
			this.ResultResponseAnyAction = result;
			if(this.ResultResponseAnyAction['result']==1)
			{
				this.SendReceiveRequestsService.showMessageToast(this.ResultResponseAnyAction['message']);
				this.ShowNearByRequests();
			}
			else
			{
				this.SendReceiveRequestsService.showMessageToast(this.ResultResponseAnyAction['message']);
			}
			console.log(this.ResultResponseAnyAction);
		},
		error =>
		{
			Loading.dismiss();//DISMISS LOADER
			console.log(error);
		});
	}

  async Apply()
  {
    const modal = await this.ModalController.create({
      component: RequestToApplyPage,
      showBackdrop: false,
    });
    return await modal.present();
  }

  async ShowApplie(UserID:any)
	{
		const modal = await this.ModalController.create({
			component: ShowAppliesPage,
			showBackdrop: false,
			componentProps:
			{
				UserID: UserID
			}
		});
		return await modal.present();
	}

  async CheckPermission()
  {
    this.AndroidPermissions.checkPermission(this.AndroidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(async (result) =>
    {
      if (result.hasPermission)
      {
        await this.EnableGPS();
      }
      else
      {
        await this.LocationAccPermission();
      }
    },
    error =>
    {
      //console.log("1",error);
      //alert("1"+error);
    });
  }

  async LocationAccPermission()
  {
    await this.LocationAccuracy.canRequest().then(async (canRequest: boolean) =>
    {
      if (canRequest)
      {
        await this.CurrentLocPosition();
      }
      else
      {
        await this.AndroidPermissions.requestPermission(this.AndroidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(async () =>
        {
          await this.EnableGPS();
        },
        error =>
        {
          //console.log("2",error)
          //alert("2"+error);
        });
      }
    });
  }

  async EnableGPS()
  {
    await this.LocationAccuracy.request(this.LocationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(async () =>
    {
      await this.CurrentLocPosition();
    },
    error =>
    {
      this.SendReceiveRequestsService.showMessageToast(this.translation.trans('open-requests-nearby','GPSDissallowedError'));
      //console.log("3",JSON.stringify(error))
      //alert("3"+JSON.stringify(error));
    });
  }

  async CurrentLocPosition()
  {
    await this.Geolocation.getCurrentPosition().then(async (response) =>
    {
      this.LocationCordinates.latitude = response.coords.latitude;
      this.LocationCordinates.longitude = response.coords.longitude;
      this.LocationCordinates.accuracy = response.coords.accuracy;
      this.LocationCordinates.timestamp = response.timestamp;
      this.ShowNearByRequests();
    }).catch((error) =>
    {
      this.SendReceiveRequestsService.showMessageToast(this.translation.trans('open-requests-nearby','GPSDissallowedError'));
      //console.log('4: ',error);
      //alert("4"+error);
    });
  }

  LimitMySearch(Ev:any)
  {
    let Distance = (Ev.detail.value) ? Ev.detail.value : null;
    if(Distance!=null)
    {
      this.Distance = Distance;
      this.ShowNearByRequests();
    }
  }

  SignIn(Form:any)
  {
    let range_in_km = (Form.range_in_km) ? Form.range_in_km : 0;
    let min_price = (Form.min_price) ? Form.min_price : 0;
    let kids_creteria = (Form.kids_creteria) ? Form.kids_creteria : 0;
    this.Distance = range_in_km;
    this.PriceRange = min_price;
    this.KidsType = kids_creteria;
    this.SignInForm.controls['range_in_km'].setValue(this.Distance);
    this.SignInForm.controls['min_price'].setValue(this.PriceRange);
    this.SignInForm.controls['kids_creteria'].setValue(this.KidsType);
    //CLOSE ACCORDIAN
    const nativeEl = this.AccordionGroup;
    if (nativeEl!.value === 'search-accordian')
    {
      nativeEl!.value = undefined;
    }
    else
    {
      nativeEl!.value = 'search-accordian';
    }
    //CLOSE ACCORDIAN
    this.ShowNearByRequests();
  }

  ResetSearch()
  {
    this.Distance = 0;
    this.PriceRange = 0;
    this.KidsType = 0;
    this.SignInForm.controls['range_in_km'].setValue('');
    this.SignInForm.controls['min_price'].setValue('');
    this.SignInForm.controls['kids_creteria'].setValue('');
    //CLOSE ACCORDIAN
    const nativeEl = this.AccordionGroup;
    if (nativeEl!.value === 'search-accordian')
    {
      nativeEl!.value = undefined;
    }
    else
    {
      nativeEl!.value = 'search-accordian';
    }
    //CLOSE ACCORDIAN
    this.ShowNearByRequests();
  }

  ShowUpdatedContent(ev:any)
	{
		setTimeout(() =>
    {
      this.ShowNearByRequests();
      ev.target.complete();
    }, 2000);
	}
}
