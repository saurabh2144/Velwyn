import Image from 'next/image';
import Link from 'next/link';
import Overlay from './Overlay';
import Shirts from '../../public/images/categories/Shirts.webp';
import Pants from '../../public/images/categories/Pants.webp';
import Sarees from '@/public/images/categories/sarees.webp'; // New image for Ladies Wear
import kurtis from '@/public/images/categories/kurtis.webp'; // New image for Ladies Wear

const Categories = () => {
  return (
    <div className='grid grid-cols-2 gap-4 md:grid-cols-3 auto-rows-[330px]'>
      <Link
        href='/search?category=Shirts'
        className='group relative overflow-hidden rounded-xl'
      >
        <Image
          src={Shirts}
          alt='Shirts'
          className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
          
        />
        <Overlay category='Shirts' />
      </Link>

      <Link
        href='/search?category=Pants'
        className='group relative overflow-hidden rounded-xl'
      >
        <Image
          src={Pants}
          alt='Pants'
          className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
         
        />
        <Overlay category='Pants' />
      </Link>

      <Link
        href='/search?category=Sarees'
        className='group relative overflow-hidden rounded-xl'
      >
        <Image
          src={Sarees}
          alt='Sarees'
          className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
  
        />
        <Overlay category='Sarees' />
      </Link>
      <Link
        href='/search?category=Sarees'
        className='group relative overflow-hidden sm:hidden rounded-xl'
      >
        <Image
          src={kurtis}
          alt='kurtis'
          className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
  
        />
        <Overlay category='kurtis' />
      </Link>
    </div>
  );
};

export default Categories;
