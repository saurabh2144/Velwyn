import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, ShippingAddress } from '../types/cart';
import { round2 } from '../utils';

type Cart = {
  items: CartItem[];
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  paymentMethod: string;
  shippingAddress: ShippingAddress;
};

const initialState: Cart = {
  items: [],
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

export const cartStore = create<Cart>()(
  persist(() => initialState, { name: 'cartStore' })
);

export const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(items.reduce((acc, item) => acc + item.price * item.qty, 0));
  const shippingPrice = round2(itemsPrice > 100 ? 0 : 100);
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
};

const useCartService = () => {
  const {
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
    shippingAddress,
  } = cartStore();

  return {
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
    shippingAddress,

    addItem: (item: CartItem) => {
      const exist = items.find(
        (x) => x.slug === item.slug && x.size === item.size && x.color === item.color
      );

      const updatedCartItems = exist
        ? items.map((x) =>
            x.slug === item.slug &&
            x.size === item.size &&
            x.color === item.color
              ? { ...exist, qty: exist.qty + item.qty }
              : x
          )
        : [...items, item];

      const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calcPrice(updatedCartItems);

      cartStore.setState({
        items: updatedCartItems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });
    },

    increase: (item: CartItem) => {
      const exist = items.find(
        (x) => x.slug === item.slug && x.size === item.size && x.color === item.color
      );
      const updatedCartItems = exist
        ? items.map((x) =>
            x.slug === item.slug && x.size === item.size && x.color === item.color
              ? { ...exist, qty: exist.qty + 1 }
              : x
          )
        : [...items, { ...item, qty: 1 }];

      const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calcPrice(updatedCartItems);

      cartStore.setState({
        items: updatedCartItems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });
    },

    decrease: (item: CartItem) => {
      const exist = items.find(
        (x) => x.slug === item.slug && x.size === item.size && x.color === item.color
      );
      if (!exist) return;
      const updatedCartItems =
        exist.qty === 1
          ? items.filter((x) => !(x.slug === item.slug && x.size === item.size && x.color === item.color))
          : items.map((x) =>
              x.slug === item.slug && x.size === item.size && x.color === item.color
                ? { ...exist, qty: exist.qty - 1 }
                : x
            );

      const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calcPrice(updatedCartItems);

      cartStore.setState({
        items: updatedCartItems,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });
    },

    saveShippingAddress: (address: ShippingAddress) => {
      cartStore.setState({ shippingAddress: address });
    },

    savePaymentMethod: (method: string) => {
      cartStore.setState({ paymentMethod: method });
    },

    clear: () => {
      cartStore.setState({ items: [], itemsPrice: 0, taxPrice: 0, shippingPrice: 0, totalPrice: 0 });
    },

    init: () => cartStore.setState(initialState),
  };
};

export default useCartService;
