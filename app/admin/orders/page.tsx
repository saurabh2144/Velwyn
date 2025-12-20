import dbConnect from '@/lib/dbConnect';
import Order from '@/lib/models/order';  // jo tune abhi update kiya hai usi model ka
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  await dbConnect();

  const orders = await Order.find({})
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">All Customer Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No orders yet.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Order ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Payment</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Delivery</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order: any) => (
                <tr key={order._id.toString()} className="hover:bg-gray-50">
                  {/* Order ID */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order._id.toString().slice(-8)}...
                  </td>

                  {/* Customer Name + Email */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div>{order.userId?.name || 'Guest'}</div>
                    <div className="text-gray-500 text-xs">{order.userId?.email || 'N/A'}</div>
                  </td>

                  {/* Total Price */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₹{order.totalPrice?.toFixed(2) || '0.00'}
                  </td>

                  {/* Payment Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        order.paid
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {order.paid ? 'Paid' : 'Pending'}
                    </span>
                  </td>

                  {/* Delivery Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        order.isDelivered
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.isDelivered ? 'Delivered' : 'Not Delivered'}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/admin/orders/${order._id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View Details →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}