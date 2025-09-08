import { pg } from './dbConnection.ts';

async function main() {
  try {

    //CREATE ACTIIVITIES
    await pg`CREATE TABLE IF NOT EXISTS activities (
      activity_id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      description TEXT NOT NULL,
      location TEXT NULL,
      started_at TIMESTAMP NULL,
      finished_at TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;

    //CREATE USERS
    await pg`CREATE TABLE IF NOT EXISTS users (
      user_id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      subscription_ends TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;

    //Insert 4 sample activities

/*     await pg`INSERT INTO activities (description, location, started_at, finished_at) VALUES
      ('Morning jog in the park', 'Central Park', '2024-01-15 07:30:00+00', '2024-01-15 08:15:00+00'),
      ('Team meeting to discuss project timeline', 'Office Conference Room', '2024-01-15 10:00:00+00', '2024-01-15 11:30:00+00'),
      ('Grocery shopping for weekly supplies', 'Local Supermarket', '2024-01-15 17:00:00+00', NULL),
      ('Reading technical documentation', 'Home Office', NULL, NULL);`; */

    console.log('Schema and sample data created successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

main();
