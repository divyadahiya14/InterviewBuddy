import Razorpay from 'razorpay';
import dotenv from 'dotenv';
dotenv.config();

const KEY_ID = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

console.log("KEY_ID:", KEY_ID);
console.log("KEY_SECRET:", KEY_SECRET);

const instance = new Razorpay({
  key_id: KEY_ID,
  key_secret: KEY_SECRET
});

const options = {
  amount: 198 * 100,
  currency: 'INR',
  receipt: `order_${Date.now()}`
};

try {
  const order = await instance.orders.create(options);
  console.log("SUCCESS:", order);
} catch (error) {
  console.error("ERROR:", error);
}
