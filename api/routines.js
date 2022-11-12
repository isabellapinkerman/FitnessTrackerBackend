const express = require('express');
const router = express.Router();
const { requireUser } = require("./utils");
const {
    getAllRoutines,
  } = require("../db");

// GET /api/routines--------------------------------------------------------------------------------
router.get("/routines", async (req, res, next) => {
    try {
      const allRoutines = await getAllRoutines();
  
      res.send(allRoutines);
    } catch (error) {
      next(error);
    }
  });


// POST /api/routines--------------------------------------------------------------------------------

// PATCH /api/routines/:routineId--------------------------------------------------------------------------------

// DELETE /api/routines/:routineId--------------------------------------------------------------------------------

// POST /api/routines/:routineId/activities--------------------------------------------------------------------------------

module.exports = router;
