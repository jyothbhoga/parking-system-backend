import dotenv from "dotenv";
import path from "path";

const envFile =
  process.env.NODE_ENV === "production" ? ".env.prod" : ".env.dev";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });
import routes from "./routes/index.js";

import express from "express";
import mongoose from "mongoose";
const db_url = "mongodb://localhost:27017/vehicle-parking-system";

mongoose.connect(db_url);

const app = express();

const con = mongoose.connection;
const PORT = process.env.PORT;
con.on("open", () => {
  console.log("connected...");
});

app.use(express.json());
app.use("", routes);

app.listen(PORT, () => {
  console.log("server started...");
});
