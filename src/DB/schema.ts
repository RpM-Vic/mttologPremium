import { pool } from "./nodePG/dbConnection";

async function main() {
  try {
    //areas: empaque, papa1, papa2, tortilla, extruido, pellet

    //papa subareas
    //subarea papa1: bines arriba, bines abajo, tablero bines, cuarto de inspeccion, rebanadora, 
    //subarea papa2: freidor, condimentador, tablero, cuarto de aceites

    //tortilla subareas: cabezal, horno, freidor, condimentador

    //extruido sub areas:extrusor,horno, condimentador

    //pellet sub areas: freidor, condimentador

    //empaque sub areas:TNA1,2,3,...,10,

    await pool.query(`
      -- AREAS
      CREATE TABLE IF NOT EXISTS areas (
        area_id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE
      );

      -- SUBAREAS (unique per area, not globally)
      CREATE TABLE IF NOT EXISTS sub_areas (
        sub_area_id SERIAL PRIMARY KEY,
        area_id INT NOT NULL REFERENCES areas(area_id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        UNIQUE(area_id, name)
      );

      -- DENOMINATIONS
      CREATE TABLE IF NOT EXISTS denominations (
        denomination_id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE
      );

      -- PERIODICITY
      CREATE TABLE IF NOT EXISTS periodicity (
        periodicity_id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE
      );

      -- PREVENTIVES
      CREATE TABLE IF NOT EXISTS preventives (
        preventive_id SERIAL PRIMARY KEY,
        sub_area_id INT NOT NULL REFERENCES sub_areas(sub_area_id) ON DELETE CASCADE,
        description TEXT NOT NULL,
        denomination_id INT NOT NULL REFERENCES denominations(denomination_id),
        periodicity_id INT NOT NULL REFERENCES periodicity(periodicity_id)
      );

      -- ORDER STATUS ENUM
      DO $$ BEGIN
        CREATE TYPE order_status AS ENUM ('pending', 'finished', 'cancelled');
      EXCEPTION WHEN duplicate_object THEN null; END $$;

      -- ORDERS
      CREATE TABLE IF NOT EXISTS orders (
        order_id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL REFERENCES users(user_id),
        status order_status NOT NULL DEFAULT 'pending',
        creation_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        finished_date TIMESTAMP,
        notes TEXT
      );

      -- ORDER PREVENTIVE STATUS ENUM
      DO $$ BEGIN
        CREATE TYPE order_preventive_status AS ENUM ('pending', 'finished', 'cancelled');
      EXCEPTION WHEN duplicate_object THEN null; END $$;

      -- ORDER_PREVENTIVES (junction table)
      CREATE TABLE IF NOT EXISTS order_preventives (
        order_preventive_id SERIAL PRIMARY KEY,
        order_id INT NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
        preventive_id INT NOT NULL REFERENCES preventives(preventive_id) ON DELETE CASCADE,
        status order_preventive_status NOT NULL DEFAULT 'pending',
        finished_date TIMESTAMP,
        UNIQUE(order_id, preventive_id) -- prevent duplicates
      );

      -- USER ROLE ENUM
      DO $$ BEGIN
        CREATE TYPE user_role AS ENUM ('technician','user', 'admin', 'supervisor','visitor');
      EXCEPTION WHEN duplicate_object THEN null; END $$;

      -- USERS
      CREATE TABLE IF NOT EXISTS users (
        user_id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email CITEXT UNIQUE NOT NULL, -- case-insensitive
        password VARCHAR(255) NOT NULL,
        active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP,
        expiration_date TIMESTAMP,
        role user_role NOT NULL DEFAULT 'visitor',
        otp VARCHAR(6),
        buffer TEXT
      );

      -- INDEXES (important for performance)
      CREATE INDEX IF NOT EXISTS idx_sub_areas_area_id ON sub_areas(area_id);
      CREATE INDEX IF NOT EXISTS idx_preventives_sub_area_id ON preventives(sub_area_id);
      CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
      CREATE INDEX IF NOT EXISTS idx_order_preventives_order_id ON order_preventives(order_id);
      CREATE INDEX IF NOT EXISTS idx_order_preventives_preventive_id ON order_preventives(preventive_id);

    `);


      // await pool.query(`
    //   CREATE TABLE IF NOT EXISTS logs (
    //     date TIMESTAMP NOT NULL
    //     level TEXT
    //     message TEXT
    //     data TEXT
    //   )
    // `);


    console.log('Schema created successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

main();
