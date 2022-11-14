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
      const publicRoutines = await getPublicRoutinesByActivity({
        id: activityId,
      });
      res.send(publicRoutines);
    } else {
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
  const activity = await getActivityById(activityId);

  try {
    if (!activity) { next({
        name: "ActivityExistsError",
        message: `Activity ${activityId} not found`,
        error: "ActivityExistsError",
      })
       
      } else {
        let updatedActivity = await updateActivity({
          id: activityId,
          name, description
        });
        console.log(updatedActivity, "queso")
        res.send(updatedActivity);
      }
      
  } catch (error) {
    if(error.code == 23505){
    next({
          name: "ActivityNameExistsError",
          message: `An activity with name ${name} already exists`,
          error: "ActivityNameExistsError",
        });
  }
}
});

module.exports = router;
