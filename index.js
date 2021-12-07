import express, { response } from "express";
import db from "./config/Database.js";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";

const port = process.env.PORT || 5000;
dotenv.config();
const app = express();
const server = http.createServer(app);

// memastikan koneksi database berjalan dnegan baik
try {
  await db.authenticate();
  console.log("Database connected...");
} catch (error) {
  console.error(error);
}

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000/", "http://192.168.100.19:5000/"],
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(router);
app.use(express.urlencoded({ extended: true }));

server.listen(port, () => console.log("server running at port 5000"));
