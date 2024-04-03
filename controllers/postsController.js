const Post = require("../models/Post");
const { body, validationResult } = require("express-validator");

exports.createPost = [
  body("text")
    .isLength({ max: 300 })
    .withMessage("The text must contain a maximum of 300 characters.")
    .isLength({ min: 1 })
    .withMessage("The text must contain at least 1 character."),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(409).json({ errors: errors.array() });
      }

      const newPost = new Post({
        author: req.user._id,
        text: req.body.text,
        timestamp: Date.now(),
      });

      await newPost.save();
      res.status(200).json({ message: "You have created a post" });
    } catch (err) {
      return next(err);
    }
  },
];

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // equals method provided by Mongoose to compare objectIDs, this method checks if two objectIDs are the same, regardless of wheter they are strings or ObjectIDs
    const isAuthor = post.author._id.equals(req.user._id);

    if (!isAuthor) {
      return res
        .status(403)
        .json({ message: "You are not the author of this post" });
    }

    await post.deleteOne();
    res.status(200).json({ message: "You have deleted this post" });
  } catch (err) {
    return next(err);
  }
};

exports.likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isLiked = post.likes.includes(req.user._id);

    if (isLiked) {
      return res.status(409).json({ message: "You already like this post" });
    }

    post.likes.push(req.user._id);
    await post.save();
    // sends the updatePost with updated likes
    res.status(200).json({ message: "You liked this post", post: post });
  } catch (err) {
    return next(err);
  }
};
