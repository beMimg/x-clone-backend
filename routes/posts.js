const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");

router.post("/", postsController.createPost);

router.delete("/:post_id", postsController.deletePost);

module.exports = router;
