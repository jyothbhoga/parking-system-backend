import routes from "./routes/index.js";

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import config from "./config/index.js";

const db_url = config.DB_URL;

mongoose.connect(db_url);

const app = express();

const con = mongoose.connection;
const PORT = config.PORT || 9000;
con.on("open", () => {
  console.log("connected...");
});

app.use(express.json());

// configure specific CORS options
const corsOptions = {
  origin: config.HOST_URL, // Replace with your client URL
  methods: "GET,POST",
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use("", routes);

app.listen(PORT, () => {
  console.log("server started...");
});
