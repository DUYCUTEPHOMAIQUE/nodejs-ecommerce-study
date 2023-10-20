"use strict";

const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({ user, publicKey }) => {
    try {
      const publicKeyString = publicKey.split.toString().trim();
      const tokens = await keytokenModel;
    } catch (error) {
      return error;
    }
  };
}
