const express = require('express');
const router = express.Router();
// const jwt = require("jsonwebtoken");
// const { JWT_SECRET } = process.env;
// const { getUser, getUserByUsername, createUser } = require("../db");

// POST /api/users/login--------------------------------------------------------------------------------
// router.post("/login", async (req, res, next) => {
//     const { username, password } = req.body;
  
//     if (!username || !password) {
//       next({
//         name: "MissingCredentialsError",
//         message: "Please supply both a username and password",
//       });
//     }
  
//     try {
//       const user = await getUserByUsername(username);
  
//       if (user && user.password == password) {
//         const token = jwt.sign({ id: user.id, username }, JWT_SECRET, {
//           expiresIn: "1w",
//         });
  
//         res.send({ message: "you're logged in!", token });
//       } else {
//         next({
//           name: "IncorrectCredentialsError",
//           message: "Username or password is incorrect",
//         });
//       }
//     } catch (error) {
//       console.log(error);
//       next(error);
//     }
//   });

// POST /api/users/register--------------------------------------------------------------------------------

// router.post("/register", async (req, res, next) => {
//     const { username, password } = req.body;
  
//     try {
//       const _user = await getUserByUsername(username);
  
//       if (_user) {
//         next({
//           name: "UserExistsError",
//           message: "A user by that username already exists",
//         });
//       }
  
//       const user = await createUser({
//         username,
//         password
//       });
  
//       const token = jwt.sign(
//         {
//           id: user.id,
//           username,
//         },
//         JWT_SECRET,
//         { expiresIn: "1w" }
//       );
  
//       res.send({
//         message: "thank you for signing up",
//         token,
//       });
//     } catch ({ name, message }) {
//       next({ name, message });
//     }
//   });
  

// GET /api/users/me--------------------------------------------------------------------------------

// GET /api/users/:username/routines--------------------------------------------------------------------------------

module.exports = router;
