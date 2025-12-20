// app/admin/orders/[id]/page.tsx
// @ts-nocheck
import dbConnect from '@/lib/dbConnect';
import Order from '@/lib/models/order';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function OrderDetailPage({ params }) {
  await dbConnect();

  const order = await Order.findById(params.id).lean();

  if (!order) {
    notFound();
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">
        Order Details - #{order._id.toString().slice(-8)}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Customer & Order Info */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
          <p><strong>Name:</strong> {order.userId?.name || 'Guest'}</p>
          <p><strong>Email:</strong> {order.userId?.email || 'N/A'}</p>
          <p className="mt-4">
            <strong>Order Date:</strong>{' '}
            {new Date(order.createdAt).toLocaleString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          <p className="mt-2">
            <strong>Payment Method:</strong> {order.paymentMethod || 'Unknown'}
          </p>
          <p className="mt-2">
            <strong>Payment Status:</strong>{' '}
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                order.paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {order.paid ? 'Paid' : 'Pending'}
            </span>
          </p>
          <p className="mt-2">
            <strong>Delivery Status:</strong>{' '}
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                order.isDelivered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {order.isDelivered ? 'Delivered' : 'Not Delivered'}
            </span>
          </p>
        </div>

        {/* Shipping Address */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          {order.shippingAddress ? (
            <>
              <p><strong>{order.shippingAddress.fullName}</strong></p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </>
          ) : (
            <p className="text-gray-500">No shipping address available.</p>
          )}
        </div>
      </div>

      {/* Order Items */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Order Items</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Product</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Color/Size</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Qty</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Price</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {order.items?.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={48}
                          height={48}
                          className="rounded mr-4 object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium">{item.name}</p>
                        {item.slug && <p className="text-xs text-gray-500">{item.slug}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.color || 'N/A'} / {item.size || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.qty}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{item.price?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₹{(item.qty * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Price Breakdown</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Items Total:</span>
            <span>₹{order.itemsPrice?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>₹{order.taxPrice?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>₹{order.shippingPrice?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="flex justify-between text-lg font-bold mt-4">
            <span>Grand Total:</span>
            <span>₹{order.totalPrice?.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-8">
        <a href="/admin/orders" className="text-indigo-600 hover:underline">
          ← Back to All Orders
        </a>
      </div>
    </div>
  );
}