import { Component, OnInit } from '@angular/core';
import {
  ModalController,
  NavParams,
  NavController,
  Platform
} from '@ionic/angular';
import { ModalpagePage } from '../modalpage/modalpage.page';
import { UserServiceService } from '../service/user-service.service';
import { FileServiceService } from '../service/file.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { map } from 'rxjs/operators';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Router } from '@angular/router';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  items: object;  
  item1: object;
  item2: object;

  public toggled: boolean = false;
  user: object;
  Myprofile: any;
  gps: any;
  information: any[];
  friendLength: any;
  options;
  imageResponse = [];
  img = [];
  name: string;

  constructor(
    public modalCtrl: ModalController,
    public userService: UserServiceService,
    public fileService: FileServiceService,
    public authService: AuthService,
    public nvCT: NavController,
    private http: HttpClient,
    private androidPermissions: AndroidPermissions,
    private geolocation: Geolocation,
    private locationAccuracy: LocationAccuracy,
    private transfer: FileTransfer,
    private file: File,
    private imagePicker: ImagePicker,
    private platform: Platform,
    private router: Router
  ) {
    this.items = [{
    name: 'Secret Chats',
     children: [
    {
        name : 'Tu'
    },
    {
      name : 'Ta'
  }
    ]} 
  ]; 

    this.item1 = [{
    name: 'Broadcast Rooms',
     children: [
    {
        name : 'Te'
    }
    ]}
  ];

    this.item2 = [{
    name: 'Event Rooms',
     children: [
    {
        name : 'To'
    }
    ]} 
  ];
}

  ngOnInit() {
    this.checkPlatform();
    this.getUser();
    this.getProfile();
    // this.getGPS();
    console.log('file' , this.file.dataDirectory)
  }

  checkPlatform() {
    if (
      this.platform.is("cordova")
    ) {
      this.checkGPSPermission();
    } else {
      this.getLocationCoordinates();
    }
  }

  getUser() {
    this.userService.getUserGroup().subscribe(
      (data: any) => {
        console.log('data', data.items);
        this.user = data.items;
        this.friendLength = this.user[0].children.length;
      },
      error => {
        console.log('error', error);
      }
    );
  }

  onInput(ev: any) {
    const val = ev.target.value;
    console.log('val', val);

    if (val && val.trim() !== '') {
      this.user[0].children = this.user[0].children.filter((member) => {
        return member.username.toLowerCase().includes(val.toLowerCase());
      });
  }
}

onCancel() {
  }

  async fileUpload() {
    const token = sessionStorage.getItem('tokenLogin');
    const reqHeader = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + token
    });
    const fileTransfer: FileTransferObject = this.transfer.create();

    const options: FileUploadOptions = {
      fileKey: 'file',
      fileName: 'name1.jpg',
      headers: { reqHeader }
    };

    for await (const i of this.img) {

      await fileTransfer.upload(i, 'http://192.168.0.182:3000/v1/files/postFile', options)
        .then((data) => {
          console.log('uploadtest :', data)
        }, (err) => {
          console.log('err :', err)
        })
    }
    this.img = [];
  }

  fileDownload() {
    const url =  'http://192.168.0.182:3000/v1/files/getfile/5cf8f5bfb3167531dc3428b4';
    const fileTransfer: FileTransferObject = this.transfer.create();
    fileTransfer.download(url, this.file.dataDirectory + '5cf8f5bfb3167531dc3428b4.png').then((entry) => {
      console.log('download complete: ' + entry.toURL());
      console.log('entry :' , entry)
      // this.readFile(entry);
      // console.log("this.readFile(entry)" , this.readFile(entry))
    }, (error) => {
      console.log('download pic err : ' , error)
    });
  }

//   readFile(fileEntry) {
//     fileEntry.file(function (file) {
//         var reader = new FileReader();

//         reader.onloadend = function () {

//             console.log("Successful file read: " + this.result);
//             // displayFileData(fileEntry.fullPath + ": " + this.result);

//         };

//         reader.readAsText(file);

//     }, (error) => {
//       console.log("caby read : " , error)
//     });
// }
public toggle(): void {
  this.toggled = !this.toggled;
}
  
  async getImages() {
    this.options = {
      maximumImagesCount: 10,
      width: 800
    }
    await this.imagePicker.getPictures(this.options).then((results) => {
      for (var i = 0; i < results.length; i++) {
        console.log('Image URI: ' + results[i]);
        this.img.push(results[i]);
        console.log('imgpath', this.img);
      }
      return this.fileService.postImg(results[i]);
    }, (err) => { });

  }

  async presentProfileModal(data) {
    const profileModal = await this.modalCtrl.create({
      component: ModalpagePage,
      componentProps: { value: data },
      cssClass: 'my-custom-modal-css'
    });
    await profileModal.present();
  }
  checkGPSPermission() {
    this.androidPermissions
      .checkPermission(
        this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION
      )
      .then(
        result => {
          console.log(result.hasPermission);
          if (result.hasPermission) {
            //If having permission show 'Turn On GPS' dialogue
            this.askToTurnOnGPS();
          } else {
            //If not having permission ask for permission
            this.requestGPSPermission();
          }
        },
        err => {
          alert(err);
        }
      );
  }
  requestGPSPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        console.log('4');
      } else {
        //Show 'GPS Permission Request' dialogue
        this.androidPermissions
          .requestPermission(
            this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION
          )
          .then(
            () => {
              // call method to turn on GPS
              this.askToTurnOnGPS();
            },
            error => {
              //Show alert if user click on 'No Thanks'
              alert(
                'requestPermission Error requesting location permissions ' +
                  error
              );
            }
          );
      }
    });
  }
  askToTurnOnGPS() {
    this.locationAccuracy
      .request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
      .then(
        () => {
          // When GPS Turned ON call method to get Accurate location coordinates
          this.getLocationCoordinates();
        },
        error =>
          alert(
            'Error requesting location permissions ' + JSON.stringify(error)
          )
      );
  }
  getLocationCoordinates() {
    this.geolocation
      .getCurrentPosition()
      .then(resp => {
        this.gps = {
          type: 'Point',
          coordinates: {
            latitude: resp.coords.latitude,
            longitude: resp.coords.longitude
          }
        };

        this.getupdate(this.gps);
      })
      .catch(error => {
        alert('Error getting location' + error);
      });
  }

  getupdate(l) {
    this.userService.getupdateUser(l).subscribe(data => {
      console.log('getupdateUser : ', data);
    });
  }

  async myProfileModal(data) {
    const profileModal = await this.modalCtrl.create({
      component: ModalpagePage,
      componentProps: { value: data },
      cssClass: 'my-custom-modal-css'
    });
    await profileModal.present();
  }

  getProfile() {
    this.userService.getProfile().subscribe(
      data => {
        this.Myprofile = data;
      },
      error => {
        console.log('error', error);
      }
    );
  }

  toggleSection(i) {
    this.user[i].open = !this.user[i].open;
  }

  toggleSecret(i) {
    this.items[i].open = !this.items[i].open;
  }

  toggleBroadcast(i) {
    this.item1[i].open = !this.item1[i].open;
  }

  toggleEvent(i) {
    this.item2[i].open = !this.item2[i].open;
  }

  setting() {
    console.log('Setting!');
    this.router.navigate(['/home/settings']);
  }

  logout() {
    this.authService.logout().subscribe(
      data => {
        this.nvCT.navigateForward('/login');
      },
      error => {
        console.log('error', error);
      }
    );
  }
}
