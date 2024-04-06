const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
});

module.exports = mongoose.model("PostComment", postCommentSchema);
