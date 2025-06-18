import Razorpay from "razorpay";

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("Razorpay credentials are missing");
}

const razorpayInstance = new Razorpay({
  key_id: "rzp_test_qLyKhr3B5MxVLi",
  key_secret: "XKgHywPDY40JzKYbggXlgdW7",
});
// const razorpayInstance = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

export default razorpayInstance;

export const RAZORPAY_WEBHOOK_SECRET =
  process.env.RAZORPAY_WEBHOOK_SECRET || "";
