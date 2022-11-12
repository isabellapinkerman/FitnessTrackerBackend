const express = require("express");
const router = express.Router();
const { requireUser, objectOwner } = require("./utils");
const {
  getAllRoutines,
  createRoutine,
  getRoutineById,
  destroyRoutine,
  attachActivitiesToRoutines,
} = require("../db");

// GET /api/routines--------------------------------------------------------------------------------
router.get("/", async (req, res, next) => {
  try {
    const allRoutines = await getAllRoutines();

    res.send(allRoutines);
  } catch (error) {
    next(error);
  }
});

// POST /api/routines--------------------------------------------------------------------------------
router.post("/", requireUser, async (req, res, next) => {
  try {
    const { isPublic, name, goal } = req.body;

    let routineData = {};

    routineData.creatorId = req.user.id;
    routineData.isPublic = isPublic;
    routineData.name = name;
    routineData.goal = goal;

    const routine = await createRoutine(routineData);

    res.send(routine);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/routines/:routineId--------------------------------------------------------------------------------

router.patch(
  "/:routineId",
  requireUser,
  objectOwner,
  async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/routines/:routineId--------------------------------------------------------------------------------

// router.delete("/:routineId", requireUser, async (req, res, next) => {
//   try {

//     const {routineId} = req.params
//     const routineActivityId = await getRoutineActivityById()
//     console.log()

//     if(){
//       destroyRoutineActivity(routineId)
//       destroyRoutine(routineId)}

//   } catch (error) {
//     next(error);
//   }
// });

// POST /api/routines/:routineId/activities--------------------------------------------------------------------------------

router.post("/:routineId/activities", requireUser, async (req, res, next) => {
  try {
    const { routineId } = req.params;

    let routine = await getRoutineById(routineId);

    const routineActivity = await attachActivitiesToRoutines(routine);

    res.send(routineActivity);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
