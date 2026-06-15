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

const FriendsController = {
  getAllFriends: getAllFriends,
};

module.exports = FriendsController;
