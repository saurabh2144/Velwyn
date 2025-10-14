import Link from 'next/link';

import ProductItem from '@/components/products/ProductItem';
import { Rating } from '@/components/products/Rating';
import productServices from '@/lib/services/productService';

const sortOrders = ['newest', 'lowest', 'highest', 'rating'];
const prices = [
  {
    name: '₹1 to ₹50',
    value: '1-50',
  },
  {
    name: '₹51 to ₹200',
    value: '51-200',
  },
  {
    name: '₹201 to ₹1000',
    value: '201-1000',
  },
];

const ratings = [5, 4, 3, 2, 1];

export async function generateMetadata({
  searchParams: { q = 'all', category = 'all', price = 'all', rating = 'all' },
}: {
  searchParams: {
    q: string;
    category: string;
    price: string;
    rating: string;
    sort: string;
    page: string;
  };
}) {
  if (
    (q !== 'all' && q !== '') ||
    category !== 'all' ||
    rating !== 'all' ||
    price !== 'all'
  ) {
    return {
      title: `Search ${q !== 'all' ? q : ''}
          ${category !== 'all' ? ` : Category ${category}` : ''}
          ${price !== 'all' ? ` : Price ${price}` : ''}
          ${rating !== 'all' ? ` : Rating ${rating}` : ''}`,
    };
  } else {
    return {
      title: 'Search Products',
    };
  }
}

