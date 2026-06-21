const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },

  // NOTE: should be hashed via bcrypt (handled in controller)
  password: { type: String, required: true },

  username: { type: String, required: true, unique: true, trim: true },

  dateOfBirth: { type: Date, required: true },

  profilePic: { type: String, default: "" },

  bio: { type: String, default: "" },

  // DIRECT FRIENDS LIST (used AFTER request accepted)
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;