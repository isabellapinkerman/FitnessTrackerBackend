const express = require("express");
const router = express.Router();
const { requireUser } = require("./utils");
const {
  getAllRoutines,
  createRoutine,
  getRoutineById,
  destroyRoutine,
  attachActivitiesToRoutines,
  getRoutineActivitiesByRoutine,
  updateRoutine,
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

router.patch("/:routineId", requireUser, async (req, res, next) => {
  const { routineId } = req.params;
  const { isPublic, name, goal } = req.body;

  const updateFields = {};

  if (isPublic) {
    updateFields.isPublic = isPublic;
  }
  if (name) {
    updateFields.name = name;
  }
  if (goal) {
    updateFields.goal = goal;
  }

  let routine = await getRoutineById(routineId);
  let routineOwner = routine.creatorId;
  let routineName = routine.name;

  if (routineOwner !== req.user.id) {
    res.status(403);
    next({
      name: "OwnerUserError",
      message: `User ${req.user.username} is not allowed to update ${routineName}`,
    });
  }

  try {
    let updatedRoutine = await updateRoutine({ routineId, ...updateFields });

    if (updatedRoutine) {
      res.send(updatedRoutine);
    } else {
      next({
        name: "UpdateRoutineError",
        message: "Error in updating routine!",
        error: "UpdateRoutineError",
      });
    }
  } catch (error) {
    next(error);
  }
});

// DELETE /api/routines/:routineId--------------------------------------------------------------------------------

router.delete("/:routineId", requireUser, async (req, res, next) => {
  const { routineId } = req.params;

  let routine = await getRoutineById(routineId);
  let routineOwner = routine.creatorId;
  let routineName = routine.name;

  if (routineOwner !== req.user.id) {
    res.status(403);
    next({
      name: "OwnerUserError",
      message: `User ${req.user.username} is not allowed to delete ${routineName}`,
    });
  }

  try {
    await destroyRoutine(routineId);
    //I'm unsure about this. Why would sending back routine work after deleting it?
    res.send(routine);
  } catch (error) {
    next(error);
  }
});

// POST /api/routines/:routineId/activities--------------------------------------------------------------------------------

router.post("/:routineId/activities", requireUser, async (req, res, next) => {
  const { routineId } = req.params;

  let routineActivity = await getRoutineActivitiesByRoutine({routineId})

    console.log(routineActivity, "this is routineActivity")

    
  try {
    

    

    let attachActivitiesToRoutines = await attachActivitiesToRoutines(routineId)



    res.send({routine_activity: attachActivitiesToRoutines});
  } catch (error) {
    next(error);
  }
});

module.exports = router;
