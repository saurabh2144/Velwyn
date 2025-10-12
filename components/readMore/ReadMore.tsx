'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';

const ReadMore = ({ children }: { children: React.ReactNode }) => {
  const [isMore, setIsMore] = useState(false);

  return (
    <div className='mb-10 py-5 w-full md:py-10'>
      <div
        className={cn(
          `relative mx-auto w-full overflow-hidden`,
          isMore ? 'max-h-none' : 'max-h-[120px] line-clamp-5'
        )}
      >
        {children}
        
        {!isMore && (
          <div className='absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-base-100 flex items-end justify-center pb-2'>
            <button
              onClick={() => setIsMore(true)}
              className='btn btn-sm flex items-center gap-1'
            >
              Read More
              <ChevronDown size={16} />
            </button>
          </div>
        )}
      </div>
      
      {isMore && (
        <div className='flex justify-center mt-4'>
          <button 
            onClick={() => setIsMore(false)} 
            className='btn btn-sm flex items-center gap-1'
          >
            Show Less
            <ChevronUp size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ReadMore;