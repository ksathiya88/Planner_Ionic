import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading, IonicPage } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import {HomePage} from '../../pages/home/home';
import {RegisterPage} from '../../pages/register/register';

import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {
  loading: Loading;
  registerCredentials = { email: '', password: '' };
 
  constructor(private nav: NavController, private storage:Storage,private auth: AuthService, private alertCtrl: AlertController, private loadingCtrl: LoadingController) { }
 
  public createAccount() {
    this.nav.push(RegisterPage);
  }
 
  public login() {
    console.log("Entered login Page");
    this.showLoading()
    this.auth.login(this.registerCredentials).then((allowed) => {
      console.log("Allowed"+allowed);
      // if (allowed) {        
     // this.storage.set('uid', allowed);  
      this.nav.push(HomePage);
      // } else {
      //   this.showError("Access Denied");
      // }
    },
      error => {
        console.log("error111111"+error);
        this.showError(error);
      });
  }
 
  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }
 
  showError(text) {
    console.log("error111111222"+text);
    this.loading.dismiss();
 
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }
}