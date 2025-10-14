// app/api/orders/mine/route.ts  (ya jis file me aapka POST hai, usi file me add karein)
import dbConnect from '@/lib/dbConnect';
import Order from '@/lib/models/orderFinalModel';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    // get session using your auth helper
    const session = await auth();
    if (!session || !session.user?._id || !session.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = session.user.email;
    console.log('Logged-in user email (GET orders):', userEmail);

    // connect to DB then fetch orders for this user's email
    await dbConnect();

    const orders = await Order.find({ 'userId.email': userEmail });

    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (err) {
    console.error('Error fetching user orders:', err);
    return NextResponse.json({ success: false, message: 'Failed to fetch orders' }, { status: 500 });
  }
}
