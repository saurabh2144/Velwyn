import { auth } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/lib/models/ProductModel';

// GET single product
export const GET = auth(async (...args: any) => {
  const [req, { params }] = args;

  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: 'unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const product = await ProductModel.findById(params.id);
    if (!product) {
      return Response.json({ message: 'product not found' }, { status: 404 });
    }

    // ensure otherImages exists
    if (!product.otherImages) product.otherImages = [];

    return Response.json(product);
  } catch (err: any) {
    return Response.json({ message: err.message || 'Server error' }, { status: 500 });
  }
}) as any;

// PUT update product
export const PUT = auth(async (...args: any) => {
  const [req, { params }] = args;

  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: 'unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();

    const {
      name,
      slug,
      price,
      category,
      image,
      brand,
      countInStock,
      description,
      sizes,       // <-- sizes array
      otherImages, // <-- new extra field
    } = await req.json();

    const product = await ProductModel.findById(params.id);
    if (!product) {
      return Response.json({ message: 'Product not found' }, { status: 404 });
    }

    product.name = name;
    product.slug = slug;
    product.price = price;
    product.category = category;
    product.image = image;
    product.brand = brand;
    product.countInStock = countInStock;
    product.description = description;
    product.sizes = sizes || [];
    product.otherImages = otherImages || []; // <-- save otherImages

    const updatedProduct = await product.save();
    return Response.json(updatedProduct);
  } catch (err: any) {
    return Response.json({ message: err.message || 'Server error' }, { status: 500 });
  }
}) as any;

// DELETE product
export const DELETE = auth(async (...args: any) => {
  const [req, { params }] = args;

  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json({ message: 'unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const product = await ProductModel.findById(params.id);
    if (!product) {
      return Response.json({ message: 'Product not found' }, { status: 404 });
    }

    await product.deleteOne();
    return Response.json({ message: 'Product deleted successfully' });
  } catch (err: any) {
    return Response.json({ message: err.message || 'Server error' }, { status: 500 });
  }
}) as any;
