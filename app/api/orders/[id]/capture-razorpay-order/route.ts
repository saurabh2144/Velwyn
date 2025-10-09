
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/lib/models/OrderModel';

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
    const { razorpay_payment_id } = await req.json();
    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = {
      id: razorpay_payment_id,
      status: 'captured',
    };
    const updatedOrder = await order.save();
    return Response.json(updatedOrder);
  } catch (err: any) {
    return Response.json({ message: err.message }, { status: 500 });
  }
});
