// app/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';

import Carousel, { CarouselSkeleton } from '@/components/carousel/carousel';
import Categories from '@/components/categories/Categories';
import Icons from '@/components/icons/Icons';
import ProductItems, { ProductItemsSkeleton } from '@/components/products/ProductItems';
import ReadMore from '@/components/readMore/ReadMore';
import Text from '@/components/readMore/Text';
import Slider from '@/components/slider/Slider';
import AutoSlider from '@/components/main/AutoSlider';
import FeaturedCategories from '@/components/main/FeaturedCategories';
import ShopYourSize from '@/components/main/ShopYourSize';
import Banner from '@/components/main/Banner';
import NewAndPopular from '@/components/main/NewAndPopular';



export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'Velwyn',
  description: process.env.NEXT_PUBLIC_APP_DESC || 'Velwyn - Trendsetting Apparel Store',
};

export default async function HomePage() {
  return (
    <div className='container mx-auto my-8 flex flex-col gap-12 px-4 md:px-0'>
      <Suspense fallback={<CarouselSkeleton />}>
        <Carousel />
      </Suspense>

      <div className='flex flex-col md:flex-row gap-8 items-center'>
        <div className='flex-1'>
          <h1 className='text-4xl md:text-6xl font-bold leading-snug'>
            Simply Unique <br /> Simply Better
          </h1>
        </div>
        <div className='flex-1 text-lg md:text-xl text-gray-700'>
          <span className='font-semibold'>Velwyn</span>- creates premium unisex casuals that blend minimal design with luxurious comfort. Designed in India, made for everyday elegance.
        </div>
      </div>

      <AutoSlider />

      <Banner />
      <NewAndPopular/>
      <ShopYourSize />
      <FeaturedCategories />
      <Categories />
      <Icons />

      {/* New & Popular SSR Section */}
      


      <Suspense fallback={<ProductItemsSkeleton qty={8} name='Latest Products' />}>
        <ProductItems />
      </Suspense>

    

      <Suspense fallback={<ProductItemsSkeleton qty={4} name='Top Rated' />}>
        <Slider />
      </Suspense>

      <ReadMore>
        <Text />
      </ReadMore>
    </div>
  );
}
