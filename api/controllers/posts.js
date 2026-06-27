const Post = require("../models/post");
const { generateToken } = require("../lib/token");
const User = require("../models/user");
const Comment = require("../models/comment");

async function getAllPosts(req, res) {
  try {
    const posts = await Post.find()
      .populate("user")
      .sort({ createdAt: -1 });

    const validPosts = posts.filter((post) => post.user);

    const postsWithComments = await Promise.all(
      validPosts.map(async (post) => {
        const comments = await Comment.find({ post: post._id })
          .populate("user", "username profilePic")
          .sort({ createdAt: 1 });

        return {
          ...post.toObject(),
          comments: comments,
        };
      })
    );

    const token = generateToken(req.user_id);

    res.status(200).json({
      posts: postsWithComments,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch posts" });
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
    res.status(500).json({ message: "Failed to create post" });
  }
}

async function updatePost(req, res) {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Only the post owner can edit
    if (post.user.toString() !== req.user_id) {
      return res.status(403).json({ message: "Not authorised to edit this post" });
    }

    if (req.body.message !== undefined) post.message = req.body.message;
    if (req.body.image !== undefined) post.image = req.body.image;

    await post.save();

    const token = generateToken(req.user_id);

    res.status(200).json({ message: "Post updated", post, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update post" });
  }
}

async function toggleLike(req, res) {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
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
    res.status(500).json({ message: "Failed to like post" });
  }
}

module.exports = { getAllPosts, createPost, updatePost, toggleLike };