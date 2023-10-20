"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Key";
const COLLECTION_NAME = "Keys";
// Declare the Schema of the Mongo model
var keyTokenSchema = new mongoose.Schema(
  {
    user: {
      type: SchemaType.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
    publicKey: {
      ttype: String,
      required: true,
    },
    resfreshToken: {
      type: Array,
      default: [],
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, keyTokenSchema, COLLECTIONNAME);
