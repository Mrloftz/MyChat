import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Camera } from '@ionic-native/camera/ngx';

// import { Crop } from '@ionic-native/crop/ngx';
// import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { IonicModule } from '@ionic/angular';

import { SettingsPage } from './settings.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],

  providers: [
    ImagePicker,
    Camera
  ],


  declarations: [SettingsPage]
})
export class SettingsPageModule {}
