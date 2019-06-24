import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import {
  NavController,
  ToastController,
  Platform,
  LoadingController,
  AlertController
} from "@ionic/angular";
import { UserServiceService } from "../service/user-service.service";
import { Geolocation } from "@ionic-native/geolocation/ngx";

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  GoogleMapsAnimation,
  MyLocation
} from "@ionic-native/google-maps";
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions
} from "@ionic-native/native-geocoder/ngx";
import { ActivatedRoute, Router, NavigationExtras } from "@angular/router";

import { MouseEvent, MapsAPILoader } from "@agm/core";
declare let google: any;

@Component({
  selector: "app-createboardcast",
  templateUrl: "./createboardcast.page.html",
  styleUrls: ["./createboardcast.page.scss"]
})
export class CreateboardcastPage implements OnInit {
  lat: any;
  lng: any;
  zoom = 5;
  markers: any;
  imageUrl = "/assets/image/upload.png";
  fileUpload: File = null;
  userData: any;
  gps: any;
  public timelineForm = new FormGroup({
    title: new FormControl(),
    detail: new FormControl()
  });
  // map: GoogleMap;
  loading: any;
  checkPL: any;
  polygon = [
    [
      [12.979175270387135, 99.9536946685547],
      [19.10624355, 100.82839966],
      [13.920985020304535, 101.20337710581634],
      [12.979175270387135, 99.9536946685547]
    ],

    [
      [19.062158756422445, 98.31911670859836],
      [18.458809139378236, 98.13179047956498],
      [18.104128119109436, 98.61518891706498],
      [18.83355632536577, 99.82368501081498],
      [19.062158756422445, 98.31911670859836]
    ],

    [
      [6.104883220575549, 101.87899421331213],
      [6.672622072372317, 101.41756843206213],
      [6.934436991737201, 100.71444343206213],
      [6.3888313850713, 100.97811530706213],
      [6.104883220575549, 101.87899421331213]
    ],

    [12.274348578241588, 102.4860132375104],
    [10.810467289289427, 102.0245874562604],
    [10.335277285795222, 100.5084741750104],
    [12.681966566486878, 100.3766382375104],
    [12.274348578241588, 102.4860132375104],

    [
      [12.274348578241588, 102.4860132375104],
      [10.810467289289427, 102.0245874562604],
      [10.335277285795222, 100.5084741750104],
      [12.681966566486878, 100.3766382375104],
      [12.274348578241588, 102.4860132375104]
    ]
  ];

  // polygon = [[19.062158756422445, 98.31911670859836], [18.458809139378236, 98.13179047956498],
  // [18.104128119109436, 98.61518891706498], [18.83355632536577, 99.82368501081498],
  // [19.062158756422445,98.31911670859836]];

  // polygon = [[6.104883220575549, 101.87899421331213], [6.672622072372317, 101.41756843206213],
  // [6.934436991737201, 100.71444343206213], [6.3888313850713, 100.97811530706213],
  // [6.104883220575549,101.87899421331213]];

  // polygon = [[12.274348578241588, 102.4860132375104], [10.810467289289427, 102.0245874562604],
  // [10.335277285795222, 100.5084741750104], [12.681966566486878, 100.3766382375104],
  // [12.274348578241588, 102.4860132375104]];
  managerOptions = {
    drawingControl: true,
    drawingControlOptions: {
      drawingModes: ["polygon"]
    },
    polygonOptions: {
      draggable: true,
      editable: true
    },
    drawingMode: "polygon"
  };
  dataroom: any;

