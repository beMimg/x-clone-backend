const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.getAllUsers = async (req, res, next) => {
  try {
    // $ne operator to find documents whera a field is not equal to a specified value
    const users = await User.find({ _id: { $ne: req.user._id } }, "username");

    return res.json({ users: users });
  } catch (err) {
    return next(err);
  }
};

exports.create = [
  // Validate form fields
  body("first_name")
    .trim()
    .escape()
    .matches(/^\S+$/)
    .withMessage("First name must be a single word without spaces")
    .isLength({ min: 1 })
    .withMessage("First name required")
    .isLength({ max: 12 })
    .withMessage("First name must have a maximum of 12 characters"),
  body("username")
    .trim()
    .escape()
    .matches(/^\S+$/)
    .withMessage("Username must be a single word without spaces")
    .isLength({ min: 1 })
    .withMessage("Username required")
    .isLength({ max: 12 })
    .withMessage("Username must have a maximum of 12 characters"),
  body("email")
    .trim()
    .escape()
    .isEmail()
    .withMessage("Invalid email address")
    .isLength({ min: 1 })
    .withMessage("Email required")
    .isLength({ max: 255 })
    .withMessage("Email must have a maximum of 255 characters"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must have at least 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage(
      "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .escape(),
  body("password_confirmation")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Passwords didn't match."),

  // Handle validation errors
  async (req, res, next) => {
    const errors = validationResult(req);

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // Convert username to lowercase for consistent storage and comparison
    const usernameLowerCase = req.body.username.toLowerCase();

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const existsUsername = await User.findOne({ usernameLowerCase });

    if (existsUsername) {
      return res.status(409).json({ errors: "Username already exists" });
    }

    const user = new User({
      first_name: req.body.first_name,
      email: req.body.email,
      username: req.body.username,
      usernameLowerCase: usernameLowerCase,
      password: hashedPassword,
      date: Date.now(),
    });

    await user.save();
    // Return a success message
    return res.status(201).json({ message: "User created" });
  },
];

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.user_id, "-password -githubId");

    if (!user) {
      return res.status(404).json({ message: "User not found" }); // Not found
    }

    res.status(200).json({ user });
  } catch (err) {
    return next(err);
  }
};

exports.followUser = async (req, res, next) => {
  try {
    const followUserTarget = await User.findById(
      req.params.user_id,
      "-password"
    );

    if (!followUserTarget) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(followUserTarget.followers);
    const isFollowed = followUserTarget.followers.includes(req.user._id);
    console.log(req.user);

    const isFollowing = req.user.followings.includes(followUserTarget._id);
    if (isFollowed || isFollowing) {
      return res.status(409).json({ message: "Already following this user" }); // Conflict status
    }

    req.user.followings.push(followUserTarget._id);
    followUserTarget.followers.push(req.user._id);

    await Promise.all([req.user.save(), followUserTarget.save()]);
    res
      .status(200)
      .json({ message: `You have followed ${followUserTarget.username}` });
  } catch (err) {
    return next(err);
  }
};
