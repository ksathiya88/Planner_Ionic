import { Component } from '@angular/core';
import {IPlannerItem, IDate, IPlannerSubTaskItem} from '../../interfaces/interface';
import {Status }  from '../../Enums/enum';
import {PlannerSubTaskComponent} from "../planner-sub-item/planner-sub-item";
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
  description:string;
  status: Status;
  subtasks:Array<PlannerSubTaskComponent>=[];
  updates:Array<string>=[];
  completed_percentage:number=0;


  constructor() {
    console.log('Hello PlannerItemComponent Component');
    //this.text = 'Hello World';
  }

  public static fromDto(dto_obj:IPlannerItem){
    let plannerObj = new PlannerItemComponent();
    plannerObj.$key = dto_obj.$key;
    plannerObj.name= dto_obj.name;
    plannerObj.date = dto_obj.date;
    plannerObj.priority = dto_obj.priority;
    plannerObj.due_days =dto_obj.due_days;
    plannerObj.status = dto_obj.status;
    plannerObj.description = dto_obj.description;

    //plannerObj.updates = dto_obj.updates;
    plannerObj.completed_percentage = dto_obj.completed_percentage;
    //plannerObj.sub_tasks = dto_obj.sub_tasks;
    if (dto_obj.subtasks) {
      console.log("subtasks1111111111111",dto_obj.subtasks);
      for( var key in dto_obj.subtasks) {
        console.log("subtasks11111111111113333333",key);
        plannerObj.subtasks.push(PlannerSubTaskComponent.fromDTO(dto_obj.subtasks[key],key));
      };
    }

    return plannerObj;
  }


}
