import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from "rxjs/Rx";
import { AuthService } from './../../providers/auth-service/auth-service';
import { Storage } from '@ionic/storage';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class FirebaseProvider {
 
  uid:string;
  constructor(public afd: AngularFireDatabase ,public afAuth: AngularFireAuth,private auth: AuthService,private storage:Storage) { 



      afAuth.authState.subscribe(user => {

        this.uid=user.uid; 
     
           });
  }
 
  getPlannerItems(user:any) {
  //  this.afAuth.authState.subscribe(user => {
    console.log("firebase22222");
    console.log("firebaseuid-method:"+user.uid);
    return this.afd.list('/plannerItems'+'-'+user.uid+'/') ;
  //  });
  }
 
  addPlannerItem(name) {
    this.afd.list('/plannerItems'+'-'+this.uid+'/').push(name);
    this.afd.list('/plannerItems'+'-'+this.uid+'/').update
  }
 
  removeItem(id) {
    this.afd.list('/plannerItems'+'-'+this.uid+'/').remove(id);
  }

  updatePlannerItem(id,changedObj){
    this.afd.list('/plannerItems'+'-'+this.uid+'/').update(id,changedObj);
  }
}