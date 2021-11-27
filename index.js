import express from "express";
import db from "./config/Database.js";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config()
const app = express()

// memastikan koneksi database berjalan dnegan baik
try {
    await db.authenticate()
    console.log('Database connected...')
} catch (error) {
    console.error(error)
}

app.use(cors({credentials:true, origin:'http://localhost:3000'}));
app.use(cookieParser());
app.use(express.json())
app.use(router)

app.listen(5000, () => console.log('server running at port 5000'))