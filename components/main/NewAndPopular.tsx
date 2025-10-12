'use client';

import { useState, useEffect } from 'react';
import productService from '@/lib/services/productService';
import ProductItem from '../products/ProductItem';


const NewAndPopular = () => {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const productsPerPage = 10;

  const categories = ['ALL', 'SHIRTS', 'T-SHIRTS', 'TROUSERS', 'JEANS', 'JACKETS', 'SWEATERS', 'HOODIES'];

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/products/all');
        const data = await res.json();
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter by category
  useEffect(() => {
    if (activeCategory === 'ALL') setFilteredProducts(products);
    else setFilteredProducts(products.filter(p => p.category === activeCategory));
    setCurrentPage(1);
  }, [activeCategory, products]);

  // Pagination
  useEffect(() => {
    const endIndex = currentPage * productsPerPage;
    setDisplayedProducts(filteredProducts.slice(0, endIndex));
    setHasMore(endIndex < filteredProducts.length);
  }, [filteredProducts, currentPage]);

  const loadMore = () => setCurrentPage(prev => prev + 1);

  if (loading && products.length === 0) return <p>Loading...</p>;

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">NEW AND POPULAR</h2>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {displayedProducts.map(product => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>

        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={loadMore}
              className="px-8 py-3 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Load More ({filteredProducts.length - displayedProducts.length} more items)
            </button>
          </div>
        )}

        {!hasMore && filteredProducts.length > 0 && (
          <div className="text-center mt-8 text-gray-500">
            All {filteredProducts.length} products loaded
          </div>
        )}
      </div>
    </div>
  );
};

export default NewAndPopular;
