import Razorpay from 'razorpay';
import crypto from 'crypto';
import OrderModel from './models/OrderModel';
import dbConnect from './dbConnect';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const createRazorpayOrder = async (orderId: string, amount: number) => {
  await dbConnect();
  try {
    const options = {
      amount: Math.round(amount * 100), // Razorpay amount in paise
      currency: 'INR',
      receipt: `rcpt_${orderId}`,
    };

    const order = await razorpay.orders.create(options);
    return order; // ye frontend ko bhejna hai for payment
  } catch (err: any) {
    throw new Error(err.message);
  }
};

// Verify payment signature sent by Razorpay webhook or frontend
export const verifyRazorpayPayment = async (razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string) => {
  await dbConnect();
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(razorpayOrderId + '|' + razorpayPaymentId)
    .digest('hex');

  if (generatedSignature !== razorpaySignature) {
    throw new Error('Payment verification failed');
  }

  // Update order in DB
  const order = await OrderModel.findOne({ _id: razorpayOrderId });
  if (!order) throw new Error('Order not found');

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: razorpayPaymentId,
    status: 'paid',
    email_address: order.shippingAddress?.email || '', // optional
  };

  const updatedOrder = await order.save();
  return updatedOrder;
};
