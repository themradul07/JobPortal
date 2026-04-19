import express from "express";
import { checkOut, paymentVerification } from "../controllers/payment.js";
import { isAuth } from "../middleware/auth.js";
const router = express.Router();

router.post("/checkout",isAuth, checkOut);
router.post("/verify", isAuth, paymentVerification);

export default router;
