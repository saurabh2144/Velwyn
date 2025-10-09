'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import { OrderItem } from '@/lib/models/OrderModel';

interface IOrderDetails {
  orderId: string;
}

const OrderDetails = ({ orderId }: IOrderDetails) => {
  const { data: session } = useSession();

  const { trigger: deliverOrder, isMutating: isDelivering } = useSWRMutation(
    `/api/orders/${orderId}`,
    async () => {
      const res = await fetch(`/api/admin/orders/${orderId}/deliver`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      res.ok
        ? toast.success('Order delivered successfully')
        : toast.error(data.message);
    }
  );

  const handleRazorpayPayment = async () => {
    try {
      // 1. Create Razorpay order from backend
      const res = await fetch(`/api/orders/${orderId}/create-razorpay-order`, {
        method: 'POST',
      });
      const orderData = await res.json();

      // 2. Razorpay checkout options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: orderData.amount, // paise
        currency: 'INR',
        name: 'Velwyn',
        order_id: orderData.id,
        handler: async function (response: any) {
          // 3. Capture payment on backend
          await fetch(`/api/orders/${orderId}/capture-razorpay-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ razorpay_payment_id: response.razorpay_payment_id }),
          });
          toast.success('Payment Successful');
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error('Payment failed');
    }
  };

  const { data, error } = useSWR(`/api/orders/${orderId}`);

  if (error) return error.message;
  if (!data) return 'Loading...';

  const {
    paymentMethod,
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isDelivered,
    deliveredAt,
    isPaid,
    paidAt,
  } = data;

  return (
    <div>
      <h1 className='py-4 text-2xl'>Order {orderId}</h1>
      <div className='my-4 grid md:grid-cols-4 md:gap-5'>
        <div className='md:col-span-3'>
          <div className='card bg-base-300'>
            <div className='card-body'>
              <h2 className='card-title'>Shipping Address</h2>
              <p>{shippingAddress.fullName}</p>
              <p>
                {shippingAddress.address}, {shippingAddress.city},{' '}
                {shippingAddress.postalCode}, {shippingAddress.country}{' '}
              </p>
              {isDelivered ? (
                <div className='text-success'>Delivered at {deliveredAt}</div>
              ) : (
                <div className='text-error'>Not Delivered</div>
              )}
            </div>
          </div>

          <div className='card mt-4 bg-base-300'>
            <div className='card-body'>
              <h2 className='card-title'>Payment Method</h2>
              <p>{paymentMethod}</p>
              {isPaid ? (
                <div className='text-success'>Paid at {paidAt}</div>
              ) : (
                <div className='text-error'>Not Paid</div>
              )}
            </div>
          </div>

          <div className='card mt-4 bg-base-300'>
            <div className='card-body'>
              <h2 className='card-title'>Items</h2>
              <table className='table'>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: OrderItem) => (
                    <tr key={item.slug}>
                      <td>
                        <Link
                          href={`/product/${item.slug}`}
                          className='flex items-center'
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          />
                          <span className='px-2'>
                            {item.name} ({item.color} {item.size})
                          </span>
                        </Link>
                      </td>
                      <td>{item.qty}</td>
                      <td>₹{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className='card bg-base-300'>
            <div className='card-body'>
              <h2 className='card-title'>Order Summary</h2>
              <ul>
                <li>
                  <div className='mb-2 flex justify-between'>
                    <div>Items</div>
                    <div>₹{itemsPrice}</div>
                  </div>
                </li>
                <li>
                  <div className='mb-2 flex justify-between'>
                    <div>Tax</div>
                    <div>₹{taxPrice}</div>
                  </div>
                </li>
                <li>
                  <div className='mb-2 flex justify-between'>
                    <div>Shipping</div>
                    <div>₹{shippingPrice}</div>
                  </div>
                </li>
                <li>
                  <div className='mb-2 flex justify-between'>
                    <div>Total</div>
                    <div>₹{totalPrice}</div>
                  </div>
                </li>

                {!isPaid && paymentMethod === 'Razorpay' && (
                  <li>
                    <button
                      className='btn btn-primary w-full'
                      onClick={handleRazorpayPayment}
                    >
                      Pay Now
                    </button>
                  </li>
                )}

                {session?.user.isAdmin && (
                  <li>
                    <button
                      className='btn my-2 w-full'
                      onClick={() => deliverOrder()}
                      disabled={isDelivering}
                    >
                      {isDelivering && (
                        <span className='loading loading-spinner'></span>
                      )}
                      Mark as delivered
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
