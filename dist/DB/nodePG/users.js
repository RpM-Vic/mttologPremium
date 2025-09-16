var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { hashSync } from "@node-rs/bcrypt";
import { generateId } from "../../helpers/generateId.js";
import { pool } from "./dbConnection.js";
export function getAllUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        return null;
    });
}
export function getUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = yield pool.query(query, [email]);
        return result.rows[0] || null;
    });
}
export function createUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
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
        const result = yield pool.query(query, values);
        return result.rows[0];
    });
}
