import { Component } from '@angular/core';
import {IPlannerItem,IDate } from '../../interfaces/interface';
import {Status }  from '../../Enums/enum';
/**
 * Generated class for the PlannerItemComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'planner-item',
  templateUrl: 'planner-item.html'
})
export class PlannerItemComponent implements IPlannerItem  {

  $key:string;
  name: string;
  date: IDate;
  priority: number;
  due_days: number;
  status: Status;
  updates:Array<string>=[];
  

  constructor() {
    console.log('Hello PlannerItemComponent Component');
    //this.text = 'Hello World';
  }

  public static fromDto(dto_obj:any){
    let plannerObj = new PlannerItemComponent();
    plannerObj.$key = dto_obj.$key;
    plannerObj.name= dto_obj.name;
    plannerObj.date = dto_obj.date;
    plannerObj.priority = dto_obj.priority;
    plannerObj.due_days =dto_obj.due_days;
    plannerObj.status = dto_obj.status;
    plannerObj.updates = dto_obj.updates;
    return plannerObj;
  }


}
