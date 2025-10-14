'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface Order {
  _id: string;
  userId: { email: string; name: string };
  paymentMethod: string;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: {
    name: string;
    color: string;
    size: string;
    qty: number;
    price: number;
    slug: string;
    image: string;
  }[];
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  paid: boolean;
  paymentId: string;
  paymentFrom: string;
  paymentDate: string;
}

const OrderSuccessPage = ({ params }: { params: { orderId: string } }) => {
       console.log("Fetching order ID:", params.orderId);
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        console.log("Fetching order ID:", params.orderId);

        const res = await fetch(`/api/ordercompleted/${params.orderId}`);
        const data = await res.json();
        if (data.success) setOrder(data.order);
        else toast.error('Order not found!');
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch order');
      }
    };
    fetchOrder();
  }, [params.orderId]);

  if (!order) return <div className="text-center mt-10"><h1>hello this is </h1>Loading order...</div>;

 return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
    {/* Congratulations Popup */}
    {showPopup && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 animate-fadeIn">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-[95%] max-w-md transform scale-95 animate-popIn">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">🎉</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Congratulations!
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Your order has been successfully placed and is being processed.
          </p>
          <button
            onClick={() => setShowPopup(false)}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            View Order Details
          </button>
        </div>
      </div>
    )}

    {/* Main Content */}
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600 text-lg">Thank you for your purchase. Your order is being processed.</p>
      </div>

      {/* Order Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Order Summary</h2>
              <p className="text-blue-100">#{order._id}</p>
            </div>
            <div className="bg-white/20 rounded-lg px-3 py-1">
              <span className="font-semibold">{order.paymentMethod}</span>
              {order.paid && (
                <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Paid
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-6">
          {/* Customer Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Customer Information
                </h3>
                <p className="font-medium text-gray-800">{order.userId.name}</p>
                <p className="text-gray-600">{order.userId.email}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Shipping Address
              </h3>
              <div className="text-gray-800">
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Order Items
            </h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Product</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-700">Quantity</th>
                    <th className="text-right py-4 px-6 font-semibold text-gray-700">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.items.map((item, index) => (
                    <tr key={`${item.slug}-${index}`} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{item.name}</p>
                            <p className="text-sm text-gray-500">
                              {item.color} {item.size}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-4 px-6">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {item.qty}
                        </span>
                      </td>
                      <td className="text-right py-4 px-6 font-semibold text-gray-800">
                        ₹{item.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Price Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Items Price</span>
                <span className="font-medium">₹{order.itemsPrice}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">₹{order.taxPrice}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">₹{order.shippingPrice}</span>
              </div>
              <div className="border-t border-gray-300 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">Total Amount</span>
                  <span className="text-xl font-bold text-blue-600">₹{order.totalPrice}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          {order.paymentId && (
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">Payment Information</h3>
              <p className="text-blue-700">
                <strong>Payment ID:</strong> {order.paymentId}
                {order.paymentFrom && ` via ${order.paymentFrom}`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => router.push('/')}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Back to Home</span>
        </button>
        
        <button
          onClick={() => window.print()}
          className="bg-white text-gray-700 border border-gray-300 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          <span>Print Receipt</span>
        </button>
      </div>
    </div>
  </div>
);
};

export default OrderSuccessPage;
