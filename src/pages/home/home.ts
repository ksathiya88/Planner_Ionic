import {FirebaseProvider} from './../../providers/firebase/firebase';
import {Component} from '@angular/core';
import {ToastController} from 'ionic-angular';
import {NavController} from 'ionic-angular';
import {FirebaseListObservable} from 'angularfire2/database';
import {AlertController} from "ionic-angular";
import {DatePicker} from '@ionic-native/date-picker';
import {AuthService} from './../../providers/auth-service/auth-service';
import {LoginPage} from '../../pages/login/login';
import {Subscription} from 'rxjs';
import {DragulaService} from 'ng2-dragula';
import {Storage} from '@ionic/storage';
import {UserServiceProvider} from './../../providers/user-service/user-service';
import {AngularFireAuth} from 'angularfire2/auth';
import {IDate} from '../../interfaces/interface';
import {Status, Icons} from '../../Enums/enum';
import {PlannerItemComponent} from '../../components/planner-item/planner-item';
import {PlannerItemModalPage} from '../../pages/planner-item-modal/planner-item-modal';
import {ModalController, NavParams} from 'ionic-angular';
import {CalendarComponent} from "../../components/calendar/calendar";
import {PlannerSubTaskComponent} from "../../components/planner-sub-item/planner-sub-item";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  styles: ['.text-input[disabled]{opacity: 1;cursor: pointer;}']
})
export class HomePage {
  //plannerItems: FirebaseListObservable<any[]>;

  $key: string;
  name: string;
  date: IDate;
  priority: number;
  due_days: number;
  status: Status;
  updates: [String];
  newItem: PlannerItemComponent = new PlannerItemComponent();
  PLANNERITEMS = 'PLANNERITEMS';
  plannerItems: Array<PlannerItemComponent> = [];
  filPlannerItems: Array<PlannerItemComponent> = [];
  myDate: Date;
  subscribeObj: any;
  uid: string;
  subs = new Subscription();


  constructor(public modalCtrl: ModalController, public navCtrl: NavController, public afAuth: AngularFireAuth, public storage: Storage,
              private dragulaService: DragulaService, private auth: AuthService, private datePicker: DatePicker,
              public firebaseProvider: FirebaseProvider, public toastCtrl: ToastController, public alertCtrl: AlertController) {
    let curr_date_obj = new Date();
    this.myDate = new Date();
    afAuth.authState.subscribe(user => {
      this.getPlannerItems(user);
    });
    this.subs.add(this.dragulaService.drag("PLANNERITEMS")
      .subscribe(({name, el, source}) => {
        // ...
        console.log("drag" + name + " " + el + " " + source);
      })
    );
    this.subs.add(this.dragulaService.drop("PLANNERITEMS")
      .subscribe(({name, el, target, source, sibling}) => {
        // ...
        console.log("drop" + name + " " + el + " " + source);
        console.log("new PlannerItem" + JSON.stringify(this.filPlannerItems));
        this.filPlannerItems.forEach((item, index) => {
          item.priority = index;
          console.log("index " + index + " " + item.$key);
          this.updateItem(item.$key, {priority: index});
        })


      })
    );
    // some events have lots of properties, just pick the ones you need
    this.subs.add(this.dragulaService.dropModel("PLANNERITEMS")
      // WHOA
      // .subscribe(({ name, el, target, source, sibling, sourceModel, targetModel, item }) => {
        .subscribe(({sourceModel, targetModel, item}) => {
          // ...
          console.log("dropModel" + name + " " + sourceModel + " " + targetModel);
        })
    );


  }

  presentToast() {
    const toast = this.toastCtrl.create({
      message: 'No Items Planned',
      duration: 5000,
      position: 'middle'
    });
    toast.present();
  }

  logout() {
    this.auth.logout();
  }

