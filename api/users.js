const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
const { getUser, getUserByUsername, createUser, getUserById } = require("../db");


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
      const user = await getUser({username, password});
  
      if (user) {
        const token = jwt.sign({ id: user.id, username }, JWT_SECRET, {
          expiresIn: "1w",
        });
  
        res.send({ message: "you're logged in!", token, user });
        return token
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

router.post("/register", async ( req, res, next) => {
    const { username, password } = req.body;
    console.log(req.body, "re.body")


    try {
        // const existingUser = await getUser({ username, password });
        // console.log(existingUser, "existing user")
    
        // if (existingUser) {
        //   next({
        //     name: "UserExistsError",
        //     message: `User ${username} is already taken`,
        //   });
        // }

        // if(password.length < 8){
        //     next({
        //         error: error.name,
        //         message: "Password Too Short!",
        //         name: error.name
        //     })
        // }
        // if(username){
        //     next({
        //         name: "UserExistsError",
        //         message: `User ${username} is already taken`
        //     })
        // }

  
//       const user = await createUser({
//         username,
//         password
//       });
//   console.log(user, "new user")
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
//         token
//       });
    } catch ({ name, message }) {
      next({ name, message });
    }
  });
  

// GET /api/users/me--------------------------------------------------------------------------------

router.get("/users/me", async (req, res)=>{
const { username, password } = req.body;
   const user = getUser({ username, password })
console.log(user)
   const token = jwt.sign(
    {
      id: user.id,
      username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1w",
    }
  );
if(token){
    res.send({
        user, token
       })
}
})
// GET /api/users/:username/routines--------------------------------------------------------------------------------

module.exports = router;
