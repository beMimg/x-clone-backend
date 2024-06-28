const User = require("../models/User");
const {
  getRandomName,
  getRandomUsername,
  randomColor,
} = require("../utils/utils");
const utils = require("../utils/auth");

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

    res.json({
      user: user.username,
      accessToken: accessToken.token,
      expiresIn: accessToken.expiresIn,
    });
  } catch (err) {
    return next(err);
  }
};
