/* eslint-disable no-useless-catch */
const client = require("./client");
const { getRoutineById } = require("./routines");

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
          UPDATE routine_activities
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

//NEW, NOT WORKING YET
async function destroyRoutineActivity(id) {

  console.log(id, "this is id")


  try {
    await client.query(`
    DELETE
    FROM routine_activities
    WHERE id=${id}
    RETURNING *
    `);
  } catch (error) {
    throw error;
  }


}

//NEW
async function canEditRoutineActivity(routineActivityId, userId) {
  try {
    //Identifies which routine activity matches the id being passed into the function
    const selectedRoutineActivity = await getRoutineActivityById(
      routineActivityId
    );

    //Take the key of routineId from the routineActivity object
    let routineId = selectedRoutineActivity.routineId;

    //Identifies which routine matches the routineId found
    //Imported the function from "./routines"
    let routine = await getRoutineById(routineId);

    //Takes the key of creatorId from the routine object
    let creatorId = routine.creatorId;

    //Checks to see if the creatorId from the routine matches the userId passed into the function. If it matches, then it returns true, otherwise it returns false.
    if (creatorId === userId) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return error;
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
