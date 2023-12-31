"use strict";

const keytokenModel = require("../models/keytoken.model");
const {
  Types: { ObjectId },
} = require("mongoose");
class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      const filter = { user: userId },
        update = {
          publicKey,
          privateKey,
          refreshTokensUsed: [],
          refreshToken,
        },
        options = {
          upsert: true,
          new: true,
        };
      const tokens = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static findByUserId = async ({ userId }) => {
    const result = await keytokenModel.findOne({ user: new ObjectId(userId) });
    return result;
  };

  static removeKeyById = async (id) => {
    const result = await keytokenModel.deleteOne({
      _id: new ObjectId(id),
    });
    console.log("result", result);
    return result;
  };
  static findByRefreshTokenUsed = async (refreshToken) => {
    return keytokenModel.findOne({
      resfreshTokensUsed: { $elemMatch: { $eq: refreshToken } },
    });
  };

  static deleteByKey = async (userId) => {
    return keytokenModel.deleteOne({ user: userId });
  };
  static findByRefreshToken = async (refreshToken) => {
    // const result = keytokenModel.findOne({ refreshToken });
    // console.log("###result", result);
    // console.log("errrr###");
    console.log("###result", refreshToken);
    return keytokenModel.findOne({ refreshToken: refreshToken });
  };
}

module.exports = KeyTokenService;
