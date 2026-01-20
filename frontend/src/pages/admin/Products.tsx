import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchProducts } from "../../features/admin/adminThunk";
import { deleteProductApi } from "../../api/admin.api";
import { Trash2 } from "lucide-react";

const Products = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector((s: any) => s.admin.products);

  const tableHeader = ["Product", "Category", "Price", "Stock", "Actions"]

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Products
        </h1>
        <p className="text-sm text-gray-500">
          Total: {products?.length}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border">
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

                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => remove(p._id)}
                    className="inline-flex items-center gap-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-10 text-gray-500"
                >
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
