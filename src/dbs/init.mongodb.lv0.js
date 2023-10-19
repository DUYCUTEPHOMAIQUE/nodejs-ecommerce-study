"use strict";

const mongoose = require("mongoose");

const connectString = `mongodb://localhost:27017`;

mongoose
  .connect(connectString)
  .then((_) => console.log("Connected to MongoDB successfully"))
  .catch((err) => console.log("Error connecting to MongoDB"));

if (1 === 1) {
  mongoose.set("debug", true);
  mongoose.set("debug", { color: true });
}

module.exports = mongoose;
