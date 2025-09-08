import { hashSync } from "@node-rs/bcrypt";
import { pg } from "./dbConnection";

export interface IUser {
  user_id?: string  //primary key
  name: string
  email: string
  password: string
  created_at?: Date; 
  updated_at?: Date; 
  subscription_ends:Date|null //End when it gets created unless he pays, null means he paid forever
}

// Create a new user
export async function createNewUser(
  name: string,
  email: string,
  password: string
): Promise<IUser | null> {
  try {
    const passwordHashed=hashSync(password)
    const [user] = await pg<IUser[]>`
      INSERT INTO activities (id, name, email, password, subscription_ends)
      VALUES (${crypto.randomUUID()}, ${name}, ${email}, ${passwordHashed}, NOW()) 
      RETURNING *;
    `;

    return user ?? null;
  } catch (err) {
    console.error("Error creating user:", err);
    return null;
  }
}

// Get a user by email + password
export async function getUser(
  email: string,
): Promise<IUser | null> {
  try {

    const [user] = await pg<IUser[]>`
      SELECT * FROM activities
      WHERE email = ${email} LIMIT 1;
    `;

    return user ?? null;
  } catch (err) {
    console.error("Error fetching user:", err);
    return null;
  }
}
