import dotenv from "dotenv";
dotenv.config({ path: ".env" });

export const PORT = process.env.PORT;
export const JWT_SECRETKEY = process.env.JWT_SECRETKEY!;
export const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
export const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;