const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  profile_pic_src: {
    type: String,
  },
  followings: [
    {
      contentType: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  followers: [
    {
      contentType: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
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
