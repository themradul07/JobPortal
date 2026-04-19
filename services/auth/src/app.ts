import express from "express";
import authRoutes from "./routes/auth.js"
import cors from "cors"
import multer from "multer";
import { connectKafka } from "./producer.js";


const app = express();
connectKafka();

app.use(cors());
app.use(express.json({limit:"50mb"}));
app.use(express.urlencoded({extended:true, limit:"50mb"}));



app.use("/api/auth", authRoutes);


export default app;

