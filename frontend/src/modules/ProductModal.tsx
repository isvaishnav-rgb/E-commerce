import { useEffect, useState } from "react";
import { X, Upload, Package, IndianRupee, Layers } from "lucide-react";
import type { Product } from "../types/Products";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: "add" | "edit";
  product?: Product | null;
}

const ProductModal = ({ isOpen, onClose, type, product }: Props) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    status: "Active",
    image: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  /* Prefill when editing */
  useEffect(() => {
    if (type === "edit" && product) {
      setForm({
        name: product.name,
        description: product.description,
        price: String(product.price),
        category: product.category,
        stock: String(product.stock),
        status: product.status,
        image: product.image,
      });
      setImagePreview(product.image);
    }
  }, [type, product]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(type === "add" ? "Creating" : "Updating", form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {type === "add" ? "Create New Product" : "Edit Product"}
            </h2>
            <p className="text-indigo-100 text-sm">
              {type === "add"
                ? "Add product details & inventory"
                : "Update your product information"}
            </p>
          </div>

          <button onClick={onClose} className="text-white">
            <X size={26} />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="p-6 max-h-[70vh] overflow-y-auto space-y-6"
        >
          {/* Name */}
          <div>
            <label className="text-sm font-medium">Product Name</label>
            <div className="relative mt-1">
              <Package className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full pl-10 py-2.5 border rounded-xl"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full border rounded-xl px-4 py-2.5"
            />
          </div>

          {/* Price & Category */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <IndianRupee className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                name="price"
                value={form.price}
                onChange={handleChange}
                type="number"
                className="w-full pl-10 py-2.5 border rounded-xl"
              />
            </div>

            <div className="relative">
              <Layers className="absolute left-3 top-3 text-gray-400" size={18} />
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full pl-10 py-2.5 border rounded-xl"
              >
                <option>Electronics</option>
                <option>Fashion</option>
                <option>Home & Kitchen</option>
              </select>
            </div>
          </div>

          {/* Stock */}
          <input
            name="stock"
            value={form.stock}
            onChange={handleChange}
            type="number"
            placeholder="Stock Quantity"
            className="w-full border rounded-xl px-4 py-2.5"
          />

          {/* Image */}
          <label className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center cursor-pointer">
            <Upload className="text-indigo-500 mb-2" />
            <span className="text-sm text-gray-500">Upload product image</span>
            <input type="file" hidden onChange={handleImageChange} />
          </label>

          {imagePreview && (
            <img
              src={imagePreview}
              className="h-40 rounded-xl object-cover"
            />
          )}

          {/* Status */}
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-2.5"
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl"
            >
              {type === "add" ? "Create Product" : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
