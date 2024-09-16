import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { NativeGeocoder } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { Calendar } from '@awesome-cordova-plugins/calendar/ngx';
import { FirebaseX } from '@awesome-cordova-plugins/firebase-x/ngx';
import { Deeplinks } from '@awesome-cordova-plugins/deeplinks/ngx';
import { SendReceiveRequestsService } from './providers/send-receive-requests.service';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { GooglePlus } from '@awesome-cordova-plugins/google-plus/ngx';
import { Facebook } from '@awesome-cordova-plugins/facebook/ngx';
import { SignInWithApple } from '@awesome-cordova-plugins/sign-in-with-apple/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import {SharedModule} from "./shared.module";

@NgModule({
  declarations: [AppComponent],
  imports:
  [
    BrowserModule,
    IonicModule.forRoot({
      backButtonText: '' // Set an empty string to have no text next to the back icon
    }),
    AppRoutingModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [
    HttpClient,
    AndroidPermissions,
    LocationAccuracy,
    Geolocation,
    NativeGeocoder,
    SocialSharing,
    Calendar,
    FirebaseX,
    Deeplinks,
    Network,
    GooglePlus,
    Facebook,
    SignInWithApple,
    StatusBar,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    SendReceiveRequestsService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
