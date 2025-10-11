import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/lib/models/ProductModel';

export const GET = async (request: NextRequest) => {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);

    const size = searchParams.get('size');
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const rating = searchParams.get('rating'); // min rating
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort'); // 'lowest', 'highest', 'toprated', 'newest'
    const page = Number(searchParams.get('page') || '1');
    const limit = Number(searchParams.get('limit') || '12');

    if (!size) return NextResponse.json({ message: 'Size is required' }, { status: 400 });

    // Build filter
    const filter: any = { sizes: { $in: [size] } };
    if (category && category !== 'all') filter.category = category;
    if (brand && brand !== 'all') filter.brand = brand;
    if (rating && rating !== 'all') filter.rating = { $gte: Number(rating) };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Sort order
    let sortOrder: Record<string, 1 | -1> = { _id: -1 }; // default newest
    if (sort === 'lowest') sortOrder = { price: 1 };
    else if (sort === 'highest') sortOrder = { price: -1 };
    else if (sort === 'toprated') sortOrder = { rating: -1 };

    const skip = (page - 1) * limit;

    const products = await ProductModel.find(filter).sort(sortOrder).skip(skip).limit(limit).lean();
    const countProducts = await ProductModel.countDocuments(filter);

    // Dynamic filters for frontend
    const categories = await ProductModel.find({ sizes: { $in: [size] } }).distinct('category');
    const brands = await ProductModel.find({ sizes: { $in: [size] } }).distinct('brand');
    const prices = await ProductModel.find({ sizes: { $in: [size] } }).sort({ price: 1 }).lean();
    const minPriceAvailable = prices.length ? prices[0].price : 0;
    const maxPriceAvailable = prices.length ? prices[prices.length - 1].price : 0;

    return NextResponse.json({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / limit),
      filters: { categories, brands, minPriceAvailable, maxPriceAvailable },
    });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 });
  }
};
