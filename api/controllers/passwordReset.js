const crypto = require("crypto");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const PasswordResetToken = require(
  "../models/PasswordResetToken"
);

exports.requestReset = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.json({
        message:
          "If account exists, token created",
      });
    }

    const token =
      crypto.randomBytes(32).toString("hex");

    await PasswordResetToken.create({
      userId: user._id,
      token,
      expiresAt:
        new Date(Date.now() + 15 * 60 * 1000),
    });

    console.log(
      `Password reset token for ${email}: ${token}`
    );

    res.json({
      message:
        "Reset token generated. Check backend logs.",
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const resetToken =
      await PasswordResetToken.findOne({
        token,
      });

    if (
      !resetToken ||
      resetToken.expiresAt < new Date()
    ) {
      return res.status(400).json({
        message: "Invalid token",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(
      resetToken.userId,
      {
        password: hashedPassword,
      }
    );

    await PasswordResetToken.deleteMany({
      userId: resetToken.userId,
    });

    res.json({
      message: "Password updated",
    });
  } catch (error) {
    res.status(500).json(error);
  }
};