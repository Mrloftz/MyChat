import {Component} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Push, PushObject, PushOptions} from '@ionic-native/push/ngx';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent {

    public appMenu = [
        {
          title: 'Friend',
          url: '/home/tab1',
          icon: 'person'
        },
        {
          title: 'Chat',
          url: '/home/tab2',
          icon: 'chatbubbles'
        },

        {
            title: 'Settings',
            url: '/settings',
            icon: 'settings'
          }
      ];
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private push: Push
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();

            if (this.platform.is('cordova')) {
                // This will only print when on cordova
                console.log('I am an cordova device!');

            }


        });
    }
}
