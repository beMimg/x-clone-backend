const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const postCommentSchema = new Schema(
  {
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
  },
  { timestamps: true }
);
// The timestamps: true option in a Mongoose schema automatically adds two new fields to the schema: createdAt and updatedAt
// These fields are automatically updated when a new document is created or an existing document is updated.

module.exports = mongoose.model("PostComment", postCommentSchema);
