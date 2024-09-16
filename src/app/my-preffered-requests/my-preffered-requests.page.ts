import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';

@Component({
  selector: 'app-my-preffered-requests',
  templateUrl: './my-preffered-requests.page.html',
  styleUrls: ['./my-preffered-requests.page.scss'],
})

export class MyPrefferedRequestsPage implements OnInit 
{
  public ProfileForm:any=[];
	public validation_messages = 
	{	
		'min_range_km': 
		[
			{ type: 'required', message: 'Minimum range in KM is required.' },
		],
		'max_range_km': 
		[
			{ type: 'required', message: 'Maximum range in KM is required.' },
		],
		'child_type': 
		[
			{ type: 'required', message: 'Selecting option is required.' },
		]
	};
  constructor(private SendReceiveRequestsService: SendReceiveRequestsService, private FB : FormBuilder, private LoadingCtrl : LoadingController)
  { }

  ngOnInit()
  { 
    this.ProfileForm = this.FB.group({
			'min_range_km': ['', Validators.required],
			'max_range_km': ['', Validators.required],
			'child_type': ['', Validators.required],
			'min_price': ['']
		});
  }

  UpdateProfile(Form:any)
  {}
}
