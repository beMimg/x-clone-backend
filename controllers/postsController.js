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
