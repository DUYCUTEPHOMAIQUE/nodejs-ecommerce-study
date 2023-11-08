"use strict";

const express = require("express");
const router = express.Router();
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const { authenticationV2 } = require("../../auth/authUtils");
//asyncHandler is async function use it to clean code in router
//signUp
router.post("/shop/signup", asyncHandler(accessController.signUp));
router.post("/shop/login", asyncHandler(accessController.login));

//authentication
router.use(authenticationV2);
//logout
router.post("/shop/logout", asyncHandler(accessController.logout));
router.post(
  "/shop/handlerrefreshtoken",
  asyncHandler(accessController.handlerefreshtoken)
);

module.exports = router;
