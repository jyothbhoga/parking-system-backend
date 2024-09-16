import dotenv from "dotenv";
dotenv.config();
import routes from "./routes/index.js";

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const db_url = process.env.DB_URL;

mongoose.connect(db_url);

const app = express();

const con = mongoose.connection;
const PORT = process.env.PORT || 9000;
con.on("open", () => {
  console.log("connected...");
});

app.use(express.json());

// configure specific CORS options
const corsOptions = {
  origin: process.env.HOST_URL, // Replace with your client URL
  methods: "GET,POST",
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use("", routes);

app.listen(PORT, () => {
  console.log("server started...");
});
