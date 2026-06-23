const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true, trim: true },
  dateOfBirth: { type: Date, required: true },
  profilePic: { type: String, default: "" },
  bio: { type: String, default: "" },

  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: []
  }],
  friendRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: []
  }]
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
module.exports = User;