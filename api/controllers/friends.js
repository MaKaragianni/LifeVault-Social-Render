const { generateToken } = require("../lib/token");
const User = require("../models/user");

async function getAllFriends(req, res) {
  try {
    const user = await User.findById(req.user_id).populate("friends");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const token = generateToken(req.user_id);
    return res.status(200).json({ friends: user.friends, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

// Send an incoming request invitation
async function sendFriendRequest(req, res) {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user_id;

    if (targetUserId === currentUserId) {
      return res.status(400).json({ message: "You cannot add yourself" });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found" });
    }

    // Add current user to target's pending request array
    await User.findByIdAndUpdate(targetUserId, {
      $addToSet: { friendRequests: currentUserId }
    });

    const token = generateToken(req.user_id);
    return res.status(200).json({ message: "Friend request sent", token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

const FriendsController = {
  getAllFriends: getAllFriends,
  sendFriendRequest: sendFriendRequest,
};

module.exports = FriendsController;