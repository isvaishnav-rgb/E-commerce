import { Heart, Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { toggleWishlist, toggleCart } from "../features/product/productSlice";
import ProductImageCarousel from "./ProductImageCarousel";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MIN_QTY = 1;
const MAX_QTY = 10;

const ProductCard = ({ product, wishlistIconDisable }: any) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  /* =====================
     CART STATE FROM REDUX
  ===================== */
  const cartItem = user?.cart?.find(
    (item: any) => item.product === product._id
  );

  const cartQuantity = cartItem?.quantity || 0;

  /* =====================
     LOCAL STATE
  ===================== */
  const [quantity, setQuantity] = useState<number>(MIN_QTY);
  const [showSuccess, setShowSuccess] = useState(false);

  /* =====================
     SYNC QTY FROM CART
  ===================== */
  useEffect(() => {
    if (cartQuantity > 0) {
      setQuantity(cartQuantity);
    }
  }, [cartQuantity]);

  /* =====================
     WISHLIST
  ===================== */
  const isWishlisted = user?.wishlist?.includes(product._id);

  /* =====================
     QUANTITY HANDLERS
  ===================== */
  const increaseQty = (e: any) => {
    e.stopPropagation();
    if (quantity < MAX_QTY) setQuantity((prev) => prev + 1);
  };

  const decreaseQty = (e: any) => {
    e.stopPropagation();
    if (quantity > MIN_QTY) setQuantity((prev) => prev - 1);
  };

  /* =====================
     ADD / UPDATE CART
  ===================== */
  const handleCart = async (e: any) => {
    e.stopPropagation();

    if (!user) {
      navigate("/login");
      return;
    }

    await dispatch(
      toggleCart({
        productId: product._id,
        quantity,
      })
    );

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1200);
  };

  /* =====================
     BUY NOW
  ===================== */
  const handleBuyNow = async (e: any) => {
    e.stopPropagation();

    if (!cartItem || cartQuantity !== quantity) {
      await dispatch(
        toggleCart({
          productId: product._id,
          quantity,
        })
      );
    }

    navigate("/cart");
  };

  const handleWishlist = (e: any) => {
    e.stopPropagation();

    if (!user) {
      navigate("/login");
      return;
    }

    dispatch(toggleWishlist(product._id));
  };

  /* =====================
     UI LOGIC
  ===================== */
  const isInCart = cartQuantity > 0;
  const isSameQuantity = quantity === cartQuantity;

  /* =====================
     CARD NAVIGATION
  ===================== */
  const handleNavigate = () => {
    navigate(`/${product._id}`);
  };

  return (
    <div
      onClick={handleNavigate}
      className="relative bg-white rounded-xl shadow p-4 hover:shadow-md transition cursor-pointer"
    >
      {/* Wishlist */}
      {user?.role !== "admin" && user?._id !== product.createdBy && (
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 z-10 bg-white p-1.5 rounded-full shadow hover:scale-105 transition"
        >
          {wishlistIconDisable ? (
            <Minus size={18} className="text-red-500" />
          ) : (
            <Heart
              size={18}
              className={
                isWishlisted
                  ? "fill-red-500 text-red-500"
                  : "text-gray-500"
              }
            />
          )}
        </button>
      )}

      {/* Images */}
      <ProductImageCarousel images={product.images} />

      {/* Info */}
      <h3 className="mt-3 font-semibold text-gray-800 line-clamp-1">
        {product.name}
      </h3>

      <p className="text-indigo-600 font-bold mt-1">
        ₹{product.finalPrice}
        {product.discount > 0 && (
          <span className="ml-2 text-sm text-gray-400 line-through">
            ₹{product.price}
          </span>
        )}
      </p>

      {/* Quantity Selector */}
      <div className="mt-3 flex items-center gap-3">
        <span className="text-sm text-gray-600">Qty:</span>

        <div
          className="flex items-center border rounded-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={decreaseQty}
            disabled={quantity === MIN_QTY}
            className={`px-3 py-1 ${
              quantity === MIN_QTY
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            <Minus size={16} />
          </button>

          <span className="px-4 py-1 font-medium">
            {quantity}
          </span>

          <button
            onClick={increaseQty}
            disabled={quantity === MAX_QTY}
            className={`px-3 py-1 ${
              quantity === MAX_QTY
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Buttons */}
      <div
        className="mt-4 flex gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        {isInCart && isSameQuantity && showSuccess && (
          <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-green-600 text-white font-medium">
            <Check size={18} /> Added
          </button>
        )}

        {isInCart && isSameQuantity && !showSuccess && (
          <button
            disabled
            className="w-full py-2 rounded-lg bg-green-100 text-green-700 font-medium cursor-not-allowed"
          >
            In Cart
          </button>
        )}

        {(!isInCart || !isSameQuantity) &&
          user?.role !== "admin" &&
          user?._id !== product.createdBy && (
            <button
              onClick={handleCart}
              className="w-full py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
            >
              {isInCart ? "Update Cart" : "Add to Cart"}
            </button>
          )}

        {user?.role !== "admin" &&
          user?._id !== product.createdBy && (
            <button
              onClick={handleBuyNow}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-indigo-600 text-indigo-600 font-medium hover:bg-indigo-50 transition"
            >
              <ShoppingBag size={18} />
              Buy Now
            </button>
          )}
      </div>
    </div>
  );
};

export default ProductCard;
