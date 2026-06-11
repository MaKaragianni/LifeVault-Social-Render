const multer = require("multer");
const express = require("express");
const path = require("path");

const router = express.Router();

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../uploads"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const baseUrl = `${req.protocol}://${req.get("host")}`;

  res.json({
    imageUrl: `${baseUrl}/uploads/${req.file.filename}`,
  });
});

module.exports = router;