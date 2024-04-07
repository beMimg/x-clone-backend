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
      expiresIn: jwtIssued.expiresIn,
    });
  } catch (err) {
    return next(err);
  }
});

// {session: false} otherwise error will accour saying that session is not required.
// Not using sessions in this case.
router.get(
  "/github",
  passport.authenticate("github", { session: false, scope: ["user:email"] })
);

// If a user is sucessfully authenticated, token will be generated and sent back to the user.
router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "/login",
  }),
  function (req, res) {
    const user = req.user;
    const jwtIssued = generateToken(user);

    return res.json({
      user: user.username,
      token: jwtIssued.token,
      expiresIn: jwtIssued.expiresIn,
    });
  }
);

module.exports = router;
