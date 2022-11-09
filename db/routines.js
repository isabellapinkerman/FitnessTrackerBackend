/* eslint-disable no-useless-catch */
const { attachActivitiesToRoutines } = require("./activities");
const client = require("./client");

async function getRoutineById(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `SELECT *
      FROM routines
      WHERE id=$1`,
      [id]
    );

    // if (!routine) {
    //   throw {
    //     name: "RoutineNotFoundError",
    //     message: "Routine not found",
    //   };
    // }

    return routine;
  } catch (error) {
    throw error;
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows } = await client.query(`
  SELECT *
  FROM routines`);

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getAllRoutines() {
  try {
    const { rows } = await client.query(`
  SELECT routines.*, users.username AS "creatorName"
  FROM routines
  JOIN users ON routines."creatorId"= users.id
  `);

    const routines = await attachActivitiesToRoutines(rows);
    return routines;
  } catch (error) {
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const routines = await getAllRoutines();

    const userRoutines = routines.filter((routine) => {
      if (routine.creatorName === username) {
        return routine;
      }
    });

    return userRoutines;
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const routines = await getAllRoutines();

    const userRoutines = routines.filter((routine) => {
      if (routine.creatorName === username && routine.isPublic === true) {
        return routine;
      }
    });

    return userRoutines;
  } catch (error) {
    throw error;
  }
}

async function getAllPublicRoutines() {
  try {
    const AllRoutines = await getAllRoutines();

    const publicRoutines = AllRoutines.filter((routine) => {
      if (routine.isPublic === true) {
        return routine;
      }
    });

    return publicRoutines;
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const { rows } = await client.query(
      `
  SELECT routines.*, users.username AS "creatorName"
  FROM routines
  JOIN users ON routines."creatorId"= users.id
  JOIN routine_activities ON routines.id = routine_activities."routineId"
  WHERE routines."isPublic" = true
  AND routine_activities."activityId" = $1
  `,
      [id]
    );

    const routines = await attachActivitiesToRoutines(rows);
    return routines;
  } catch (error) {
    throw error;
  }
}

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
    INSERT INTO routines("creatorId", "isPublic", name, goal)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `,
      [creatorId, isPublic, name, goal]
    );

    return routine;
  } catch (error) {
    throw error;
  }
}

//NEW
async function updateRoutine({ id, ...fields }) {
  //setString takes all the keys from object input and sets it in a way that object.query can read it. The index is moved over by 1 for every additional key.
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  //Uncomment below to test it out:
  // console.log(setString, "setString");

  //Try block does NOT check if values have changed. It takes the newer values that are in the fields input then assigns them as new values in the database.
  try {
    if (setString.length > 0) {
      await client.query(
        `
        UPDATE routines
        SET ${setString}
        WHERE id=${id}
        RETURNING *
        `,
        Object.values(fields)
      );
    }

    //This should reflect when you pass the same id into the getRoutineById function.
    return getRoutineById(id);
  } catch (error) {
    throw error;
  }
}


//NEW NOT WORKING YET
async function destroyRoutine(id) {
  try {
    await client.query(`
    DELETE
    FROM routines
    WHERE id=${id}
    RETURNING *
    `);
    //missing delete from routine_activities
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