  presentCalendarModal() {
    let calendarModal = this.modalCtrl.create(CalendarComponent);
    calendarModal.onDidDismiss(data => {
      if (data != null) {
        console.log("dismissed data Calendat" + data);
        this.myDate = new Date(data);
        this.changeDate();
        //console.log("dismissed data11111"+item.$key);
        // console.log("dismissed data11111");

        //this.updateItem(item.$key, {name:data.name,updates:data.updates,completed_percentage:data.completed_percentage});
      }
    });
    calendarModal.present();
  }

  presentPlannerModal(item: PlannerItemComponent) {
    console.log("no1111key" + item.$key);
    console.log("methodmodal" + JSON.stringify(item));
    console.log("methodmodal11111" + JSON.stringify(item));
    let plannerModal = this.modalCtrl.create(PlannerItemModalPage, {item: item});
    plannerModal.onDidDismiss(data => {
      if (data != null) {
        console.log("dismissed data" + JSON.stringify(data));
        console.log("dismissed data11111" + item.$key);
        // console.log("dismissed data11111");

        this.updateItem(item.$key, {
          name: data.name,
          updates: data.updates,
          completed_percentage: data.completed_percentage
        });
      }
    });
    plannerModal.present();
  }

  /**
   * For getting planner items for a particular date
   * also creates a subscription and a subscribe object
   * for myDate
   */
  getPlannerItems(user1) {

    //this.presentProfileModal();

    //let date:string=date;
    console.log("came inside method22222222222" + user1);
    let observable = this.firebaseProvider.getPlannerItems(user1);
    this.subscribeObj = observable.subscribe((items: PlannerItemComponent[]) => {
      items = items.map((dto_obj: any) => {
        return PlannerItemComponent.fromDto(dto_obj);
      })
      //console.log("came inside" + this.myDate.replace(/T.*/,""));
      this.plannerItems = items;
      let curr_obj = this.getDateObject(this.myDate);
      this.filPlannerItems = [];
      console.log(JSON.stringify(items) + "----" + JSON.stringify(curr_obj));
      let plannerItems = this.filterPlannerItem(items, curr_obj);
      //this.filterPlannerItem = this.filterPlannerItem(items, curr_obj);
      this.filPlannerItems = this.mapPlannerItem(plannerItems, curr_obj)
        .sort((item1: PlannerItemComponent, item2: PlannerItemComponent) => {
          return item2.due_days - item1.due_days;
        })
      this.filPlannerItems = this.filPlannerItems.sort((item1: PlannerItemComponent, item2: PlannerItemComponent) => {
        return item1.priority - item2.priority;
      });


      console.log("PlannerItems", this.filPlannerItems);
      if (this.filPlannerItems.length <= 0) {
        console.log("Toast11111111111");
        this.presentToast();
      }
      console.log(JSON.stringify(this.filPlannerItems));
    })
  }

  filterPlannerItem(items: PlannerItemComponent[], curr_date_obj: IDate): PlannerItemComponent[] {
    return items.filter((item) => {
      let present_date_obj = this.getCurrentDateObj();
      console.log("aa" + new Date(item.date.year + "-" + item.date.month + "-" + item.date.date).getTime());
      console.log("bb" + new Date(curr_date_obj.year + "-" + curr_date_obj.month + "-" + curr_date_obj.date).getTime());
      if (new Date(item.date.year + "-" + item.date.month + "-" + item.date.date).getTime() ==
        new Date(curr_date_obj.year + "-" + curr_date_obj.month + "-" + curr_date_obj.date).getTime()) {
        console.log("Pushing item" + JSON.stringify(item));
        return true;
      } else if ((new Date(item.date.year + "-" + item.date.month + "-" + item.date.date).getTime() <
        new Date(curr_date_obj.year + "-" + curr_date_obj.month + "-" + curr_date_obj.date).getTime()) && (item.status != Status.COMPLETED)
        && (new Date(curr_date_obj.year + "-" + curr_date_obj.month + "-" + curr_date_obj.date).getTime() ==
          new Date(present_date_obj.year + "-" + present_date_obj.month + "-" + present_date_obj.date).getTime())) {
        console.log("Pushing item11111" + JSON.stringify(item));
        return true;
      } else {
        return false;
      }
    });

  }


