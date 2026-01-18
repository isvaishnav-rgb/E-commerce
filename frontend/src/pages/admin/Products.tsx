import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchProducts } from "../../features/admin/adminThunk";
import { deleteProductApi } from "../../api/admin.api";

const Products = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector((s: any) => s.admin.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  const remove = async (id: string) => {
    await deleteProductApi(id);
    dispatch(fetchProducts());
  };

  return (
    <div>
      <h1 className="text-2xl mb-4">Products</h1>

      {products.map((p: any) => (
        <div key={p._id} className="border p-4 mb-2">
          <p>{p.name}</p>
          <p>₹{p.price}</p>

          <button className="btn-warning">Edit</button>
          <button
            onClick={() => remove(p._id)}
            className="btn-danger ml-2"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default Products;