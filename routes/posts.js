const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");

router.get("/", postsController.getAllPosts);

router.post("/", postsController.createPost);

router.delete("/:post_id", postsController.deletePost);

router.post("/:post_id/like", postsController.likePost);

router.delete("/:post_id/like", postsController.deslikePost);

module.exports = router;
