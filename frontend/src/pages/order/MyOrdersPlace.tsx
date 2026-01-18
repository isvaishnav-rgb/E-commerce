import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchMyOrders } from "../../features/order/orderSlice";
import { Package, Truck, CheckCircle } from "lucide-react";

const MyOrdersPage = () => {
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector(
    (state) => state.orders
  );

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading orders...</p>;
  }

  if (!orders.length) {
    return (
      <div className="text-center mt-20 text-gray-500">
        <Package size={48} className="mx-auto mb-3" />
        No orders yet
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>

      <div className="space-y-6">
        {orders.map((order: any) => (
          <div
            key={order._id}
            className="bg-white rounded-xl shadow p-5"
          >
            <div className="flex justify-between mb-3">
              <span className="font-semibold">
                Order #{order._id.slice(-6)}
              </span>
              <span className="text-indigo-600 font-medium">
                ₹{order.totalAmount}
              </span>
            </div>

            <p className="text-sm text-gray-500">
              Payment: {order?.payment?.status}
            </p>

            <div className="flex items-center gap-2 mt-2 text-sm">
              {order.status === "Created" && <Package size={16} />}
              {order.status === "Shipped" && <Truck size={16} />}
              {order.status === "Delivered" && (
                <CheckCircle size={16} />
              )}
              <span>{order.status}</span>
            </div>

            <div className="mt-4 space-y-2">
              {order.items.map((item: any) => (
                <div
                  key={item._id}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <p>
                <strong>Address:</strong>{" "}
                {order.address.street}, {order.address.city},{" "}
                {order.address.state}
              </p>
              <p>
                <strong>Phone:</strong> {order.phone}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrdersPage;
