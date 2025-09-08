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