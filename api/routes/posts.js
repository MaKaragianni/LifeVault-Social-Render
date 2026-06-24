const express = require("express");
const router = express.Router();

const PostsController = require("../controllers/posts");
const CommentsController = require("../controllers/comments");
const tokenChecker = require("../middleware/tokenChecker");

router.get("/", PostsController.getAllPosts);
router.post("/", PostsController.createPost);
router.post("/:id/like", PostsController.toggleLike);
router.put("/:id", tokenChecker, PostsController.updatePost);

router.post("/:id/comments", tokenChecker, CommentsController.createComment);
router.post("/:id/comments/:commentId/like", tokenChecker, CommentsController.toggleCommentLike);
router.put("/:id/comments/:commentId", tokenChecker, CommentsController.updateComment);

module.exports = router;