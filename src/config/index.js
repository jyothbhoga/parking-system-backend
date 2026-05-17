import dotenv from "dotenv";
import path from "path";

const getFile = (type) => {
  switch (type) {
    case "development":
      return ".env.dev";
    case "local":
      return ".env.local";
    case "production":
      return ".env.production";
    default:
      return ".env.local";
  }
};

const envFile = getFile(process.env.NODE_ENV);
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

console.log(process.env.PORT);

export default {
  PORT: process.env.PORT || 9000,
  DB_URL: process.env.DB_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  HOST_URL: process.env.HOST_URL,
  NODE_ENV: process.env.NODE_ENV,
  // Cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};
