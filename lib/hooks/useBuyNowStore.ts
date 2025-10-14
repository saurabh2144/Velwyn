'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { round2 } from '../utils';

export type BuyNowItem = {
  _id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  qty: number;
  color?: string;
  size?: string;
};

export type ShippingAddress = {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

type BuyNowState = {
  item?: BuyNowItem;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  paymentMethod: string;
  shippingAddress: ShippingAddress;

  // Actions
  setItem: (item: BuyNowItem) => void;
  clearItem: () => void;
  saveShippingAddress: (shippingAddress: ShippingAddress) => void;
  savePaymentMethod: (paymentMethod: string) => void;
};

const initialState = {
  item: undefined,
  itemsPrice: 0,
  taxPrice: 0,
  shippingPrice: 0,
  totalPrice: 0,
  paymentMethod: 'Razorpay',
  shippingAddress: {
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  },
};

export const useBuyNowStore = create<BuyNowState>()(
  persist(
    (set) => ({
      ...initialState,

      setItem: (item: BuyNowItem) => {
        const itemsPrice = round2(item.price * item.qty);
        const shippingPrice = round2(itemsPrice > 100 ? 0 : 100);
        const taxPrice = round2(itemsPrice * 0.15);
        const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

        set({
          item,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        });
      },

      clearItem: () => set({ ...initialState }),

      saveShippingAddress: (shippingAddress: ShippingAddress) =>
        set({ shippingAddress }),

      savePaymentMethod: (paymentMethod: string) => set({ paymentMethod }),
    }),
    {
      name: 'buyNowStore',
    }
  )
);