export default async function SearchPage({
  searchParams: {
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
    sort = 'newest',
    page = '1',
  },
}: {
  searchParams: {
    q: string;
    category: string;
    price: string;
    rating: string;
    sort: string;
    page: string;
  };
}) {
  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg,
  }: {
    c?: string;
    s?: string;
    p?: string;
    r?: string;
    pg?: string;
  }) => {
    const params = { q, category, price, rating, sort, page };
    if (c) params.category = c;
    if (p) params.price = p;
    if (r) params.rating = r;
    if (pg) params.page = pg;
    if (s) params.sort = s;
    return `/search?${new URLSearchParams(params).toString()}`;
  };
  
  const categories = await productServices.getCategories();
  const { countProducts, products, pages } = await productServices.getByQuery({
    category,
    q,
    price,
    rating,
    page,
    sort,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 md:hidden">
        <div className="px-4 py-3">
          <h1 className="text-lg font-semibold text-gray-900">Search Results</h1>
          <div className="flex items-center flex-wrap gap-1 mt-2 text-sm text-gray-600">
            <span className={products.length === 0 ? 'text-gray-500' : 'text-gray-700'}>
              {products.length === 0 ? 'No' : countProducts} Results
            </span>
            {q !== 'all' && q !== '' && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                {q}
              </span>
            )}
            {category !== 'all' && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                {category}
              </span>
            )}
            {price !== 'all' && (
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                Price: {price}
              </span>
            )}
            {rating !== 'all' && (
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                Rating: {rating}+
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:grid lg:grid-cols-5 lg:gap-6">
          {/* Filters Sidebar - Mobile Collapsible */}
          <div className="lg:col-span-1 mb-4 lg:mb-0">
            {/* Mobile Filter Toggle */}
            <details className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 lg:hidden">
              <summary className="p-4 font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                <span>Filters</span>
                <svg className="w-5 h-5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-4 pb-4 space-y-6">
                {/* Categories */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="font-medium text-gray-900 mb-3">Categories</div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    <button className="w-full text-left">
                      <Link
                        className={`block px-3 py-2 rounded-lg transition-colors ${
                          'all' === category 
                            ? 'bg-blue-100 text-blue-700 font-medium' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        href={getFilterUrl({ c: 'all' })}
                      >
                        Any
                      </Link>
                    </button>
                    {categories.map((c: string) => (
                      <button key={c} className="w-full text-left">
                        <Link
                          className={`block px-3 py-2 rounded-lg transition-colors ${
                            c === category 
                              ? 'bg-blue-100 text-blue-700 font-medium' 
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          href={getFilterUrl({ c })}
                        >
                          {c}
                        </Link>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="font-medium text-gray-900 mb-3">Price</div>
                  <div className="space-y-2">
                    <button className="w-full text-left">
                      <Link
                        className={`block px-3 py-2 rounded-lg transition-colors ${
                          'all' === price 
                            ? 'bg-blue-100 text-blue-700 font-medium' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        href={getFilterUrl({ p: 'all' })}
                      >
                        Any
                      </Link>
                    </button>
                    {prices.map((p) => (
                      <button key={p.value} className="w-full text-left">
                        <Link
                          href={getFilterUrl({ p: p.value })}
                          className={`block px-3 py-2 rounded-lg transition-colors ${
                            p.value === price 
                              ? 'bg-blue-100 text-blue-700 font-medium' 
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {p.name}
                        </Link>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Customer Review */}
                <div className="border-t border-gray-100 pt-4">
                  <div className="font-medium text-gray-900 mb-3">Customer Review</div>
                  <div className="space-y-2">
                    <button className="w-full text-left">
                      <Link
                        href={getFilterUrl({ r: 'all' })}
                        className={`block px-3 py-2 rounded-lg transition-colors ${
                          'all' === rating 
                            ? 'bg-blue-100 text-blue-700 font-medium' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        Any
                      </Link>
                    </button>
                    {ratings.map((r) => (
                      <button key={r} className="w-full text-left">
                        <Link
                          href={getFilterUrl({ r: `${r}` })}
                          className={`block px-3 py-2 rounded-lg transition-colors ${
                            `${r}` === rating 
                              ? 'bg-blue-100 text-blue-700 font-medium' 
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Rating value={r} caption={''} />
                            <span className="text-sm text-gray-600">& up</span>
                          </div>
                        </Link>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </details>

            {/* Desktop Filters */}
            <div className="hidden lg:block space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="font-semibold text-gray-900 mb-3 text-lg">Categories</div>
                <div className="space-y-2">
                  <Link
                    className={`block px-3 py-2 rounded-lg transition-colors ${
                      'all' === category 
                        ? 'bg-blue-100 text-blue-700 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    href={getFilterUrl({ c: 'all' })}
                  >
                    Any
                  </Link>
                  {categories.map((c: string) => (
                    <Link
                      key={c}
                      className={`block px-3 py-2 rounded-lg transition-colors ${
                        c === category 
                          ? 'bg-blue-100 text-blue-700 font-medium' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      href={getFilterUrl({ c })}
                    >
                      {c}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="font-semibold text-gray-900 mb-3 text-lg">Price</div>
                <div className="space-y-2">
                  <Link
                    className={`block px-3 py-2 rounded-lg transition-colors ${
                      'all' === price 
                        ? 'bg-blue-100 text-blue-700 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    href={getFilterUrl({ p: 'all' })}
                  >
                    Any
                  </Link>
                  {prices.map((p) => (
                    <Link
                      key={p.value}
                      href={getFilterUrl({ p: p.value })}
                      className={`block px-3 py-2 rounded-lg transition-colors ${
                        p.value === price 
                          ? 'bg-blue-100 text-blue-700 font-medium' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {p.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="font-semibold text-gray-900 mb-3 text-lg">Customer Review</div>
                <div className="space-y-2">
                  <Link
                    href={getFilterUrl({ r: 'all' })}
                    className={`block px-3 py-2 rounded-lg transition-colors ${
                      'all' === rating 
                        ? 'bg-blue-100 text-blue-700 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Any
                  </Link>
                  {ratings.map((r) => (
                    <Link
                      key={r}
                      href={getFilterUrl({ r: `${r}` })}
                      className={`block px-3 py-2 rounded-lg transition-colors ${
                        `${r}` === rating 
                          ? 'bg-blue-100 text-blue-700 font-medium' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Rating value={r} caption={''} />
                        <span className="text-sm text-gray-600">& up</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="lg:col-span-4">
            {/* Desktop Header */}
            <div className="hidden md:flex flex-col justify-between py-4 lg:flex-row lg:items-center">
              <div className="flex items-center flex-wrap gap-2 mb-4 lg:mb-0">
                <span className={`text-gray-700 ${products.length === 0 ? 'text-gray-500' : ''}`}>
                  {products.length === 0 ? 'No' : countProducts} Results
                </span>
                {q !== 'all' && q !== '' && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {q}
                  </span>
                )}
                {category !== 'all' && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    {category}
                  </span>
                )}
                {price !== 'all' && (
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                    Price: {price}
                  </span>
                )}
                {rating !== 'all' && (
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                    Rating: {rating}+
                  </span>
                )}
                {(q !== 'all' && q !== '') || category !== 'all' || rating !== 'all' || price !== 'all' ? (
                  <Link 
                    className="btn btn-ghost btn-sm text-gray-600 hover:text-gray-800" 
                    href="/search"
                  >
                    Clear
                  </Link>
                ) : null}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">Sort by:</span>
                <div className="flex flex-wrap gap-1">
                  {sortOrders.map((s) => (
                    <Link
                      key={s}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        sort == s 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                      href={getFilterUrl({ s })}
                    >
                      {s}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div>
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your search filters</p>
                  <Link 
                    href="/search" 
                    className="btn btn-primary btn-sm"
                  >
                    Clear Filters
                  </Link>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                      <ProductItem key={product.slug} product={product} />
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  {pages > 1 && (
                    <div className="flex justify-center mt-8">
                      <div className="join">
                        {Array.from(Array(pages).keys()).map((p) => (
                          <Link
                            key={p}
                            className={`btn join-item btn-sm min-w-12 ${
                              Number(page) === p + 1 
                                ? 'btn-active bg-blue-600 text-white border-blue-600' 
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                            href={getFilterUrl({ pg: `${p + 1}` })}
                          >
                            {p + 1}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}