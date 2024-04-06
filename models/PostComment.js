const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const postCommentSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  likes: {
    type: Array,
    content: Schema.Types.ObjectId,
    ref: "User",
  },
  timestamp: {
    type: Date,
    required: true,
  },
});

postCommentSchema.virtual("utc_timestamp").get(function () {
  return DateTime.fromJSDate(this.timestamp).toUTC().toISO();
});

module.exports = mongoose.model("PostComment", postCommentSchema);
