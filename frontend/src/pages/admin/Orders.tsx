import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchOrders, updateOrderStatus } from "../../features/admin/adminThunk";

const Orders = () => {
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector((s: any) => s.admin);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleStatusChange = async (orderId: string, status: string) => {
    await dispatch(updateOrderStatus({ id: orderId, status }));
    dispatch(fetchOrders());
  };

  const OrderStatus = ["Pending", "Confirmed", "Delivered", "Cancelled", "Returned"]

  if (loading) {
    return <p>Loading orders...</p>;
  }

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold mb-4">All Orders</h1>

      {!orders || orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <div key={order._id} className="border p-4 rounded-lg shadow-sm bg-white">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-3">
                <div className="space-y-1">
                  <p className="text-sm md:text-base"><strong>Order ID:</strong> <span className="text-gray-600">#{order._id.slice(-6)}</span></p>
                  <p className="text-sm md:text-base"><strong>Customer:</strong> {order.user?.name}</p>
                  <p className="text-xs text-gray-500">{order.user?.email}</p>
                  <p className="text-sm md:text-base"><strong>Total:</strong> <span className="text-blue-600 font-semibold">₹{order.totalAmount}</span></p>
                  <p className="text-xs text-gray-500"><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="w-full sm:w-auto flex items-center sm:block">
                  <span className="sm:hidden font-bold mr-2 text-sm">Status:</span>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="flex-1 sm:w-auto border rounded px-2 py-1 text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {OrderStatus.map((val, index) => <option value={val} key={index}>{val}</option>)}
                  </select>
                </div>
              </div>

              <div className="border-t pt-3">
                <p className="text-sm font-bold mb-1">Items:</p>
                <div className="space-y-1">
                  {order.items?.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center text-xs md:text-sm pl-2 border-l-2 border-gray-100">
                      <span>{item.product?.name} <span className="text-gray-400">× {item.quantity}</span></span>
                      <span className="font-medium">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t text-xs md:text-sm text-gray-600 space-y-1">
                <p><strong>Address:</strong></p>
                <p className="leading-relaxed">
                  {order?.address?.street}, {order?.address?.city}, {order?.address?.state} - {order?.address?.pincode}, {order?.address?.country}
                </p>
                <p><strong>Phone:</strong> {order.phone}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;