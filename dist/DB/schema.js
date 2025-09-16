var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { pool } from "./nodePG/dbConnection";
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield pool.query(`
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
        }
        catch (error) {
            console.error('Error setting up database:', error);
        }
    });
}
main();
