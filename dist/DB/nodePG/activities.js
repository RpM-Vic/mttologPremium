import { generateId } from "../../helpers/generateId.js";
import { pool } from "./dbConnection.js";
export async function getAllActivities() {
    const { rows } = await pool.query("SELECT * FROM activities");
    return rows;
}
export async function getAllActivitiesFromOneUser(user_id) {
    const { rows } = await pool.query(`
    SELECT * FROM activities
    WHERE user_id = $1;
  `, [user_id]);
    return rows;
}
export async function deleteAllActivitiesFromOneUser(user_id) {
    const { rows } = await pool.query(`
    DELETE FROM activities
    WHERE user_id = $1
    RETURNING *;
  `, [user_id]);
    return rows;
}
export async function createActivities(user_id, activities) {
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
    const { rows } = await pool.query(query, values);
    return rows;
}
