import { Component,OnInit } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { AuthService } from './../providers/auth-service/auth-service';

import { LoginPage } from '../pages/login/login';

import { HomePage } from '../pages/home/home';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  templateUrl: 'app.html'
})
export class MyApp  {
  rootPage:any;
 // @ViewChild(Nav) nav;

  constructor(platform: Platform,statusBar: StatusBar,public afAuth: AngularFireAuth, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      
      console.log("user first"+afAuth.auth.currentUser);
     afAuth.authState.subscribe(user => {
    if (user!=null)
    { 
       this.rootPage = HomePage;
    }else {
      this.rootPage = LoginPage;
    }

       });
    
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }


}