  getDays(date1: Date, date2: Date) {

    console.log("Comparing" + date1 + "-" + date2);
    let timeDiff = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  mapPlannerItem(items: PlannerItemComponent[], curr_date_obj: IDate): PlannerItemComponent[] {
    return items.map((item) => {
      if (item.status != Status.COMPLETED) {
        item.due_days = this.getDays(new Date(item.date.year + "-" + item.date.month + "-" + item.date.date),
          new Date(curr_date_obj.year + "-" + curr_date_obj.month + "-" + curr_date_obj.date));
      } else {
        item.due_days = -20;
      }
      return item;
    })
  }


  addItem() {
    let newItem = this.newItem;
    this.newItem = new PlannerItemComponent();
    this.newItem.name = "";
    console.log("item name1111" + newItem.name);
    console.log("item name 3333 " + this.newItem.name);
    newItem.date = this.getDateObject(this.myDate);
    newItem.status = Status.CREATED;
    newItem.priority = 1;
    newItem.updates = [];
    newItem.completed_percentage = 0;
    newItem.subtasks = [];
    console.log("new Item" + JSON.stringify(newItem));
    this.firebaseProvider.addPlannerItem(newItem);
  }

  removeItem(id, itemKey?: string) {
    if (itemKey)
      this.firebaseProvider.removeSubItem(itemKey, id);
    else
      this.firebaseProvider.removeItem(id);
  }

  updateItem(id, changedObj) {
    this.firebaseProvider.updatePlannerItem(id, changedObj);
  }

  updateSubTaskItem(itemKey, id, changedObj) {
    this.firebaseProvider.updateSubPlannerItem(itemKey, id, changedObj);
  }


  updateCompleted(event: Event, id, itemkey?: string) {
    console.log("sub task key" + id);
    event.stopPropagation();

    const alert = this.alertCtrl.create({
      title: 'Move to Completed',
      subTitle: 'Are you sure?',
      message: 'Are you sure you want to move it to Completed?',
      buttons: [
        {
          text: 'Yes, go ahead',
          handler: () => {
            if (itemkey)
              this.updateSubTaskItem(itemkey, id, {completed_percentage: 100, status: Status.COMPLETED})
            else
              this.updateItem(id, {completed_percentage: 100, status: Status.COMPLETED, priority: 100});
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

  moveCurrent() {
    this.myDate = new Date();
    this.changeDate();
  }

  changeDate() {
    console.log("cames inside changeDate" + this.myDate);
    this.subscribeObj.unsubscribe();
    this.getPlannerItems(this.auth.UserObj);
  }

  getCurrentDateObj(): IDate {
    //let date = this.truncateDate(new Date().toISOString());
    return this.getDateObject(new Date());
  }

  truncateDate(date: string): string {
    return date.replace(/T.*/, "");
  }


  /**
   * returns the Date Object(IDate) for the provided
   * date
   * @param date
   */
  getDateObject(date: Date): IDate {
    // let date_split = date.split("/");
    let current_year = date.getFullYear().toString();
    let current_month = (date.getMonth() + 1).toString();
    let current_date = date.getDate().toString();

    var dd = {"date": current_date, "month": current_month, "year": current_year};
    console.log("date---", dd, new Date(dd.year + "-" + dd.month + "-" + dd.date));
    return dd;
  }


  isCompleted(item: PlannerItemComponent | PlannerSubTaskComponent): boolean {
    console.log("item888888", item)
    return item.status === Status.COMPLETED;
  }

  isDueDateToday(item: PlannerItemComponent): boolean {
    return item.due_days === 0;
  }

}
