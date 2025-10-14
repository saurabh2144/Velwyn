'use client';

import Link from 'next/link';
import useSWR from 'swr';
import { useState, useEffect } from 'react';

type Order = {
  _id: string;
  createdAt: string;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
};

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function MyOrders() {
  const { data, error, isLoading } = useSWR('/api/orders/mine', fetcher);

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="text-red-500 text-4xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-red-800 mb-2">Error Loading Orders</h2>
        <p className="text-red-600 mb-6">Failed to load your orders. Please try again.</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!data || !data.success || !data.orders || data.orders.length === 0) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <div className="text-gray-400 text-6xl mb-6">📦</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">No Orders Yet</h2>
          <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
            You haven't placed any orders yet. Start shopping to see your orders here!
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
          >
            <span>Start Shopping</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );

  const orders: Order[] = data.orders;

  const StatusBadge = ({ status, date, label }: { status: boolean; date?: string; label: string }) => (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
      status 
        ? 'bg-green-100 text-green-800 border border-green-200' 
        : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    }`}>
      <span className={`w-2 h-2 rounded-full mr-2 ${
        status ? 'bg-green-500' : 'bg-yellow-500'
      }`}></span>
      {status ? (date ? new Date(date).toLocaleDateString() : label) : `Not ${label}`}
    </div>
  );

  const OrderCard = ({ order }: { order: Order }) => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Order Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <span className="text-blue-600 text-lg">📦</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">Order #{order._id.substring(18, 24)}</h3>
              <p className="text-gray-500 text-sm">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 mt-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">₹{order.totalPrice}</p>
            </div>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex flex-col gap-2">
          <StatusBadge status={order.isPaid} date={order.paidAt} label="Paid" />
          <StatusBadge status={order.isDelivered} date={order.deliveredAt} label="Delivered" />
        </div>

        {/* Action Button */}
        <div className="lg:text-right">
          <Link 
            href={`/order/${order._id}`}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors group"
          >
            <span>View Details</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </div>
  );

  const OrderTable = ({ orders }: { orders: Order[] }) => (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
        <p className="text-gray-600 mt-1">Your recent orders and their status</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Order ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Payment</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Delivery</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <span className="text-blue-600 text-sm">📦</span>
                    </div>
                    <span className="font-medium text-gray-900">#{order._id.substring(18, 24)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className="font-bold text-gray-900 text-lg">₹{order.totalPrice}</span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={order.isPaid} date={order.paidAt} label="Paid" />
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={order.isDelivered} date={order.deliveredAt} label="Delivered" />
                </td>
                <td className="px-6 py-4">
                  <Link 
                    href={`/order/${order._id}`}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors group"
                  >
                    <span>View</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600 text-lg">
            You have {orders.length} order{orders.length !== 1 ? 's' : ''} in total
          </p>
        </div>

        {/* Mobile View - Cards */}
        <div className="lg:hidden space-y-6">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden lg:block">
          <OrderTable orders={orders} />
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4">
              <div className="text-blue-600 text-2xl mb-2">📦</div>
              <h3 className="font-semibold text-gray-900 mb-1">Order Tracking</h3>
              <p className="text-gray-600 text-sm">Track your orders in real-time</p>
            </div>
            <div className="p-4">
              <div className="text-green-600 text-2xl mb-2">🔄</div>
              <h3 className="font-semibold text-gray-900 mb-1">Easy Returns</h3>
              <p className="text-gray-600 text-sm">30-day return policy</p>
            </div>
            <div className="p-4">
              <div className="text-purple-600 text-2xl mb-2">📞</div>
              <h3 className="font-semibold text-gray-900 mb-1">Need Help?</h3>
              <p className="text-gray-600 text-sm">Contact our support team</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}