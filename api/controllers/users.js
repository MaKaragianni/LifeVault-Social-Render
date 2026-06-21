const User = require("../models/user");
const Post = require("../models/post");

// CREATE USER
async function create(req, res) {
  try {
    const {
      email,
      password,
      confirmPassword,
      username = "",
      profilePic = "",
      bio = "",
      dateOfBirth,
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    const user = new User({
      email,
      password,
      username,
      profilePic,
      bio,
      dateOfBirth,
    });

    await user.save();

    console.log("User created:", user._id);

    res.status(201).json({ message: "OK" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Something went wrong" });
  }
}

// GET PROFILE (BY ID)
async function getProfile(req, res) {
  try {
    const [user, posts] = await Promise.all([
      User.findById(req.params.id),
      Post.find({ user: req.params.id })
        .populate("user")
        .sort({ createdAt: -1 }),
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user, posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// SEARCH USERS
async function searchUsers(req, res) {
  try {
    const users = await User.find({
      username: {
        $regex: req.query.username || "",
        $options: "i",
      },
    });

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
}

async function handleFollow(req, res) {
  try {
    const friend = await User.findById(req.params.id);
    const user = await User.findById(req.user_id);

    if (!friend || !user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user._id.equals(friend._id)) {
      return res.status(400).json({
        message: "You cannot follow yourself",
      });
    }

    const isFriend = user.friends.some((id) =>
      id.equals(friend._id)
    );

    if (isFriend) {
      await User.updateOne(
        { _id: user._id },
        { $pull: { friends: friend._id } }
      );

      return res.json({ message: "Unfollowed" });
    }

    await User.updateOne(
      { _id: user._id },
      { $addToSet: { friends: friend._id } }
    );

    return res.json({ message: "Followed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error" });
  }
}

// GET USER BY USERNAME
async function getUserByUsername(req, res) {
  try {
    const user = await User.findOne({
      username: req.params.username,
    }).populate("friends");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
}

module.exports = {
  create,
  getProfile,
  searchUsers,
  handleFollow,
  getUserByUsername,
};