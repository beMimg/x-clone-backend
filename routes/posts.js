const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");
const postsCommentsRoute = require("./postsComments");

router.get("/", postsController.getAllPosts);

router.post("/", postsController.createPost);

router.get("/self", postsController.getAllPostsByUser);

router.get("/liked", postsController.getLikedPosts);

router.get("/:post_id", postsController.getOnePost);

router.delete("/:post_id", postsController.deletePost);

router.post("/:post_id/like", postsController.likePost);

router.delete("/:post_id/like", postsController.deslikePost);

// children route for post comments
router.use("/:post_id/comments", postsCommentsRoute);

module.exports = router;
