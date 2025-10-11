import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/lib/models/ProductModel';

export const GET = async (request: NextRequest) => {
  try {
    await dbConnect();

    // URL query se size aur optional page/limit le lo
    const { searchParams } = new URL(request.url);
    const size = searchParams.get('size'); // eg: "M"
    const page = Number(searchParams.get('page') || '1');
    const limit = Number(searchParams.get('limit') || '10');

    if (!size) {
      return NextResponse.json({ message: 'Size is required' }, { status: 400 });
    }

    // Filter products by size
    const filter = { sizes: { $in: [size] } };

    const skip = limit * (page - 1);

    const products = await ProductModel.find(filter)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const countProducts = await ProductModel.countDocuments(filter);

    return NextResponse.json({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / limit),
    });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 });
  }
};
