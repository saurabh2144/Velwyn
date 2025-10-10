// components/SimpleBanner.tsx
'use client';

import { useState, useEffect } from 'react';

const SimpleBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const banners = [
    {
      id: 1,
      text: "🚚 Free Shipping on Orders Above ₹200",
      bgColor: "bg-green-500",
    },
    {
      id: 2,
      text: "💰 30 Days Money-back Guarantee",
      bgColor: "bg-blue-500",
    },
    {
      id: 3,
      text: "🔥 New Collection Dropping Soon",
      bgColor: "bg-red-500",
    },
    {
      id: 4,
      text: "🎉 Up to 40% OFF on Selected Items",
      bgColor: "bg-purple-500",
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <div className="w-full relative h-10 bg-gray-900 text-white overflow-hidden">
      <div 
        className="flex transition-transform duration-500 ease-in-out h-10"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            className={`w-full flex-shrink-0 flex items-center justify-center h-10 ${banner.bgColor}`}
          >
            <div className="text-center">
              <span className="font-medium text-sm flex items-center justify-center">
                {banner.text}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Progress indicators */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
        {banners.map((_, index) => (
          <div
            key={index}
            className={`w-1 h-1 rounded-full transition-all ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SimpleBanner;