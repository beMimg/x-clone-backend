const jwt = require("jsonwebtoken");
require("dotenv").config();

// Access token has a short duration
exports.generateAccessToken = (user) => {
  const payload = {
    sub: user._id,
    username: user.username,
  };

  const duration = "5m";

  const signedToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: duration,
  });

  return {
    token: signedToken,
    expiresIn: duration,
  };
};

// Refresh token has a longer duration than access token
exports.generateRefreshToken = (user) => {
  const payload = {
    sub: user._id,
    username: user.username,
  };

  const duration = "7d";

  const signedToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: duration,
  });

  return {
    token: signedToken,
    expiresIn: duration,
  };
};

exports.randomColor = () => {
  const colors = [
    "rose",
    "red",
    "green",
    "blue",
    "teal",
    "yellow",
    "orange",
    "purple",
  ];

  const randomNumber = Math.floor(Math.random() * colors.length);

  return colors[randomNumber];
};
