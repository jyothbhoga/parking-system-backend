import dotenv from "dotenv";
import path from "path";

const envFile =
  process.env.NODE_ENV === "development" ? ".env.dev" : ".env.prod";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

export default {
  PORT: process.env.PORT || 9000,
  DB_URL: process.env.DB_URL,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  PORT: process.env.PORT,
  STORAGE_BUCKET: process.env.STORAGE_BUCKET,
  JWT_SECRET: process.env.JWT_SECRET,
  HOST_URL: process.env.HOST_URL,
  DB_URL: process.env.DB_URL,
  FIREBASE_TYPE: process.env.FIREBASE_TYPE,
  FIREBASE_PRIVATE_KEY_ID: process.env.FIREBASE_PRIVATE_KEY_ID,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
  FIREBASE_CLIENT_ID: process.env.FIREBASE_CLIENT_ID,
  FIREBASE_AUTH_URI: process.env.FIREBASE_AUTH_URI,
  FIREBASE_TOKEN_URI: process.env.FIREBASE_TOKEN_URI,
  FIREBASE_AUTH_CERT_URL: process.env.FIREBASE_AUTH_CERT_URL,
  FIREBASE_CLIENT_CERT_URL: process.env.FIREBASE_CLIENT_CERT_URL,
  FIREBASE_UNIVERSE_DOMAIN: process.env.FIREBASE_UNIVERSE_DOMAIN,
  NODE_ENV: process.env.NODE_ENV,
};
