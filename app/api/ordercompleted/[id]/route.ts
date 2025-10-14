import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import OrderFinal, { IOrderFinal } from '@/lib/models/orderFinalModel';
import dbConnect from '@/lib/dbConnect';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!mongoose.connection.readyState) {
  mongoose.connect(MONGODB_URI);
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 });
  }

  try {
    await dbConnect();

    // lean() returns plain JS object, cast as any to fix TS errors
    const orderDoc = await OrderFinal.findById(id).lean() as any;
    console.log("oorder obj form db =",orderDoc);

    if (!orderDoc) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // safely format _id and dates
    const formattedOrder = {
      ...orderDoc,
      _id: orderDoc._id,
      userId: orderDoc.userId ?? null,
      items: orderDoc.items?.map((item: any) => ({
        ...item,
        _id: item._id?.toString(),
      })) || [],
      paymentDate: orderDoc.paymentDate ? new Date(orderDoc.paymentDate).toISOString() : null,
      createdAt: orderDoc.createdAt ? new Date(orderDoc.createdAt).toISOString() : null,
      updatedAt: orderDoc.updatedAt ? new Date(orderDoc.updatedAt).toISOString() : null,
    };

    return NextResponse.json({ success: true, order: orderDoc }, { status: 200 });
  } catch (err: any) {
    console.error('Error fetching order:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
