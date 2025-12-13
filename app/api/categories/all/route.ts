// app/api/categories/all/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/lib/models/ProductModel';
export const GET = async (request: NextRequest) => {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get('page') || '1');
    const limit = Number(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const categories = await ProductModel.aggregate([
      {
        $group: {
          _id: '$category',
          productCount: { $sum: 1 },
          image: { $first: '$image' }
        }
      },
      { $sort: { productCount: -1 } },
      { $skip: skip },
      { $limit: limit }
    ]);

    const totalCount = await ProductModel.distinct('category').then(c => c.length);

    const formattedCategories = categories.map(cat => ({
      name: cat._id,
      count: `${cat.productCount}+ items`,
      image: cat.image ?? null
    }));

    return NextResponse.json({
      categories: formattedCategories,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      hasMore: page < Math.ceil(totalCount / limit)
    });

  } catch (err: any) {
    console.error('Categories API Error:', err);

    return NextResponse.json(
      {
        categories: [],
        totalCount: 0,
        currentPage: 1,
        totalPages: 0,
        hasMore: false,
        error: err.message || 'Server error'
      },
      { status: 500 }
    );
  }
};
