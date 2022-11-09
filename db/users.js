/* eslint-disable no-useless-catch */
const client = require("./client");
const bcrypt = require("bcrypt")


// database functions

// user functions
async function createUser({ username, password }) {

  
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT)

  try {
    const {
      rows: [user],
    } = await client.query(
      `
    INSERT INTO users(username, password)
    VALUES ($1, $2)
    ON CONFLICT (username) DO NOTHING
    RETURNING *
    ;
    `,
      [username, hashedPassword]
    );
    delete user.password
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {


  const user = await getUserByUsername(username);
  const hashedPassword = user.password;
  const isValid = await bcrypt.compare(password, hashedPassword)

  // console.log(isValid, "this is is valid")


  try {
    if(!username || !hashedPassword){
      return null
    }

    const currentUser = await getUserByUsername(username)
    if(!currentUser){
      return null
    }

    //This if statement was previously (currentUser.password === password) which checked whether the currentUser's password is equal to the existing un-hashed password. isValid is passed in the if statement instead because it already checks the currentUser's password and the hashedPassword.
    if(isValid){
      delete currentUser.password
      return currentUser
    }else{
      return null
    }


  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `SELECT id, username
      FROM users
      WHERE id=${userId}`
    );

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    throw error;
  }
}

//why is there no test for this
async function getUserByUsername(username) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `SELECT *
      FROM users
      WHERE username=$1`,
      [username]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
};
