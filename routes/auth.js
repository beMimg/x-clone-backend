const express = require("express");
const passport = require("passport");
const { authenticate } = require("passport");
const router = express.Router();
const generateToken = require("../utils/utils");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

router.post("/", async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(401).json({ message: "Invalid username" });
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const jwtIssued = generateToken(user);

    return res.json({
      user: user.username,
      token: jwtIssued.token,
      expiesIn: jwtIssued.expiresIn,
    });
  } catch (err) {
    return next(err);
  }
});

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.json({ message: "Authenticated", user: req.user.username });
  }
);

module.exports = router;
