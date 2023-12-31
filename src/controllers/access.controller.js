"use strict";
const AccessService = require("../services/access.service");

const { OK, CREATED, SuccessResponse } = require("../core/success.response");
const AcessService = require("../services/access.service");
class AccessController {
  handlerefreshtoken = async (req, res, next) => {
    new SuccessResponse({
      message: "create new tokens successfully",
      metadata: await AccessService.handlerRefreshTokenV2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  };

  logout = async (req, res, next) => {
    new SuccessResponse({
      message: "Logout successfully",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };

  login = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body),
    }).send(res);
  };
  signUp = async (req, res, next) => {
    new CREATED({
      message: "Registed OK!",
      metadata: await AcessService.signUp(req.body),
    }).send(res);
  };
}

module.exports = new AccessController();
