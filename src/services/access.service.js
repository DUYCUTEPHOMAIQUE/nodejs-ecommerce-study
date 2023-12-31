"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const {
  BadRequestError,
  ConflictRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");
const { getInfoData } = require("../utils");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static handlerRefreshTokenV2 = async ({ refreshToken, user, keyStore }) => {
    const { userId, email } = user;

    if (keyStore.resfreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteByKey(userId);
      throw new ForbiddenError("Something were wrong ! Plz login again !!");
    }
    if (refreshToken !== keyStore.refreshToken)
      throw new AuthFailureError("Shop not registed!--2");

    //Neu chua du dung

    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    console.log("####holderToken", holderToken);
    //khong tim duoc throw ra loi
    if (!holderToken) {
      throw new AuthFailureError("Shop not registed --1");
    }
    //neu tim duoc thi verify
    // const { userId, email } = await verifyJWT(
    //   refreshToken,
    //   holderToken.privateKey
    // );
    //check userId
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop not registed --2");
    // create tokens mowis
    const tokens = await createTokenPair(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey
    );

    //update
    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        resfreshTokensUsed: refreshToken,
      },
    });

    return {
      user,
      tokens,
    };
  };

  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    console.log("delKey: " + delKey);
    return delKey;
  };

  static login = async ({ email, password, refreshToken = null }) => {
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError("Shop not registed");
    // console.log("######found shop", foundShop);
    const match = bcrypt.compare(password, foundShop.password);

    if (!match) throw new AuthFailureError("Authentication Error");

    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const { _id: userId } = foundShop;
    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
      userId,
    });

    return {
      shop: getInfoData({
        fileds: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError("Error: shop already registered");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      // create privateKey and PublicKey
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      console.log(privateKey, publicKey); //save collection Keystore

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });
      if (!keyStore) {
        return {
          code: "xxx",
          message: "keyStore error",
        };
      }

      //created token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );
      console.log(`Create token successfully: `, tokens);

      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fileds: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }
    return {
      code: 202,
      metadata: null,
    };
  };
}

module.exports = AccessService;
