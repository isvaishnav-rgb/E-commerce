import { useEffect, useState } from "react";
import { createProductApi, updateProductApi } from "../api/product.api";
import type { Product } from "../types/Products";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: "add" | "edit";
  product: Product | null;
}

interface Errors {
  name?: string;
  price?: string;
  stock?: string;
  images?: string;
}

const MAX_IMAGES = 5;

const ProductModal = ({ isOpen, onClose, type, product }: Props) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    category: "",
    stock: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  /* =====================
     Prefill edit mode
  ===================== */
  useEffect(() => {
    if (type === "edit" && product) {
      setForm({
        name: product.name,
        description: product.description,
        price: String(product.price),
        discount: String(product.discount || 0),
        category: product.category,
        stock: String(product.stock),
      });
    }
  }, [type, product]);

  if (!isOpen) return null;

  /* =====================
     Image Handlers
  ===================== */
  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);

    if (images.length + selectedFiles.length > MAX_IMAGES) {
      setErrors((prev) => ({
        ...prev,
        images: `You can upload maximum ${MAX_IMAGES} images`,
      }));
      return;
    }

    setImages((prev) => [...prev, ...selectedFiles]);
    setErrors((prev) => ({ ...prev, images: undefined }));
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* =====================
     Validation
  ===================== */
  const validate = () => {
    const e: Errors = {};

    if (!form.name.trim()) e.name = "Product name is required";
    if (!form.price || Number(form.price) <= 0)
      e.price = "Price must be greater than 0";
    if (!form.stock || Number(form.stock) < 0)
      e.stock = "Stock must be 0 or more";
    if (type === "add" && images.length === 0)
      e.images = "At least one image is required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* =====================
     Submit
  ===================== */
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const fd = new FormData();

      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      images.forEach((img) => fd.append("images", img));

      if (type === "add") {
        await createProductApi(fd);
      } else if (product) {
        await updateProductApi(product._id, fd);
      }

      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* =====================
     UI
  ===================== */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-6 text-xl font-bold text-gray-800">
          {type === "add" ? "Add Product" : "Edit Product"}
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Name */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Product Name *
            </label>
            <input
              placeholder="Lahenga"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2
                ${errors.name
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-indigo-500"
                }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Category
            </label>
            <input
              placeholder="Women Wear"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Stock *
            </label>
            <input
              type="number"
              value={form.stock}
              onChange={(e) =>
                setForm({ ...form, stock: e.target.value })
              }
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2
                ${errors.stock
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-indigo-500"
                }`}
            />
            {errors.stock && (
              <p className="mt-1 text-xs text-red-500">{errors.stock}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Price *
            </label>
            <input
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
              className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2
                ${errors.price
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-indigo-500"
                }`}
            />
            {errors.price && (
              <p className="mt-1 text-xs text-red-500">{errors.price}</p>
            )}
          </div>

          {/* Discount */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Discount (%)
            </label>
            <input
              type="number"
              value={form.discount}
              onChange={(e) =>
                setForm({ ...form, discount: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Images */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Images * (Max {MAX_IMAGES})
            </label>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-600
                file:mr-4 file:rounded-lg file:border-0
                file:bg-indigo-600 file:px-4 file:py-2
                file:text-sm file:font-medium file:text-white
                hover:file:bg-indigo-700"
            />

            {errors.images && (
              <p className="mt-1 text-xs text-red-500">{errors.images}</p>
            )}

            {/* Preview */}
            {images.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative">
                    <img
                      src={URL.createObjectURL(img)}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center
                        rounded-full bg-red-500 text-xs text-white"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-2 font-medium text-white
              hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Product"}
          </button>

          <button
            onClick={onClose}
            className="w-full rounded-lg border border-gray-300 py-2 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
