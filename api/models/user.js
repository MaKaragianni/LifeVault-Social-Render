const mongoose = require("mongoose");

// confirmPassword is left out here, so that it doesn't save in MongoDB
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, default: "", unique: true },
  profilePic: { type: String, default: "" },
  bio: { type: String, default: "" },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    validate: {
      validator: function(friendId) {
        return !friendId.equals(this._id);
      },
      message: "You cannot follow yourself"
    }
  }],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
