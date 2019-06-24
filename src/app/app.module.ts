import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';

import {HttpModule} from '@angular/http';
import {AuthService} from './service/auth.service';
import {AuthguardService} from './service/authguard.service';

import {Geolocation} from '@ionic-native/geolocation/ngx';
import {ImagePicker} from '@ionic-native/image-picker/ngx';
import {
    FileTransfer,
    FileTransferObject
} from '@ionic-native/file-transfer/ngx';
import {File} from '@ionic-native/file/ngx';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {LocationAccuracy} from '@ionic-native/location-accuracy/ngx';
import {Push} from '@ionic-native/push/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';


@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        HttpModule
    ],
    providers: [
        StatusBar,
        SplashScreen,
        AuthService,
        AuthguardService,
        File,
        FileTransfer,
        Geolocation,
        ImagePicker,
        FileTransferObject,
        AndroidPermissions,
        LocationAccuracy,
        Push,
        NativeGeocoder,
        FileChooser,
        FilePath,
        PhotoViewer,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
