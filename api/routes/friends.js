const express = require("express");
const router = express.Router();

const FriendsController = require("../controllers/friends");

router.get("/", FriendsController.getAllFriends);

// POST /friends/request/:id - Sends a friend request to a specific user ID
router.post("/request/:id", FriendsController.sendFriendRequest);

module.exports = router;