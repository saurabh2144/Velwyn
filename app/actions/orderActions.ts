// app/actions/orderActions.ts
// @ts-nocheck
'use server';

import dbConnect from '@/lib/dbConnect';
import Order from '@/lib/models/order';
import { revalidatePath } from 'next/cache';

export async function markAsOnTheWay(orderId) {
  await dbConnect();

  // Pehle order fetch karo
  const order = await Order.findById(orderId).lean();

  let updateData = {
    deliveryStatus: 'on_the_way',
    updatedAt: new Date(),
  };

  // Agar expectedDeliveryDate nahi hai to set kar do (5 din baad)
  if (!order.expectedDeliveryDate) {
    const createdAt = new Date(order.createdAt);
    const expected = new Date(createdAt.getTime() + 5 * 24 * 60 * 60 * 1000); // 5 days baad
    updateData.expectedDeliveryDate = expected;
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { $set: updateData },
    { new: true }
  ).lean();

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${orderId}`);
  return updatedOrder;
}

export async function markAsDelivered(orderId) {
  await dbConnect();
  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    {
      $set: {
        deliveryStatus: 'delivered',
        isDelivered: true,
        deliveredAt: new Date(),
        updatedAt: new Date(),
      },
    },
    { new: true }
  ).lean();
  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${orderId}`);
  return updatedOrder;
}