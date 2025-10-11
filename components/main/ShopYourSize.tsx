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
  const sizes = [
    { label: 'XS', name: 'Extra Small' },
    { label: 'S', name: 'Small' },
    { label: 'M', name: 'Medium' },
    { label: 'L', name: 'Large' },
    { label: 'XL', name: 'Extra Large' },
    { label: 'XXL', name: 'Double Extra Large' },
  ];

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
    <div className="bg-gradient-hero min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <h2 className="text-4xl font-extrabold text-center text-foreground mb-12 tracking-tight">
          SHOP YOUR SIZE
        </h2>

        {/* Size Selection Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          {sizes.map((size) => (
            <div
              key={size.label}
              className="flex flex-col items-center bg-card p-6 rounded-xl shadow-lg border border-border transition-smooth hover:shadow-glow"
            >
              <button
                onClick={() => handleSizeClick(size.label)}
                className={`w-20 h-20 text-xl font-bold rounded-full border-4 transition-smooth flex items-center justify-center
                  ${
                    selectedSize === size.label
                      ? 'bg-primary text-primary-foreground border-primary shadow-glow'
                      : 'bg-card text-foreground border-muted-foreground/30 hover:border-accent hover:scale-105'
                  }`}
              >
                {size.label}
              </button>
              <p className="mt-3 text-sm text-foreground font-semibold text-center">{size.name}</p>
            </div>
          ))}
        </div>

        {/* Shop Now Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {sizes.map((size) => (
            <button
              key={size.label}
              className="bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-base text-sm shadow-md hover:shadow-lg"
            >
              Shop Now
            </button>
          ))}
        </div>

        {/* Size Guide Section */}
        <div className="text-center mb-12">
          <p className="text-muted-foreground mb-2 text-sm">*Find your perfect fit with our size guide</p>
          <button className="text-foreground font-medium underline hover:no-underline text-sm transition-base">
            Size Guide
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-12"></div>

        {/* Filters and Products Section */}
        {selectedSize && (
          <>
            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-base ${
                    filters.category === cat
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'bg-card border-border text-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                  onClick={() => setFilters((prev) => ({ ...prev, category: cat }))}
                >
                  {cat}
                </button>
              ))}
              
              {brands.map((brand) => (
                <button
                  key={brand}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-base ${
                    filters.brand === brand
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'bg-card border-border text-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                  onClick={() => setFilters((prev) => ({ ...prev, brand }))}
                >
                  {brand}
                </button>
              ))}
              
              {[5, 4, 3, 2, 1].map((r) => (
                <button
                  key={r}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition-base ${
                    filters.rating === r.toString()
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'bg-card border-border text-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                  onClick={() => setFilters((prev) => ({ ...prev, rating: r.toString() }))}
                >
                  {r}★ & Up
                </button>
              ))}
              
              <select
                value={filters.sort}
                onChange={(e) => setFilters((prev) => ({ ...prev, sort: e.target.value }))}
                className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-base"
              >
                <option value="newest">Newest</option>
                <option value="lowest">Price: Low to High</option>
                <option value="highest">Price: High to Low</option>
                <option value="toprated">Top Rated</option>
              </select>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-muted-foreground mt-4">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No products found for selected size.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((p) => (
                  <Link
                    key={p._id}
                    href={`/product/${p.slug}`}
                    className="bg-card rounded-xl shadow-md hover:shadow-lg transition-smooth overflow-hidden border border-border hover:border-primary/20 group"
                  >
                    <div className="relative w-full h-64 overflow-hidden">
                      <Image 
                        src={p.image} 
                        alt={p.name} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-smooth" 
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-foreground line-clamp-2">{p.name}</h3>
                      <p className="text-primary font-bold mt-2">₹{p.price}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm text-muted-foreground">{p.brand}</span>
                        <span className="text-sm text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                          {p.rating}★
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ShopYourSizeWithFilters;