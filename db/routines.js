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

      const routines = await attachActivitiesToRoutines(rows)
  return routines
    } catch (error) {
      throw error;
    }
}

async function getAllRoutinesByUser({ username }) {}

async function getPublicRoutinesByUser({ username }) {}

async function getAllPublicRoutines() {
  try {
    const AllRoutines = await getAllRoutines()

    const publicRoutines = AllRoutines.filter((routine)=>{
      if(routine.isPublic === true){
        return routine
      }
    })

    return publicRoutines
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByActivity({ id }) {}

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
    // console.log(routine, "this is routine")
    return routine;
  } catch (error) {
    throw error;
  }
}

async function updateRoutine({ id, ...fields }) {

}

async function destroyRoutine(id) {

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
