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


  //if the activity does not exist, return error message
  let activityExists = await getActivityById(activityId);
  console.log(activityExists ,"this is activityExists")
  if (!activityExists) {
    next({
      name: "ActivityExistsError",
      message: `The activity ${activityExists.name} does not exist`,
    });
  }

  try {
    const publicRoutines = await getPublicRoutinesByActivity({ activityId });

    console.log(publicRoutines, "this is public routines")

    res.send(publicRoutines);
  } catch (error) {
    throw error;
  }
});

// GET /api/activities--------------------------------------------------------------------------------

router.get("/", async (req, res, next) => {
  try {
    const allActivities = await getAllActivities();

    res.send(allActivities);
  } catch (error) {
    next(error);
  }
});

// POST /api/activities--------------------------------------------------------------------------------
router.post("/", requireUser, async (req, res, next) => {
  const { name, description } = req.body;

  const activityExists = await getActivityByName(name);
  if (activityExists) {
    next({
      name: "ActivityExistsError",
      message: `An activity with name ${name} already exists`,
    });
  }

  try {
    const activityData = {};
    activityData.name = name;
    activityData.description = description;

    const activity = await createActivity(activityData);

    res.send(activity);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// PATCH /api/activities/:activityId--------------------------------------------------------------------------------
router.patch("/:activityId", requireUser, async (req, res, next) => {
  const { activityId } = req.params;
  const { name, description } = req.body;

  let activityExists = await getActivityById(activityId);
  if (!activityExists) {
    next({
      name: "ActivityExistsError",
      message: `The activity ${activityExists.name} does not exist`,
    });
  }

  const updateFields = {};

  if (name && name !== activityExists.name) {
    updateFields.name = name;
  }
  if (description) {
    updateFields.description = description;
  }

  try {
    const updatedActivity = await updateActivity(activityId, updateFields);
    res.send(updatedActivity);
  } catch (error) {
    throw error;
  }
});

module.exports = router;
