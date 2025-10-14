import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import OrderFinal from '@/lib/models/orderFinalModel';
import { auth } from "@/lib/auth";

  // <-- import from your NextAuth config file
const MONGODB_URI = process.env.MONGODB_URI || '';

if (!mongoose.connection.readyState) {
  mongoose.connect(MONGODB_URI);
  //await dbConnect();
}

export async function POST(req: NextRequest) {

       const session =  await auth(); 
    if (!session || !session.user?._id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

 const userId ={
  email : session.user.email,
  name : session.user.name
 } 
 console.log("session",session);
  console.log("User ID:", userId);


    // ✅ Securely extracted userId from NextAuth
  try {
    const body = await req.json();
    console.log('📦 Received Order Data:', body);

    const order = await OrderFinal.create({
      userId: userId || null ,
      paymentMethod: body.paymentMethod,
      shippingAddress: body.shippingAddress,
      items: body.items,
      itemsPrice: body.itemsPrice,
      taxPrice: body.taxPrice,
      shippingPrice: body.shippingPrice,
      totalPrice: body.totalPrice,
      paid: false,
      paymentId: null,
      paymentAmount: null,
    });
       console.log('order we get from backend =',order);
    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    console.error('❌ Error saving order:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
