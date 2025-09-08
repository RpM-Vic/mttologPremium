import { generateId } from "../../helpers/generateId.ts";
import { pg } from "./dbConnection.ts";

export async function getAllActivities(){
  const activities = await pg`SELECT * FROM activities`;
  return activities
}

export async function getAllActivitiesFromOneUser(user_id: string) {
  const result = await pg`
    SELECT * FROM activities
    WHERE user_id = ${user_id};
  `;
  return result; 
}

export async function deleteAllActivitiesFromOneUser(user_id: string) {
  const result = await pg`
    DELETE FROM activities
    WHERE user_id = ${user_id}
    RETURNING *;
  `;
  return result.length; 
}

export async function createActivities(user_id: string, activities: IActivity[]) {
  if (activities.length === 0) return [];

  const rows = activities.map(a => ({
    user_id,
    activity_id: generateId(),
    description: a.description,
    location: a.location ?? null,
    started_at: a.startedAt ?? null,
    finished_at: a.finishedAt ?? null,
  }));

  const result = await pg`
    INSERT INTO activities ${pg(rows)}
    RETURNING *;
  `;

  return result; // array of inserted rows
}
