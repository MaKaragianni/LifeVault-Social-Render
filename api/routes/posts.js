const express = require("express");
const router = express.Router();

const PostsController = require("../controllers/posts");
const CommentsController = require("../controllers/comments");
const tokenChecker = require("../middleware/tokenChecker");

router.get("/", PostsController.getAllPosts);
router.post("/", PostsController.createPost);
router.post("/:id/like", PostsController.toggleLike);

router.post("/:id/comments", tokenChecker, CommentsController.createComment);

module.exports = router;