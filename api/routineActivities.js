/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const { requireUser, objectOwner } = require("./utils");
const {
  updateRoutineActivity,
  getRoutineActivityById,
  getRoutineById,
} = require("../db");

// PATCH /api/routine_activities/:routineActivityId --------------------------------------------------------------------------------

router.patch("/:routineActivityId", requireUser, objectOwner, async (req, res, next) => {
  const { routineActivityId } = req.params;
  const { count, duration } = req.body;

  const updateFields = {};

  if (duration) {
    updateFields.duration = duration;
  }
  if (count) {
    updateFields.count = count;
  }

  console.log(objectOwner, "this is object owner")

  try {
    const originalRoutineActivity = await getRoutineActivityById(
      routineActivityId
    );
    const routineId = originalRoutineActivity.routineId;
    const routineFromOriginalOwner = await getRoutineById(routineId);
    const routineOwnerId = routineFromOriginalOwner.creatorId;
    console.log(routineOwnerId, "this is the routine owner's Id");
    console.log(req.user.id, "this is logged in user's Id");

    if (routineOwnerId === req.user.id) {
      const updatedRoutineActivity = await updateRoutineActivity(
        routineActivityId,
        updateFields
      );
      res.send({ routine_activity: updatedRoutineActivity });
    }
  } catch (error) {
    throw error;
  }
});

// DELETE /api/routine_activities/:routineActivityId--------------------------------------------------------------------------------

module.exports = router;
