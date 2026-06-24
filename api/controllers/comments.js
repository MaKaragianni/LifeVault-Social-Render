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
      likes: [],
    });

    await newComment.save();

    // Populate user so the frontend receives username immediately
    const populated = await newComment.populate("user", "username profilePic");

    res.status(201).json({ message: "Comment created successfully", comment: populated });
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(500).json({ message: "Failed to create comment" });
  }
}

async function toggleCommentLike(req, res) {
  try {
    const { id: postId, commentId } = req.params;
    const userId = req.user_id;

    const comment = await Comment.findOne({ _id: commentId, post: postId });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const alreadyLiked = comment.likes.some(
      (likeId) => likeId.toString() === userId
    );

    if (alreadyLiked) {
      comment.likes.pull(userId);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    return res.status(200).json({ comment: { ...comment.toObject() } });
  } catch (err) {
    console.error("Error toggling comment like:", err);
    res.status(500).json({ message: "Failed to like comment" });
  }
}

async function updateComment(req, res) {
  try {
    const { id: postId, commentId } = req.params;

    const comment = await Comment.findOne({
      _id: commentId,
      post: postId,
    });

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (comment.user.toString() !== req.user_id) {
      return res.status(403).json({
        message: "Not authorised",
      });
    }

    comment.message = req.body.message;

    await comment.save();

    return res.status(200).json({
      message: "Comment updated successfully",
      comment,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to update comment",
    });
  }
}

module.exports = { createComment, toggleCommentLike, updateComment };