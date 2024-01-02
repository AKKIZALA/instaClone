const mongoose = require("mongoose");

const postschema = mongoose.Schema({
  picture: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  caption: {
    type: String,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  Date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('Post',postschema)