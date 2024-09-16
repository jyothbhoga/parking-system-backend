import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import config from "../config/index.js";

const generateToken = (user) => {
  // Payload for the JWT (e.g., user ID and email)
  const payload = {
    id: user._id,
    email: user.email,
  };

  // Sign the JWT with a secret key and set an expiration time (e.g., 1 hour)
  const token = jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: "1h", // Token expires in 1 hour
  });

  return token;
};

export default generateToken;
