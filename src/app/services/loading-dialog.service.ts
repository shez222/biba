import { Injectable } from '@angular/core';
import {LoadingController} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class LoadingDialogService {

  private loading : HTMLIonLoadingElement | null = null;

  constructor(private LoadingCtrl : LoadingController) { }

  async showLoadingDialog(){
    if (this.loading === null) {
      //LOADER
      this.loading = await this.LoadingCtrl.create({
        spinner: null,
        //duration: 5000,
        message: 'Please wait...',
        translucent: true,
        cssClass: 'custom-class custom-loading'
      });
      await this.loading.present();
    }
  }

  async dismissLoadingDialog(){
    if (this.loading !== null) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }
}
