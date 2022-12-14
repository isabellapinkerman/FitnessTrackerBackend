/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { requireUser } = require("./utils");
const {
  getUser,
  createUser,
  getPublicRoutinesByUser,
  getUserByUsername,
} = require("../db");

// POST /api/users/login--------------------------------------------------------------------------------
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }

  try {
    const user = await getUser({ username, password });

    if (user) {
      const token = jwt.sign({ id: user.id, username }, JWT_SECRET, {
        expiresIn: "1w",
      });

      res.send({ message: "you're logged in!", token, user });
      return token;
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// POST /api/users/register--------------------------------------------------------------------------------

router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;

  // const SALT_COUNT = 10;
  // const hashedPassword = await bcrypt.hash(password, SALT_COUNT)

  const existingUser = await getUserByUsername(username);

  if (existingUser) {
    next({
      name: "UserExistsError",
      message: `User ${username} is already taken.`,
    });
  }

  try {
    if (password.length < 8) {
      next({
        name: "PasswordError",
        message: "Password Too Short!",
        error: "This is the error message",
      });
    }

    const user = await createUser({
      username,
      password,
    });

    const token = jwt.sign(
      {
        id: user.id,
        username,
      },
      JWT_SECRET,
      { expiresIn: "1w" }
    );

    res.send({
      message: "thank you for signing up",
      token,
      user,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// GET /api/users/me--------------------------------------------------------------------------------

router.get("/me", requireUser, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    next(error);
  }
});

// GET /api/users/:username/routines--------------------------------------------------------------------------------

router.get("/:username/routines", async (req, res) => {
  const { username } = req.params;

  try {
    const userRoutines = await getPublicRoutinesByUser({ username });

    const filteredRoutines = userRoutines.filter((routine) => {
      return req.user && routine.creatorId === req.user.id;
    });

    if (filteredRoutines) {
      res.send(filteredRoutines);
    }
  } catch (error) {
    throw error;
  }
});

module.exports = router;
