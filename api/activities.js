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
  getActivityById,
} = require("../db");

// GET /api/activities/:activityId/routines--------------------------------------------------------------------------------

router.get("/:activityId/routines", async (req, res, next) => {
  //console.log(activityId) exists
  const { activityId } = req.params;

  //console.log(existingActivity) exists
  const activity = await getActivityById(activityId);
  if (!activity) {
    res.send({
      name: "ActivityNotFoundError",
      message: `Activity ${activityId} not found`,
      error: "ActivityNotFoundError",
    });
  }

  // try {
 
  // } catch (error) {
  //   throw error;
  // }
});

// GET /api/activities--------------OK----------------------------------------------------------------

router.get("/", async (req, res, next) => {
  try {
    const allActivities = await getAllActivities();

    res.send(allActivities);
  } catch (error) {
    next(error);
  }
});

// POST /api/activities--------------OK----------------------------------------------------------------
router.post("/", requireUser, async (req, res, next) => {
  const { name, description } = req.body;

  const activity = await getActivityByName(name);
  if (activity) {
    next({
      name: "ActivityExistsError",
      message: `An activity with name ${name} already exists`,
    });
  }

  try {
    const activity = await createActivity({ name, description });

    res.send(activity);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/activities/:activityId--------------------------------------------------------------------------------
router.patch("/:activityId", requireUser, async (req, res, next) => {
  const { activityId } = req.params;
  const { name, description } = req.body;

  const activity = await getActivityById(activityId);
  if (!activity) {
    next({
      name: "ActivityExistsError",
      message: `Activity ${activityId} not found`,
      error: "ActivityExistsError",
    });
  }

  // if (name === activity.name) {
  //   next({
  //     name: "ActivityNameExistsError",
  //     message: `Activity ${name} already exists`,
  //     error: "ActivityNameExistsError",
  //   });
  // }

  // try {
  //   const updateFields = {}
  //   updateFields.name = name
  //   updateFields.description = description

  //   const updatedActivity = await updateActivity(activityId, ...updateFields);
  //   res.send(updatedActivity);
  // } catch (error) {
  //   throw error;
  // }
});

module.exports = router;
