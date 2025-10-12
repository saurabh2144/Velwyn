'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Product } from '@/lib/models/ProductModel';
import { OrderItem } from '@/lib/models/OrderModel';
import useCartService from '@/lib/hooks/useCartStore';
import { Rating } from './Rating';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const ProductItem = ({ product }: { product: Product }) => {
  const { items, increase } = useCartService();
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0] || 'Default');

  const [showAdded, setShowAdded] = useState(false);
  const [showAlready, setShowAlready] = useState(false);

  const imageUrl = product.image && product.image.trim() !== '' 
    ? product.image 
    : '/images/placeholder.jpg';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const existItem = items.find(
      (x) => x.slug === product.slug && x.size === selectedSize && x.color === selectedColor
    );

    if (existItem) {
      // Item already in cart -> show popup
      setShowAlready(true);
    } else {
      const newItem: OrderItem = {
        slug: product.slug,
        name: product.name,
        image: product.image,
        price: product.price,
        qty: 1,
        size: selectedSize,
        color: selectedColor,
      };
      increase(newItem);

      // Show animation feedback
      setShowAdded(true);
      setTimeout(() => setShowAdded(false), 1000); // hide after 1 sec
    }
  };

  return (
    <Link href={`/product/${product.slug}`}>
      <div className="group cursor-pointer relative">
        <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-3 overflow-hidden relative">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />

          {/* Quick Add Button */}
          <button 
            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:bg-gray-50"
            onClick={handleQuickAdd}
          >
            Quick Add +
          </button>

          {/* Added Animation */}
          <AnimatePresence>
            {showAdded && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-2 left-1/2 -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded shadow-md text-sm"
              >
                Added to cart!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Product Info */}
        <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-lg font-bold text-gray-900">₹{product.price}</p>
        <p className='line-clamp-1 text-sm text-gray-600'>{product.brand}</p>
        <Rating value={product.rating} caption={''} />

        {/* Sizes */}
        <div className="mt-2 flex items-center space-x-1">
          {product.sizes?.map((size) => (
            <button
              key={size}
              className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs 
                ${selectedSize === size ? 'border-blue-500 bg-blue-100' : 'border-gray-300'} 
                hover:bg-gray-50`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedSize(size);
              }}
            >
              {size}
            </button>
          ))}
        </div>

        {/* Colors */}
        {product.colors && (
          <div className="mt-2 flex items-center space-x-1">
            {product.colors.map((color) => (
              <button
                key={color}
                className={`w-6 h-6 rounded-full border flex items-center justify-center 
                  ${selectedColor === color ? 'border-blue-500' : 'border-gray-300'} 
                  hover:ring-1 hover:ring-blue-300`}
                style={{ backgroundColor: color }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedColor(color);
                }}
              />
            ))}
          </div>
        )}

        {/* Already in Cart Modal */}
        <AnimatePresence>
          {showAlready && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="bg-white p-6 rounded-lg shadow-lg w-80 text-center"
              >
                <h3 className="text-lg font-semibold mb-4">Item already in your cart</h3>
                <div className="flex justify-around">
                  <Link
                    href="/cart"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Checkout
                  </Link>
                  <button
                    onClick={() => setShowAlready(false)}
                    className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Link>
  );
};

export default ProductItem;