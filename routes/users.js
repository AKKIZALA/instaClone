const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/Instaclone");

const usersShchema = mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  password: {
    type: String,
  },
  bio: {
    type: String,
  },
  profileImage: {
    type: String,
  },
  post: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  createdDate: {
    type: Date,
    default: Date.now(),
  },
});

usersShchema.plugin(plm);

module.exports = mongoose.model("User", usersShchema);
