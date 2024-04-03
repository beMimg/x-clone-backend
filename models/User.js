const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  githubId: {
    type: String,
  },

  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  usernameLowerCase: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  profile_pic_src: {
    type: String,
  },
  followings: { type: Array, contentType: Schema.Types.ObjectId, ref: "User" },
  followers: { type: Array, contentType: Schema.Types.ObjectId, ref: "User" },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
  },
});

userSchema.virtual("utc_creation").get(function () {
  return DateTime.fromJSDate(this.date).toUTC().toISO();
});

module.exports = mongoose.model("User", userSchema);
