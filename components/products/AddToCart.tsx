'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import useCartService from '@/lib/hooks/useCartStore';
import { IOrderFinal } from '@/lib/models/orderFinalModel';

type orderFinalModel = IOrderFinal['items'][0];

const AddToCart = ({ item }: { item: orderFinalModel }) => {
  const router = useRouter();
  const { items, increase, decrease } = useCartService();
  const [existItem, setExistItem] = useState<orderFinalModel | undefined>();

  useEffect(() => {
    setExistItem(items.find((x) => x.slug === item.slug));
  }, [item, items]);

  const addToCartHandler = () => {
    increase(item);
  };

  if (existItem) {
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-2 text-green-600 font-medium">
          <ShoppingCart size={18} />
          <span>Already in Cart</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="btn btn-sm"
            type="button"
            onClick={() => decrease(existItem)}
          >
            -
          </button>
          <span className="text-lg">{existItem.qty}</span>
          <button
            className="btn btn-sm"
            type="button"
            onClick={() => increase(existItem)}
          >
            +
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      className="btn btn-primary w-full"
      type="button"
      onClick={addToCartHandler}
    >
      Add to Cart
    </button>
  );
};

export default AddToCart;
