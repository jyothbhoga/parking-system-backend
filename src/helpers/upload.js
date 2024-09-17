import admin from "firebase-admin";
import config from "../config/index.js";
import { Storage } from "@google-cloud/storage";
import multer from "multer";

if (!config.FIREBASE_PRIVATE_KEY) {
  throw new Error(
    "FIREBASE_PRIVATE_KEY is undefined. Please check your environment variable settings."
  );
}

const privateKey = config.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");

const storage = new Storage({
  projectId: config.FIREBASE_PROJECT_ID,
  credentials: {
    private_key: privateKey,
    client_email: config.FIREBASE_CLIENT_EMAIL,
  },
});

// Initialize Firebase Admin and Storage Bucket
admin.initializeApp({
  credential: admin.credential.cert({
    type: config.FIREBASE_TYPE,
    project_id: config.FIREBASE_PROJECT_ID,
    private_key_id: config.FIREBASE_PRIVATE_KEY_ID,
    private_key: privateKey, // Ensure newlines are handled
    client_email: config.FIREBASE_CLIENT_EMAIL,
    client_id: config.FIREBASE_CLIENT_ID,
    auth_uri: config.FIREBASE_AUTH_URI,
    token_uri: config.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: config.FIREBASE_AUTH_CERT_URL,
    client_x509_cert_url: config.FIREBASE_CLIENT_CERT_URL,
    universe_domain: config.FIREBASE_UNIVERSE_DOMAIN,
  }),
  storageBucket: config.STORAGE_BUCKET,
});

const bucket = admin.storage().bucket();

// Multer setup to handle image upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10000000 }, // 10MB file size limit
}).single("stickerImgURL");

export { storage, bucket, upload };
