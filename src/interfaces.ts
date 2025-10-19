export interface IActivity {
  user_id?: string //FOREIGN KEY
  activity_id?: string; // SERIAL PRIMARY KEY (optional for creation)
  description: string; // TEXT NOT NULL
  location?: string ; 
  startedAt?: Date ; // TIMESTAMP NULL
  finishedAt?: Date ; // TIMESTAMP NULL
  created_at?: Date; // TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  updated_at?: Date; // TIMESTAMP DEFAULT CURRENT_TIMESTAMP
}

// Add a database response interface
export interface DBActivity {
  user_id: string;
  activity_id: string;
  description: string;
  location: string | null;
  started_at: Date | null;
  finished_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface ILoginUser{
  email:string,   //unique
  password:string, //not null
}

export interface IUser extends ILoginUser{
  name:string,     //not null
}

export interface DBUser extends IUser{
  //db specific
  user_id: string  //primary key
  active:boolean, //default 1 not null
  created_at:Date, //timestamp not null
  updated_at:Date, //timestamp
  expiration_date:Date|null 
  roles:string  //not null
  OTP:string|null
  buffer:string|null
}

export interface IPreventive{
  preventiveID:number,
  sub_area_id:number,
  description:string,
  denomination:number,
  periodicity:number,

}

export interface IOrder{
  order_id:number,
  user_id:string,
  status:string,
  creation_date:string,
  finished_date:string,
  notes:string,
  sub_area_id:number
}