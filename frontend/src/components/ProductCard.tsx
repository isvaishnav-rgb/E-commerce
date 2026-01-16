import { useState } from "react";
import { Heart } from "lucide-react";
import type { Product } from "../dummyData/productsData";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <div className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col">
      
      {/* Wishlist Icon */}
      <button
        onClick={() => setWishlisted(!wishlisted)}
        className="absolute top-3 right-3 bg-white p-1.5 rounded-full shadow hover:scale-105 transition"
      >
        <Heart
          size={18}
          className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-500"}
        />
      </button>

      {/* Product Image */}
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-40 object-cover rounded-lg"
      />

      {/* Product Info */}
      <div className="flex-1 mt-3">
        <h3 className="font-semibold text-gray-800">
          {product.name}
        </h3>

        {/* Dummy Description */}
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          High-quality product with premium materials and excellent durability.
        </p>

        <p className="text-indigo-600 font-bold mt-2">
          ₹{product.price}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex gap-2">
        <button
          className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Add to Cart
        </button>

        <button
          className="flex-1 border border-indigo-600 text-indigo-600 py-2 rounded-lg hover:bg-indigo-50 transition"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
