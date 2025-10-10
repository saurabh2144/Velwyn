// components/AutoSlider.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const AutoSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      id: 1,
      title: "New Collection Dropping",
      subtitle: "Get it by October 18",
      description: "Fresh styles for the season",
      image: "/images/slider/slide-1.jpg", // Replace with actual image paths
      background: "bg-gradient-to-r from-blue-50 to-indigo-100",
      buttonText: "Shop Now",
      buttonLink: "/new-arrivals"
    },
    {
      id: 2,
      title: "Up to 40% OFF",
      subtitle: "Limited Time Offer",
      description: "On all shirts and t-shirts",
      image: "/images/slider/slide-2.jpg",
      background: "bg-gradient-to-r from-red-50 to-pink-100",
      buttonText: "Discover Deals",
      buttonLink: "/sale"
    },
    {
      id: 3,
      title: "Premium Quality Fabrics",
      subtitle: "100% Cotton Collection",
      description: "Experience comfort like never before",
      image: "/images/slider/slide-3.jpg",
      background: "bg-gradient-to-r from-green-50 to-teal-100",
      buttonText: "Explore Collection",
      buttonLink: "/premium"
    },
    {
      id: 4,
      title: "Summer Essentials",
      subtitle: "Stay Cool & Stylish",
      description: "Lightweight fabrics for hot days",
      image: "/images/slider/slide-4.jpg",
      background: "bg-gradient-to-r from-orange-50 to-yellow-100",
      buttonText: "Shop Summer",
      buttonLink: "/summer-collection"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="w-full relative h-[500px] md:h-[600px] overflow-hidden bg-gray-100">
      {/* Slides Container */}
      <div 
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`w-full flex-shrink-0 h-full ${slide.background} relative`}
          >
            <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
              {/* Content Section */}
              <div className="w-full md:w-1/2 z-10 space-y-6">
                <div className="space-y-3">
                  <p className="text-lg font-semibold text-gray-600">
                    {slide.subtitle}
                  </p>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-xl text-gray-600 max-w-md">
                    {slide.description}
                  </p>
                </div>
                
                <div className="flex space-x-4">
                  <button className="bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors shadow-lg">
                    {slide.buttonText}
                  </button>
                  <button className="border-2 border-gray-900 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 hover:text-white transition-colors">
                    Learn More
                  </button>
                </div>
              </div>

              {/* Image Section */}
              <div className="hidden md:block md:w-1/2 relative h-full">
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-96 h-96">
                  {/* Placeholder for clothing image */}
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg shadow-2xl flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <div className="w-24 h-24 bg-gray-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-white font-bold">👕</span>
                      </div>
                      <p className="text-sm">Clothing Image</p>
                      <p className="text-xs mt-1">{slide.title}</p>
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -left-4 w-20 h-20 bg-yellow-400 rounded-full opacity-20"></div>
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-blue-400 rounded-full opacity-20"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all z-20"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all z-20"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide 
                ? 'bg-gray-900 w-8' 
                : 'bg-gray-400 hover:bg-gray-600'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200 z-20">
        <div 
          className="h-full bg-gray-900 transition-all duration-5000 ease-linear"
          style={{ 
            width: `${(currentSlide + 1) * (100 / slides.length)}%`,
            transition: 'width 5s linear'
          }}
        />
      </div>
    </div>
  );
};

export default AutoSlider;