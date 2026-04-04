const multer = require("multer");
const ApiError = require("../utils/ApiError");

const storage = multer.memoryStorage();

const fileFilter = (allowedTypes) => (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, `File type not allowed. Allowed: ${allowedTypes.join(", ")}`), false);
  }
};

const imageUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter(["image/jpeg", "image/png", "image/webp"]),
});

const audioUpload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: fileFilter(["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg"]),
});

const documentUpload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: fileFilter(["application/pdf", "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]),
});

module.exports = { imageUpload, audioUpload, documentUpload };