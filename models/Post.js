const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const postSchema = new mongoose.Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  likes: {
    type: Array,
    contentType: Schema.Types.ObjectId,
    ref: "User",
  },
  numberOfComments: {
    type: Number,
  },
});

postSchema.virtual("utc_timestamp").get(function () {
  return DateTime.fromJSDate(this.timestamp).toUTC().toISO();
});

module.exports = mongoose.model("Post", postSchema);
