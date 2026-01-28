import {
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Box,
  Stack,
  Paper
} from "@mui/material";
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
        `${product.name} removed from cart`,
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
    <Card
      onClick={handleNavigate}
      elevation={2}
      sx={{
        position: "relative",
        p: 2,
        borderRadius: 3,
        cursor: product.stock === 0 ? "not-allowed" : "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Out of Stock Overlay */}
      {product.stock === 0 && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          <Ban className="w-32 h-32 text-red-800 opacity-40 animate-ban-scale stroke-red-800" />
        </Box>
      )}

      {/* Heart Overlay */}
      {showHeartOverlay && !wishlistIconDisable && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            zIndex: 50,
          }}
        >
          <Heart className="w-32 h-32 opacity-20 animate-heart-scale fill-red-500 stroke-red-500" />
        </Box>
      )}

      {/* Wishlist Button */}
      {canInteract && (
        <IconButton
          onClick={handleWishlist}
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 10,
            bgcolor: "white",
            boxShadow: 1,
            "&:hover": { bgcolor: "grey.100", transform: "scale(1.1)" },
          }}
        >
          {wishlistIconDisable ? (
            <Minus size={18} className="text-red-500" />
          ) : (
            <Heart
              size={18}
              className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-500"}
            />
          )}
        </IconButton>
      )}

      {/* Images */}
      <Box sx={{ position: "relative" }}>
        <ProductImageCarousel images={product.images} />
      </Box>

      {/* Info */}
      <CardContent sx={{ p: 0, pt: 2, flexGrow: 1, "&:last-child": { pb: 0 } }}>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          color="text.primary"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
          }}
        >
          {product.name}
        </Typography>

        <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mt: 0.5 }}>
          <Typography variant="h6" fontWeight="bold" color="primary">
            ₹{product.finalPrice}
          </Typography>
          {product.discount > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ textDecoration: "line-through" }}>
              ₹{product.price}
            </Typography>
          )}
        </Stack>

        {/* Quantity Selector */}
        {canInteract && (
          <Box sx={{ mt: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="body2" color="text.secondary">
                Qty:
              </Typography>
              <Paper
                variant="outlined"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <IconButton
                  size="small"
                  onClick={decreaseQty}
                  disabled={quantity === MIN_QTY}
                  sx={{ borderRadius: 0, px: 1.5 }}
                >
                  <Minus size={16} />
                </IconButton>
                <Typography variant="body2" fontWeight="medium" sx={{ px: 2 }}>
                  {quantity}
                </Typography>
                <IconButton
                  size="small"
                  onClick={increaseQty}
                  disabled={quantity >= product.stock || quantity === MAX_QTY}
                  sx={{ borderRadius: 0, px: 1.5 }}
                >
                  <Plus size={16} />
                </IconButton>
              </Paper>
            </Stack>
            {stockMessage && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
                {stockMessage}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>

      {/* Actions */}
      <Box sx={{ mt: 3 }} onClick={(e) => e.stopPropagation()}>
        {canInteract ? (
          <Stack spacing={1.5}>
            <Box>
              {isInCart && isSameQuantity && showSuccess ? (
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  startIcon={<Check size={18} />}
                  sx={{ borderRadius: 2, py: 1 }}
                >
                  Added
                </Button>
              ) : isInCart && isSameQuantity ? (
                <Button
                  fullWidth
                  disabled
                  variant="contained"
                  sx={{
                    borderRadius: 2,
                    py: 1,
                    bgcolor: "success.light",
                    color: "white",
                    "&.Mui-disabled": { bgcolor: "success.light", color: "white" },
                  }}
                >
                  In Cart
                </Button>
              ) : (
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleCart}
                  disabled={product.stock === 0}
                  sx={{ borderRadius: 2, py: 1 }}
                >
                 {isInCart ? "Update Cart" : "Add to Cart"}
                </Button>
              )}
            </Box>
            {/* 
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              startIcon={<ShoppingBag size={18} />}
              sx={{ borderRadius: 2, py: 1, fontWeight: "bold" }}
            >
              Buy Now
            </Button> */}
          </Stack>
        ) : (
          user?.role === "provider" && (
            <Box
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                bgcolor: "primary.light",
                color: "white",
                border: "1px solid",
                borderColor: "primary.main",
                cursor: "not-allowed",
              }}
            >
              <Info size={16} />
              <Typography variant="body2" fontWeight="medium">
                Your product
              </Typography>
            </Box>
          )
        )}
      </Box>
    </Card>
  );
};

export default ProductCard;
