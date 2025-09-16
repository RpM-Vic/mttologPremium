import { pool } from "./nodePG/dbConnection";


async function main() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS logs (
        date TIMESTAMP NOT NULL
        level TEXT
        message TEXT
        data TEXT
      )
    `);


  // await  pool.query(`
  //     CREATE TABLE IF NOT EXISTS users (
  //       user_id VARCHAR(255) PRIMARY KEY,
  //       name VARCHAR(255) NOT NULL,
  //       email VARCHAR(255) UNIQUE NOT NULL,
  //       password VARCHAR(255) NOT NULL,
  //       active BOOLEAN NOT NULL DEFAULT TRUE,
  //       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  //       updated_at TIMESTAMP,
  //       expiration_date TIMESTAMP,
  //       roles TEXT NOT NULL DEFAULT 'user',
  //       OTP VARCHAR(6),
  //       buffer TEXT
  //     );
  //   `);

    console.log('Schema created successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

main();
