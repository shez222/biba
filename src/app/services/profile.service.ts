import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private SubjectOnProfileDataChanged = new Subject<void>();

  observableOnProfileDataChanged(): Subject<void>
  {
    return this.SubjectOnProfileDataChanged;
  }

  constructor() { }

  SaveUserInformation(userData:any, session_token:string) {
    let ObjUser =
      {
        session_token: session_token,
        name: userData['first_name'],
        surname: userData['surname'],
        image: userData['image'],
        email: userData['email'],
        identify: userData['identify'],
        language: userData['language'],
      }
    localStorage.setItem('UserInformation', JSON.stringify(ObjUser));
    this.SubjectOnProfileDataChanged.next();
  }

  SaveLanguageToProfile(language: string){
    let UserInformationData = this.GetUserProfileData();
    if (UserInformationData !== null){
      UserInformationData.language = language;
      this.SaveUserInformation(UserInformationData, UserInformationData.session_token)
    }
  }

  GetUserProfileData() : any | null
  {
    let UserInformationData = localStorage.getItem("UserInformation");
    if (UserInformationData != null) {
      UserInformationData = JSON.parse(UserInformationData);
    }
    return UserInformationData;
  }


}
