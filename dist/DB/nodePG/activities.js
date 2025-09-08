var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { generateId } from "../../helpers/generateId.js";
import { pool } from "./dbConnection.js";
export function getAllActivities() {
    return __awaiter(this, void 0, void 0, function* () {
        const { rows } = yield pool.query("SELECT * FROM activities");
        return rows;
    });
}
export function getAllActivitiesFromOneUser(user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const { rows } = yield pool.query(`
    SELECT * FROM activities
    WHERE user_id = $1;
  `, [user_id]);
        return rows;
    });
}
export function deleteAllActivitiesFromOneUser(user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const { rows } = yield pool.query(`
    DELETE FROM activities
    WHERE user_id = $1
    RETURNING *;
  `, [user_id]);
        return rows;
    });
}
export function createActivities(user_id, activities) {
    return __awaiter(this, void 0, void 0, function* () {
        if (activities.length === 0)
            return [];
        const values = [];
        const valuePlaceholders = [];
        activities.forEach((activity, index) => {
            var _a, _b, _c;
            const baseIndex = index * 6;
            values.push(user_id, generateId(), activity.description, (_a = activity.location) !== null && _a !== void 0 ? _a : null, (_b = activity.startedAt) !== null && _b !== void 0 ? _b : null, (_c = activity.finishedAt) !== null && _c !== void 0 ? _c : null);
            valuePlaceholders.push(`($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5}, $${baseIndex + 6})`);
        });
        const query = `
    INSERT INTO activities (user_id, activity_id, description, location, started_at, finished_at)
    VALUES ${valuePlaceholders.join(', ')}
    RETURNING *;
  `;
        const { rows } = yield pool.query(query, values);
        return rows;
    });
}
