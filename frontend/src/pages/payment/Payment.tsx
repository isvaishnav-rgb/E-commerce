import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";

const PaymentPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<
    "COD" | "STRIPE"
  >("COD");
  const [loading, setLoading] = useState(false);

  /* =====================
     FETCH ORDER
  ===================== */
  useEffect(() => {
    const fetchOrder = async () => {
      const res = await axios.get(`/order/${orderId}`);
      setOrder(res.data.order);
    };

    fetchOrder();
  }, [orderId]);

  /* =====================
     CONFIRM PAYMENT
  ===================== */
  const handleConfirmPayment = async () => {
    if (!order) return;

    setLoading(true);

    try {
      // ✅ CASH ON DELIVERY
      if (paymentMethod === "COD") {
        // order already created, payment stays Pending
        navigate("/orders");
        return;
      }

      // ✅ STRIPE
      const res = await axios.post(
        `/payment/checkout/${orderId}`
      );

      window.location.href = res.data.checkoutUrl;
    } catch (err: any) {
      alert("Payment failed");
      setLoading(false);
    }
  };

  if (!order) {
    return (
      <p className="text-center mt-10">
        Loading payment details...
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-6">
          Choose Payment Method
        </h2>

        {/* ORDER INFO */}
        <div className="border rounded-lg p-4 mb-6">
          <p>
            <strong>Order ID:</strong>{" "}
            {order._id.slice(-6)}
          </p>
          <p>
            <strong>Total Amount:</strong> ₹
            {order.totalAmount}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {order.paymentStatus}
          </p>
        </div>

        {/* PAYMENT OPTIONS */}
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
            />
            <span>Cash on Delivery</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              checked={paymentMethod === "STRIPE"}
              onChange={() => setPaymentMethod("STRIPE")}
            />
            <span>Pay Online (Stripe)</span>
          </label>
        </div>

        {/* CONFIRM BUTTON */}
        <button
          disabled={loading}
          onClick={handleConfirmPayment}
          className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
        >
          {loading ? "Processing..." : "Confirm Payment"}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
