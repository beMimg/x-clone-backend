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
    "bg-rose-500",
    "bg-red-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-teal-500",
    "bg-yellow-500",
    "bg-orange-500",
    "bg-purple-500",
  ];

  const randomNumber = Math.floor(Math.random() * colors.length);

  return colors[randomNumber];
};
