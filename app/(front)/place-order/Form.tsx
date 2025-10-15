'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import useCartService from '@/lib/hooks/useCartStore';
import { useBuyNowStore } from '@/lib/hooks/useBuyNowStore';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Form = () => {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState<any>(null);

  const {
    paymentMethod,
    shippingAddress,
    items: cartItems,
    itemsPrice: cartItemsPrice,
    taxPrice: cartTaxPrice,
    shippingPrice: cartShippingPrice,
    totalPrice: cartTotalPrice,
    clear: clearCart,
  } = useCartService();

  const { item: buyNowItem, clearItem: clearBuyNow } = useBuyNowStore();
  const items = buyNowItem ? [buyNowItem] : cartItems;

  const { itemsPrice, taxPrice, shippingPrice, totalPrice } = buyNowItem
    ? (() => {
        const ip = buyNowItem.price * buyNowItem.qty;
        const sp = ip > 100 ? 0 : 100;
        const tax = ip * 0.15;
        const total = ip + sp + tax;
        return { itemsPrice: ip, shippingPrice: sp, taxPrice: tax, totalPrice: total };
      })()
    : {
        itemsPrice: cartItemsPrice,
        taxPrice: cartTaxPrice,
        shippingPrice: cartShippingPrice,
        totalPrice: cartTotalPrice,
      };

  useEffect(() => {
    if (!paymentMethod) router.push('/payment');
    if (!shippingAddress) router.push('/shipping');
    if (!buyNowItem && cartItems.length === 0) router.push('/');
  }, [paymentMethod, shippingAddress, cartItems, buyNowItem, router]);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <>Loading...</>;

  const handleCOD = () => setShowConfirm(true);

  const Coddb = async () => {
    setShowConfirm(false);
    setPlacing(true);
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    const data = {
      paymentMethod,
      shippingAddress,
      items,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    };

    try {
      const res = await fetch('/api/orderfinal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        toast.success('Order saved successfully!');
        if (buyNowItem) clearBuyNow(); else clearCart();
        router.push(`/order-success/${result.order._id}`);
      } else {
        toast.error('Failed to save order!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error while placing order');
    } finally {
      setPlacing(false);
    }
  };

  const handleOnlinePayment = async () => {
    if (!paymentMethod) return toast.error('Select payment method');
    try {
      setPlacing(true);

      const res = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalPrice }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('Razorpay order creation failed:', text);
        toast.error('Failed to create Razorpay order');
        return;
      }

      const data = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: totalPrice * 100,
        currency: 'INR',
        name: 'Velwyn',
        description: 'Order Payment',
        order_id: data.order.id,
        prefill: { 
          name: shippingAddress.fullName, 
          email: '' // No email in shippingAddress, pass empty string
        },
        handler: async (response: any) => {
          setPaymentResponse(response);

          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentData: {
                paymentMethod,
                shippingAddress,
                items,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
              },
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            toast.success('Order placed successfully!');
            if (buyNowItem) clearBuyNow(); else clearCart();
            router.push(`/order-success/${verifyData.order._id}`);
          } else {
            toast.error('Payment verification failed!');
          }
        },
        modal: { ondismiss: () => toast.error('Payment cancelled') },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Payment failed');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div>
      <CheckoutSteps current={4} />
      <div className='my-4 grid md:grid-cols-4 md:gap-5'>
        <div className='overflow-x-auto md:col-span-3'>
          {/* Shipping Address */}
          <div className='card bg-base-300'>
            <div className='card-body'>
              <h2 className='card-title'>Shipping Address</h2>
              <p>{shippingAddress.fullName}</p>
              <p>{shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}</p>
              <Link className='btn' href='/shipping'>Edit</Link>
            </div>
          </div>

          {/* Payment Method */}
          <div className='card mt-4 bg-base-300'>
            <div className='card-body'>
              <h2 className='card-title'>Payment Method</h2>
              <p>{paymentMethod}</p>
              <Link className='btn' href='/payment'>Edit</Link>
            </div>
          </div>

          {/* Items */}
          <div className='card mt-4 bg-base-300'>
            <div className='card-body'>
              <h2 className='card-title'>Items</h2>
              <table className='table'>
                <thead>
                  <tr><th>Item</th><th>Quantity</th><th>Price</th></tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.slug}>
                      <td>
                        <Link href={`/product/${item.slug}`} className='flex items-center'>
                          <Image src={item.image} alt={item.name} width={50} height={50} />
                          <span className='px-2'>{item.name} ({item.color || ''} {item.size || ''})</span>
                        </Link>
                      </td>
                      <td>{item.qty}</td>
                      <td>₹{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!buyNowItem && <Link className='btn' href='/cart'>Edit</Link>}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className='card bg-base-300'>
            <div className='card-body'>
              <h2 className='card-title'>Order Summary</h2>
              <ul className='space-y-3'>
                <li className='flex justify-between'><div>Items</div><div>₹{itemsPrice}</div></li>
                <li className='flex justify-between'><div>Tax</div><div>₹{taxPrice}</div></li>
                <li className='flex justify-between'><div>Shipping</div><div>₹{shippingPrice}</div></li>
                <li className='flex justify-between font-bold'><div>Total</div><div>₹{totalPrice}</div></li>
                <li>
                  {paymentMethod === 'CashOnDelivery' ? (
                    <button onClick={handleCOD} disabled={placing} className='btn btn-primary w-full'>{placing ? 'Placing...' : 'Place Order'}</button>
                  ) : (
                    <button onClick={handleOnlinePayment} disabled={placing} className='btn btn-primary w-full'>{placing ? 'Processing...' : `Proceed to Pay ₹${totalPrice}`}</button>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* COD Confirm Popup */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md text-center">
            <h2 className="text-xl font-semibold mb-2">Confirm Your Order</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to place this order on <b>Cash On Delivery</b>?</p>
            <div className="flex justify-center gap-4">
              <button onClick={Coddb} className="px-6 py-2 bg-green-600 text-white rounded-lg">Yes, Confirm</button>
              <button onClick={() => setShowConfirm(false)} className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;
