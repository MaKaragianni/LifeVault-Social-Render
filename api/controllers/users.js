const User = require("../models/user");
const Post = require("../models/post");

function create(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const username = req.body.username || "";
  const profilePic = req.body.profilePic || "";
  const bio = req.body.bio || "";

  // Enforcing validation of matching passwords before touching Mongoose
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  // confirmPassword is left out here, so that it doesn't save in MongoDB
  const user = new User({ email, password, username, profilePic, bio });
  user
    .save()
    .then((user) => {
      console.log("User created, id:", user._id.toString());
      res.status(201).json({ message: "OK" });
    })
    .catch((err) => {
      console.error(err);
      res.status(400).json({ message: "Something went wrong" });
    });
}

function getProfile(req, res) {
  Promise.all([
    User.findById(req.params.id),
    Post.find({ user: req.params.id })
      .populate("user")
      .sort({ createdAt: -1 }),
  ])
    .then(([user, posts]) => {
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.status(200).json({
        user,
        posts,
      });
    })
    .catch((err) => {
      console.error(err);

      res.status(500).json({
        message: "Server error",
      });
    });
}

async function searchUsers(req, res) {
  try {
    const user = await User.find({ username: req.query.username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
}

async function handleFollow(req, res) {
  const friend = await User.findById(req.params.id);
  const user = await User.findById(req.user_id);
  try {
    if (user.friends.includes(friend._id)) {
      await User.updateOne(
        {_id: user._id},
        {$pull: {friends: friend._id}
      })
      return res.status(200).json({
        message: "Unfollowed"
      })
  } else {
      await User.updateOne(
        {_id: user._id},
        {$addToSet: {friends: friend._id}
      })
      return res.status(200).json({
        message: "Followed"
      })
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Something went wrong"
    });
  }
}

const UsersController = {
  create,
  getProfile,
  searchUsers,
  handleFollow,
};

module.exports = UsersController;