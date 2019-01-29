import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {PlannerItemComponent} from '../../components/planner-item/planner-item';
import { ModalController, ViewController } from 'ionic-angular';
import {PlannerSubTaskComponent} from "../../components/planner-sub-item/planner-sub-item";
import {FirebaseProvider} from "../../providers/firebase/firebase";
/**
 * Generated class for the PlannerItemModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-planner-item-modal',
  templateUrl: 'planner-item-modal.html',
})
export class PlannerItemModalPage {
  item:PlannerItemComponent;
  item_name:string;
  newUpdate:string;
  description:string;
  newSubTaskName:string;
  item_updates:Array<string>;
  subTasks:Array<PlannerSubTaskComponent>=[];
  item_comp_percentage:number;
  constructor(public navCtrl: NavController,public firebaseProvider: FirebaseProvider,public navParams: NavParams,public viewCtrl:ViewController) {
    console.log('Planner Item Object', JSON.stringify(navParams.get('item')));
    //this.item = this.navParams.get('item')
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlannerItemModalPage');
    this.item = this.navParams.get('item');
    console.log('Planner Item ObjectDid load', this.item);

    this.item_name = this.item.name;
    if (this.item.updates==undefined){
      console.log("33333333333333");
      this.item.updates=[];
    }
    if (this.item==undefined){
      console.log("33333333333333");
      this.item.updates=[];
    }
    this.subTasks=this.item.subtasks;
    this.description = this.item.description;
    this.item_updates = this.item.updates;
    this.item_comp_percentage = this.item.completed_percentage;
  }


  addUpdate(){
    console.log("new Updates"+this.newUpdate);
    this.item_updates.push('');
  }

  addSubTask() {
    console.log("hello11111");
    let plannersubTask = new PlannerSubTaskComponent();
    plannersubTask.name = this.newSubTaskName;

    console.log("SubTasks",this.item.subtasks);
    this.newSubTaskName='';
    this.item.subtasks.push(plannersubTask);
    console.log("22222",this.item.$key);
    this.firebaseProvider.addSubTaskItem(this.item.$key,plannersubTask);
  }

  dismiss() {
    // let data = { 'foo': 'bar' };
    // console.log("viewctrl"+data);
    // this.viewCtrl.dismiss(data);
    this.item.name=this.item_name;
    this.item.updates=this.item_updates;
    this.item.completed_percentage=this.item_comp_percentage;
    this.item.description = this.description;
    this.item.subtasks=this.subTasks;
    console.log("model"+JSON.stringify(this.item));
    console.log(this.item.completed_percentage);
    this.viewCtrl.dismiss(this.item);
  }

  close(){
    this.viewCtrl.dismiss(this.item);
  }

}
