'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type orderFinalModel = {
  _id: string;
  name: string;
  image: string;
  size: string;
  qty: number;
  price: number;
  color?: string;
  slug?: string;
};

type Order = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  totalPrice: number;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  paid?: boolean;
  paymentId?: string | null;
  paymentAmount?: number | null;
  paymentDate?: string | null;
  paymentFrom?: string | null;
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
  [key: string]: any;
};

export default function OrderPage() {
  const params = useParams();
  const orderId = params.id;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (data.success) setOrder(data.order);
        else setError(data.message || 'Order not found');
      } catch (err) {
        setError('Failed to fetch order');
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading order details...</p>
      </div>
    </div>
  );

  if (error) return (
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

  if (!order) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="text-yellow-500 text-4xl mb-4">📦</div>
        <h2 className="text-2xl font-bold text-yellow-800 mb-2">Order Not Found</h2>
        <p className="text-yellow-600">The order you're looking for doesn't exist.</p>
      </div>
    </div>
  );

  const StatusBadge = ({ status, label, date }: { status: boolean; label: string; date?: string }) => (
    <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
      status 
        ? 'bg-green-100 text-green-800 border border-green-200' 
        : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    }`}>
      <span className={`w-2 h-2 rounded-full mr-2 ${
        status ? 'bg-green-500' : 'bg-yellow-500'
      }`}></span>
      {status ? `${label} • ${date ? new Date(date).toLocaleDateString() : ''}` : `Pending ${label}`}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <span className="text-2xl">📦</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
                  <p className="text-gray-500 mt-1 text-lg">Order ID: {order._id}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
              <StatusBadge status={order.isPaid} label="Paid" date={order.paidAt} />
              <StatusBadge status={order.isDelivered} label="Delivered" date={order.deliveredAt} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Main Content - Left Side */}
          <div className="xl:col-span-8 space-y-8">
            
            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <span className="text-blue-600 text-lg">🛒</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Order Items</h2>
              </div>
              
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div 
                    key={item._id} 
                    className="flex items-center gap-6 p-6 border border-gray-100 rounded-xl hover:bg-blue-50 transition-all duration-200 group"
                  >
                    <div className="flex-shrink-0 relative">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg shadow-sm"
                      />
                      <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">{item.name}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="bg-gray-100 px-2 py-1 rounded">Size: {item.size}</span>
                        <span className="bg-gray-100 px-2 py-1 rounded">Qty: {item.qty}</span>
                        {item.color && (
                          <span className="bg-gray-100 px-2 py-1 rounded">Color: {item.color}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-lg">₹{item.price}</p>
                      <p className="text-sm text-gray-500">Total: ₹{(item.price * item.qty).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping & Customer Info Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Shipping Address */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <span className="text-green-600 text-lg">🏠</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Shipping Address</h2>
                </div>
                
                <div className="space-y-4 text-gray-700">
                  <div className="flex items-start gap-3">
                    <span className="text-gray-400 mt-1">👤</span>
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">{order.shippingAddress.fullName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <span className="text-gray-400 mt-1">📍</span>
                    <div>
                      <p className="text-gray-900">{order.shippingAddress.address}</p>
                      <p className="text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                      <p className="text-gray-600">{order.shippingAddress.country}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <span className="text-purple-600 text-lg">👥</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Customer Information</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Full Name</p>
                    <p className="font-semibold text-gray-900 text-lg">{order.userId.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email Address</p>
                    <p className="font-semibold text-gray-900 text-lg break-all">{order.userId.email}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Customer Since</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="xl:col-span-4 space-y-8">
            
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <span className="text-orange-600 text-lg">💰</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Items Price</span>
                  <span className="font-semibold text-gray-900">₹{order.itemsPrice}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Shipping Fee</span>
                  <span className="font-semibold text-gray-900">₹{order.shippingPrice}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Tax Amount</span>
                  <span className="font-semibold text-gray-900">₹{order.taxPrice}</span>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="text-lg font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-blue-600">₹{order.totalPrice}</span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-100 p-2 rounded-lg">
                  <span className="text-green-600 text-lg">💳</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Payment Information</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                  <p className="font-bold text-gray-900 text-lg">{order.paymentMethod}</p>
                </div>
                
                {order.paymentId && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Payment ID</p>
                    <p className="font-semibold text-gray-900 break-all">{order.paymentId}</p>
                  </div>
                )}
                
                {order.paymentFrom && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Payment From</p>
                    <p className="font-semibold text-gray-900">{order.paymentFrom}</p>
                  </div>
                )}
                
                {order.paymentDate && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Payment Date</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(order.paymentDate).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <span className="text-indigo-600 text-lg">🕒</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Order Timeline</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Order Placed</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Last Updated</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {new Date(order.updatedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}