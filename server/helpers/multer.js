const multer = require("multer");
const fs = require("fs");
const path = require("path");

const userItems = path.join(__dirname, "..", "user_items");
const idValidation = path.join(__dirname, "..", "user_ids");

if (!fs.existsSync(userItems)) {
  fs.mkdirSync(userItems, { recursive: true });
}

if (!fs.existsSync(idValidation)) {
  fs.mkdirSync(idValidation, { recursive: true });
}

const itemStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, userItems);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const idStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, idValidation);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const itemUpload = multer({
  storage: itemStorage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

// Also export an uploader for ID validation if needed
const idUpload = multer({
  storage: idStorage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

module.exports = { itemUpload, idUpload };
