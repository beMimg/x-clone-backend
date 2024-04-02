const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

exports.handleLogin = async (req, res, next) => {
  try {
    const usernameLowerCase = req.body.username.toLowerCase();

    const user = await User.findOne({ usernameLowerCase: usernameLowerCase });

    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const accessToken = jwt.sign(
      { username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );

    const refreshToken = jwt.sign(
      { username: user.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "4d" }
    );

    await User.findByIdAndUpdate(user._id, { refreshToken });

    // this is not available to javascript, it's more secure.
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ accessToken });
  } catch (err) {
    return next(err);
  }
};
