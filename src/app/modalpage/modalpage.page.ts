import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { UserServiceService } from '../service/user-service.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as _ from 'underscore';
import { SocketService, Event } from '../service/socket.service';

@Component({
  selector: 'app-modalpage',
  templateUrl: './modalpage.page.html',
  styleUrls: ['./modalpage.page.scss'],
})
export class ModalpagePage implements OnInit {
  dataUser;
  Profile: any;
  createChatRoomSub: any;
  user: any;
  showNext = false;
  userGroup = [];
  userFilter: any;
  checkUser: any;
  allUser = [];
  result: any;
  val: any;

  constructor(public navParam: NavParams, public userService: UserServiceService, private socket: SocketService
    , private router: Router, private modalCtrl: ModalController, private http: HttpClient) { }

  ngOnInit() {
    this.dataUser = this.navParam.get('value');
    this.getProfile();

  }

  getProfile() {
    this.userService.getProfile().subscribe(data => {
      console.log('Profile',data);
      this.Profile = data;
      console.log(this.Profile)
      this.getUser();
    });
  }

  createChatRoom(type) {
    if (this.createChatRoomSub) {
      this.createChatRoomSub.unsubscribe();
    }
    console.log('this.dataUser',this.dataUser);
    const user = [this.dataUser._id,this.Profile._id];
    console.log('user',user);
    this.createChatRoomSub = this.userService.createChatRoom(user, this.dataUser.username, type).subscribe(data => {
      this.openDetailsWithState(data);
    });
  }

  next() {
    this.showNext = !this.showNext;
  }

  openDetailsWithState(data) {
    const navigationExtras: NavigationExtras = {
      state: {
        user: data
      }
    };
    this.closeModal();
    this.router.navigate(['/tab2/chatroom'], navigationExtras);
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  getUser() {
    this.userService.getUser().subscribe((user: any) => {
      console.log('user', user);
      this.allUser = user;
      const filter = _.filter(user, data => data.username !== this.dataUser.username && data.username !== this.Profile.username);
      this.userFilter = filter;
      this.userGroup.push(this.dataUser.username);
      if (this.dataUser.username === this.Profile.username) {
        this.checkUser = true;
      }
    });
  }

  onInput(ev) {
    console.log(ev.target.value)
    this.val = ev.target.value;

    
}

search() {
  if (this.val && this.val.trim() !== '') {
    this.result = this.allUser.filter((member) => {
      return member.username.toLowerCase() === this.val.toLowerCase();
    })
}
}

  onCancel(ev) {
  }

  addFriend(id) {
    console.log('add!', id);
    console.log(this.Profile)
  }


  check(event, value) {
    if (event.detail.checked === true) {
      this.userGroup.push(value.username);
    } else {
      const index = this.userGroup.indexOf(value.username);
      if (index > -1) {
        this.userGroup.splice(index, 1);
      }
    }
  }

  createGroup() {
    if (this.createChatRoomSub) {
      this.createChatRoomSub.unsubscribe();
    }
    this.userGroup.push(this.Profile.username);
    this.createChatRoomSub = this.userService.createChatRoom(this.userGroup, this.userGroup.toString(), 'group').subscribe(data => {
      this.openDetailsWithState(data);
    });
  }
}
