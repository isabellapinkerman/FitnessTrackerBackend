const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { getUserById, getUserByToken } = require("../db");
const { JWT_SECRET } = process.env;

router.use();

  router.use((req, res, next) => {
    if (req.user) {
      console.log("User is set:", req.user);
    }

    next();
  });

// GET /api/health--------------------------------------------------------------------------------
router.get("/health", async (req, res, next) => {
  res.send({message:"Great success!"})
});

// ROUTER: /api/users--------------------------------------------------------------------------------
const usersRouter = require("./users");
router.use("/users", usersRouter);

// ROUTER: /api/activities--------------------------------------------------------------------------------
const activitiesRouter = require("./activities");
router.use("/activities", activitiesRouter);

// ROUTER: /api/routines--------------------------------------------------------------------------------
const routinesRouter = require("./routines");
router.use("/routines", routinesRouter);

// ROUTER: /api/routine_activities--------------------------------------------------------------------------------
const routineActivitiesRouter = require("./routineActivities");
router.use("/routine_activities", routineActivitiesRouter);

//---------------NEW--------------------
router.use((error, req, res, next) => {
  res.send({
    error: error.name,
    name: error.name,
    message: error.message,
  });
});


module.exports = router;
