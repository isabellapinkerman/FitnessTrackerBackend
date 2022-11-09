require("dotenv").config()

const express = require("express")
const app = express()
const apiRouter = require("./api");


const cors = require("cors")
app.use(cors());

const morgan = require("morgan");
app.use(morgan("dev"));

app.use(express.json());

app.use("/api", apiRouter);

// Setup your Middleware and API Router here

module.exports = app;
