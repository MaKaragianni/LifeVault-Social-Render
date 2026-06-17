const express = require("express");
const tokenChecker = require("../middleware/tokenChecker");
const UsersController = require("../controllers/users");
const router = express.Router();

router.post("/", UsersController.create);
router.get("/search", UsersController.searchUsers);
router.get("/:id", UsersController.getProfile);
// router.post("/:id/follow", tokenChecker, UsersController.addFriend);
router.post("/:id/handlefollow", tokenChecker, UsersController.handleFollow);

module.exports = router;
