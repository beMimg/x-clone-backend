const User = require("../models/User");
const jwt = require("jsonwebtoken");
const utils = require("../utils/utils");

const handleRefreshToken = async (req, res, next) => {
  try {
    // extract the refresh token from the cookie
    const cookies = req.cookies;
    if (!cookies.jwt) {
      return res.sendStatus(401);
    }
    const refreshToken = cookies.jwt;

    // name this foundUser instead of user, otherwise it will conflict with the user object in the jwt.verify callback
    const foundUser = await User.findOne({ refreshToken: refreshToken });
    if (!foundUser) {
      return res.sendStatus(403);
    }

    // verify if the refresh token is valid
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      // if the refreshToken is valid then generate a new accessToken and return it to the client
      const accessToken = utils.generateAccessToken(foundUser);

      res.json({
        user: foundUser.username,
        accessToken: accessToken.token,
        expiresIn: accessToken.expiresIn,
      });
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = { handleRefreshToken };
