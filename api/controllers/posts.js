const Post = require("../models/post");
const { generateToken } = require("../lib/token");

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
      message: req.body.message,
      image: req.body.image || "",
      user: req.user_id,
    });

    await post.save();

    const token = generateToken(req.user_id);

    res.status(201).json({
      message: "Post created",
      token,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to create post",
    });
  }
}

const PostsController = {
  getAllPosts: getAllPosts,
  createPost: createPost,
};

module.exports = PostsController;