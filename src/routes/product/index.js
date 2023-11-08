"use strict";

const express = require("express");
const router = express.Router();
const ProductController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const { authenticationV2 } = require("../../auth/authUtils");
//asyncHandler is async function use it to clean code in router

//authentication
router.use(authenticationV2);
//logout
router.post("", asyncHandler(ProductController.createProduct));

module.exports = router;
