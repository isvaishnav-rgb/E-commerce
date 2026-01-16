import { Plus } from "lucide-react";
import { useState } from "react";
import { providerProducts } from "../../dummyData/ProviderProduct";
import ProductModal from "../../modules/ProductModal";
import type { Product } from "../../types/Products";

const ServiceProviderDashboard = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  /* Open Add Modal */
  const handleAddProduct = () => {
    setMode("add");
    setSelectedProduct(null);
    setOpen(true);
  };

  /* Open Edit Modal */
  const handleEditProduct = (product: Product) => {
    setMode("edit");
    setSelectedProduct(product);
    setOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          My Products
        </h1>

        <button
          onClick={handleAddProduct}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus size={18} />
          Add New Product
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {providerProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover rounded-lg"
            />

            <h3 className="mt-3 font-semibold text-gray-800">
              {product.name}
            </h3>

            <p className="text-indigo-600 font-bold mt-1">
              ₹{product.price}
            </p>

            <span
              className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${
                product.status === "Active"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {product.status}
            </span>

            {/* Actions */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleEditProduct(product)}
                className="flex-1 border border-indigo-600 text-indigo-600 py-2 rounded-lg hover:bg-indigo-50 transition"
              >
                Edit
              </button>

              <button
                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      <ProductModal
        isOpen={open}
        onClose={() => setOpen(false)}
        type={mode}
        product={selectedProduct}
      />
    </div>
  );
};

export default ServiceProviderDashboard;
