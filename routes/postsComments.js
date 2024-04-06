const express = require("express");
const postsCommentsController = require("../controllers/postsCommentsController");
// merge params set to true to get the req.params.post_id from post route
const router = express.Router({ mergeParams: true });

router.post("/", postsCommentsController.createComment);

module.exports = router;
