"use strict";

const { model, Schema, Types } = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const DOCUMENT_NAME = "Shop";
const COLLECTION_NAME = "Shops";

var shopSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      length: 150,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
    },
    verify: {
      type: Schema.Types.Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    roles: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, shopSchema);
