const express = require("express");

const router = express.Router();

const controller = require(
  "../controllers/passwordReset"
);

router.post(
  "/request",
  controller.requestReset
);

router.post(
  "/reset",
  controller.resetPassword
);

module.exports = router;