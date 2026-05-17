import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10000000 }, // 10MB
}).single("stickerImgURL");

export { upload };
