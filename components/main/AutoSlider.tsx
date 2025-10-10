// components/AutoSlider.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const AutoSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  const slides = [
    {
      id: 1,
      title: "New Collection",
      subtitle: "Get it by October 18",
      description: "Fresh styles for the season",
      mobileTitle: "New Collection",
      mobileDescription: "Fresh styles arriving soon",
      image: "/images/slider/slide-1.jpg",
      background: "bg-gradient-to-r from-blue-50 to-indigo-100",
      mobileBackground: "bg-gradient-to-b from-blue-50 to-indigo-100",
      buttonText: "Shop Now",
      buttonLink: "/new-arrivals"
    },
    {
      id: 2,
      title: "Up to 40% OFF",
      subtitle: "Limited Time Offer",
      description: "On all shirts and t-shirts",
      mobileTitle: "40% OFF Sale",
      mobileDescription: "Limited time offers",
      image: "/images/slider/slide-2.jpg",
      background: "bg-gradient-to-r from-red-50 to-pink-100",
      mobileBackground: "bg-gradient-to-b from-red-50 to-pink-100",
      buttonText: "Discover Deals",
      buttonLink: "/sale"
    },
    {
      id: 3,
      title: "Premium Quality",
      subtitle: "100% Cotton Collection",
      description: "Experience comfort like never before",
      mobileTitle: "Premium Cotton",
      mobileDescription: "100% comfort guaranteed",
      image: "/images/slider/slide-3.jpg",
      background: "bg-gradient-to-r from-green-50 to-teal-100",
      mobileBackground: "bg-gradient-to-b from-green-50 to-teal-100",
      buttonText: "Explore",
      buttonLink: "/premium"
    },
    {
      id: 4,
      title: "Summer Essentials",
      subtitle: "Stay Cool & Stylish",
      description: "Lightweight fabrics for hot days",
      mobileTitle: "Summer Styles",
      mobileDescription: "Lightweight & comfortable",
      image: "/images/slider/slide-4.jpg",
      background: "bg-gradient-to-r from-orange-50 to-yellow-100",
      mobileBackground: "bg-gradient-to-b from-orange-50 to-yellow-100",
      buttonText: "Shop Summer",
      buttonLink: "/summer-collection"
    }
  ];

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
      clearInterval(interval);
    };
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="w-full relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-gray-100">
      {/* Slides Container */}
      <div 
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`w-full flex-shrink-0 h-full ${
              isMobile ? slide.mobileBackground : slide.background
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
              {/* Content Section */}
              <div className="w-full md:w-1/2 z-10 space-y-4 md:space-y-6 text-center md:text-left">
                <div className="space-y-2 md:space-y-3">
                  <p className="text-sm md:text-lg font-semibold text-gray-600">
                    {slide.subtitle}
                  </p>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                    {isMobile ? slide.mobileTitle : slide.title}
                  </h1>
                  <p className="text-base md:text-xl text-gray-600 max-w-md mx-auto md:mx-0">
                    {isMobile ? slide.mobileDescription : slide.description}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <Link 
                    href={slide.buttonLink}
                    className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors shadow-lg text-sm md:text-base"
                  >
                    {slide.buttonText}
                  </Link>
                  <button className="border-2 border-gray-900 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 hover:text-white transition-colors text-sm md:text-base">
                    Learn More
                  </button>
                </div>
              </div>

              {/* Image Section - Hidden on mobile */}
              {!isMobile && (
                <div className="hidden md:block md:w-1/2 relative h-full">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-80 h-80 lg:w-96 lg:h-96">
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg shadow-2xl flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gray-400 rounded-full mx-auto mb-3 lg:mb-4 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">👕</span>
                        </div>
                        <p className="text-xs lg:text-sm">Clothing Image</p>
                        <p className="text-xs mt-1 opacity-75">{slide.title}</p>
                      </div>
                    </div>
                    
                    <div className="absolute -top-3 -left-3 w-16 h-16 bg-yellow-400 rounded-full opacity-20"></div>
                    <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-blue-400 rounded-full opacity-20"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Hidden on mobile */}
      {!isMobile && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all z-20"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all z-20"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Slide Indicators */}
      <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 md:space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
              index === currentSlide 
                ? 'bg-gray-900 w-4 md:w-8' 
                : 'bg-gray-400 hover:bg-gray-600'
            }`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200 z-20">
        <div 
          className="h-full bg-gray-900 transition-all duration-5000 ease-linear"
          style={{ 
            width: `${(currentSlide + 1) * (100 / slides.length)}%`
          }}
        />
      </div>
    </div>
  );
};

export default AutoSlider;