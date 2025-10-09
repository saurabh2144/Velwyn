
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const POST = auth(async (...request: any) => {
  const [req, { params }] = request;
  if (!req.auth) {
    return Response.json({ message: 'unauthorized' }, { status: 401 });
  }
  await dbConnect();

  const order = await OrderModel.findById(params.id);
  if (!order) {
    return Response.json({ message: 'Order not found' }, { status: 404 });
  }

  try {
    const options = {
      amount: order.totalPrice * 100, // amount in paise
      currency: 'INR',
      receipt: `receipt_order_${order._id}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);
    return Response.json(razorpayOrder);
  } catch (err: any) {
    return Response.json({ message: err.message }, { status: 500 });
  }
});
