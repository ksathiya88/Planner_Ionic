import { FirebaseProvider } from './../../providers/firebase/firebase';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FirebaseListObservable } from 'angularfire2/database';
import { AlertController } from "ionic-angular";
import { DatePicker } from '@ionic-native/date-picker';
import { AuthService } from './../../providers/auth-service/auth-service';
import {LoginPage} from '../../pages/login/login';

//import {PlannerItem} from './home.interface'; 

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  //plannerItems: FirebaseListObservable<any[]>;
  newItem: IPlannerItem = {};
  plannerItems: Array<IPlannerItem> = [];
  filPlannerItems: Array<IPlannerItem> = [];
  myDate: string;
  subscribeObj: any;
  uid:string;

  constructor(public navCtrl: NavController, private auth: AuthService,private datePicker: DatePicker, public firebaseProvider: FirebaseProvider, public alertCtrl: AlertController) {
    let curr_date_obj = new Date();
    this.myDate = new Date().toISOString();
    this.getPlannerItems();
    let userObj = this.auth.UserObj;
      //this.username = info['name'];
      //this.email = info['email'];
    this.uid = userObj.uid;  
  }


  public logout() {
    this.auth.logout().subscribe(succ => {
      this.navCtrl.setRoot(LoginPage);
    });
  }


  /**
   * For getting planner items for a particular date
   * also creates a subscription and a subscribe object
   * for myDate
   */
  getPlannerItems() {
    //let date:string=date;
    console.log("came inside method22222222222");
    let observable = this.firebaseProvider.getPlannerItems();
    this.subscribeObj = observable.subscribe((items: IPlannerItem[]) => {
      console.log("came inside" + this.myDate.replace(/T.*/,""));
      this.plannerItems = items;
      let curr_obj = this.getDateObject(this.myDate.replace(/T.*/,""));
      this.filPlannerItems = [];
      console.log(JSON.stringify(items)+"----"+JSON.stringify(curr_obj));
      let plannerItems = this.filterPlannerItem(items, curr_obj);
      this.filPlannerItems = this.mapPlannerItem(plannerItems,new Date(this.myDate.replace(/T.*/,"")))
                       .sort((item1:IPlannerItem,item2:IPlannerItem)=>{
          return  item2.due_days - item1.due_days;
      })
      console.log(JSON.stringify(this.filPlannerItems));
    })
  }

  filterPlannerItem(items: IPlannerItem[], curr_date_obj: IDate): IPlannerItem[] {
    return items.filter((item) => {
      let present_date_obj = this.getCurrentDateObj();
      console.log("aa"+new Date(item.date.year+"-"+item.date.month+"-"+item.date.date).getTime());
      console.log("bb"+new Date(curr_date_obj.year+"-"+curr_date_obj.month+"-"+curr_date_obj.date).getTime());
      if (new Date(item.date.year+"-"+item.date.month+"-"+item.date.date).getTime() ==
        new Date(curr_date_obj.year+"-"+curr_date_obj.month+"-"+curr_date_obj.date).getTime()) {
        console.log("Pushing item" + JSON.stringify(item));
        return true;
      } else if ((new Date(item.date.year+"-"+item.date.month+"-"+item.date.date).getTime() <
        new Date(curr_date_obj.year+"-"+curr_date_obj.month+"-"+curr_date_obj.date).getTime()) && (item.status != Status.COMPLETED) 
        && (new Date(curr_date_obj.year+"-"+curr_date_obj.month+"-"+curr_date_obj.date).getTime()== 
        new Date(present_date_obj.year+"-"+present_date_obj.month+"-"+present_date_obj.date).getTime()) ) {
        console.log("Pushing item11111" + JSON.stringify(item));
        return true;
      } else {
        return false;
      }
    });

  }

  
  getDays(date1: Date, date2: Date) {
    
    console.log("Comparing"+date1+"-"+date2);
    let timeDiff = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  mapPlannerItem(items: IPlannerItem[], curr_date_obj: Date): IPlannerItem[] {
    return items.map((item) => {
      if (item.status != Status.COMPLETED) {
          item.due_days = this.getDays(new Date(item.date.year+"-"+item.date.month+"-"+item.date.date), curr_date_obj);
      }else {
         item.due_days=-20;
      }
      return item;
    })
  }



  addItem() {
    console.log("item name" + this.newItem.name);
    this.newItem.date = this.getDateObject(this.myDate.replace(/T.*/,""));
    this.newItem.status = Status.CREATED;
    this.newItem.priority = 1;
    console.log("new Item" + JSON.stringify(this.newItem));
    this.firebaseProvider.addPlannerItem(this.newItem);
  }

  removeItem(id) {
    this.firebaseProvider.removeItem(id);
  }

  updateItem(id, changedObj) {
    this.firebaseProvider.updatePlannerItem(id, changedObj);
  }

  updateCompleted(id) {

    const alert = this.alertCtrl.create({
      title: 'Move to Completed',
      subTitle: 'Are you sure?',
      message: 'Are you sure you want to move it to Completed?',
      buttons: [
        {
          text: 'Yes, go ahead',
          handler: () => {
            this.updateItem(id, { status: Status.COMPLETED });
          }
        },
        {
          text: 'No, I changed my mind!',
          role: 'cancel',
          handler: () => {
            console.log('Cancelled!');
          }
        }
      ]
    });

    alert.present();

  }

  moveCurrent(){
    this.myDate = new Date().toISOString();
    this.changeDate();
  }

  changeDate() {
    console.log("cames inside changeDate"+this.myDate);
    this.subscribeObj.unsubscribe();
    this.getPlannerItems();
  }

  getCurrentDateObj():IDate {
    let date = this.truncateDate(new Date().toISOString());
    return this.getDateObject(date);
  }

  truncateDate(date:string):string{
      return date.replace(/T.*/,"");
  }


  /**
   * returns the Date Object(IDate) for the provided
   * date
   * @param date 
   */
  getDateObject(date: string): IDate {
    let date_split = date.split("-");
    let current_year = date_split[0];
    let current_month = date_split[1];
    let current_date = date_split[2];
    return { "date": current_date, "month": current_month, "year": current_year };
  }


  isCompleted(item: IPlannerItem): boolean {
    return item.status === Status.COMPLETED;
  }

}

interface IPlannerItem {
  name?: string;
  date?: IDate;
  priority?: number;
  due_days?: number;
  status?: Status;
}


interface IDate {
  date: string;
  month: string;
  year: string;
}

enum Icons {
  NOT_COMPLETED = "md-checkmark-circle-outline",
  COMPLETED = "md-checkmark-circle"
}


enum Status {
  CREATED = "created",
  COMPLETED = "completed",
  PARTIAL_COMPLETED = "partial_completed",
  STARTED = "started"
}