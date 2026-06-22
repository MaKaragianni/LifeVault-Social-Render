const Post = require("../models/post");
const { generateToken } = require("../lib/token");
const User = require("../models/user");

async function getAllPosts(req, res) {
  try {
    const posts = await Post.find()
      .populate("user")
      .sort({ createdAt: -1 });

    const validPosts = posts.filter((post) => post.user);

    const token = generateToken(req.user_id);

    res.status(200).json({
      posts: validPosts,
      token,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to fetch posts",
    });
  }
}

async function createPost(req, res) {
  try {
    const post = new Post({
      message: req.body.message || "",
      image: req.body.image || "",
      user: req.user_id,
    });

    await post.save();

    const token = generateToken(req.user_id);

    res.status(201).json({
      message: "Post created successfully",
      token,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to create post",
    });
  }
}

async function toggleLike(req, res) {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json ({message: "Post not found"});
    }

    const alreadyLiked = post.likes.some(
      (likeID) => likeID.toString() === req.user_id
    );

    if (alreadyLiked) {
      post.likes.pull(req.user_id);
    } else {
      post.likes.push(req.user_id);
    }

    await post.save();

    return res.status(200).json({ likes: post.likes });

    } catch (err) {
    console.error(err);
    res.status(500).json({message: "Failed to like post"});
  }
};

module.exports = { getAllPosts, createPost, toggleLike };