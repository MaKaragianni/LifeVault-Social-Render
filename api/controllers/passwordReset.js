const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const PasswordResetToken = require("../models/PasswordResetToken");

async function requestReset(req, res) {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        message: "If account exists, token created",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    await PasswordResetToken.create({
      userId: user._id,
      token,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    console.log(`RESET TOKEN (${email}): ${token}`);

    return res.status(200).json({
      message: "Reset token generated",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;

    const resetToken = await PasswordResetToken.findOne({
      token,
    });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(resetToken.userId, {
      password: hashedPassword,
    });

    await PasswordResetToken.deleteMany({
      userId: resetToken.userId,
    });

    return res.json({ message: "Password updated" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  requestReset,
  resetPassword,
};