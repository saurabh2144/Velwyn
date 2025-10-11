import Image from 'next/image';
import Link from 'next/link';
import { getPlaiceholder } from 'plaiceholder';

import { Product } from '@/lib/models/ProductModel';

import { Rating } from './Rating';

const ProductItem = async ({ product }: { product: Product }) => {
  const buffer = await fetch(product.image).then(async (res) =>
    Buffer.from(await res.arrayBuffer()),
  );

  const { base64 } = await getPlaiceholder(buffer);

  return (
    <>
      {/* <div className='card mb-4 bg-base-300'>
      <figure>
        <Link
          href={`/product/${product.slug}`}
          className='relative aspect-square h-full w-full'
        >
          <Image
            src={product.image}
            alt={product.name}
            placeholder='blur'
            blurDataURL={base64}
            width={350}
            height={350}
            className='h-full w-full object-cover'
          />
        </Link>
      </figure>
      <div className='card-body'>
        <Link href={`/product/${product.slug}`}>
          <h3 className='card-title line-clamp-1 font-normal'>
            {product.name}
          </h3>
        </Link>
        <Rating value={product.rating} caption={`(${product.name})`} isCard />
        <p className='line-clamp-1'>{product.brand}</p>
        <div className='card-actions flex items-center justify-between'>
          <span className='text-2xl'>₹{product.price}</span>
        </div>
      </div>
    </div> */}



      <Link
        href={`/product/${product.slug}`}

      >
        <div

          className="group cursor-pointer"
        >
          <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-3 overflow-hidden relative">
            <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
              <span className="text-gray-600 text-sm">

                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  style={{ objectFit: 'cover' }} // cover / contain / fill
                />
                {/* <img src={product.image} alt={product.name}  />*/}</span>

            </div>

            {/* Quick add to cart */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="bg-white px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:bg-gray-50">
                Quick Add +
              </button>
            </div>
          </div>

          <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-lg font-bold text-gray-900">{product.price}</p>
          <p className='line-clamp-1'>{product.brand}</p>
          <Rating value={product.rating} caption={''} />
          <div className="mt-2 flex items-center space-x-1">
            <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-xs hover:bg-gray-50">
              S
            </button>
            <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-xs hover:bg-gray-50">
              M
            </button>
            <button className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-xs hover:bg-gray-50">
              L
            </button>
            <span className="text-xs text-gray-500 ml-1">+7</span>
          </div>
        </div>
      </Link>
    </>
  );
};

export default ProductItem;
