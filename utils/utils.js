const jwt = require("jsonwebtoken");
require("dotenv").config();
const crypto = require("crypto");
// Access token has a short duration
exports.generateAccessToken = (user) => {
  const payload = {
    sub: user._id,
    username: user.username,
  };

  const duration = "1h";

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

exports.getRandomName = () => {
  const randomNames = [
    "John",
    "Everest",
    "Elon",
    "Elen",
    "Fred",
    "Jihn",
    "Flor",
    "Beauty",
  ];

  const randomNumber = Math.floor(Math.random() * randomNames.length);

  return randomNames[randomNumber];
};

exports.getRandomUsername = (first_name) => {
  const randomString = crypto.randomBytes(8).toString("hex");

  const username = `${first_name}${randomString}`;
  return username;
};
