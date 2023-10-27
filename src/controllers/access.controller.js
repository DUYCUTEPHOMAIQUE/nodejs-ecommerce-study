"use strict";
const AccessService = require("../services/access.service");

const { OK, CREATED } = require("../core/success.response");
const AcessService = require("../services/access.service");
class AccessController {
  signUp = async (req, res, next) => {
    new CREATED({
      message: "Registed OK!",
      metadata: await AcessService.signUp(req.body),
    }).send(res);
  };
}

module.exports = new AccessController();
