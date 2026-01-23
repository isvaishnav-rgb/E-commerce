import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import ProductModal from "../../modules/ProductModal";
import {
  getMyProductsApi,
  deleteProductApi,
} from "../../api/product.api";
import type { Product } from "../../types/Products";
import ProductImageCarousel from "../../components/ProductImageCarousel";
import { useNavigate } from "react-router-dom";

const ServiceProviderDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    const data = await getMyProductsApi();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteProductApi(id);
    fetchProducts();
  };

  const handleNavigate=(productId: string)=> {
    navigate(`/${productId}`)

  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Products</h1>
        <button
          onClick={() => {
            setMode("add");
            setSelectedProduct(null);
            setOpen(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Products */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <div
            key={p._id}
            className="rounded-xl bg-white p-4 shadow cursor-pointer"
            onClick={()=>handleNavigate(p._id)}
          >
            {/* Image Carousel */}
            <ProductImageCarousel images={p.images} />

            <h3 className="mt-3 text-lg font-semibold">
              {p.name}
            </h3>

            <p className="text-gray-700">
              ₹{p.finalPrice || p.price}
            </p>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  setMode("edit");
                  setSelectedProduct(p);
                  setOpen(true);
                }}
                className="flex-1 rounded border px-3 py-1 text-sm"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(p._id)}
                className="flex-1 rounded border px-3 py-1 text-sm text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <ProductModal
        isOpen={open}
        onClose={() => {
          setOpen(false);
          fetchProducts();
        }}
        type={mode}
        product={selectedProduct}
      />
    </div>
  );
};

export default ServiceProviderDashboard;
