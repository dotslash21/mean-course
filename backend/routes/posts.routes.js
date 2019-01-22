const express = require("express");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file-storage");
const PostsController = require("../controllers/posts.controller");

const router = express.Router();

// Get posts
router.get("", PostsController.getPosts);

// Get post by ID
router.get("/:id", PostsController.getPostById);

// Add post
router.post("", checkAuth, extractFile, PostsController.createPost);

// Update post
router.put("/:id", checkAuth, extractFile, PostsController.updatePost);

// Delete post/api/posts
router.delete("/:id", checkAuth, PostsController.deletePost);

module.exports = router;
