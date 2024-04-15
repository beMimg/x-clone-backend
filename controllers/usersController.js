const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { randomColor } = require("../utils/utils");
const cloudinary = require("../utils/cloudinary");

exports.getAllUsers = async (req, res, next) => {
  try {
    // $ne operator to find documents whera a field is not equal to a specified value
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;
    const skip = (page - 1) * 10;

    const users = await User.find(
      { _id: { $ne: req.user._id } },
      "username first_name profile_pic_src profile_color"
    )
      .sort({ date: 1 })
      .skip(skip)
      .limit(pageSize);

    if (users.length === 0) {
      return res.status(404).json({ message: "There are no users yet." });
    }
    return res.status(200).json({ users: users });
  } catch (err) {
    return next(err);
  }
};

exports.getTopUsers = async (req, res, next) => {
  try {
    // Top users will be based in the number of followers.
    const users = await User.aggregate([
      {
        $project: {
          _id: 1,
          first_name: 1,
          profile_pic_src: 1,
          profile_color: 1,
          username: 1,
          followersCount: { $size: "$followers" },
          // create a proprety folowersCount with the size of followers array
        },
      },
      {
        // sort the followersCount by descending order
        $sort: { followersCount: -1 },
      },
      {
        // only the first 5
        $limit: 6,
      },
    ]);

    return res.status(200).json({ users });
  } catch (err) {
    return next(err);
  }
};

exports.getSelf = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id, "-password -refreshToken");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
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
    const randomProfileColor = randomColor();

    const user = new User({
      first_name: req.body.first_name,
      email: req.body.email,
      username: req.body.username,
      usernameLowerCase: usernameLowerCase,
      password: hashedPassword,
      date: Date.now(),
      profile_color: randomProfileColor,
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

    const isFollowed = followUserTarget.followers.includes(req.user._id);

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

exports.deleteFollow = async (req, res, next) => {
  try {
    const userTarget = await User.findById(req.params.user_id);

    if (!userTarget) {
      return res.status(404).json({ message: "User not found" });
    }

    /*
     indexOf, returns the index of a given element in an array,
     if that element doesn't exists it returns -1, for that reason,
     we check if is <0 the target user is not beinf followed so the user
     cannot unfollow.
    */
    const isFollowedIndex = userTarget.followers.indexOf(req.user._id);

    const isFollowingIndex = req.user.followings.indexOf(userTarget._id);

    // If the user is not following, cannot unfollow
    if (isFollowedIndex < 0 && isFollowingIndex < 0) {
      return res
        .status(409)
        .json({ message: "You are not following this user" });
    }

    // With the returned index from the indexOf, remove that id from the array.
    userTarget.followers.splice(isFollowedIndex, 1);
    req.user.followings.splice(isFollowingIndex, 1);

    await Promise.all([req.user.save(), userTarget.save()]);
    res.status(200).json({ message: `You unfollowed ${userTarget.username}` });
  } catch (err) {
    return next(err);
  }
};

exports.updateProfilePic = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Update user's profile_pic_src with the image URL
    req.user.profile_pic_src = result.secure_url;

    // Save the updated user
    await req.user.save();

    // Return success message with the updated user
    return res
      .status(200)
      .json({ message: "Profile picture updated", user: req.user });
  } catch (err) {
    return next(err);
  }
};

exports.getUserFollowings = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.user_id, "followings").populate(
      {
        path: "followings",
        select: "profile_color first_name username profile_pic_src",
      }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ users: user.followings });
  } catch (err) {
    return next(err);
  }
};

exports.getUserFollowers = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.user_id, "followers").populate({
      path: "followers",
      select: "profile_color first_name username profile_pic_src",
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ users: user.followers });
  } catch (err) {
    return next(err);
  }
};
