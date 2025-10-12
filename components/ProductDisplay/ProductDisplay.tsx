'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AddToCart from '@/components/products/AddToCart';
import { Rating } from '@/components/products/Rating';
import { convertDocToObj } from '@/lib/utils';
import useCartService from '@/lib/hooks/useCartStore';

interface ProductDisplayProps {
  product: any;
}

const DEFAULT_OTHER_IMAGES = [
  'https://res.cloudinary.com/djniaanui/image/upload/v1760266144/xosSYsYuQ2WNJyFpvuBKy5lsWs_jsdd2z.avif',
  'https://res.cloudinary.com/djniaanui/image/upload/v1760266144/xosSYsYuQ2WNJyFpvuBKy5lsWs_jsdd2z.avif',
  'https://res.cloudinary.com/djniaanui/image/upload/v1760266144/xosSYsYuQ2WNJyFpvuBKy5lsWs_jsdd2z.avif',
  'https://res.cloudinary.com/djniaanui/image/upload/v1760266144/xosSYsYuQ2WNJyFpvuBKy5lsWs_jsdd2z.avif',
  'https://res.cloudinary.com/djniaanui/image/upload/v1760266144/xosSYsYuQ2WNJyFpvuBKy5lsWs_jsdd2z.avif',
  'https://res.cloudinary.com/djniaanui/image/upload/v1760266144/xosSYsYuQ2WNJyFpvuBKy5lsWs_jsdd2z.avif'
];

const ProductDisplay = ({ product }: ProductDisplayProps) => {
  const router = useRouter();
  const { addItem } = useCartService();

  const otherImages =
    product.otherImages && product.otherImages.length > 0
      ? product.otherImages
      : DEFAULT_OTHER_IMAGES;

  const allImages = [product.image, ...otherImages];
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [qty] = useState(1);

  // Automatic image slider
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
    if (!selectedColor || !selectedSize) {
      alert('Please select color and size before buying');
      return;
    }

    const item = {
      ...convertDocToObj(product),
      qty,
      color: selectedColor,
      size: selectedSize,
    };

    addItem(item);
    
  console.log('Buying Item:', item);
    router.push('/shipping');
  };

  return (
    <div className="my-4">
      <div className="grid gap-4 md:grid-cols-4">
        {/* Image section */}
        <div className="md:col-span-2 relative">
          <div className="relative aspect-square border p-2 bg-white flex items-center justify-center">
            <Image
              src={allImages[mainImageIndex]}
              alt={product.name}
              width={640}
              height={640}
              className="h-full w-full object-contain"
            />

            {/* Arrows */}
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 hover:bg-white/90"
            >
              &#8592;
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 hover:bg-white/90"
            >
              &#8594;
            </button>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 mt-2 overflow-x-auto">
            {allImages.map((img, idx) => (
              <div
                key={idx}
                className={`w-20 h-20 cursor-pointer border p-1 ${
                  mainImageIndex === idx ? 'border-primary' : 'border-gray-300'
                }`}
                onClick={() => setMainImageIndex(idx)}
              >
                <Image
                  src={img}
                  alt=""
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="md:col-span-1 space-y-4">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-gray-700">{product.brand}</p>
          <Rating
            value={product.rating}
            caption={`${product.numReviews} reviews`}
          />
          <p className="mt-2">{product.description}</p>

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <h3 className="font-semibold">Select Color:</h3>
              <div className="flex gap-2 mt-1">
                {product.colors.map((color: string, idx: number) => (
                  <button
                    key={idx}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor === color
                        ? 'border-black'
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 className="font-semibold">Select Size:</h3>
              <div className="flex gap-2 mt-1">
                {product.sizes.map((size: string, idx: number) => (
                  <button
                    key={idx}
                    className={`px-3 py-1 border rounded ${
                      selectedSize === size
                        ? 'bg-black text-white'
                        : 'bg-white text-black'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price & Stock */}
          <div className="mt-2">
            <div className="flex justify-between text-lg font-semibold">
              <span>Price</span>
              <span>₹{product.price}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Status</span>
              <span>
                {product.countInStock > 0 ? 'In Stock' : 'Unavailable'}
              </span>
            </div>
          </div>

          {/* Buttons */}
          {product.countInStock > 0 && (
            <div className="mt-4 flex-col gap-3">
              <AddToCart
                item={{
                  ...convertDocToObj(product),
                  qty,
                  color: selectedColor,
                  size: selectedSize,
                }}
              />
              <button
                className="btn btn-primary w-full "
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;
