const User = require("../models/User");
const utils = require("../utils/utils");

exports.logout = async (req, res, next) => {
  // On client-side, also delete the access token when the user logs out
  try {
    // extract the refresh token from the cookie
    const cookies = req.cookies;
    if (!cookies.jwt) {
      return res.sendStatus(204); // No content
    }

    const refreshToken = cookies.jwt;

    // name this foundUser instead of user, otherwise it will conflict with the user object in the jwt.verify callback
    // is refreshToken in db?
    const foundUser = await User.findOne({ refreshToken: refreshToken });
    if (!foundUser) {
      // need to pass the same options as when the cookie was set, otherwise the cookie will not be deleted
      // except maxAge (not needed)
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      return res.sendStatus(204);
    }

    res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "none" });
    foundUser.refreshToken = null;
    await foundUser.save();
    res.sendStatus(204);
  } catch (err) {
    return next(err);
  }
};
