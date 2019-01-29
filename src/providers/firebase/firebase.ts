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
    console.log("add object",JSON.stringify(name));
    this.afd.list('/plannerItems'+'-'+this.uid+'/').push(name);
    this.afd.list('/plannerItems'+'-'+this.uid+'/').update;
  }

  addSubTaskItem(itemKey,item){
    console.log("itemKey",itemKey);
    this.afd.list('/plannerItems'+'-'+this.uid+`/${itemKey}/subtasks`).push(item);
    this.afd.list('/plannerItems'+'-'+this.uid+`/${itemKey}/subtasks`).update;
  }

  removeItem(id) {
    this.afd.list('/plannerItems'+'-'+this.uid+'/').remove(id);
  }

  removeSubItem(itemKey,id) {
    this.afd.list('/plannerItems'+'-'+this.uid+`/${itemKey}/subtasks`).remove(id);
  }

  updatePlannerItem(id,changedObj){
    console.log("uid-key",id);
    this.afd.list('/plannerItems'+'-'+this.uid+'/').update(id,changedObj);
  }

  updateSubPlannerItem(itemKey,id,changedObj){
    this.afd.list('/plannerItems'+'-'+this.uid+`/${itemKey}/subtasks`).update(id,changedObj);
  }

}
