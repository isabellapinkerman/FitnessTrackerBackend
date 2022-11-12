/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const { requireUser } = require("./utils");
const {
  getPublicRoutinesByActivity,
  getAllActivities,
  createActivity,
  getActivityByName,
  updateActivity,
} = require("../db");

// GET /api/activities/:activityId/routines--------------------------------------------------------------------------------




router.get("/:activityId/routines", async (req, res,) => {
  const { activityId } = req.params;
  try {
    const userRoutine = await getPublicRoutinesByActivity({ activityId });

    const filteredRoutines = userRoutine.filter((activity) => {
      return req.user && activity.creatorId === req.user.id;
    });

    if (filteredRoutines) {
      res.send(filteredRoutines);
    }
  } catch (error) {
    throw error;
  }
});

// GET /api/activities--------------------------------------------------------------------------------

router.get("/activities", async (req, res, next) => {
  try {
    const allActivities = await getAllActivities();

    res.send(allActivities);
  } catch (error) {
    next(error);
  }
});

// POST /api/activities--------------------------------------------------------------------------------
router.post("/activities", requireUser, async (req, res, next) => {
  const { name, description } = req.body;

  const existingActivity = await getActivityByName(name);

  if (existingActivity) {
    next({
      name: "UserExistsError",
      message: `User ${name} is already taken.`,
    });
  }

  const activityData = {};

  try {
    (activityData.id = req.user.id), (activityData.name = name);
    activityData.description = description;
    const activity = await createActivity(activityData);

    console.log(activity, "this is activity");

    if (activity) {
      res.send({ activity });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// PATCH /api/activities/:activityId--------------------------------------------------------------------------------

router.patch("/activities/:activityId", async (req, res) => {
  const { activityId } = req.params;
  const { name, description } = req.body;

  const updateFields = {};

  if (name) {
    updateFields.name = name;
  }

  if (description) {
    updateFields.description = description;
  }

  try {
    const updatedActivity = await updateActivity(activityId, updateFields);
    res.send({ activity: updatedActivity });
  } catch (error) {
    throw error;
  }
});

module.exports = router;
