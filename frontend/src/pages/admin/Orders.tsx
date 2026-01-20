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
      <h1 className="text-2xl mb-4">All Orders</h1>

      {!orders || orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <div key={order._id} className="border p-4 rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p><strong>Order ID:</strong> #{order._id.slice(-6)}</p>
                  <p><strong>Customer:</strong> {order.user?.name} ({order.user?.email})</p>
                  <p><strong>Total:</strong> ₹{order.totalAmount}</p>
                  <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p><strong>Status:</strong>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="ml-2 border rounded px-2 py-1"
                    >
                      {OrderStatus.map((val, index) => <option value={val} key={index}>{val}</option>)}
                    </select>
                  </p>
                </div>
              </div>

              <div className="border-t pt-3">
                <p><strong>Items:</strong></p>
                {order.items?.map((item: any, index: number) => (
                  <div key={index} className="ml-4 text-sm">
                    • {item.product?.name} × {item.quantity} = ₹{item.price * item.quantity}
                  </div>
                ))}
              </div>

              <div className="mt-2 text-sm text-gray-600">
                <p><strong>Address:</strong> {order.address}</p>
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