import Image from 'next/image';
import Link from 'next/link';
import Overlay from './Overlay';
import Handbags from '../../public/images/categories/Handbags.webp';
import Pants from '../../public/images/categories/Pants.webp';
import Shirts from '../../public/images/categories/Shirts.webp';

const Categories = () => {
  return (
    <div className='grid grid-cols-2 gap-4 md:grid-cols-4 md:auto-rows-[330px] auto-rows-[300px]'>
      <Link href='/search?category=Shirts' className='group relative col-span-2 row-span-1 md:row-span-2 overflow-hidden rounded-xl'>
        <Image src={Shirts} alt='Shirts' className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105' placeholder='blur' />
        <Overlay category='Shirts' />
      </Link>

      <Link href='/search?category=Pants' className='group relative overflow-hidden rounded-xl'>
        <Image src={Pants} alt='Pants' className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105' placeholder='blur' />
        <Overlay category='Pants' />
      </Link>

      <Link href='/search?category=Handbags' className='group relative overflow-hidden rounded-xl'>
        <Image src={Handbags} alt='Handbags' className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105' placeholder='blur' />
        <Overlay category='Handbags' />
      </Link>
    </div>
  );
};

export default Categories;
