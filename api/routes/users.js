const express = require("express");
const router = express.Router();

const tokenChecker = require("../middleware/tokenChecker");
const UsersController = require("../controllers/users");

// CREATE USER
router.post("/", UsersController.create);

// SEARCH USERS
router.get("/search", UsersController.searchUsers);

// GET USER BY USERNAME
router.get(
  "/username/:username",
  UsersController.getUserByUsername
);

// GET PROFILE BY ID
router.get("/:id", UsersController.getProfile);

router.post(
  "/:id/handlefollow",
  tokenChecker,
  UsersController.handleFollow
);

module.exports = router;