import cloudinary from "../config/cloudinary.js";

/**
 * Upload an image to Cloudinary.
 * @param {Buffer|string} file - Buffer for multer memory uploads, or a base64/URL string
 * @param {{ folder?: string, publicId?: string, [key: string]: any }} options
 * @returns {Promise<{ url: string, publicId: string }>}
 */
const uploadImage = async (file, options = {}) => {
  const { folder, publicId, ...rest } = options;
  const uploadOptions = {
    resource_type: "auto",
    unique_filename: true,
    overwrite: false,
    ...(folder !== undefined && { folder }),
    ...(publicId !== undefined && { public_id: publicId }),
    ...rest,
  };

  if (Buffer.isBuffer(file)) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(uploadOptions, (error, result) => {
          if (error) {
            reject(new Error(`Cloudinary upload failed: ${error.message}`));
            return;
          }
          resolve({ url: result.secure_url, publicId: result.public_id });
        })
        .end(file);
    });
  }

  try {
    const result = await cloudinary.uploader.upload(file, uploadOptions);
    return { url: result.secure_url, publicId: result.public_id };
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

/**
 * Delete an image from Cloudinary by its public ID.
 * @param {string} publicId
 */
const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error(`Cloudinary delete failed: ${error.message}`);
  }
};

/**
 * Generate a Cloudinary delivery URL for a given public ID.
 * @param {string} publicId
 * @param {Record<string, any>} transformations
 * @returns {string}
 */
const getImageUrl = (publicId, transformations = {}) => {
  return cloudinary.url(publicId, { secure: true, ...transformations });
};

export default { uploadImage, deleteImage, getImageUrl };
