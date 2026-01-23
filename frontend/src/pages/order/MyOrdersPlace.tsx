import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchMyOrders } from "../../features/order/orderSlice";
import { Package, Truck, CheckCircle, ShoppingBag } from "lucide-react";

const statusStyles: Record<string, string> = {
  Created: "bg-yellow-100 text-yellow-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
};

const MyOrdersPage = () => {
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  /* Loading */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500 text-lg">Loading your orders...</p>
      </div>
    );
  }

  /* Empty State */
  if (!orders.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <ShoppingBag size={56} className="text-indigo-500 mb-4" />
        <h3 className="text-xl font-semibold">No orders yet</h3>
        <p className="text-gray-500 mt-1">
          Once you place an order, it will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">My Orders</h2>

      <div className="space-y-6">
        {orders.map((order: any) => (
          <div
            key={order._id}
            className="bg-white rounded-2xl shadow-sm border p-6"
          >
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-semibold">
                  #{order._id.slice(-6)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    statusStyles[order.status]
                  }`}
                >
                  {order.status}
                </span>

                <p className="text-lg font-semibold text-indigo-600">
                  ₹{order.totalAmount}
                </p>
              </div>
            </div>

            {/* Divider */}
            <hr className="my-4" />

            {/* Payment + Status */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {order.status === "Created" && <Package size={16} />}
              {order.status === "Shipped" && <Truck size={16} />}
              {order.status === "Delivered" && (
                <CheckCircle size={16} />
              )}
              <span>
                Payment:{" "}
                <strong className="capitalize">
                  {order?.payment?.status}
                </strong>
              </span>
            </div>

            {/* Items */}
            <div className="mt-4 space-y-3">
              {order.items.map((item: any) => (
                <div
                  key={item._id}
                  className="flex justify-between text-sm"
                >
                  <span className="text-gray-700">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Address */}
            <div className="mt-4 text-sm text-gray-600">
              <p>
                <span className="font-medium">Address:</span>{" "}
                 Street: {order?.address?.street}, 
                 City: {order?.address?.city},  
                 State: {order?.address?.state}, 
                 PinCode: {order?.address?.pincode}, 
                 Country: {order?.address?.country}
              </p>
              <p>
                <span className="font-medium">Phone:</span>{" "}
                {order.phone}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrdersPage;
