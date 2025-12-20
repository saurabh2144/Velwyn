'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { IOrderFinal } from '@/lib/models/orderFinalModel';

// Derive the item type directly from the model
type OrderItem = IOrderFinal['items'][0];

type Order = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  totalPrice: number;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  paymentMethod: string;
  userId: { name: string; email: string };
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: OrderItem[];
  deliveryStatus?: string;
  expectedDeliveryDate?: string;
  [key: string]: any;
};

export default function OrderPage() {
  const params = useParams();
  const orderId = params.id;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showContactPopup, setShowContactPopup] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        console.log('Fetched order data:', data);
        if (data.success) setOrder(data.order);
        else setError(data.message || 'Order not found');
      } catch {
        setError('Failed to fetch order');
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading order details...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">Oops!</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  if (!order)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-yellow-500 text-4xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-yellow-800 mb-2">
            Order Not Found
          </h2>
          <p className="text-yellow-600">
            The order you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );

  const StatusBadge = ({
    status,
    label,
    date,
  }: {
    status: boolean | string;
    label: string;
    date?: string;
  }) => (
    <div
      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
        typeof status === 'boolean'
          ? status
            ? 'bg-green-100 text-green-800 border border-green-200'
            : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
          : status === 'delivered'
          ? 'bg-green-100 text-green-800 border border-green-200'
          : status === 'on_the_way'
          ? 'bg-blue-100 text-blue-800 border border-blue-200'
          : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full mr-2 ${
          typeof status === 'boolean'
            ? status
              ? 'bg-green-500'
              : 'bg-yellow-500'
            : status === 'delivered'
            ? 'bg-green-500'
            : status === 'on_the_way'
            ? 'bg-blue-500'
            : 'bg-yellow-500'
        }`}
      ></span>
      {typeof status === 'boolean'
        ? status
          ? `${label} • ${date ? new Date(date).toLocaleDateString() : ''}`
          : `Pending ${label}`
        : status === 'delivered'
        ? `Delivered • ${date ? new Date(date).toLocaleDateString() : ''}`
        : status === 'on_the_way'
        ? 'On the Way'
        : status || 'Pending'}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <span className="text-2xl">📦</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Order Details
                  </h1>
                  <p className="text-gray-500 mt-1 text-lg">
                    Order ID: {order._id}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
              <StatusBadge
                status={order.isPaid}
                label="Paid"
                date={order.paidAt}
              />
              <StatusBadge
                status={order.deliveryStatus || order.isDelivered}
                label="Delivery"
                date={order.deliveredAt}
              />
            </div>
          </div>
        </div>

        {/* Expected Delivery Date */}
        {order.expectedDeliveryDate && (
          <div className="mb-8 bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-4 rounded-xl">
                <span className="text-3xl">🚚</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Expected Delivery Date
                </h3>
                <p className="text-gray-600 text-lg mt-1">
                  {new Date(order.expectedDeliveryDate).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Items Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            Items in this Order
          </h2>
          <div className="divide-y divide-gray-200">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between py-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl border"
                  />
                  <div>
                    <p className="text-lg font-medium text-gray-800">
                      {item.name}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {item.color ? `Color: ${item.color} • ` : ''}
                      {item.size ? `Size: ${item.size}` : ''}
                    </p>
                  </div>
                </div>
                <div className="text-right mt-3 sm:mt-0">
                  <p className="text-gray-800 font-semibold">
                    ₹{item.price.toFixed(2)}
                  </p>
                  <p className="text-gray-500 text-sm">Qty: {item.qty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">
            Order Summary
          </h2>
          <div className="space-y-3 text-lg">
            <div className="flex justify-between">
              <span>Items Total:</span>
              <span>₹{order.itemsPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>₹{order.shippingPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>₹{order.taxPrice.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900">
              <span>Grand Total:</span>
              <span>₹{order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Contact Customer Care Button */}
      <button
        onClick={() => setShowContactPopup(true)}
        className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 z-50 transition-all duration-300 transform hover:scale-105"
      >
        <span className="text-2xl">📞</span>
        <span className="font-semibold">Contact Customer Care</span>
      </button>

      {/* Contact Popup */}
      {showContactPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 relative">
            <button
              onClick={() => setShowContactPopup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
            >
              ×
            </button>

            <div className="text-center">
              <div className="text-5xl mb-6">📧</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Contact Customer Care
              </h3>
              <p className="text-gray-700 mb-6">
                Email us at: <br />
                <a
                  href="mailto:contact.velwyn@gmail.com"
                  className="text-indigo-600 font-medium hover:underline break-all"
                >
                  contact.velwyn@gmail.com
                </a>
              </p>
              <p className="text-gray-600">
                Our agent will respond to you soon if you email us your problem.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}