import { Component, OnInit } from '@angular/core';
import { Crop } from '@ionic-native/crop/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { Platform, ModalController, ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { SocketService } from '../service/socket.service';
import { ModalpagePage } from '../modalpage/modalpage.page';
import { UserServiceService } from '../service/user-service.service';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  providers: [Crop, Camera]
})
export class SettingsPage implements OnInit {

  fileUrl: any = null;
  respData: any;
  currentImage: any;
  fileType: string;
  filesName: string;
  img = [];
  userData: any;



  constructor(
    private userService: UserServiceService,
    private imagePicker: ImagePicker,
    private crop: Crop,
    private transfer: FileTransfer,
    private platform: Platform,
    private socket: SocketService,
    public modalCtrl: ModalController,
    public actionSheetController: ActionSheetController,
    private photoViewer: PhotoViewer,
    private camera: Camera) { }
  ngOnInit() {
    // this.cropUpload();
    // this.checkPlatform();
    this.getProfile();
  }


  checkPlatform() {
    if (this.platform.is('cordova')) {
      this.chooseImage();
    }
  }


  getProfile() {
    this.userService.getProfile().subscribe((data: any) => {
      this.userData = data.profile.refprofile;
      this.fileUrl = this.userData;
    });
  }

  viewPhoto(picId) {
    this.photoViewer.show('http://192.168.0.139:3000/v1/files/getFile/' + picId);
  }



  // cropUpload() {
  //   this.imagePicker.getPictures({ maximumImagesCount: 1, outputType: 0 }).then((results) => {
  //     for (const row of results) {
  //       console.log('Image URI: ' + row);
  //       this.crop.crop(row, { quality: 100 })
  //         .then(
  //           newImage => {
  //             console.log('new image path is: ' + newImage);
  //             const fileTransfer: FileTransferObject = this.transfer.create();
  //             const uploadOpts: FileUploadOptions = {
  //               fileKey: 'file',
  //               fileName: newImage.substr(newImage.lastIndexOf('/') + 1)
  //             };
  //             fileTransfer.upload(newImage, 'http://192.168.0.121:3000/v1/files/postFile', uploadOpts)
  //               .then((data) => {
  //                 console.log('data image 55555555555555555555555', data);
  //                 this.respData = JSON.parse(data.response);
  //                 console.log(this.respData);
  //                 this.fileUrl = this.respData.fileUrl;
  //               }, (err) => {
  //                 console.log(err);
  //               });
  //           },
  //           error => console.error('Error cropping image', error)
  //         );
  //     }
  //   }, (err) => { console.log(err); });
  // }

  // takePicture() {
  //   const options: CameraOptions = {
  //     quality: 100,
  //     destinationType: this.camera.DestinationType.DATA_URL,
  //     encodingType: this.camera.EncodingType.JPEG,
  //     mediaType: this.camera.MediaType.PICTURE
  //   };

  //   this.camera.getPicture(options).then((imageData) => {
  //     this.currentImage = 'data:image/jpeg;base64,' + imageData;
  //   }, (err) => {
  //     // Handle error
  //     console.log("Camera issue:" + err);
  //   });
  // }

  async chooseImage() {

    const actionSheet = await this.actionSheetController.create({
      header: 'Choose Photo',
      buttons: [{
        text: 'Take photo',
        role: 'destructive',
        icon: 'camera',
        handler: () => {
          this.fileUrl = "";
          const options: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
          };
          const token = localStorage.getItem("tokenLogin");
          this.camera.getPicture(options).then((imageData) => {
            this.currentImage = imageData;
            console.log('photo camera', this.currentImage);
            const fileTransfer: FileTransferObject = this.transfer.create();
            const uploadOpts: FileUploadOptions = {
              fileKey: 'file',
              fileName: imageData.substr(imageData.lastIndexOf('/') + 1),
              headers: { Authorization: "Bearer " + token },
            };
            fileTransfer.upload(imageData, 'http://192.168.0.139:3000/v1/files/postProfile/', uploadOpts)
              .then((data) => {
                this.respData = JSON.parse(data.response);
                this.fileUrl = this.respData.file[0].id;
              }).catch(err => {
                console.log('err', err);
              });


          }, (err) => {
            // Handle error
            console.log("Camera issue:" + err);
          });
          console.log('take photo');
        }
      }, {
        text: 'Upload from gallery',
        icon: 'folder-open',
        handler: () => {
          this.img = [];
          this.fileUrl = "";
          const token = localStorage.getItem("tokenLogin");
          this.imagePicker.getPictures({ maximumImagesCount: 1, outputType: 0 }).then((results) => {
            for (const row of results) {
              console.log('Image URI: ' + row);


              // const fileTransfer: FileTransferObject = this.transfer.create();
              // const uploadOpts: FileUploadOptions = {
              //   fileKey: 'file'
              // };

              // fileTransfer.upload(row, 'http://192.168.0.139:3000/v1/files/postFile', uploadOpts)
              //   .then((data) => {
              //     console.log('data image 55555555555555555555555', data);
              //   }).catch(err => {
              //     console.log('err', err);
              //   });


              this.crop.crop(row, { quality: 100 })
                .then(
                  newImage => {
                    console.log('new image path is: ' + newImage);
                    const fileTransfer: FileTransferObject = this.transfer.create();
                    const uploadOpts: FileUploadOptions = {
                      fileKey: 'file',
                      fileName: newImage.substr(newImage.lastIndexOf('/') + 1),
                      headers: { Authorization: "Bearer " + token },
                    };
                    fileTransfer.upload(newImage, 'http://192.168.0.139:3000/v1/files/postProfile/', uploadOpts)
                      .then((data) => {
                        this.respData = JSON.parse(data.response);
                        this.fileUrl = this.respData.file[0].id;
                      }).catch(err => {
                        console.log('err', err);
                      });
                  }).catch(err => {
                    console.log('err', err);
                  });
            }
          }).catch(err => {
            console.log('errr', err);
          });
          console.log('upload gellery');

        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }



}
