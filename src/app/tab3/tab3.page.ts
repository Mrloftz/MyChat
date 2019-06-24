import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NavController, AlertController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { UserServiceService } from '../service/user-service.service';
import * as _ from 'underscore';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  searchBarOpened = false;
  timelines: any;
  startComment = false;
  Myprofile: any;
  lng: any;
  lat: any;
  dataUser: any;
  private geoCoder;
  address: { 'formatted_address': any; 'city': any; };

  constructor(
    private http: HttpClient,
    public nvCT: NavController,
    public userService: UserServiceService,
    private geolocation: Geolocation,
    private route: ActivatedRoute,
    private router: Router,
    public alertController: AlertController
  ) {
  }
  async ngOnInit() {
    await this.getProfile();
    await this.getLocation();
    this.getTimeline();

  }

  async getTimeline() {
    this.dataUser = { _id: sessionStorage.getItem('refChatroom'), location: [this.lat, this.lng] };
    return this.http
      .post(environment.api + '/timeline/gettimeline', this.dataUser)
      .subscribe((res: any) => {
        console.log(res);
        this.timelines = res;
        console.log('getTimeLine', this.timelines);

      });
  }

  clickNoti() {
    console.log('Notification!');
  }
  getLocation() {
    this.geolocation.getCurrentPosition().then((resp: any) => {
      console.log(resp.coords.latitude, resp.coords.longitude);
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      this.getTimeline();
    });
  }
  // checkLocation(timelines) {
  //   const gps = timelines.location[0];
  //   if (this.measure(gps.lat, gps.lng, this.lat, this.lng) > gps.radius) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }
  // measure(lat1, lon1, lat2, lon2) {
  //   const R = 6378.137; // Radius of earth in KM
  //   const dLat = (lat2 * Math.PI) / 180 - (lat1 * Math.PI) / 180;
  //   const dLon = (lon2 * Math.PI) / 180 - (lon1 * Math.PI) / 180;
  //   const a =
  //     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //     Math.cos((lat1 * Math.PI) / 180) *
  //     Math.cos((lat2 * Math.PI) / 180) *
  //     Math.sin(dLon / 2) *
  //     Math.sin(dLon / 2);
  //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //   const d = R * c;
  //   return d * 1000; // meters
  // }
  getProfile() {
    this.userService.getProfile().subscribe(
      (data: any) => {
        console.log(data);
        this.Myprofile = data;
      },
      error => {
        console.log('error', error);
      }
    );
  }
  clickLike(timelines) {
    const check = _.indexOf(timelines.likes, this.Myprofile.username);
    let newlike = '';
    if (check !== -1) {
      newlike = _.without(timelines.likes, this.Myprofile.username);
      timelines.likes = newlike;
    } else {
      timelines.likes.push(this.Myprofile.username);
    }

    console.log(' timelines', timelines);

    return this.http
      .post(environment.api + '/timeline/getUpdateLikes/', { _id: timelines._id, likes: timelines.likes })
      .subscribe(
        (data: any) => {
        },
        error => {
          console.log('error', error.error);
        }
      );
  }
  deleteComment(timeline, index) {
    console.log(timeline, index);
    timeline.comment[index] = 0;
    const list = _.without(timeline.comment, 0);
    timeline.comment = list;
    console.log(timeline)
    return this.http
      .post(environment.api + '/timeline/getUpdateLikes/', timeline)
      .subscribe(
        (data: any) => {
        },
        error => {
          console.log('error', error.error);
        }
      );
  }
  clickComment(timelines) {
    this.startComment = true;
  }
  openComment(timeline) {
    if (timeline.open === undefined) {
      timeline.open = true;
    } else {
      timeline.open = !timeline.open;
    }
  }
  sendMessage(messages, timeline) {
    timeline.comment[timeline.comment.length] = {
      name: this.Myprofile.username,
      message: messages
    };
    console.log('sendMessage', messages, timeline);

    return this.http
      .post(environment.api + '/timeline/getUpdateLikes/', {_id:timeline._id, comment: timeline.comment })
      .subscribe(
        (data: any) => {
        },
        error => {
          console.log('error', error.error);
        }
      );
  }

  async clickMore(tmp) {
    console.log('tmp', tmp.refuser, this.Myprofile._id);
    if (tmp.refuser === this.Myprofile._id) {
      this.Mytimelinealert(tmp);
    } else {
      this.otherlinealert();
    }
  }

  async Mytimelinealert(tmp) {
    const tmp2 = tmp;
    const str = tmp.pin === 1 ? 'unpin' : 'pin';
    const flc = tmp.pin === 1 ? 0 : 1;
    tmp2['flc'] = 1;
    const alert = await this.alertController.create({
      header: 'option',
      buttons: [
        {
          text: 'edit',
          cssClass: 'timeline',
          handler: (blah) => {
            const navigationExtras: NavigationExtras = {
              state: {
                user: tmp2
              }
            };
            this.router.navigate(['/createtimeline'], navigationExtras);

          }
        }, {
          text: 'delete',
          cssClass: 'timeline',
          handler: () => {
            return this.http
              .post(environment.api + '/timeline/deleteTimeline', { _id: tmp._id })
              .subscribe(res => {
                this.getTimeline();
              });
          }
        }, {
          text: str,
          cssClass: 'timeline',
          handler: (blah) => {
            return this.http
              .post(environment.api + '/timeline/getUpdateLikes', { _id: tmp._id, pin: flc })
              .subscribe(res => {
                console.log(res); this.getTimeline();
              });
          }
        }
      ]
    });

    await alert.present();
  }
  async otherlinealert() {
    const alert = await this.alertController.create({
      message: 'this not youe broadcast.',
    });

    await alert.present();
  }
  onSearch(event) {
    console.log(event.target.value);
  }
}
