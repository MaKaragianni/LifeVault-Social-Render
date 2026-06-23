const express = require("express");
const router = express.Router();

const tokenChecker = require("../middleware/tokenChecker");
const UsersController = require("../controllers/users");
const upload = require("../cloudinaryConfig");

// CREATE USER
router.post("/", upload.single("profilePic"), UsersController.create);

// SEARCH USERS
router.get("/search", UsersController.searchUsers);

// GET PROFILE (BY ID)
router.get("/:id", UsersController.getProfile);

// GET USER BY USERNAME
router.get(
  "/username/:username",
  UsersController.getUserByUsername
);

// SEND FRIEND REQUEST
router.post("/:id/friendRequest", tokenChecker, UsersController.sendFriendRequest);

// ACCEPT FRIEND REQUEST
router.post("/friendRequest/:requestId/accept", tokenChecker, UsersController.acceptFriendRequest);

// REJECT FRIEND REQUEST
router.post("/friendRequest/:requestId/reject", tokenChecker, UsersController.rejectFriendRequest);

module.exports = router;