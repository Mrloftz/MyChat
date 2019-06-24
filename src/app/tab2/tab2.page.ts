import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { UserServiceService } from '../service/user-service.service';
import { SocketService, Event } from '../service/socket.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _ from 'underscore';
import * as moment from 'moment';

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
    public toggled: boolean = false;

    chatRoom: any;
    chatRoomReal = [];
    profile: any;
    checkRooms = true;

    constructor(
        public formBuilder: FormBuilder,
        public nvCT: NavController,
        private router: Router,
        private userService: UserServiceService,
        private socket: SocketService
    ) {
    }

    ngOnInit() {
        console.log('ngOnInit');
        this.userService.getProfile().subscribe((profile: any) => {
            this.profile = profile;
            console.log(this.profile._id);
            this.getChatRoom();
        });
    }

    getTime(time) {
        return moment(time).fromNow();
    }

    public toggle(): void {
        this.toggled = !this.toggled;
    }

    onInput(ev: any) {
        const val = ev.target.value;
        console.log('val', val);
    }

    getChatRoom() {
        this.userService.getChatRoom().subscribe(room => {
            console.log('rooms', room);
            this.chatRoom = room;
            this.chatRoom.forEach(element => {

                if (element.type === 'single') {
                    const filter = _.filter(element.user, data => 
                        data._id !== this.profile._id);
                    element.pairchat = filter;
                    element.badge = '8';
                    this.chatRoomReal.push(element);
                } else {
                    element.badge = '9';
                    this.chatRoomReal.push(element);
                }
            });
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

}
