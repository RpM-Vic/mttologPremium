import { generateId } from "../../helpers/generateId";
import { IActivity, DBActivity } from "../../interfaces";
import { pool } from "./dbConnection";

export async function getAllActivities(): Promise<DBActivity[]> {
  const { rows } = await pool.query<DBActivity>("SELECT * FROM activities");
  return rows;
}

export async function getAllActivitiesFromOneUser(user_id: string): Promise<DBActivity[]> {
  const { rows } = await pool.query<DBActivity>(`
    SELECT * FROM activities
    WHERE user_id = $1;
  `, [user_id]);
  return rows;
}

export async function deleteAllActivitiesFromOneUser(user_id: string): Promise<DBActivity[]> {
  const { rows } = await pool.query<DBActivity>(`
    DELETE FROM activities
    WHERE user_id = $1
    RETURNING *;
  `, [user_id]);
  return rows;
}

export async function createActivities(user_id: string, activities: IActivity[]): Promise<DBActivity[]> {
  if (activities.length === 0) return [];

  const values: any[] = [];
  const valuePlaceholders: string[] = [];
  
  activities.forEach((activity, index) => {
    const baseIndex = index * 6;
    values.push(
      user_id,
      generateId(),
      activity.description,
      activity.location ?? null,
      activity.startedAt ?? null,
      activity.finishedAt ?? null
    );
    valuePlaceholders.push(`($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5}, $${baseIndex + 6})`);
  });

  const query = `
    INSERT INTO activities (user_id, activity_id, description, location, started_at, finished_at)
    VALUES ${valuePlaceholders.join(', ')}
    RETURNING *;
  `;

  const { rows } = await pool.query<DBActivity>(query, values);
  return rows;
}