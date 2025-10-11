'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Product } from '@/lib/models/ProductModel';

import { Rating } from './Rating';

const ProductItem = ({ product }: { product: Product }) => {
  // Ensure image URL is not empty and use placeholder if needed
  const imageUrl = product.image && product.image.trim() !== '' 
    ? product.image 
    : '/images/placeholder.jpg';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Add to cart logic here
    console.log('Quick Add:', product.name);
  };

  const handleSizeClick = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    // Size selection logic here
    console.log('Size selected:', size);
  };

  return (
    <Link href={`/product/${product.slug}`}>
      <div className="group cursor-pointer">
        <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-3 overflow-hidden relative">
          <div className="w-full h-full">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          </div>

          {/* Quick add to cart */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              className="bg-white px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:bg-gray-50"
              onClick={handleQuickAdd}
            >
              Quick Add +
            </button>
          </div>
        </div>

        <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-lg font-bold text-gray-900">₹{product.price}</p>
        <p className='line-clamp-1 text-sm text-gray-600'>{product.brand}</p>
        <Rating value={product.rating} caption={''} />
        
        {/* Sizes */}
        <div className="mt-2 flex items-center space-x-1">
          {product.sizes?.slice(0, 3).map((size) => (
            <button 
              key={size}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-xs hover:bg-gray-50"
              onClick={(e) => handleSizeClick(e, size)}
            >
              {size}
            </button>
          ))}
          {product.sizes && product.sizes.length > 3 && (
            <span className="text-xs text-gray-500 ml-1">
              +{product.sizes.length - 3}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;