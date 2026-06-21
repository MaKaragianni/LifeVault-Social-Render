const express = require("express");
const router = express.Router();

const tokenChecker = require("../middleware/tokenChecker");

const controller = require(
  "../controllers/friendRequests"
);

router.post(
  "/request/:userId",
  tokenChecker,
  controller.sendRequest
);

router.get(
  "/requests",
  tokenChecker,
  controller.getRequests
);

router.put(
  "/accept/:requestId",
  tokenChecker,
  controller.acceptRequest
);

router.put(
  "/decline/:requestId",
  tokenChecker,
  controller.declineRequest
);

router.delete(
  "/remove/:friendId",
  tokenChecker,
  controller.removeFriend
);

module.exports = router;