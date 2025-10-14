'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [filters, setFilters] = useState({
    category: 'all',
    brand: 'all',
    priceRange: [0, 0],
    rating: 'all',
    sort: 'newest',
  });

  const productsSectionRef = useRef<HTMLDivElement>(null);

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
    const wasAlreadySelected = selectedSize === size;

    if (wasAlreadySelected) {
      setSelectedSize(null);
      setProducts([]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setSelectedSize(size);
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
    }
  };

  return (
    <div className="bg-gradient-hero min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <h2 className="text-4xl font-extrabold text-center text-foreground mb-12 tracking-tight">
          SHOP YOUR SIZE
        </h2>

        {/* Size Selection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          {sizes.map((size) => (
            <div key={size.label} className="group perspective-1000">
              <div
                className={`relative flex flex-col items-center bg-card p-6 rounded-xl shadow-lg border border-border transition-all duration-500 ease-out transform
                group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-primary/20
                group-hover:bg-gradient-to-br group-hover:from-card group-hover:to-primary/5
                group-hover:border-primary/30 group-hover:-translate-y-2
                ${selectedSize === size.label ? 'ring-2 ring-primary shadow-glow' : ''}`}
              >
                <button
                  onClick={() => handleSizeClick(size.label)}
                  className={`relative w-20 h-20 text-xl font-bold rounded-full border-4 transition-all duration-500 ease-out transform group-hover:scale-110 group-hover:shadow-lg flex items-center justify-center z-10
                    ${
                      selectedSize === size.label
                        ? 'bg-primary text-primary-foreground border-primary shadow-glow scale-110'
                        : 'bg-card text-foreground border-muted-foreground/30 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground'
                    }`}
                >
                  {size.label}
                  <div className="absolute inset-0 rounded-full bg-primary/20 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500" />
                </button>
                <p className="mt-3 text-sm text-foreground font-semibold text-center relative z-10 group-hover:text-primary transition-colors duration-300">
                  {size.name}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Products Section */}
        {selectedSize && (
          <div ref={productsSectionRef}>
            {/* Loading */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-muted-foreground mt-4">Loading products for {selectedSize}...</p>
              </div>
            )}

            {/* Filters */}
            {!loading && (
              <div className="flex flex-wrap justify-center gap-3 mb-10">
                <select
                  value={filters.category}
                  onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
                  className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.brand}
                  onChange={(e) => setFilters((prev) => ({ ...prev, brand: e.target.value }))}
                  className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground"
                >
                  <option value="all">All Brands</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.rating}
                  onChange={(e) => setFilters((prev) => ({ ...prev, rating: e.target.value }))}
                  className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground"
                >
                  <option value="all">All Ratings</option>
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>
                      {r}★ & Up
                    </option>
                  ))}
                </select>

                <select
                  value={filters.sort}
                  onChange={(e) => setFilters((prev) => ({ ...prev, sort: e.target.value }))}
                  className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground"
                >
                  <option value="newest">Newest</option>
                  <option value="lowest">Price: Low to High</option>
                  <option value="highest">Price: High to Low</option>
                  <option value="toprated">Top Rated</option>
                </select>
              </div>
            )}

            {/* Products Grid - Horizontal Scroll */}
            {!loading && products.length > 0 ? (
              <div className="flex space-x-6 overflow-x-auto py-4 scrollbar-hide">
                {products.map((p) => (
                  <Link
                    key={p._id}
                    href={`/product/${p.slug}`}
                    className="min-w-[220px] group relative bg-card rounded-xl shadow-md border border-border transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:border-primary/20 flex-shrink-0"
                  >
                    <div className="relative w-full h-64 overflow-hidden">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300">
                        {p.name}
                      </h3>
                      <p className="text-primary font-bold mt-2">₹{p.price}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-muted-foreground">{p.brand}</span>
                        <span className="text-sm text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                          {p.rating}★
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              !loading && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">No products found for {selectedSize} size.</p>
                  <p className="text-sm text-muted-foreground mt-2">Try selecting different filters</p>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopYourSizeWithFilters;
