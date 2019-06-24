import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NavigationExtras, Router } from '@angular/router';
import { UserServiceService } from '../service/user-service.service';

@Component({
  selector: 'app-creategroup',
  templateUrl: './creategroup.page.html',
  styleUrls: ['./creategroup.page.scss'],
})
export class CreategroupPage implements OnInit {

  groupName: string;
  user = [];
  createChatRoomSub: any;
  userGroup = [];
  profile: any;
  userCheck = [];

  constructor(public userService: UserServiceService, private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.getProfile();
    this.getUser();
  }

  getProfile() {
    this.userService.getProfile().subscribe(data => {
      this.profile = data;
      console.log(this.profile);
    });
  }

  getUser() {
    this.userService.getUser().subscribe((data: any) => {
      this.user = data;
      console.log('user', this.user);
    });
  }

  openDetailsWithState(data) {
    const navigationExtras: NavigationExtras = {
      state: {
        user: data
      }
    };
    this.router.navigate(['/tab2/chatroom'], navigationExtras);
  }

  onInput(ev: any) {
    this.groupName = ev.target.value;
}

check(event, value) {
  if (event.detail.checked === true) {
    this.userGroup.push(value._id);
    this.userCheck.push(value.username);
  } else {
    const index = this.userGroup.indexOf(value._id);
    const indaexC = this.userCheck.indexOf(value.username)
    if (index > -1) {
      this.userGroup.splice(index, 1);
      this.userCheck.splice(indaexC, 1);
    }
  } 
}

createGroup() {
  if (this.createChatRoomSub) {
    this.createChatRoomSub.unsubscribe();
  }
  this.userGroup.push(this.profile._id);
  this.userService.createChatRoom(this.userGroup, this.groupName, 'group').subscribe(data => {
    this.openDetailsWithState(data);
  });
}

}
