const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

exports.refreshToken = async (req, res, next) => {
  try {
    // Extract JWT from cookies
    const refreshToken = req.cookies.jwt;

    // If no JWT, send 401 Unauthorized status
    if (!refreshToken) return res.sendStatus(401);

    // Find user with matching refreshToken
    const user = await User.findOne({ refreshToken: refreshToken });

    // If no user found, send 403 Forbidden status
    if (!user) return res.sendStatus(403);

    // Verify the refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      // If verification fails, send 403 status
      if (err) return res.sendStatus(403);

      // If varifications succeeds, create a new accessToken
      const accessToken = jwt.sign(
        { username: user.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30s" }
      );
      // Send the new accessToken as a json
      res.json({ accessToken });
    });
  } catch (err) {
    return next(err);
  }
};
