// components/TestComponent.tsx
'use client';
import { useEffect, useState } from 'react';
import productService from '@/lib/services/productService';

export default function TestComponent() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const test = async () => {
      try {
        console.log('Testing service...');
        
        // Test 1: Get categories
        const categories = await productService.getCategories();
        console.log('Categories:', categories);
        
        // Test 2: Get all products
        const allProducts = await productService.getByQuery({
          q: 'all',
          category: 'all',
          price: 'all',
          rating: 'all',
          sort: 'newest',
          page: '1',
          limit: 10
        });
        console.log('All Products:', allProducts);
        
        setData({ categories, allProducts });
      } catch (error) {
        console.error('Test failed:', error);
        
      }
    };
    
    test();
  }, []);

  return (
    <div className="p-4 bg-yellow-100">
      <h3 className="font-bold">Debug Info:</h3>
      <pre className="text-xs">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}