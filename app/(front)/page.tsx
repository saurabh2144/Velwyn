import { Metadata } from 'next';
import { Suspense } from 'react';

import Carousel, { CarouselSkeleton } from '@/components/carousel/carousel';
import Categories from '@/components/categories/Categories';
import Icons from '@/components/icons/Icons';
import ProductItems, { ProductItemsSkeleton } from '@/components/products/ProductItems';
import ReadMore from '@/components/readMore/ReadMore';
import Text from '@/components/readMore/Text';
import Slider from '@/components/slider/Slider';

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'Velwyn',
  description: process.env.NEXT_PUBLIC_APP_DESC || 'Velwyn - Trendsetting Apparel Store',
};

const HomePage = () => {
  return (
    <div className='container mx-auto my-8 flex flex-col gap-12 px-4 md:px-0'>
      {/* Carousel */}
      <Suspense fallback={<CarouselSkeleton />}>
        <Carousel />
      </Suspense>

      {/* Hero Section */}
      <div className='flex flex-col md:flex-row gap-8 items-center'>
        <div className='flex-1'>
          <h1 className='text-4xl md:text-6xl font-bold leading-snug'>
            Simply Unique <br /> Simply Better
          </h1>
        </div>
        <div className='flex-1 text-lg md:text-xl text-gray-700'>
         <span className='font-semibold'>Velwyn</span> – Lucknow’s premier destination for stylish, high-quality clothing, curated with love by Rohit. Experience fashion that speaks your style.
        </div>
      </div>

      {/* Categories */}
      <Categories />

      {/* Icons / Features */}
      <Icons />

      {/* Latest Products */}
      <Suspense fallback={<ProductItemsSkeleton qty={8} name='Latest Products' />}>
        <ProductItems />
      </Suspense>

      {/* Top Rated Slider */}
      <Suspense fallback={<ProductItemsSkeleton qty={4} name='Top Rated' />}>
        <Slider />
      </Suspense>

      {/* About / ReadMore */}
      <ReadMore>
        <Text />
      </ReadMore>
    </div>
  );
};

export default HomePage;
