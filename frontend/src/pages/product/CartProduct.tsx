import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { toggleCart } from "../../features/product/productSlice";
import { useState, useMemo } from "react";
import { placeOrderApi } from "../../api/order.api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

/* =====================
   ADDRESS INTERFACE
===================== */
export interface IAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

const CheckoutPage = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const user = useAppSelector((state) => state.auth.user);
  const { products } = useAppSelector((state) => state.products);

  const cart = user?.cart || [];

  /* =====================
     USER INPUT STATE
  ===================== */
  const [phone, setPhone] = useState(user?.phone || "");

  const [address, setAddress] = useState<IAddress>({
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    country: user?.address?.country || "",
    pincode: user?.address?.pincode || "",
  });

  /* =====================
     MERGE CART + PRODUCTS
  ===================== */
  const cartItems = useMemo(() => {
    if (!cart.length || !products.length) return [];

    return cart
      .map((item: any) => {
        const product = products.find(
          (p: any) => p._id === item.product
        );
        if (!product) return null;
        return { ...item, product };
      })
      .filter(Boolean);
  }, [cart, products]);

  /* =====================
     PRICE CALCULATION
  ===================== */
  const subtotal = cartItems.reduce(
    (sum: number, item: any) =>
      sum + item.product.price * item.quantity,
    0
  );

  const discount = cartItems.reduce(
    (sum: number, item: any) =>
      sum +
      (item.product.price - item.product.finalPrice) *
      item.quantity,
    0
  );

  const total = subtotal-discount;

  /* =====================
     EMPTY CART
  ===================== */
  if (!cartItems.length) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <ShoppingBag size={64} className="text-gray-300" />
        <h2 className="text-xl font-semibold mt-4">
          Your cart is empty
        </h2>
      </div>
    );
  }

  /* =====================
     PLACE ORDER
  ===================== */
  const handlePlaceOrder = async () => {
    const finalPhone = user?.phone || phone;
    const finalAddress = user?.address || address;

    if (
      !finalPhone ||
      !finalAddress.street ||
      !finalAddress.city ||
      !finalAddress.state ||
      !finalAddress.country ||
      !finalAddress.pincode
    ) {
      alert("Please fill all address fields");
      return;
    }

    try {
      const res = await placeOrderApi({
        phone: finalPhone,
        address: finalAddress,
        items: cartItems.map((item: any) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
      });

      alert("Order placed successfully ✅");
      navigate(`/payment/${res?.data?.orderId}`)
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
        "Failed to place order"
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* CART ITEMS */}
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-2xl font-bold">Shopping Cart</h2>

        {cartItems.map((item: any) => (
          <div
            key={item.product._id}
            className="flex gap-4 bg-white p-4 rounded-xl shadow"
          >
            <img
              src={item.product.images?.[0]}
              alt={item.product.name}
              className="w-24 h-24 object-cover rounded-lg"
            />

            <div className="flex-1">
              <h3 className="font-semibold">
                {item.product.name}
              </h3>

              <p className="text-indigo-600 font-bold mt-1">
                ₹{item.product.finalPrice}
                <span className="ml-2 text-sm text-gray-400 line-through">
                  ₹{item.product.price}
                </span>
              </p>

              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={() =>
                    dispatch(
                      toggleCart({
                        productId: item.product._id,
                        quantity: item.quantity - 1,
                      })
                    )
                  }
                  disabled={item.quantity <= 1}
                  className={`p-1 border rounded ${item.quantity <= 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <Minus size={16} />
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() =>
                    dispatch(
                      toggleCart({
                        productId: item.product._id,
                        quantity: item.quantity + 1,
                      })
                    )
                  }
                  className="p-1 border rounded cursor-pointer"
                >
                  <Plus size={16} />
                </button>

                <button
                  onClick={() => {
                    dispatch(
                      toggleCart({
                        productId: item.product._id,
                        quantity: 0,
                      })
                    );
                    toast.error(
                      `${item.product.name} removed from cart`,
                    );
                  }}
                  className="ml-4 text-red-500 cursor-pointer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="font-bold">
              ₹{item.product.finalPrice * item.quantity}
            </div>
          </div>
        ))}
      </div>

      {/* ORDER SUMMARY */}
      <div className="bg-white rounded-xl shadow p-6 sticky top-24">
        <h3 className="text-xl font-bold mb-4">
          Order Summary
        </h3>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-₹{discount}</span>
          </div>

          <div className="border-t pt-3 flex justify-between font-bold">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>

        {/* USER DETAILS */}
        <div className="mt-6 space-y-4">
          {/* PHONE */}
          {user?.phone ? (
            <div className="bg-gray-50 p-3 rounded-lg text-sm">
              <span className="font-semibold">Phone:</span>{" "}
              {user.phone}
            </div>
          ) : (
            <input
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          )}

          {/* ADDRESS */}
          {user?.address ? (
            <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-1">
              <p className="font-semibold">Address:</p>
              <p>{user.address.street}</p>
              <p>
                {user.address.city}, {user.address.state}
              </p>
              <p>
                {user.address.country} - {user.address.pincode}
              </p>
            </div>
          ) : (
            <>
              <input
                placeholder="Street Address"
                value={address.street}
                onChange={(e) =>
                  setAddress({
                    ...address,
                    street: e.target.value,
                  })
                }
                className="w-full border rounded-lg px-3 py-2"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="City"
                  value={address.city}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      city: e.target.value,
                    })
                  }
                  className="border rounded-lg px-3 py-2"
                />
                <input
                  placeholder="State"
                  value={address.state}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      state: e.target.value,
                    })
                  }
                  className="border rounded-lg px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Country"
                  value={address.country}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      country: e.target.value,
                    })
                  }
                  className="border rounded-lg px-3 py-2"
                />
                <input
                  placeholder="Pincode"
                  value={address.pincode}
                  onChange={(e) =>
                    setAddress({
                      ...address,
                      pincode: e.target.value,
                    })
                  }
                  className="border rounded-lg px-3 py-2"
                />
              </div>
            </>
          )}
        </div>

        <button
          onClick={handlePlaceOrder}
          className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
