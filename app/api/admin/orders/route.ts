import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import orderFinalModel from '@/lib/models/orderFinalModel';

export const GET = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      },
    );
  }
  await dbConnect();
  const orders = await orderFinalModel.find()
    .sort({ createdAt: -1 })
    // get the name of user
    .populate('user', 'name');

  return Response.json(orders);
}) as any;
