import { Heart, Check, Minus, Plus, ShoppingBag, Info, Ban } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { toggleWishlist, toggleCart } from "../features/product/productSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductImageCarousel from "./ProductImageCarousel";
import toast from "react-hot-toast";

const MIN_QTY = 1;
const MAX_QTY = 10;

const ProductCard = ({ product, wishlistIconDisable }: any) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const cartItem = user?.cart?.find((item: any) => item.product === product._id);
  const cartQuantity = cartItem?.quantity || 0;

  const [quantity, setQuantity] = useState<number>(MIN_QTY);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showHeartOverlay, setShowHeartOverlay] = useState(false);
  const [stockMessage, setStockMessage] = useState("");

  useEffect(() => {
    if (cartQuantity > 0) setQuantity(cartQuantity);
    setStockMessage(""); // reset message
  }, [cartQuantity]);

  const isWishlisted = user?.wishlist?.includes(product._id);

  const increaseQty = (e: any) => {
    e.stopPropagation();

    if (product.stock === 0) {
      toast.error(`${product.name} is out of stock`);
      return;
    }

    if (quantity >= product.stock) {
      toast.error(`Only ${product.stock} left in stock`);
      return;
    }

    if (quantity < MAX_QTY) {
      setQuantity(prev => prev + 1);
      setStockMessage("");
    }
  };

  const decreaseQty = (e: any) => {
    e.stopPropagation();
    if (quantity > MIN_QTY) {
      setQuantity(prev => prev - 1);
      setStockMessage("");
    }
  };

  const handleCart = async (e: any) => {
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }

    if (product.stock === 0) {
      setStockMessage("Product is out of stock");
      return;
    }

    await dispatch(toggleCart({ productId: product._id, quantity }));
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1200);
    setStockMessage("");
  };

  const handleBuyNow = async (e: any) => {
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }

    if (product.stock === 0) {
      setStockMessage("Product is out of stock");
      return;
    }

    if (!cartItem || cartQuantity !== quantity) {
      await dispatch(toggleCart({ productId: product._id, quantity }));
    }

    navigate("/cart");
  };

  const handleWishlist = (e: any) => {
    e.stopPropagation();

    if (wishlistIconDisable) {
      toast.error(
        `${product.name} removed from wishlist`,
      );
    }

    if (!user) {
      navigate("/login");
      return;
    }

    dispatch(toggleWishlist(product._id));
    setShowHeartOverlay(true);
    setTimeout(() => setShowHeartOverlay(false), 800);
  };

  const isInCart = cartItem ? cartQuantity > 0 : false;
  const isSameQuantity = quantity === cartQuantity;
  const canInteract = user?.role !== "admin" && user?._id !== product.createdBy;

  const handleNavigate = () => {
    if (product.stock === 0) {
      toast.error(`${product.name} is out of stock`, { duration: 3000 });
      return; // prevent navigation
    }
    navigate(`/${product._id}`);
  };

  return (
    <div
      onClick={handleNavigate}
      className={`relative bg-white rounded-xl shadow p-4 hover:shadow-md transition cursor-pointer ${product.stock === 0 ? "cursor-not-allowed" : ""
        }`}
    >
      {/* Out of Stock Overlay */}
      {/* Out of Stock Center Icon/Text */}
      {product.stock === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <span className="text-red-600 text-3xl font-bold opacity-40 select-none cursor-not-allowed">
            <Ban className="w-32 h-32 text-red-800 opacity-100 animate-ban-scale stroke-red-800" />
          </span>
        </div>
      )}

      {/* Heart Overlay */}
      {showHeartOverlay && !wishlistIconDisable && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
          <Heart className="w-32 h-32 opacity-20 animate-heart-scale fill-red-500 stroke-red-500" />
        </div>
      )}

      {/* Wishlist Button */}
      {canInteract && (
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 z-10 bg-white p-1.5 rounded-full shadow hover:scale-105 transition cursor-pointer"
        >
          {wishlistIconDisable ? <Minus size={18} className="text-red-500" /> : (
            <Heart size={18} className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-500"} />
          )}
        </button>
      )}

      {/* Images */}
      <ProductImageCarousel images={product.images} />

      {/* Info */}
      <h3 className="mt-3 font-semibold text-gray-800 line-clamp-1">{product.name}</h3>
      <p className="text-indigo-600 font-bold mt-1">
        ₹{product.finalPrice}
        {product.discount > 0 && (
          <span className="ml-2 text-sm text-gray-400 line-through">₹{product.price}</span>
        )}
      </p>

      {/* Quantity Selector */}
      {canInteract && (
        <div className="mt-3 flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Qty:</span>
            <div className="flex items-center border rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={decreaseQty}
                disabled={quantity === MIN_QTY}
                className={`px-3 py-1 ${quantity === MIN_QTY ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 cursor-pointer"}`}
              >
                <Minus size={16} />
              </button>

              <span className="px-4 py-1 font-medium">{quantity}</span>

              <button
                onClick={increaseQty}
                className={`px-3 py-1 ${(quantity >= product.stock || quantity === MAX_QTY) ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 cursor-pointer"}`}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Stock Message */}
          {stockMessage && (
            <p className="text-xs text-red-600 mt-1">{stockMessage}</p>
          )}
        </div>
      )}

      {/* Buttons */}
      {canInteract ? (
        <div className="mt-4 flex gap-2" onClick={(e) => e.stopPropagation()}>
          {isInCart && isSameQuantity && showSuccess ? (
            <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-green-600 text-white font-medium">
              <Check size={18} /> Added
            </button>
          ) : isInCart && isSameQuantity ? (
            <button disabled className="w-full py-2 rounded-lg bg-green-100 text-green-700 font-medium cursor-not-allowed">
              In Cart
            </button>
          ) : (
            <button
              onClick={handleCart}
              disabled={product.stock === 0}
              className={`w-full py-2 rounded-lg text-white font-medium ${product.stock === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
            >
              {isInCart ? "Update Cart" : "Add to Cart"}
            </button>
          )}

          <button
            onClick={handleBuyNow}
            disabled={product.stock === 0}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg border font-medium ${product.stock === 0 ? "text-gray-500 border-gray-300 cursor-not-allowed" : "border-indigo-600 text-indigo-600 hover:bg-indigo-50"}`}
          >
            <ShoppingBag size={18} />
            Buy Now
          </button>
        </div>
      ) : (
        user?.role === "provider" && (
          <div className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-indigo-600 text-indigo-600 bg-indigo-50 mt-6 cursor-not-allowed">
            <Info size={16} />
            Your product
          </div>
        )
      )}
    </div>
  );
};

export default ProductCard;