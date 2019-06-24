import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";
import { UserServiceService } from "../service/user-service.service";
import { SocketService } from "../service/socket.service";
import { IonContent, AlertController } from "@ionic/angular";
import { ImagePicker } from "@ionic-native/image-picker/ngx";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from "@ionic-native/file-transfer/ngx";
import { File, FileEntry } from "@ionic-native/file/ngx";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
// import { environment } from "src/environments/environment";
import { NavController } from "@ionic/angular";
import { FileChooser } from "@ionic-native/file-chooser/ngx";
import { environment } from "src/environments/environment";
import { FilePath } from "@ionic-native/file-path/ngx";
import { PhotoViewer } from "@ionic-native/photo-viewer/ngx";
import * as _ from "underscore";

@Component({
  selector: "app-chatroom",
  templateUrl: "chatroom.page.html",
  styleUrls: ["chatroom.page.scss"]
})
export class ChatroomPage implements OnInit {
  items: object;
  obj = [
    { name: "Germany", voteCount: 20 },
    { name: "Spain", voteCount: 30 },
    { name: "France", voteCount: 20 },
    { name: "Nigeria", voteCount: 30 }
  ];

  @ViewChild("content") content: IonContent;

  dataUser: any;
  userData: any;
  messageAll: any;
  updateChatSub: any;
  sendMessageNow = [];
  sendMessageSub: any;
  GPS: any;
  show = false;
  img = [];
  datapoll: any;
  options: any;
  pieChartData;
  data = [];
  filePathFromChooser;
  filesPath;
  fileType: string;
  filesName: string;
  checkFocus = false;
  testURi: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserServiceService,
    private socket: SocketService,
    private imagePicker: ImagePicker,
    private transfer: FileTransfer,
    public nvCT: NavController,
    private fileChooser: FileChooser,
    private http: HttpClient,
    private file: File,
    private filePath: FilePath,
    public alertController: AlertController,
    private photoViewer: PhotoViewer
  ) {
    this.items = [{
      name: 'Annoucement',
      children: [
        { name: 'Test1' },
        { name: 'Test2'}
      ]
    }];
    // this.genData();
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.dataUser = this.router.getCurrentNavigation().extras.state.user;
        sessionStorage.setItem('refChatroom', this.dataUser._id);
        console.log("dateUser", this.dataUser);
      }
    });
  }

  async ngOnInit() {    // this.useAngularLibrary();
    await this.getProfile();
    await this.getPoll();
    this.getMessageActive();
    this.joinRoom();
    this.updateChat();

  }

  checkFocusClick() {
    this.checkFocus = false;
  }

  onInput(eve) {
    // console.log('onInput', eve);
  }
  ionViewDidEnter() {
    console.log("scrollBottom");
    setTimeout(() => {
      this.scrollToBottom();
    }, 500);
    console.log("scrollBottom2");
  }
  PostTimeline() {
    const navigationExtras: NavigationExtras = {
      state: {
        user: this.dataUser
      }
    };
    console.log(this.dataUser);
    this.router.navigate(["/createtimeline"], navigationExtras);
  }
  async chooseImage() {
    this.img = [];
    this.options = {
      maximumImagesCount: 10,
      width: 800,
      params: this.dataUser._id
    };
    await this.imagePicker.getPictures(this.options).then(
      results => {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < results.length; i++) {
          // console.log('Image URI: ' + results[i]);
          // this.img.push(results[i]);
          // console.log('imgpath', this.img);
          if (this.img.length < 10) {
            this.img.push(results[i]);
            console.log("imgpath", this.img);
          } else {
            this.presentAlertConfirm();
          }
        }
      },
      err => {
        console.log("err : ", err);
      }
    );
  }
  async chooseFile() {
    this.img = [];
    await this.fileChooser.open().then(
      uri => {
        let uripath = uri.toString();

        console.log("Image URI: ", uripath);
        console.log(" uri ", uri.toString())
        if (this.img.length < 10) {
          this.img.push(uripath);
          console.log("imgpath", this.img);
        } else {
          this.presentAlertConfirm();
        }
        console.log("imgpath", this.img);

        // this.filePathFromChooser = uri;
        this.filePath.resolveNativePath(uri).then(
          filePath => {
            this.filesPath = filePath;
            this.file.resolveLocalFilesystemUrl(filePath).then(
              fileInfo => {
                let files = fileInfo as FileEntry;
                files.file(success => {
                  this.fileType = success.type;
                  this.filesName = success.name;
                  console.log(
                    "fileName : ",
                    this.filesName,
                    "   fileType :",
                    this.fileType
                  );
                });
              },
              err => {
                console.log(err);
                throw err;
              }
            );
          },
          err => {
            console.log(err);
            throw err;
          }
        );
      },
      err => {
        console.log(err);
        throw err;
      }
    );
  }

  viewPhoto(picId) {
    console.log("Pic id :", picId)
    this.photoViewer.show('http://192.168.0.182:3000/v1/files/getFile/' + picId);
  }

  async viewVideo() {

    let downloadUrl: any;
    downloadUrl = 'http://192.168.0.182:3000/v1/files/getFile/5d033bf80514993a2c7591a3';
    let path = this.file.externalRootDirectory + '/Download/'
    console.log("path naja . ", path)
    const transfer = this.transfer.create();
    /////////////////////////////////////////////
    await transfer.download(downloadUrl, path + 'myfile.mp4').then(entry => {
      let url = entry.toURL();
      this.testURi = url;
      // let test = downloadUrl.toURL()
      console.log('get this.test uri', url);
    });
  }

  removeFile() {
    console.log('this.testURi', this.testURi)
    this.file.removeFile(this.file.externalRootDirectory + '/Download/', 'myfile.mp4').then(res => { console.log("deleted :", res) })
  }

  async uploadFile() {
    const token = localStorage.getItem("tokenLogin");
    const fileTransfer: FileTransferObject = this.transfer.create();
    const options: FileUploadOptions = {
      headers: { Authorization: "Bearer " + token },
      fileName: this.filesName,
      //////////// ContentType /////////
      mimeType: this.fileType,
      params: {
        refChatroom: this.dataUser._id,
        refuser: this.userData._id
      }
    }; console.log("this.dataUser.id", this.dataUser._id)
    for await (const i of this.img) {
      await fileTransfer
        .upload(i, "http://192.168.0.182:3000/v1/files/postFile", options)
        .then(
          data => {
            console.log("uploadtest :", data);
            const time = new Date();
            this.socket.sendChat(JSON.parse(data.response).file[0].id, time, JSON.parse(data.response).file[0].contentType);
            console.log(options.params);
          },
          err => {
            console.log("err :", err);
          }
        );
    }
    this.img = [];
  }
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      message: "Your file don't more than 10 files",
      buttons: [
        {
          text: "Okay",
          handler: () => { }
        }
      ]
    });

    await alert.present();
  }

  showBar(a) {
    if (this.show) {
      this.show = a;
    } else {
      this.show = a;
    }
  }

  scrollToBottom() {
    this.content.scrollToBottom(0);
  }

  joinRoom() {
    this.socket.joinRoom(this.dataUser._id);
  }

  updateChat() {
    this.updateChatSub = this.socket.onUpdateChat().subscribe(data => {
      console.log("socket on update chat", data);
      if (data.username !== "SERVER") {
        this.sendMessageNow.push(data);
      }
    });
  }

  leaveRoom() {
    if (this.updateChatSub) {
      this.updateChatSub = this.updateChatSub.unsubscribe();
    }
    this.socket.leaveRoom(this.dataUser._id);
  }

  ce(e) {
    console.log(e);
  }

  async getProfile() {
    this.userService.getProfile().subscribe(data => {
      this.userData = data;
    });
  }

  logScrollStart() {
    console.log("logScrollStart");
    document.getElementById("chat-parent");
  }

  logScrolling(event) {
    console.log("event", event);
  }

  sendMessage(messages) {
    if (this.sendMessageSub) {
      this.sendMessageSub.unsubscribe();
    }
    const time = new Date();
    this.socket.sendChat(messages, time, 'text');
    this.sendMessageSub = this.userService
      .sendMessage(this.dataUser._id, messages, 'text')
      .subscribe(data => {
      });
  }

  getMessageActive() {
    this.userService.getMessageActive(this.dataUser._id).subscribe((data: any) => {
      if (this.dataUser.type !== 'secret single') {
        data.forEach(element => {
          if (element.message_type === 'text') {
            this.sendMessageNow.push({
              username: element.refuser.username, data: element.message
              , type: element.message_type, updatedAt: element.updatedAt
            });
          }
          if (element.message_type === 'image') {
            this.sendMessageNow.push({
              username: element.refuser.username, data: element.img
              , type: element.message_type, updatedAt: element.updatedAt
            });
          }
          if (element.message_type === 'video') {
            this.sendMessageNow.push({
              username: element.refuser.username, data: element.img
              , type: element.message_type, updatedAt: element.updatedAt
            });
          }
          if (element.message_type === 'application') {
            this.sendMessageNow.push({
              username: element.refuser.username, data: element.img
              , type: element.message_type, updatedAt: element.updatedAt
            });
          }
        });
      }
      console.log('sendMessageNow', this.sendMessageNow);
    });
  }
  gotoCreate() {
    this.nvCT.navigateForward("/tab4/create-poll");
  }

  async getPoll() {
    return this.http.post(environment.api + '/polls/getpoll', { id: sessionStorage.getItem('refChatroom') }).subscribe(res => {
      console.log(res);
      this.datapoll = res;
      console.log("this.datapoll", this.datapoll);
      // this.options = _.where(this.datapoll[0].choice);
      // console.log("halooptions", this.options);
      this.datapoll.reverse();
    });
  }

  useAngularLibrary() {
    this.pieChartData = {
      chartType: "PieChart",
      dataTable: this.data,
      options: {
        title: "Country",
        width: 400,
        height: 300
      }
    };
  }

  genData() {
    this.data = [["Languages", "Percent"]];
    this.obj.forEach(element => {
      this.data.push([element.name, element.voteCount]);
      console.log("this.options", this.obj);
      console.log("this.data", this.data);
    });
    this.useAngularLibrary();
  }

  openDetailsWithState() {
    const navigationExtras: NavigationExtras = {
      state: {
        user: this.dataUser._id
      }
    };
    this.router.navigate(["/tab4/create-poll"], navigationExtras);
  }
  opentimeline() {
    this.router.navigate(["/timeline"]);
  }

  toggleSection(i) {
    this.items[i].open = !this.items[i].open;
  }



}
