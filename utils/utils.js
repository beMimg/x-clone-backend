const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (user) => {
  const payload = {
    sub: user._id,
    username: user.username,
  };

  const signedToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: "3d",
  });

  return {
    token: "Bearer " + signedToken,
    expiresIn: "3d",
  };
};

module.exports = generateToken;
