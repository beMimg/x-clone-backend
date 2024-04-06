const Post = require("../models/Post");
const PostComment = require("../models/PostComment");
const { body, validationResult } = require("express-validator");

exports.createComment = [
  body("text")
    .isLength({ min: 1 })
    .withMessage("Comments must have at least 1 character")
    .isLength({ max: 200 })
    .withMessage("Comments must have a maximum of 200 characters"),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(409).json({ errors: errors.array() });
      }

      const post = await Post.findById(req.params.post_id);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const comment = new PostComment({
        author: req.user._id,
        postId: post._id,
        text: req.body.text,
      });

      await comment.save();
      res.status(200).json({ message: "You've commented this post" });
    } catch (err) {
      return next(err);
    }
  },
];
