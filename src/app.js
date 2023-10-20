require("dotenv").config();
const compression = require("compression");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const express = require("express");
const { countConnect, checkOverload } = require("./helpers/check.connect");

const app = express();

//init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

//init db
require("./dbs/init.mongodb");

//init routes
// app.get("/", (req, res, next) => {
//   const strCompress = "Welcome Guys!";
//   return res.status(200).json({
//     message: "Welcome to",
//     // metadata: strCompress.repeat(10000),
//   });
// });

//init routes
app.use("/", require("./routes"));

//handle errors

module.exports = app;
