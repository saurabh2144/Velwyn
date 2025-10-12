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

    // Get all unique categories with product counts
    const categories = await ProductModel.aggregate([
      {
        $group: {
          _id: '$category',
          productCount: { $sum: 1 },
          image: { $first: '$image' } 
        }
      },
      { $sort: { productCount: -1 } }, // Sort by most products first
      { $skip: skip },
      { $limit: limit }
    ]);

    // Get total count for pagination
    const totalCategories = await ProductModel.distinct('category');
    const totalCount = totalCategories.length;

    // Format response
    const formattedCategories = categories.map(cat => ({
      name: cat._id,
      count: `${cat.productCount}+ items`,
      image: cat.image
    }));

    return NextResponse.json({
      categories: formattedCategories,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      hasMore: page < Math.ceil(totalCount / limit)
    });

  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 });
  }
};