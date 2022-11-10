const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const {
  getUser,
  getUserByUsername,
  createUser,
  getUserById,
} = require("../db");


// function requireUser(req, res, next) {
//   if (!req.user) {
//     next({
//       name: "MissingUserError",
//       message: "You must be logged in to perform this action",
//     });
//   }

//   next();
// }


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


  try {
    const existingUser = await getUser({ username, password });
    console.log(existingUser)


    if (existingUser) {
      next({
        error: "Error",
        name: "UserExistsError",
        message: `User ${username} is already taken.`,
      });
    }

    if (password.length < 8) {
      next({
        error: "PasswordError",
        message: "Password Too Short!",
        name: "PasswordError",
      });
    }

    // if(username){
    //     next({
    //         name: "UserExistsError",
    //         message: `User ${username} is already taken`
    //     })
    // }

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
      message: "thank you for signing up", token, user
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// GET /api/users/me--------------------------------------------------------------------------------

router.get("/me", async (req, res) => {
  const {authorization} = req.headers
  const token = authorization.split(' ')[1]
  console.log(token)

  const user = await getUser({ username, password });
  // console.log(user, "this is user ==========");

  // const token = jwt.sign(
  //   {
  //     id: user.id,
  //     username,
  //   },
  //   process.env.JWT_SECRET,
  //   {
  //     expiresIn: "1w",
  //   }
  // );

  console.log(token, "this is token")
  if (token) {
    res.send(
      user
    );
  }
});
// GET /api/users/:username/routines--------------------------------------------------------------------------------

module.exports = router;
