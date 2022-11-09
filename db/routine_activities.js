/* eslint-disable no-useless-catch */
const client = require("./client");

//NEW
async function getRoutineActivityById(id) {
  try {
    const {
      rows: [routine_activity],
    } = await client.query(`
  SELECT *
  FROM routine_activities
  WHERE id = ${id}`);

    if (!routine_activity) {
      return null;
    }

    return routine_activity;
  } catch (error) {
    throw error;
  }
}

async function addActivityToRoutine({
  routineId,
  activityId,
  duration,
  count,
}) {
  try {
    const {
      rows: [routine_activity],
    } = await client.query(
      `
      INSERT INTO routine_activities("routineId", "activityId", duration, count)
      VALUES ($1, $2, $3, $4 )
      ON CONFLICT ("routineId", "activityId") DO NOTHING
      RETURNING *;
      `,
      [routineId, activityId, duration, count]
    );
    return routine_activity;
  } catch (error) {
    throw error;
  }
}

//NEW
async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const { rows: routine_activity } = await client.query(`
    SELECT id
    FROM routine_activities
    WHERE "routineId" = ${id}`);

    return routine_activity;
  } catch (error) {
    throw error;
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  try {
    if (setString.length > 0) {
      await client.query(
        `
          UPDATE routine_activity
          SET ${setString}
          WHERE id=${id}
          RETURNING *
          `,
        Object.values(fields)
      );
    }

    return getRoutineActivityById(id);
  } catch (error) {
    throw error;
  }
}

async function destroyRoutineActivity(id) {

  try {
    await client.query(`
    DELETE
    FROM routine_activity
    WHERE id=${id}
    `);

  } catch (error) {
    throw error;
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
