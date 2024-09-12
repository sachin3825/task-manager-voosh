import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadImageToCloudinary = async (file, folder, height, quality) => {
  const options = { folder };

  if (height) {
    options.height = height;
  }

  if (quality) {
    options.quality = quality;
  }

  options.resource_type = 'auto';

  console.log('Cloudinary upload options:', options);

  try {
    // Use `file.path` for multer file objects
    const result = await cloudinary.uploader.upload(file.path, options);
    return result;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

export const clearUploadFolder = () => {
  const uploadDir = path.join(__dirname, '../uploads'); // Adjust the path as needed
  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      console.error('Failed to list directory contents:', err);
      return;
    }
    files.forEach((file) => {
      const filePath = path.join(uploadDir, file);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Failed to delete file:', filePath, err);
        } else {
          console.log('Deleted file:', filePath);
        }
      });
    });
  });
};
