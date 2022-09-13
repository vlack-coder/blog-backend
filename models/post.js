const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    meta: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    tags: [String],
    author: {
      // type: mongoose.Schema.Types.ObjectId
      type: String,
      default: "Admin",
    },
    thumbnail: {
      type: Object,
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);
