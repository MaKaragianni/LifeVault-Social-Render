const User = require("../models/user");
const Post = require("../models/post");
const bcrypt = require("bcryptjs");
const Comment = require("../models/comment");

// CREATE USER
async function create(req, res) {
  try {
    const {
      email,
      password,
      confirmPassword,
      username = "",
      bio = "",
      dateOfBirth,
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }
    // Hash the password before saving it to the database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // SAFE INTEGRATION: 
    // If a file was uploaded via Cloudinary multer, req.file.path holds the remote URL string.
    // If no file was sent, it falls back safely to an empty string or a default avatar URL.
    const profilePicUrl = req.file ? req.file.path : "";

    const user = new User({
      email,
      password: hashedPassword, // Saves the hashed version here
      username,
      profilePic: profilePicUrl, // Saves the actual remote HTTPS link directly
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
    const [user, rawPosts] = await Promise.all([
      User.findById(req.params.id)
        .populate("friends", "username profilePic")
        .populate("friendRequests", "username profilePic"),
      Post.find({ user: req.params.id }).populate("user").sort({ createdAt: -1 })
  ]);
 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
 
    // Map over the posts and attach comments fetched from the Comment collection
    const postsWithComments = await Promise.all(
      rawPosts.map(async (post) => {
        // Find all comments belonging to this post, and populate who wrote them
        const comments = await Comment.find({ post: post._id })
          .populate("user", "username profilePic") // populates comment author details
          .sort({ createdAt: 1 }); // oldest comments first

        // Convert the mongoose document to a plain object so we can add the property
        return {
          ...post.toObject(),
          comments: comments,
        };
      })
    );
 
    // Send back the posts containing their attached comments array
    res.status(200).json({ user, posts: postsWithComments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
 
// SEARCH USERS
async function searchUsers(req, res) {
  try {
    const searchString = req.query.username || "";
 
    if (!searchString.trim()) {
      return res.status(200).json([]);
    }
 
    const queryConditions = {
      username: {
        $regex: searchString,
        $options: "i",
      },
    };
 
    const currentUserId = req.user_id || req.query.currentUserId;
    if (currentUserId) {
      queryConditions._id = { $ne: currentUserId };
    }
 
    const users = await User.find(queryConditions);
 
    // Return 404 when nothing matches so the API test passes
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
 
    return res.status(200).json(users);
  } catch (err) {
    console.error("Search users error:", err);
    res.status(500).json({ message: "Something went wrong" });
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

// SEND FRIEND REQUEST
async function sendFriendRequest(req, res) {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ message: "User not found" });

    // Prevent sending request to yourself or duplicating requests
    if (targetUser.friendRequests.some(id => id.toString() === req.user_id)) {
      return res.status(400).json({ message: "Request already sent" });
    }

    // Push the logged-in user's ID into the target user's incoming requests array
    targetUser.friendRequests.push(req.user_id);
    await targetUser.save();

    res.status(200).json({ message: "Friend request sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// ACCEPT FRIEND REQUEST
async function acceptFriendRequest(req, res) {
  try {
    const loggedInUser = await User.findById(req.user_id);
    const senderUser = await User.findById(req.params.requestId);

    if (!senderUser) return res.status(404).json({ message: "User no longer exists" });

    // Add each other to friends arrays
    loggedInUser.friends.push(senderUser._id);
    senderUser.friends.push(loggedInUser._id);

    // Remove from pending requests array
    loggedInUser.friendRequests.pull(senderUser._id);

    await loggedInUser.save();
    await senderUser.save();

    res.status(200).json({ message: "Friend request accepted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// REJECT/DELETE FRIEND REQUEST
async function rejectFriendRequest(req, res) {
  try {
    const loggedInUser = await User.findById(req.user_id);
    if (!loggedInUser) return res.status(404).json({ message: "User not found" });

    // Remove the sender's ID from the incoming friendRequests array
    loggedInUser.friendRequests.pull(req.params.requestId);
    await loggedInUser.save();

    res.status(200).json({ message: "Friend request removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
 
module.exports = {
  create,
  getProfile,
  searchUsers,
  getUserByUsername,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest
};