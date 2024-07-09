const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.generateAccessToken = (user) => {
  const payload = {
    sub: user._id,
    username: user.username,
  };

  const duration = "7d";

  const signedToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: duration,
  });

  return {
    token: signedToken,
    expiresIn: duration,
  };
};