  address: any;
  private geoCoder;
  dataPoll: any;
  flc = false;
  constructor(
    private http: HttpClient,
    public nvCT: NavController,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserServiceService,
    private geolocation: Geolocation,
    private platform: Platform,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private mapsAPILoader: MapsAPILoader,
    public alertController: AlertController
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.dataPoll = this.router.getCurrentNavigation().extras.state.user;
        console.log("dateUser", this.dataPoll);
        this.flc = this.dataPoll.flc;
      }
    });
  }

  async ngOnInit() {
    await this.setform();
    await this.getProfile();
    await this.platform.ready();
    await this.mapApi();
  }
  setform() {
    if (this.flc) {
      console.log("setformsetformsetformsetform", this.dataPoll);
      this.timelineForm = this.formBuilder.group({
        title: [this.dataPoll.title],
        detail: [this.dataPoll.detail, Validators.compose([Validators.required])],
        picture: [this.dataPoll.picture]
      });
    } else {
      this.timelineForm = this.formBuilder.group({
        title: [""],
        detail: ["", Validators.compose([Validators.required])],
        picture: [""]
      });
    }
  }
  mapApi() {
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      // tslint:disable-next-line:new-parens
      this.geoCoder = new google.maps.Geocoder();
    });
  }

  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(resp => {
        // this.lat = 18.7905618;
        // this.lng = 98.9880909;
        this.lat = resp.coords.latitude;
        this.lng = resp.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.lat, this.lng);
      });
    }
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results, status) => {
        console.log(results);
        console.log(status);
        if (status === "OK") {
          if (results[0]) {
            this.zoom = 12;
            this.address = { formatted_address: results[0].formatted_address };
            console.log("mappppppppp", this.address);
          } else {
            window.alert("No results found");
          }
        } else {
          window.alert("No location found");
        }
      }
    );
  }


  getProfile() {
    this.userService.getProfile().subscribe(data => {
      this.userData = data;
    });
  }
  inside(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    // return [point, vs]
    const x = point[0],
      y = point[1];

    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      const xi = vs[i][0],
        yi = vs[i][1];
      const xj = vs[j][0],
        yj = vs[j][1];

      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) {
        inside = !inside;
      }
    }

    return inside;
  }
  onFileSelected(file: FileList) {
    this.fileUpload = file.item(0);
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    };
    reader.readAsDataURL(this.fileUpload);
  }
  Submit() {
    if (this.flc) {
      console.log("setformsetformsetformsetform", this.dataPoll);
      console.log("this.timelineForm", this.timelineForm);
      const userId = this.userData._id;
      let area = [];
      this.polygon.forEach(element => {
        if (this.inside([this.lat, this.lng], element)) {
          area = element;
        }
      });
      const list = {
        id: this.dataPoll._id,
        title: this.timelineForm.value.title,
        detail: this.timelineForm.value.detail,
        picture: this.timelineForm.value.picture,
        refuser: userId,
        location: 'MOK',
        likes: this.dataPoll ? this.dataPoll.like : [],
        comment: this.dataPoll ? this.dataPoll.comment : [],
        refchat: sessionStorage.getItem("refChatroom")
      };
      console.log("updateTimeline", list);
      return this.http
        .post(environment.api + "/Timeline/updateTimeline", list)
        .subscribe(
          (data: any) => {
            this.router.navigate(["/tab2/chatroom"]);
          },
          error => {
            console.log("error", error.error);
          }
        );
    } else {
      this.createTimeline();
    }
  }
  async createTimeline() {
    // const userId = this.userData._id;
    let area = [];
    this.polygon.forEach(element => {
      if (this.inside([this.lat, this.lng], element)) {
        area = element;
      }
    });
    if (this.imageUrl === "/assets/image/upload.png") {
      this.timelineForm.get("picture").setValue("");
    } else {
      const pic = this.imageUrl;
      this.timelineForm.get("picture").setValue(pic);
    }
    const likeList = this.dataPoll && this.dataPoll.like !== undefined ? this.dataPoll.like : [];
    const conmentList = this.dataPoll && this.dataPoll.comment !== undefined ? this.dataPoll.comment : [];
    console.log('area.length > 0', area.length > 0)
    console.log('userData', this.userData)

    if (area.length > 0) {
      const list = {
        title: this.timelineForm.value.title,
        detail: this.timelineForm.value.detail,
        // picture: this.timelineForm.value.picture,
        refuser: this.userData._id,
        pin: 0,
        location: [this.lat, this.lng],
        likes: likeList,
        comment: conmentList,
        refchat: sessionStorage.getItem("refChatroom")
      };
      console.log("getTimeline", list);
      return this.http
        .post(environment.api + "/Timeline/createTimeline", list)
        .subscribe(
          (data: any) => {
            // console.log("datadatadatadata", data);

            this.router.navigate(["/tab2/chatroom"]);
          },
          error => {
            console.log("error", error.error);
          }
        );
    } else {
      const alert = await this.alertController.create({
        message: "You aren't stay in corrent area.",
        buttons: ["OK"]
      });

      await alert.present();
    }
  }
}



