'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Product = {
  _id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  sizes?: string[];
  category: string;
  brand: string;
  rating: number;
};

const ShopYourSizeWithFilters = () => {
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const [filters, setFilters] = useState({
    category: 'all',
    brand: 'all',
    priceRange: [0, 0],
    rating: 'all',
    sort: 'newest',
  });

  const fetchProducts = async () => {
    if (!selectedSize) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('size', selectedSize);
      if (filters.category !== 'all') params.append('category', filters.category);
      if (filters.brand !== 'all') params.append('brand', filters.brand);
      if (filters.rating !== 'all') params.append('rating', filters.rating);
      if (filters.priceRange[0]) params.append('minPrice', filters.priceRange[0].toString());
      if (filters.priceRange[1]) params.append('maxPrice', filters.priceRange[1].toString());
      if (filters.sort) params.append('sort', filters.sort);

      const res = await fetch(`/api/products/filterByAll?${params.toString()}`);
      const data = await res.json();

      setProducts(data.products || []);

      // Update dynamic filters only when size changes
      if (!categories.length) {
        setCategories(data.filters.categories);
        setBrands(data.filters.brands);
        setMinPrice(data.filters.minPriceAvailable);
        setMaxPrice(data.filters.maxPriceAvailable);
        setFilters((prev) => ({
          ...prev,
          priceRange: [data.filters.minPriceAvailable, data.filters.maxPriceAvailable],
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedSize, filters]);

  const handleSizeClick = (size: string) => {
    setSelectedSize(size === selectedSize ? null : size);
    setFilters({
      category: 'all',
      brand: 'all',
      priceRange: [0, 0],
      rating: 'all',
      sort: 'newest',
    });
    setProducts([]);
    setCategories([]);
    setBrands([]);
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">SHOP YOUR SIZE</h2>

        <div className="flex justify-center gap-4 mb-8">
          {sizes.map((size) => (
            <button
              key={size}
              className={`px-4 py-2 rounded-md border ${
                selectedSize === size ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300'
              }`}
              onClick={() => handleSizeClick(size)}
            >
              {size}
            </button>
          ))}
        </div>

        {selectedSize && (
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-3 py-1 border rounded-md ${filters.category === cat ? 'bg-blue-500 text-white' : 'bg-white border-gray-300'}`}
                onClick={() => setFilters((prev) => ({ ...prev, category: cat }))}
              >
                {cat}
              </button>
            ))}

            {brands.map((brand) => (
              <button
                key={brand}
                className={`px-3 py-1 border rounded-md ${filters.brand === brand ? 'bg-blue-500 text-white' : 'bg-white border-gray-300'}`}
                onClick={() => setFilters((prev) => ({ ...prev, brand }))}
              >
                {brand}
              </button>
            ))}

            {[5, 4, 3, 2, 1].map((r) => (
              <button
                key={r}
                className={`px-2 py-1 border rounded-md ${filters.rating === r.toString() ? 'bg-blue-500 text-white' : 'bg-white border-gray-300'}`}
                onClick={() => setFilters((prev) => ({ ...prev, rating: r.toString() }))}
              >
                {r}★ & Up
              </button>
            ))}

            <select className="border rounded-md px-2 py-1" value={filters.sort} onChange={(e) => setFilters((prev) => ({ ...prev, sort: e.target.value }))}>
              <option value="newest">Newest</option>
              <option value="lowest">Price: Low to High</option>
              <option value="highest">Price: High to Low</option>
              <option value="toprated">Top Rated</option>
            </select>
          </div>
        )}

        {selectedSize && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading ? (
              <p className="text-center col-span-4">Loading...</p>
            ) : products.length === 0 ? (
              <p className="text-center col-span-4">No products found.</p>
            ) : (
              products.map((p) => (
                <div key={p._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Link href={`/product/${p.slug}`}>
                    <div className="relative w-full h-64">
                      <Image src={p.image} alt={p.name} fill className="object-cover" />
                    </div>
                    <div className="p-4">
                      <h4 className="text-lg font-medium text-gray-900">{p.name}</h4>
                      <p className="text-gray-700 mt-1">₹{p.price}</p>
                      <p className="text-sm text-gray-500">{p.rating}★</p>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopYourSizeWithFilters;
