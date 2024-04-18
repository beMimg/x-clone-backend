const User = require("../models/User");
const {
  getRandomName,
  getRandomUsername,
  randomColor,
} = require("../utils/utils");
const utils = require("../utils/utils");

exports.createAndLogin = async (req, res, next) => {
  try {
    const first_name = getRandomName();
    const email = `${first_name}@gmail.com`;
    const username = getRandomUsername(first_name);
    const usernameLowerCase = username.toLowerCase();
    const password = process.env.GUEST_PASSWORD;
    const profile_color = randomColor();
    const date = Date.now();

    const user = new User({
      first_name: first_name,
      email: email,
      username: username,
      usernameLowerCase: usernameLowerCase,
      password: password,
      profile_color: profile_color,
      date: date,
    });

    await user.save();

    const accessToken = utils.generateAccessToken(user);
    const refreshToken = utils.generateRefreshToken(user);
    user.refreshToken = refreshToken.token;
    await user.save();
    // Set the refresh token in the cookie with httpOnly and secure flag
    // httpOnly flag makes sure that the cookie is not accessible via JavaScript
    // This refreshToken will be used to generate a new access token when the current access token expires
    res.cookie("jwt", refreshToken.token, {
      httpOnly: true,
      secure: true,
      maxAge: 604800000,
      sameSite: "none",
    });

    res.cookie("accessTokenRes", accessToken.token, {
      maxAge: 300000,
      sameSite: "none",
    }); //5min

    res.status(200).json({ message: "Success" });
  } catch (err) {
    return next(err);
  }
};
