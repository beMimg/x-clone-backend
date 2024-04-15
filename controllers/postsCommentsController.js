const Post = require("../models/Post");
const PostComment = require("../models/PostComment");
const { body, validationResult } = require("express-validator");

exports.getAllComments = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const allComments = await PostComment.find({ postId: post._id })
      .populate({
        path: "author",
        select: "username profile_pic_src first_name profile_color",
      })
      .sort({
        createdAt: -1,
      });

    if (allComments.length === 0) {
      return res
        .status(200)
        .json({ message: "No comments found for this post" });
    }

    res.status(200).json({ allComments });
  } catch (err) {
    return next(err);
  }
};

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

      post.numberOfComments = post.numberOfComments + 1;
      await post.save();
      await comment.save();
      res.status(200).json({ message: "You've commented this post" });
    } catch (err) {
      return next(err);
    }
  },
];

exports.getComment = async (req, res, next) => {
  try {
    const comment = await PostComment.findById(req.params.comment_id).populate({
      path: "likes",
      select: "profile_pic_src username",
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json({ comment });
  } catch (err) {
    return next(err);
  }
};

exports.likeComment = async (req, res, next) => {
  try {
    const comment = await PostComment.findById(req.params.comment_id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.likes.push(req.user._id);
    await comment.save();
    res.status(200).json({ message: "You liked this comment" });
  } catch (err) {
    return next(err);
  }
};

exports.deslikeComment = async (req, res, next) => {
  try {
    const comment = await PostComment.findById(req.params.comment_id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // the index of the user._id in the likes array
    const authorIndex = comment.likes.indexOf(req.user._id);

    comment.likes.splice(authorIndex, 1);
    await comment.save();
    res.status(200).json({ message: "You desliked this comment." });
  } catch (err) {
    return next(err);
  }
};
