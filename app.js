require("dotenv").config()

const express = require("express")
const app = express()

//----------------------------NEW STUFF-----------------------------
//Routes the api/index.js to this page
const apiRouter = require("./api");


const cors = require("cors")
app.use(cors());

const morgan = require("morgan");
app.use(morgan("dev"));

app.use(express.json());

//Adds an additional /api endpoint to the URL (localhost:3000 based on PORT found in server.js) and displays what's in apiRouter
app.use("/api", apiRouter);

//------------------------------------------------------------------


// Setup your Middleware and API Router here

module.exports = app;
