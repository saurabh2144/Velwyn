// app/actions/orderActions.ts
'use server'; // Yeh line zaroori hai!

import dbConnect from '@/lib/dbConnect';
import Order from '@/lib/models/order';
import { revalidatePath } from 'next/cache';

export async function markAsOnTheWay(orderId) {
  await dbConnect();
  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    {
      $set: {
        deliveryStatus: 'on_the_way',
        updatedAt: new Date(),
      },
    },
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