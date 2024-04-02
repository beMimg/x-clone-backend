const User = require("../models/User");

exports.logout = async (req, res, next) => {
  try {
    // Client side should delete the access token

    // Get the refresh token from the cookie
    const refreshToken = req.cookies.jwt;

    if (!refreshToken) return res.sendStatus(204); // No content

    const user = await User.findOne({ refreshToken: refreshToken });

    if (!user) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      return res.sendStatus(204);
    }

    // Delete the cookie from client browser
    /* 
    Usually when deleting a cookie, you need to pass all the same options that were set when creating the cookie,
    but maxAge is one of the few exceptions.    
    */
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    // Delete the refresh token in the database
    user.refreshToken = null;
    await user.save();
    res.sendStatus(204);
  } catch (err) {
    return next(err);
  }
};
