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
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

//init db
require("./dbs/init.mongodb");

//init routes
app.use("/", require("./routes"));

//handle errors

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal Server Error",
  });
});

module.exports = app;
