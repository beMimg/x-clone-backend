const User = require("../models/User");

exports.logout = async (req, res, next) => {
  try {
    // Client side should delete the access token

    // Get the refresh token from the cookie
    const refreshToken = req.cookies.jwt;

    if (!refreshToken) return res.sendStatus(204); // No content

    const user = await User.findOne({ refreshToken: refreshToken });

    if (!user) {
      res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
      return res.sendStatus(204);
    }

    // Delete the cookie from client browser
    res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // secure: true for https
    // Delete the refresh token in the database
    user.refreshToken = null;
    await user.save();
    res.sendStatus(204);
  } catch (err) {
    return next(err);
  }
};
