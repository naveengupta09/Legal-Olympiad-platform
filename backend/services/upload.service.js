const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFromBuffer = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    stream.end(buffer);
  });
};

const uploadImage = async (file, folder = "general") => {
  const result = await uploadFromBuffer(file.buffer, {
    folder: `legal-olympiad/${folder}`,
    resource_type: "image",
    transformation: [{ quality: "auto", fetch_format: "auto" }],
  });
  return result.secure_url;
};

const uploadAudio = async (file) => {
  const result = await uploadFromBuffer(file.buffer, {
    folder: "legal-olympiad/podcasts",
    resource_type: "video",
  });
  return result.secure_url;
};

const uploadDocument = async (file) => {
  const result = await uploadFromBuffer(file.buffer, {
    folder: "legal-olympiad/documents",
    resource_type: "raw",
  });
  return result.secure_url;
};

const deleteFile = async (publicId) => {
  return cloudinary.uploader.destroy(publicId);
};

module.exports = { uploadImage, uploadAudio, uploadDocument, deleteFile };