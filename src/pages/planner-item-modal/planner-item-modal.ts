import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {PlannerItemComponent} from '../../components/planner-item/planner-item';
import { ModalController, ViewController } from 'ionic-angular';
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
  item_updates:Array<string>;
  item_comp_percentage:number;
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl:ViewController) {
    console.log('Planner Item Object', JSON.stringify(navParams.get('item')));

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
    this.item_updates = this.item.updates;
    this.item_comp_percentage = this.item.completed_percentage;
  }


  addUpdate(){
    console.log("new Updates"+this.newUpdate);
    this.item_updates.push(this.newUpdate);
  }


  dismiss() {
    // let data = { 'foo': 'bar' };
    // console.log("viewctrl"+data);
    // this.viewCtrl.dismiss(data);
    this.item.name=this.item_name;
    this.item.updates=this.item_updates;
    this.item.completed_percentage=this.item_comp_percentage;
    console.log("model"+JSON.stringify(this.item));
    console.log(this.item.completed_percentage);
    this.viewCtrl.dismiss(this.item);
  }

}
