// SearchBox.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { Search } from 'lucide-react';

export const SearchBox = () => {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'all';
  const router = useRouter();

  const [formCategory, setFormCategory] = useState(category);
  const [formQuery, setFormQuery] = useState(q);
  const [isMobile, setIsMobile] = useState(false);

  const {
    data: categories,
    error,
    isLoading,
  } = useSWR('/api/products/categories');

  // Check if mobile screen
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (error) return <div className="text-error text-sm">Error loading categories</div>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?category=${formCategory}&q=${encodeURIComponent(formQuery)}`);
  };

  // Mobile optimized version
  if (isMobile) {
    return (
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="join space-between w-full">
          <select
            name="category"
            value={formCategory}
            aria-label="Category"
            className="join-item select select-bordered select-sm w-24 text-xs"
            onChange={(e) => setFormCategory(e.target.value)}
          >
            <option value="all">All</option>
            {categories?.map((c: string) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          
          <div className="join-item ml-4 flex-1 relative">
            <input
              className="input input-bordered input-sm w-full pl-10"
              placeholder="Search products..."
              aria-label="Search"
              value={formQuery}
              name="q"
              onChange={(e) => setFormQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          
          <button 
            className="btn join-item btn-primary btn-sm px-3" 
            type="submit"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </form>
    );
  }

  // Desktop version
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="join w-full">
        <select
          name="category"
          value={formCategory}
          aria-label="Category"
          className="join-item select select-bordered w-28"
          onChange={(e) => setFormCategory(e.target.value)}
        >
          <option value="all">All</option>
          {categories?.map((c: string) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        
        <div className="join-item ml-4 flex-1 relative">
          <input
            className="input input-bordered w-full pl-10"
            placeholder="Search for products..."
            aria-label="Search"
            value={formQuery}
            name="q"
            onChange={(e) => setFormQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        
        <button 
          className="btn join-item ml-1 btn-primary px-6" 
          type="submit"
        >
          Search
        </button>
      </div>
      
      {/* {isLoading && (
        <div className="mt-2 flex gap-2">
          <div className="skeleton h-4 w-16"></div>
          <div className="skeleton h-4 w-20"></div>
          <div className="skeleton h-4 w-12"></div>
        </div>
      )} */}
      
    </form>
  );
};