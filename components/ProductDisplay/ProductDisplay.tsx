'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AddToCart from '@/components/products/AddToCart';
import { Rating } from '@/components/products/Rating';
import { convertDocToObj } from '@/lib/utils';
import useCartService from '@/lib/hooks/useCartStore';
import { useBuyNowStore } from '@/lib/hooks/useBuyNowStore';

interface ProductDisplayProps {
  product: any;
}

const DEFAULT_OTHER_IMAGES = [
 'https://res.cloudinary.com/djniaanui/image/upload/v1760266144/xosSYsYuQ2WNJyFpvuBKy5lsWs_jsdd2z.avif',
 'https://res.cloudinary.com/djniaanui/image/upload/v1760266144/xosSYsYuQ2WNJyFpvuBKy5lsWs_jsdd2z.avif',
 'https://res.cloudinary.com/djniaanui/image/upload/v1760266144/xosSYsYuQ2WNJyFpvuBKy5lsWs_jsdd2z.avif',
 'https://res.cloudinary.com/djniaanui/image/upload/v1760266144/xosSYsYuQ2WNJyFpvuBKy5lsWs_jsdd2z.avif',
 'https://res.cloudinary.com/djniaanui/image/upload/v1760266144/xosSYsYuQ2WNJyFpvuBKy5lsWs_jsdd2z.avif',
 'https://res.cloudinary.com/djniaanui/image/upload/v1760266144/xosSYsYuQ2WNJyFpvuBKy5lsWs_jsdd2z.avif',
];

const ProductDisplay = ({ product }: ProductDisplayProps) => {
  const router = useRouter();
  const { addItem } = useCartService();        
  const { setItem } = useBuyNowStore();        

  const otherImages =
    product.otherImages && product.otherImages.length > 0
      ? product.otherImages
      : DEFAULT_OTHER_IMAGES;

  const allImages = [product.image, ...otherImages];
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setMainImageIndex((prev) =>
        prev === allImages.length - 1 ? 0 : prev + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [allImages.length]);

  const prevImage = () => {
    setMainImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setMainImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert('Please select color and size before buying');
      return;
    }

    const item = {
      _id: product._id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      price: product.price,
      qty,
      color: selectedColor,
      size: selectedSize,
    };
  
    setItem(item);      
    router.push('/shipping');
  };

 return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-6 px-4 sm:py-8 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8">
          
          {/* Image Gallery Section */}
          <div className="lg:col-span-7 flex flex-col space-y-4 lg:space-y-6">
            <div className="relative w-full aspect-square bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden group">
              <Image
                src={allImages[mainImageIndex]}
                alt={product.name}
                width={800}
                height={800}
                className="w-full h-full object-contain p-2 sm:p-4 transition-transform duration-500 group-hover:scale-105"
                priority
              />
              
              <button 
                onClick={prevImage} 
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 sm:p-3 shadow-lg border border-gray-200 transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={nextImage} 
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 sm:p-3 shadow-lg border border-gray-200 transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-black/70 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium">
                {mainImageIndex + 1} / {allImages.length}
              </div>
            </div>

            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <div
                  key={idx}
                  className={`flex-shrink-0 w-16 sm:w-20 h-16 sm:h-20 cursor-pointer rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                    mainImageIndex === idx 
                      ? 'border-blue-500 shadow-md scale-105' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setMainImageIndex(idx)}
                >
                  <Image 
                    src={img} 
                    alt={`${product.name} view ${idx + 1}`} 
                    width={80} 
                    height={80} 
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="lg:col-span-5 flex flex-col space-y-4 sm:space-y-6">
            <div className="space-y-4 sm:space-y-6">
              <div className="border-b border-gray-200 pb-4 sm:pb-6">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  {product.name}
                </h1>
                <p className="text-sm sm:text-lg text-gray-600 mt-1 sm:mt-2">{product.brand}</p>
                
                <div className="flex items-center gap-2 sm:gap-4 mt-2 sm:mt-4">
                  <Rating value={product.rating} caption={`${product.numReviews} reviews`} />
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <span className="text-xs sm:text-sm text-gray-500">{product.countInStock} in stock</span>
                </div>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">Description</h3>
                <p className="text-sm sm:text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {product.colors?.length > 0 && (
                <div className="space-y-2 sm:space-y-3">
                  <h3 className="text-sm sm:text-lg font-semibold text-gray-900">Select Color</h3>
                  <div className="flex gap-2 sm:gap-3 flex-wrap">
                    {product.colors.map((color: string) => (
                      <button
                        key={color}
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 transition-all duration-300 hover:scale-110 hover:shadow-lg ${
                          selectedColor === color 
                            ? 'border-blue-500 shadow-lg scale-110' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {product.sizes?.length > 0 && (
                <div className="space-y-2 sm:space-y-3">
                  <h3 className="text-sm sm:text-lg font-semibold text-gray-900">Select Size</h3>
                  <div className="flex gap-2 flex-wrap">
                    {product.sizes.map((size: string) => (
                      <button
                        key={size}
                        className={`px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg min-w-[50px] sm:min-w-[60px] ${
                          selectedSize === size 
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-transparent text-white shadow-lg scale-105' 
                            : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 sm:p-6 space-y-2 sm:space-y-4">
                <div className="flex justify-between items-center text-xl sm:text-2xl font-bold text-gray-900">
                  <span>Price</span>
                  <span className="text-2xl sm:text-3xl text-blue-600">₹{product.price}</span>
                </div>
                <div className="flex justify-between items-center text-sm sm:text-lg">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-semibold ${
                    product.countInStock > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {product.countInStock > 0 ? '✅ In Stock' : '❌ Out of Stock'}
                  </span>
                </div>
              </div>

              {product.countInStock > 0 && (
                <div className="space-y-3 sm:space-y-4 pt-2 sm:pt-4">
                  <AddToCart
                    item={{
                      ...convertDocToObj(product),
                      qty,
                      color: selectedColor,
                      size: selectedSize,
                    }}
                  />
                  
                  <button 
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 sm:space-x-3 text-sm sm:text-lg"
                    onClick={handleBuyNow}
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Buy Now</span>
                  </button>

                  <div className="flex justify-center gap-4 sm:gap-6 pt-2 sm:pt-4 border-t border-gray-200 text-xs sm:text-sm">
                    <div className="flex items-center gap-1 sm:gap-2 text-gray-500">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Secure Checkout
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 text-gray-500">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      Free Shipping
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
 );
};

export default ProductDisplay;
