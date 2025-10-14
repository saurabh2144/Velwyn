import crypto from 'crypto';
import dbConnect from '@/lib/dbConnect';
import Order from '@/lib/models/orderFinalModel';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentData } = await req.json();
    const session =  await auth(); 
    if (!session || !session.user?._id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

 const userId ={
  email : session.user.email,
  name : session.user.name
 } 
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      await dbConnect();

      const newOrder = await Order.create({
        ...paymentData,
          userId: userId || null,
        paid: true,
        paymentId: razorpay_payment_id,
        paymentFrom: 'Razorpay',
        paymentDate: new Date(),
      });

      return NextResponse.json({ success: true, order: newOrder }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 400 });
    }
  } catch (err) {
    console.error('Payment verification error:', err);
    return NextResponse.json({ success: false, message: 'Verification failed' }, { status: 500 });
  }
}
