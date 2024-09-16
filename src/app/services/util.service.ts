import { Injectable } from '@angular/core';
import {SocialSharing} from "@awesome-cordova-plugins/social-sharing/ngx";
import {TranslationService} from "./translation.service";
import {SendReceiveRequestsService} from "../providers/send-receive-requests.service";

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(private socialSharing: SocialSharing,
              private translation: TranslationService,
              private sendReceiveRequestsService: SendReceiveRequestsService
  ) { }

  CalculateDistanceBetweenLatLon(lat1:any,lon1:any,lat2:any,lon2:any)
  {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2-lon1);
    var a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return Math.round(d);
  }

  deg2rad(deg:any)
  {
    return deg * (Math.PI/180)
  }

  DateDifference(Date1:any,Date2:any,Date3:any,Date4:any)
  {
    let DaysTranslation = this.translation.trans('common-requests-block','Days');
    let HRSTranslation = this.translation.trans('common-requests-block','Hours');
    let SameTranslation = this.translation.trans('common-requests-block','SameDateAndTime');

    var diffMs = (Date4 - Date3); // milliseconds between now & Christmas
    var diffDays = Math.floor(diffMs / 86400000); // days
    var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    if(diffDays > 0 && diffHrs > 0)
    {
      return diffDays + " " + DaysTranslation + " " + diffHrs+" " + HRSTranslation;
    }
    else if(diffDays == 0 && diffHrs > 0)
    {
      return diffHrs+" " + HRSTranslation;
    }
    else if(diffDays > 0 && diffHrs == 0)
    {
      return diffDays + " " + DaysTranslation;
    }
    else
    {
      return SameTranslation;
    }
  }

  async ShareOnSocialNetwork(packageName: string, appName: string, social: string, message: string, subject: string, image: string, url: string) {
    try {
      const socialNetworks: { [key: string]: () => Promise<void> } = {
        facebook: () => this.socialSharing.shareViaFacebook(message, image, url),
        whatsapp: () => this.socialSharing.shareViaWhatsApp(message, image, url),
        instagram: () => this.socialSharing.shareViaInstagram(message, image),
        twitter: () => this.socialSharing.shareViaTwitter(message, image, url)
      };

      const shareAction = socialNetworks[social] || (() => this.socialSharing.share(message, subject, image, url));

      if (packageName !== 'none') {
        await this.socialSharing.canShareVia(packageName, message, subject, image, url);
      }
      await shareAction();
    } catch (error) {
      const errorMessage = "There was a problem please try later";
      this.sendReceiveRequestsService.showMessageToast(errorMessage);
    }
  }

  /**
   * Returns something like:
   * {
   *     "iss": "https://appleid.apple.com",
   *     "aud": "com.babysitter.application",
   *     "exp": 1713814623,
   *     "iat": 1713728223,
   *     "sub": "001090.XXXXXXXXX.1530",
   *     "c_hash": "yNF8yakt6YRuJyyptx9xvg",
   *     "email": "p.xxxxx@bluewin.ch",
   *     "email_verified": true,
   *     "auth_time": 1713728223,
   *     "nonce_supported": true
   * }
   * @param idToken
   * @constructor
   */
  DecryptAppleIdToken(idToken: string)
  {
    let base64Url = idToken.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c)
    {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  }
}
