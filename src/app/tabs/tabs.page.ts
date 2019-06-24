import { Component } from '@angular/core';
import { SocketService, Event } from '../service/socket.service';
import { UserServiceService } from '../service/user-service.service';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private socket: SocketService, private userService: UserServiceService, private push: Push) {
    this.socket.onEvent(Event.CONNECT).subscribe(() => {
      console.log('socket on connect');

      this.userService.getProfile().subscribe((profile: any) => {
        this.socket.addUser(profile._id);
      });
    });

    // to initialize push notifications
    const options: PushOptions = {
      android: {},
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      },
      windows: {},
      browser: {
        pushServiceURL: 'http://push.api.phonegap.com/v1/push'
      }
    };
    console.log('Login');
    const pushObject: PushObject = this.push.init(options);

    pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));

    pushObject.on('registration').subscribe((registration: any) => {

      console.log('registration Device', registration);

      this.userService.fcmToken(registration.registrationId).subscribe((data) => {
      });

    }
    );

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));

  }



}
