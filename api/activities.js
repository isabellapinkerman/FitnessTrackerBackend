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

  const { activityId } = req.params;
  const activity = await getActivityById(activityId);

  try {
    if (activity) {
      const publicRoutines = await getPublicRoutinesByActivity({id: activityId})
      res.send(publicRoutines)
    }else {
      res.send({
        name: "ActivityNotFoundError",
        message: `Activity ${activityId} not found`,
        error: "ActivityNotFoundError",
      });
    }
  } catch (error) {
    throw error;
  }
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
const fields = {}
  if(typeof name != 'undefined') {fields.name = name}
  if(typeof description != 'undefined') {fields.description = description}

  const activity = await getActivityById(activityId);
  // let activityName = activity.name 
  console.log(activity, "ACTIVITYYYYYYYY")

  try {
    if(activity.name === name){
      next({
        name: "ActivityNameExistsError",
        message: `Activity ${activity.name} already exists`,
        error: "ActivityNameExistsError",
      });
    }

  if (activity) {
    let updatedActivity = await updateActivity({id: activityId, ...fields})
    res.send(updatedActivity)
  }else {
    next({
      name: "ActivityExistsError",
      message: `Activity ${activityId} not found`,
      error: "ActivityExistsError",
    });
  }

  } catch (error) {
    throw error;
  }
});

module.exports = router;
