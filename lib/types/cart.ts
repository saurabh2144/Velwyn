// lib/types/cart.ts

export type CartItem = {
  slug: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  size: string;
  color?: string;
};

export type ShippingAddress = {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};
