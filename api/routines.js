const express = require("express");
const router = express.Router();
const { requireUser } = require("./utils");
const {
  getAllRoutines,
  createRoutine,
  getRoutineById,
  destroyRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutine,
  addActivityToRoutine,
  getRoutineActivityById,
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
  const fields = {};
  if (typeof name != "undefined") {
    fields.name = name;
  }
  if (typeof goal != "undefined") {
    fields.goal = goal;
  }
  if (typeof isPublic != "undefined") {
    fields.isPublic = isPublic;
  }

  let routine = await getRoutineById(routineId);
  let routineOwner = routine.creatorId;
  let routineName = routine.name;
  try {
    if (routineOwner === req.user.id) {
      let updatedRoutine = await updateRoutine({ id: routineId, ...fields });
      res.send(updatedRoutine);
    } else {
      res.status(403);
      next({
        error: "ERROR",
        name: "OwnerUserError",
        message: `User ${req.user.username} is not allowed to update ${routineName}`,
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

router.post("/:routineId/activities", async (req, res, next) => {
  const { routineId } = req.params;
  const { activityId, duration, count } = req.body;

  // const routineActivityId = await getRoutineActivitiesByRoutine({
  //   id: routineId,
  // });

  // const routineActivity = await getRoutineActivityById(routineActivityId[0].id);


  // if (routineActivity.activityId !== activityId) {
  //   next({
  //     name: "ActivityExistsInRoutineError",
  //     message: `Activity ID ${activityId} already exists in Routine ID ${routineId}`,
  //     error: "ActivityExistsInRoutineError",
  //   });
  // }

  try {
    let attachedActivitiesToRoutines = await addActivityToRoutine({
      routineId,
      activityId,
      duration,
      count,
    });

    res.send(attachedActivitiesToRoutines);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
