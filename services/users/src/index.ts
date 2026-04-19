import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user";
import cors from "cors";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({limit:"50mb"}));
app.use(express.urlencoded({extended:true, limit:"50mb"}));

app.use('/api/user', userRoutes);


app.listen(process.env.PORT, ()=>{
    console.log(`User services is running on http://localhost:${process.env.PORT}`)
})