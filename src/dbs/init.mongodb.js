"use strict";

const mongoose = require("mongoose");

const stringConnect = "mongodb://localhost:27017/shopDEV";

class DataBase {
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(stringConnect)
      .then((_) => console.log("Connected to MongoDB successfully PRO"))
      .catch((error) => console.log("Error connecting"));
  }

  static getInstance() {
    if (!DataBase.instance) {
      DataBase.instance = new DataBase();
    }
    return DataBase.instance;
  }
}

const instanceMongodb = DataBase.getInstance();

module.exports = instanceMongodb;
