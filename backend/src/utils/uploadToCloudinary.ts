const cloudinary = require("../config/cloudinary");

const uploadBufferToCloudinary = (buffer: Buffer, folder: string) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "image",
        },
        (error: any, result: any) => {
          if (error) return reject(error);
          resolve(result.secure_url);

        }
      )
      .end(buffer);
  });
};

module.exports = uploadBufferToCloudinary;
