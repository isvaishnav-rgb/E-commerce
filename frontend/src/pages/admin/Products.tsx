import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchProducts } from "../../features/admin/adminThunk";
import { deleteProductApi } from "../../api/admin.api";
import { Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

const Products = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector((s: any) => s.admin.products);

  const tableHeader = ["Product", "Category", "Price", "Discount", "FinalPrice", "Stock", "Actions"]

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const remove = async (id: string) => {
    await deleteProductApi(id);
    dispatch(fetchProducts());
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">
          Products
        </h1>
        <p className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Total: {products?.length}
        </p>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {products && products.map((p: any) => (
          <div key={p?._id} className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={p?.images?.[0]}
                alt={p?.name}
                className="w-16 h-16 rounded-md object-cover border"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 truncate">{p?.name}</p>
                <p className="text-xs text-gray-500">#{p?._id.slice(-6)}</p>
                <p className="text-sm text-blue-600 font-medium">{p?.category}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm mb-4">
              <div>
                <p className="text-gray-500 text-xs">Price</p>
                <p className="font-medium">₹{p?.price}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Discount</p>
                <p className="font-medium text-green-600">{p?.discount | 0}% off</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Final Price</p>
                <p className="font-bold text-blue-700">₹{p?.finalPrice || p?.price}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Stock</p>
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${p.stock > 0
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                    }`}
                >
                  {p?.stock} units
                </span>
              </div>
            </div>

            <div className="border-t pt-3">
              <button
                onClick={() => {
                  remove(p._id);
                  toast.success("Product deleted successfully");
                }}
                className="w-full flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 py-2 rounded-md transition-colors font-medium border border-red-100"
              >
                <Trash2 size={16} />
                Delete Product
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {tableHeader.map((tableHeading, index) =>
                <th className="text-left px-4 py-3" key={index}>{tableHeading}</th>
              )}
            </tr>
          </thead>

          <tbody>
            {products && products.map((p: any) => (
              <tr
                key={p?._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={p?.images?.[0]}
                      alt={p?.name}
                      className="w-12 h-12 rounded-md object-cover border"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        {p?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {p?._id.slice(-6)}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3 text-gray-700">
                  {p?.category}
                </td>

                <td className="px-4 py-3 font-medium text-gray-800">
                  ₹{p?.price}
                </td>
                <td className="px-4 py-3 font-medium text-gray-800 text-green-600">
                  {p?.discount | 0} %
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">
                  ₹{p?.finalPrice || p?.price}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${p.stock > 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                      }`}
                  >
                    {p?.stock}
                  </span>
                </td>

                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => {
                      remove(p._id);
                      toast.success("Product deleted successfully");
                    }}
                    className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 cursor-pointer font-medium"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {products.length === 0 && (
        <div className="text-center py-12 bg-white border rounded-lg mt-4">
          <p className="text-gray-500">No products found</p>
        </div>
      )}
    </div>
  );
};

export default Products;
