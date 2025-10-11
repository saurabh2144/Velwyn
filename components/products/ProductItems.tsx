import productService from '@/lib/services/productService';
import { convertDocToObj, delay } from '@/lib/utils';
import ProductItem from './ProductItem';

const ProductItems = async () => {
  await delay(4000);
  const latestProducts = await productService.getLatest();

  return (
    <div>
      <h2 className='text-2xl md:text-3xl font-bold mb-6 border-b-2 border-primary w-36'>Latest Products</h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {latestProducts.map((product) => (
          <ProductItem key={product.slug} product={convertDocToObj(product)} />
        ))}
      </div>
    </div>
  );
};

export default ProductItems;

// Skeleton Loading
const ProductItemSkeleton = () => (
  <div className='bg-white rounded-xl shadow-md overflow-hidden animate-pulse'>
    <div className='h-64 bg-gray-300'></div>
    <div className='p-4 space-y-2'>
      <div className='h-6 bg-gray-300 w-3/4'></div>
      <div className='h-4 bg-gray-300 w-1/2'></div>
      <div className='h-4 bg-gray-300 w-1/3'></div>
      <div className='h-10 bg-gray-300 w-full rounded'></div>
    </div>
  </div>
);

export const ProductItemsSkeleton = ({ qty, name }: { qty: number; name: string }) => (
  <div>
    <h2 className='text-2xl md:text-3xl font-bold mb-6 border-b-2 border-primary w-36'>{name}</h2>
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6'>
      {Array.from({ length: qty }).map((_, i) => (
        <ProductItemSkeleton key={i} />
      ))}
    </div>
  </div>
);