// mapClicked($event: MouseEvent) {
  //   this.markers = [];
  //   this.lat = $event.coords.lat;
  //   this.lng = $event.coords.lng;
  //   this.getAddress(this.lat, this.lng);
  //   // this.markers.push({
  //   //   lat: $event.coords.lat,
  //   //   lng: $event.coords.lng
  //   // });
  // }

  // initDrawingManager(map: any) {
  //   const options = {
  //     drawingControl: true,
  //     drawingControlOptions: {
  //       drawingModes: ['polygon']
  //     },
  //     polygonOptions: {
  //       draggable: true,
  //       editable: true,
  //       fillColor: 'red'
  //     },
  //     drawingMode: google.maps.drawing.OverlayType.POLYGON
  //   };
  //   const drawingManager = new google.maps.drawing.DrawingManager(options);
  //   drawingManager.setMap(map);
  // }
  // loadMap() {
  //   this.map = GoogleMaps.create('map_canvas', {
  //     camera: {
  //       target: {
  //         lat: 43.0741704,
  //         lng: -89.3809802
  //       },
  //       zoom: 18,
  //       tilt: 30
  //     }
  //   });
  // }
  // async onButtonClick() {
  //   this.map.clear();
  //   let titletext = '';
  //   this.loading = await this.loadingCtrl.create({
  //     message: 'Please wait...'
  //   });
  //   await this.loading.present();

  //   // Get the location of you
  //   this.map
  //     .getMyLocation()
  //     .then(async (location: MyLocation) => {
  //       this.loading.dismiss();
  //       console.log(JSON.stringify(location, null, 2));

  //       // Move the map camera to the location with animation
  //       this.map.animateCamera({
  //         target: location.latLng,
  //         zoom: 17,
  //         tilt: 30
  //       });
  //       const options: NativeGeocoderOptions = {
  //         useLocale: true,
  //         maxResults: 5
  //       };
  //       console.log(
  //         location.latLng[0],
  //         location.latLng[1],
  //         location.latLng.lat,
  //         location.latLng.lng
  //       );
  //       await this.nativeGeocoder
  //         .reverseGeocode(location.latLng.lat, location.latLng.lng, options)
  //         .then((result: NativeGeocoderResult[]) => {
  //           console.log('titletext2', result[0]);

  //           titletext =
  //             result[0].subThoroughfare +
  //             ' ' +
  //             result[0].thoroughfare +
  //             ' ' +
  //             result[0].subLocality +
  //             ' ' +
  //             result[0].locality +
  //             ' ' +
  //             result[0].subAdministrativeArea +
  //             ' ' +
  //             result[0].administrativeArea +
  //             ' ' +
  //             result[0].postalCode;
  //           console.log('titletext2', titletext);
  //         })
  //         .catch((error: any) => console.log(error));
  //       // add a marker

  //       console.log('titletext3', titletext);

  //       const marker: Marker = this.map.addMarkerSync({
  //         title: titletext,
  //         snippet: 'This plugin is awesome!',
  //         position: location.latLng,
  //         animation: GoogleMapsAnimation.BOUNCE
  //       });
  //       console.log('map', marker);

  //       // show the infoWindow
  //       marker.showInfoWindow();

  //       // If clicked it, display the alert
  //       marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
  //         this.showToast('clicked!');
  //       });
  //     })
  //     .catch(err => {
  //       this.loading.dismiss();
  //       this.showToast(err.error_message);
  //     });
  // }
  // async showToast(message: string) {
  //   const toast = await this.toastCtrl.create({
  //     message,
  //     duration: 2000,
  //     position: 'middle'
  //   });

  //   toast.present();
  // }