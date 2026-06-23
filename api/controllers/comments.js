const Comment = require("../models/comment");

async function createComment(req, res) {
  try {
    const { message } = req.body;
    const postId = req.params.id;
    const userId = req.user_id;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const newComment = new Comment({
      message: message,
      user: userId,
      post: postId,
    });

    await newComment.save();
    res.status(201).json({ message: "Comment created successfully", comment: newComment });
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(500).json({ message: "Failed to create comment" });
  }
}

module.exports = { createComment };