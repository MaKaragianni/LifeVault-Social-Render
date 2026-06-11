const User = require("../models/user");
const Post = require("../models/post");

function create(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username || "";
  const profilePic = req.body.profilePic || "";
  const bio = req.body.bio || "";

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

const UsersController = {
  create,
  getProfile,
};

module.exports = UsersController;
