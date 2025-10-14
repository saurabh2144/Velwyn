import dbConnect from '@/lib/dbConnect';
import Order from '@/lib/models/orderFinalModel';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session || !session.user?._id || !session.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userEmail = session.user.email;

    await dbConnect();

    const order = await Order.findOne({ _id: params.id, 'userId.email': userEmail });

    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (err) {
    console.error('Error fetching order:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
