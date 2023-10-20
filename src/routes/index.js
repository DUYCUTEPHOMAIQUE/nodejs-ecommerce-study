"use strict";

const express = require("express");

const router = express.Router();

router.use("/v1/api", require("./acess"));
// router.get("", (req, res, next) => {
//   return res.status(200).json({
//     message: "Welcome to the World!",
//   });
// });

module.exports = router;
