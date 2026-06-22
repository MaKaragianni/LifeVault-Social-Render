const express = require("express");
const router = express.Router();

const tokenChecker = require("../middleware/tokenChecker");
const UsersController = require("../controllers/users");

// CREATE USER
router.post("/", UsersController.create);

// SEARCH USERS
router.get("/search", UsersController.searchUsers);

// GET PROFILE (BY ID)
router.get("/:id", UsersController.getProfile);

// GET USER BY USERNAME
router.get(
  "/username/:username",
  UsersController.getUserByUsername
);

module.exports = router;