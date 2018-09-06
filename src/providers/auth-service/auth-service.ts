import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import AuthProvider = firebase.auth.AuthProvider;


export class User {
  name: string;
  email: string;

  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}

@Injectable()
export class AuthService {

  private user: firebase.User;
  public currentUser :firebase.User;

  constructor(public afAuth: AngularFireAuth) {

    console.log("user11111"+JSON.stringify(afAuth.auth.currentUser));
    this.currentUser = afAuth.auth.currentUser;
    //this.user=afAuth.auth.currentUser;
   // afAuth.auth.currentUser 
    afAuth.authState.subscribe(user => {
      console.log("Authenticated User" + JSON.stringify(user));
      this.user = user;
    });
  }

  isLoggedIn() {
    if (this.user == null) {
      return false;
    }
    return true;
  }

  public get UserObj():firebase.User {
     return this.user;
  }

  public login(credentials) {
    console.log('Sign in with email');
    return this.afAuth.auth.signInWithEmailAndPassword(credentials.email,
      credentials.password);
  }

  public register(credentials) {
    return this.afAuth.auth.createUserWithEmailAndPassword(credentials.email,
      credentials.password);
  }


  public logout() {
    return this.afAuth.auth.signOut();
  }
}