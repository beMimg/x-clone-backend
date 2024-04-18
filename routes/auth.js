const express = require("express");
const passport = require("passport");
const { authenticate } = require("passport");
const router = express.Router();
const utils = require("../utils/utils");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  handleRefreshToken,
} = require("../controllers/refresh-tokenController");
const guestController = require("../controllers/guestController");
const { BASE_URL, FRONTEND_URL } = require("../utils/constants");

router.get("/refresh", handleRefreshToken);

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

    const accessToken = utils.generateAccessToken(user);

    const refreshToken = utils.generateRefreshToken(user);

    user.refreshToken = refreshToken.token;
    await user.save();
    // Set the refresh token in the cookie with httpOnly and secure flag
    // httpOnly flag makes sure that the cookie is not accessible via JavaScript
    // This refreshToken will be used to generate a new access token when the current access token expires
    res.cookie("jwt", refreshToken.token, {
      httpOnly: true,
      secure: true,
      maxAge: 604800000,
      sameSite: "none",
    });

    res.json({
      user: user.username,
      accessToken: accessToken.token,
      expiresIn: accessToken.expiresIn,
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
    failureRedirect: `${FRONTEND_URL}/login`,
  }),

  async function (req, res) {
    const user = req.user;
    const accessToken = utils.generateAccessToken(user);

    const refreshToken = utils.generateRefreshToken(user);

    user.refreshToken = refreshToken.token;
    await user.save();

    // Set the refresh token in the cookie with httpOnly and secure flag
    // httpOnly flag makes sure that the cookie is not accessible via JavaScript
    // This refreshToken will be used to generate a new access token when the current access token expires
    res.cookie("jwt", refreshToken.token, {
      httpOnly: true,
      secure: true,
      maxAge: 604800000,
      sameSite: "none",
    });

    res.cookie("accessTokenRes", accessToken.token, {
      maxAge: 300000,
      sameSite: "none",
      secure: true,
    }); //5min

    res.redirect(`${FRONTEND_URL}/socials-saving`);
  }
);

router.post("/guest", guestController.createAndLogin);
module.exports = router;
