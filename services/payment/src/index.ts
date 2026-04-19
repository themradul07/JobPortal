
import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import Razorpay from "razorpay";
import paymentRoutes from "./routes/payment.js"


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.get("/", (req, res) => {
    res.send("Payment Service is running");
});

app.use('/api/payment' , paymentRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Payment Service is running on port ${process.env.PORT}`);
});