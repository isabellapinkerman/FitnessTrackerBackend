/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const { requireUser } = require("./utils");
const {
  updateRoutineActivity,
  getRoutineActivityById,
  getRoutineById,
  destroyRoutineActivity,
  canEditRoutineActivity,
} = require("../db");

// PATCH /api/routine_activities/:routineActivityId --------------------------------------------------------------------------------

router.patch("/:routineActivityId", requireUser, async (req, res, next) => {
  const { routineActivityId } = req.params;
  const { duration, count } = req.body;

  const updateFields = {};

  if (duration) {
    updateFields.duration = duration;
  }

  if (count) {
    updateFields.count = count;
  }

  const routineOwner = await canEditRoutineActivity(
    routineActivityId,
    req.user.id
  );

  const routineActivity = await getRoutineActivityById(routineActivityId);
  const routineId = routineActivity.routineId;
  const routine = await getRoutineById(routineId);
  const routineName = routine.name;

  if (!routineOwner) {
    res.status(403);
    next({
      name: "OwnerUserError",
      message: `User ${req.user.username} is not allowed to update ${routineName}`,
    });
  }
 
    try {
        try {
            let updatedRoutineActivity = await updateRoutineActivity({ routineId, ...updateFields });
        
            if (updatedRoutineActivity) {
              res.send(updatedRoutineActivity);
            } else {
              next({
                name: "UpdateRoutineActivityError",
                message: "Error in updating routine_activity!",
                error: "UpdateRoutineActivityError",
              });
            }
          } catch (error) {
            next(error);
          }
    } catch (error) {
      next(error);
    }
});

// DELETE /api/routine_activities/:routineActivityId--------------------------------------------------------------------------------

router.delete("/:routineActivityId", requireUser, async (req, res, next) => {
  const { routineActivityId } = req.params;

//----------------Checks if routine_activity is by the logged in user---------------
  const routineOwner = await canEditRoutineActivity(
    routineActivityId,
    req.user.id
  );

  const routineActivity = await getRoutineActivityById(routineActivityId);

  const routineId = routineActivity.routineId;
  const routine = await getRoutineById(routineId);
  const routineName = routine.name;

  if (!routineOwner) {
    res.status(403);
    next({
      name: "OwnerUserError",
      message: `User ${req.user.username} is not allowed to delete ${routineName}`,
    });
  }

  try {
    await destroyRoutineActivity(routineActivityId);
    //I'm unsure about this. Why would sending back routineActivity work after deleting it?
    res.send(routineActivity);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
