'use client';

import { useState, useEffect } from 'react';
import productService from '@/lib/services/productService';
import Image from 'next/image';

const NewAndPopular = () => {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const productsPerPage = 10;

  const categories = [
    'ALL', 'SHIRTS', 'T-SHIRTS', 'TROUSERS', 'JEANS',
    'JACKETS', 'SWEATERS', 'HOODIES'
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/products/all');
        const data = await res.json();
        setProducts(data.products);
        console.log("all product data is ", data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products when category changes
  useEffect(() => {
    if (activeCategory === 'ALL') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((product) => product.category === activeCategory));
    }
    setCurrentPage(1); // Reset to first page when category changes
  }, [activeCategory, products]);

  // Update displayed products when filtered products or current page changes
  useEffect(() => {
    const startIndex = 0;
    const endIndex = currentPage * productsPerPage;
    setDisplayedProducts(filteredProducts.slice(0, endIndex));
    setHasMore(endIndex < filteredProducts.length);
  }, [filteredProducts, currentPage]);

  const loadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  if (loading && products.length === 0) return <p>Loading...</p>;

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            NEW AND POPULAR
          </h2>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === category
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading && products.length === 0 ? (
          <div className="text-center text-gray-500">Loading products...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {displayedProducts.map((product) => (
                <div key={product.id} className="group cursor-pointer">
                  <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-3 overflow-hidden relative">
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                      <span className="text-gray-600 text-sm">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      </span>
                    </div>

                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="bg-white px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:bg-gray-50">
                        Quick Add +
                      </button>
                    </div>
                  </div>

                  <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-lg font-bold text-gray-900">{product.price}</p>

                  <div className="mt-2 flex items-center space-x-1">
                    <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-xs hover:bg-gray-50">S</button>
                    <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-xs hover:bg-gray-50">M</button>
                    <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-xs hover:bg-gray-50">L</button>
                    <span className="text-xs text-gray-500 ml-1">+7</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Show loading when loading more */}
            {loading && products.length > 0 && (
              <div className="text-center text-gray-500 mt-4">Loading more products...</div>
            )}

            {/* Load More Button */}
            {hasMore && !loading && (
              <div className="text-center mt-8">
                <button 
                  onClick={loadMore}
                  className="px-8 py-3 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Load More ({filteredProducts.length - displayedProducts.length} more items)
                </button>
              </div>
            )}

            {/* Show message when all products are loaded */}
            {!hasMore && filteredProducts.length > 0 && (
              <div className="text-center mt-8 text-gray-500">
                All {filteredProducts.length} products loaded
              </div>
            )}
          </>
        )}

      
      </div>
    </div>
  );
};

export default NewAndPopular;