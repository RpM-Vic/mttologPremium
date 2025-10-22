import { hashSync } from "@node-rs/bcrypt";
import { generateId } from "../../helpers/generateId.js";
import { pool } from "./dbConnection.js";
export async function getAllUsers() {
    const query = 'SELECT * FROM users ';
    const result = await pool.query(query);
    return result.rows || null;
}
export async function getUserByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
}
export async function getUserById(user_id) {
    const query = 'SELECT * FROM users WHERE user_id = $1';
    const result = await pool.query(query, [user_id]);
    return result.rows[0] || null;
}
export async function createUser(user) {
    const query = `
    INSERT INTO users (
      user_id, name, email, password, active, 
      expiration_date, roles, OTP, buffer
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *;
  `;
    const passwordHashed = hashSync(user.password);
    const values = [
        generateId(),
        user.name,
        user.email,
        passwordHashed,
        1, //default 1 active
        null, //expiration
        "user", //role default "user"
        null, //OTP
        null //buffer
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
}
