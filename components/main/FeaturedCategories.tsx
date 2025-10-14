'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

type Category = {
  name: string;
  count: string;
  image: string;
};

const FeaturedCategories = () => {
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [displayCount, setDisplayCount] = useState(0);
  const [increment, setIncrement] = useState(6); // default mobile

  // Decide increment based on screen size
  const updateIncrement = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) {
        setIncrement(20); // desktop
      } else {
        setIncrement(6); // mobile
      }
    }
  };

  useEffect(() => {
    updateIncrement();
    window.addEventListener('resize', updateIncrement);
    return () => window.removeEventListener('resize', updateIncrement);
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/categories/all?page=1&limit=100`);
      const data = await res.json();
      setAllCategories(data.categories);

      // Initially show mobile/desktop number
      setDisplayCount(Math.min(increment, data.categories.length));
      setCategories(data.categories.slice(0, increment));
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [increment]);

  const handleShowMore = () => {
    const nextCount = Math.min(displayCount + increment, allCategories.length);
    setCategories(allCategories.slice(0, nextCount));
    setDisplayCount(nextCount);
  };

  const handleCategoryClick = (categoryName: string) => {
    const encodedCategory = encodeURIComponent(categoryName);
    window.location.href = `/search?category=${encodedCategory}`;
  };

  if (initialLoad) {
    return (
      <div className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            TOP CATEGORIES
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: increment }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          TOP CATEGORIES
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <div
              key={index}
              onClick={() => handleCategoryClick(category.name)}
              className="group cursor-pointer p-4 rounded-lg hover:bg-gray-50 transition-all duration-300 border border-gray-100 hover:border-blue-200 hover:shadow-md"
            >
              <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-medium">
                      {category.name.split(' ')[0].charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              <h3 className="font-medium text-gray-900 text-sm mb-1 group-hover:text-blue-600 line-clamp-2">
                {category.name}
              </h3>
              <p className="text-xs text-gray-500">{category.count}</p>
            </div>
          ))}
        </div>

        {/* Show More Button */}
        {displayCount < allCategories.length && (
          <div className="text-center mt-8">
            <button
              onClick={handleShowMore}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Show More Categories'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedCategories;
