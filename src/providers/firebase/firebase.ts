import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from "rxjs/Rx";
import { AuthService } from './../../providers/auth-service/auth-service';

@Injectable()
export class FirebaseProvider {
 
  constructor(public afd: AngularFireDatabase ,private auth: AuthService) { }
 
  getPlannerItems() {
    return this.afd.list('/plannerItems'+'-'+this.auth.UserObj.uid+'/') ;
  }
 
  addPlannerItem(name) {
    this.afd.list('/plannerItems'+'-'+this.auth.UserObj.uid+'/').push(name);
    this.afd.list('/plannerItems'+'-'+this.auth.UserObj.uid+'/').update
  }
 
  removeItem(id) {
    this.afd.list('/plannerItems'+'-'+this.auth.UserObj.uid+'/').remove(id);
  }

  updatePlannerItem(id,changedObj){
    this.afd.list('/plannerItems'+'-'+this.auth.UserObj.uid+'/').update(id,changedObj);
  }
}