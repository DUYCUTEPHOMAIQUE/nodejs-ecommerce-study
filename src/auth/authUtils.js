"use strict";

const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    //
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(`error verify: `, err);
      } else {
        console.log(`decode verify:`, decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {}
};

const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid Request");
  const keyStore = await findByUserId({ userId });
  if (!keyStore) throw new NotFoundError("Not Found keyStore");

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid Request");
  console.log(keyStore);
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    console.log("decodeUser", decodeUser);
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid UserId");
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

module.exports = {
  createTokenPair,
  authentication,
};
