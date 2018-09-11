
export interface IPlannerItem {
    $key?:string;
    name?: string;
    date?: IDate;
    priority?: number;
    due_days?: number;
    status?: Status;
    updates?:Array<String>,
    
  }
  
  
  export interface IDate {
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