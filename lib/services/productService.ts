import { cache } from 'react';
import dbConnect from '@/lib/dbConnect';
import ProductModel, { Product } from '@/lib/models/ProductModel';
import { convertDocToObj } from '@/lib/utils';

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

// ✅ Get products by query (with size support)
const getByQuery = cache(
  async ({
    q,
    category,
    sort,
    price,
    rating,
    size,
    page = '1',
    limit = 10,
  }: {
    q: string;
    category: string;
    price: string;
    rating: string;
    sort: string;
    size?: string;
    page: string;
    limit?: number;
  }) => {
    await dbConnect();

    const filter: any = {};

    if (q && q !== 'all') {
      filter.name = { $regex: q, $options: 'i' };
    }

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (rating && rating !== 'all') {
      filter.rating = { $gte: Number(rating) };
    }

    if (price && price !== 'all') {
      const [minPrice, maxPrice] = price.split('-').map(Number);
      filter.price = { $gte: minPrice, $lte: maxPrice };
    }

    if (size && size !== 'all') {
      filter.sizes = { $in: [size] };
    }

    const order: Record<string, 1 | -1> =
      sort === 'lowest'
        ? { price: 1 }
        : sort === 'highest'
        ? { price: -1 }
        : sort === 'toprated'
        ? { rating: -1 }
        : { _id: -1 };

    const categories = await ProductModel.find().distinct('category');
    const sizesList = await ProductModel.find().distinct('sizes');

    const skip = limit * (Number(page) - 1);

    const products = await ProductModel.find(filter, '-reviews')
      .sort(order)
      .skip(skip)
      .limit(limit)
      .lean();

    const countProducts = await ProductModel.countDocuments(filter);

    return {
      products: toProducts(products),
      countProducts,
      page: Number(page),
      pages: Math.ceil(countProducts / limit),
      categories,
      sizes: sizesList,
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


// --------------------------------------------------------------------
// ✅ Additional Filtered Products Service (for advanced search UI)
// --------------------------------------------------------------------

export interface ProductFilters {
  category?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  searchQuery?: string;
  sortBy?: string;
}

export interface FilteredProductsResponse {
  products: Product[];
  totalProducts: number;
  categories: string[];
  sizes: string[];
  priceRange: {
    min: number;
    max: number;
  };
}

const getProductsWithFilters = async (
  filters: ProductFilters
): Promise<FilteredProductsResponse> => {
  try {
    await dbConnect();

    const query: any = {};

    if (filters.category) query.category = filters.category;
    if (filters.size) query.sizes = { $in: [filters.size] };

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.price = {};
      if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice;
      if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice;
    }

    if (filters.rating !== undefined) {
      query.rating = { $gte: filters.rating };
    }

    if (filters.searchQuery) {
      query.$or = [
        { name: { $regex: filters.searchQuery, $options: 'i' } },
        { description: { $regex: filters.searchQuery, $options: 'i' } },
        { brand: { $regex: filters.searchQuery, $options: 'i' } },
      ];
    }

    let sort: any = {};
    switch (filters.sortBy) {
      case 'price_asc':
        sort.price = 1;
        break;
      case 'price_desc':
        sort.price = -1;
        break;
      case 'rating':
        sort.rating = -1;
        break;
      case 'newest':
      default:
        sort.createdAt = -1;
    }

    const products = await ProductModel.find(query)
      .sort(sort)
      .limit(48)
      .lean();

    const categories = await ProductModel.distinct('category');
    const sizes = await ProductModel.distinct('sizes');

    const priceStats = await ProductModel.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
    ]);

    return {
      products: products.map(convertDocToObj),
      totalProducts: await ProductModel.countDocuments(query),
      categories,
      sizes,
      priceRange: {
        min: priceStats[0]?.minPrice || 0,
        max: priceStats[0]?.maxPrice || 0,
      },
    };
  } catch (error) {
    console.error('Error in getProductsWithFilters:', error);
    return {
      products: [],
      totalProducts: 0,
      categories: [],
      sizes: [],
      priceRange: { min: 0, max: 0 },
    };
  }
};


// --------------------------------------------------------------------
// ✅ Final Export
// --------------------------------------------------------------------

const productService = {
  getLatest,
  getFeatured,
  getBySlug,
  getByQuery,
  getCategories,
  getTopRated,
  getByCategory,
  getProductsWithFilters, // <-- added here
};

export default productService;
