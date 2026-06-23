const User = require("../models/user");
const { generateToken } = require("../lib/token");
const bcrypt = require("bcryptjs");

async function createToken(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({ email: email });
  if (!user) {
    console.log("Auth Error: User not found");
    return res.status(401).json({ message: "User not found" });
  } 
  
  const isMatch = await bcrypt.compare(password, user.password);
  
  if (!isMatch) {
    console.log("Auth Error: Passwords do not match");
    return res.status(401).json({ message: "Password incorrect" });
  } else {
    const token = generateToken(user.id);
    return res.status(201).json({ message: "OK", token: token, userId: user.id });
  }
}

const AuthenticationController = {
  createToken: createToken,
};

module.exports = AuthenticationController;