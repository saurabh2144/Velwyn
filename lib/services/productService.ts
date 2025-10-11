import { cache } from 'react';
import dbConnect from '@/lib/dbConnect';
import ProductModel, { Product } from '@/lib/models/ProductModel';

export const revalidate = 3600;

// Utility functions
const toProducts = (docs: any[]): Product[] => docs as unknown as Product[];
const toProduct = (doc: any | null): Product | null =>
  doc ? (doc as unknown as Product) : null;

// Get latest products
const getLatest = cache(async (limit = 8) => {
  await dbConnect();
  const products = await ProductModel.find({})
    .sort({ _id: -1 })
    .limit(limit)
    .lean();
  return toProducts(products);
});

// Get top rated products
const getTopRated = cache(async (limit = 8) => {
  await dbConnect();
  const products = await ProductModel.find({})
    .sort({ rating: -1 })
    .limit(limit)
    .lean();
  return toProducts(products);
});

// Get featured products
const getFeatured = async () => {
  await dbConnect();
  const products = await ProductModel.find({ isFeatured: true })
    .limit(3)
    .lean();
  return toProducts(products);
};

// Get product by slug
const getBySlug = cache(async (slug: string) => {
  await dbConnect();
  const product = await ProductModel.findOne({ slug }).lean();
  return toProduct(product);
});

// ✅ Get products by query (now includes size filter)
const getByQuery = cache(
  async ({
    q,
    category,
    sort,
    price,
    rating,
    size,        // <-- NEW: add size param
    page = '1',
    limit = 10,
  }: {
    q: string;
    category: string;
    price: string;
    rating: string;
    sort: string;
    size?: string; // <-- NEW
    page: string;
    limit?: number;
  }) => {
    await dbConnect();

    console.log('Received params:', { category, size, page, limit });

    // Build filter object
    const filter: any = {};

    // Text search filter
    if (q && q !== 'all') {
      filter.name = { $regex: q, $options: 'i' };
    }

    // Category filter
    if (category && category !== 'all') {
      filter.category = category;
    }

    // Rating filter
    if (rating && rating !== 'all') {
      filter.rating = { $gte: Number(rating) };
    }

    // Price filter
    if (price && price !== 'all') {
      const [minPrice, maxPrice] = price.split('-').map(Number);
      filter.price = { $gte: minPrice, $lte: maxPrice };
    }

    // ✅ Size filter (new)
    if (size && size !== 'all') {
      // Match products that contain this size in the "sizes" array
      filter.sizes = { $in: [size] };
    }

    console.log('Final filter:', filter);

    // Sort order
    const order: Record<string, 1 | -1> =
      sort === 'lowest'
        ? { price: 1 }
        : sort === 'highest'
        ? { price: -1 }
        : sort === 'toprated'
        ? { rating: -1 }
        : { _id: -1 };

    // Distinct categories and sizes for filters
    const categories = await ProductModel.find().distinct('category');
    const sizesList = await ProductModel.find().distinct('sizes'); // <-- NEW

    // Pagination setup
    const skip = limit * (Number(page) - 1);

    // Get filtered products
    const products = await ProductModel.find(filter, '-reviews')
      .sort(order)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const countProducts = await ProductModel.countDocuments(filter);

    console.log(`Found ${products.length} products out of ${countProducts} total`);

    return {
      products: toProducts(products),
      countProducts,
      page: Number(page),
      pages: Math.ceil(countProducts / limit),
      categories,
      sizes: sizesList, // <-- return distinct sizes too
    };
  }
);

// Get distinct categories
const getCategories = cache(async () => {
  await dbConnect();
  const categories = await ProductModel.find().distinct('category');
  return categories;
});

// Get products by category
const getByCategory = cache(async (category: string, limit = 10, page = 1) => {
  await dbConnect();
  const filter = category === 'ALL' ? {} : { category };
  const products = await ProductModel.find(filter)
    .sort({ _id: -1 })
    .skip(limit * (page - 1))
    .limit(limit)
    .lean();

  const countProducts = await ProductModel.countDocuments(filter);

  return {
    products: toProducts(products),
    countProducts,
    page,
    pages: Math.ceil(countProducts / limit),
  };
});

const productService = {
  getLatest,
  getFeatured,
  getBySlug,
  getByQuery,
  getCategories,
  getTopRated,
  getByCategory,
};

export default productService;
