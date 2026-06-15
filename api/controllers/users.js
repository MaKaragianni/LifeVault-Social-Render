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

async function addFriend(req, res) {
  const friend = await User.findById(req.params.id);
  const user = await User.findById(req.user_id);
  user.friends.push(friend._id)
  await user.save();
  return res.status(200).json({ message: "Friend added" })
}

const UsersController = {
  create,
  getProfile,
  searchUsers,
  addFriend,
};

module.exports = UsersController;
