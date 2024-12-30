const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// Cloudinary configuration
cloudinary.config({
  cloud_name: "dfkagvqr4", // Your Cloudinary cloud name
  api_key: "694545163521249", // Your Cloudinary API key
  api_secret: "f5js3BWBcyEBLJ6M8ynSOI_Nz1o", // Your Cloudinary API secret
});

// Multer setup with memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * Utility function to upload an image to Cloudinary
 * @param {Buffer} file - The file buffer to be uploaded
 * @returns {Promise<Object>} - The Cloudinary upload response
 * @throws {Error} - If the upload fails
 */
async function imageUploadUtil(file) {
  try {
    const result = await cloudinary.uploader.upload(file, {
      resource_type: "auto", // Automatically detects the file type
    });
    return result;
  } catch (error) {
    console.error("Cloudinary upload failed:", error.message);
    throw new Error("Image upload failed. Please check the file and try again.");
  }
}

module.exports = { upload, imageUploadUtil };
