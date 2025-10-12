import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/lib/models/ProductModel';

export const GET = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'unauthorized' },
      { status: 401 }
    );
  }

  await dbConnect();

  const products = await ProductModel.find().lean();

  // Ensure otherImages exists as array
  const sanitizedProducts = products.map((p: any) => ({
    ...p,
    otherImages: p.otherImages || [],
  }));

  return Response.json(sanitizedProducts);
}) as any;

export const POST = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'unauthorized' },
      { status: 401 }
    );
  }

  await dbConnect();

  const product = new ProductModel({
    name: 'sample name',
    slug: 'sample-name-' + Math.random(),
    image:
      'https://res.cloudinary.com/dqxlehni0/image/upload/v1715622109/No_Image_Available_kbdno1.jpg',
    otherImages: [], // <-- added empty array
    price: 0,
    category: 'sample category',
    brand: 'sample brand',
    countInStock: 0,
    description: 'sample description',
    rating: 0,
    numReviews: 0,
  });

  try {
    await product.save();
    return Response.json(
      { message: 'Product created successfully', product },
      { status: 201 }
    );
  } catch (err: any) {
    return Response.json(
      { message: err.message },
      { status: 500 }
    );
  }
}) as any;
