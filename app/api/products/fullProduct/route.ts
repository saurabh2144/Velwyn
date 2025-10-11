// app/api/admin/products/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/lib/models/ProductModel';

export const GET = async () => {
  await dbConnect();
  const products = await ProductModel.find();
  return NextResponse.json(products);
};
