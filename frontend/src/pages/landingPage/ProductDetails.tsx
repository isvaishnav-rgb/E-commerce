import { useParams } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import ProductImageCarouselFull from "../../components/ProductImageCarouselFull";

const ProductDetailsPage = () => {
  const { productId } = useParams();

  const product = useAppSelector((state) =>
    state.products.products.find((p: any) => p._id === productId)
  );

  if (!product) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        Product not found
      </div>
    );
  }

  return (
    <div>
      {/* Images */}
      <ProductImageCarouselFull images={product.images} />

      {/* Details */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

        <h1 className="text-3xl font-bold">{product.name}</h1>

        <p className="text-gray-600">{product.description}</p>

        {/* Price */}
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold text-indigo-600">
            ₹{product.finalPrice}
          </span>

          {product.discount > 0 && (
            <>
              <span className="line-through text-gray-400">
                ₹{product.price}
              </span>
              <span className="text-green-600 font-medium">
                {product.discount}% OFF
              </span>
            </>
          )}
        </div>

        {/* Meta Info */}
        <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">

          <div><b>Product ID:</b> {product._id}</div>
          <div><b>Category:</b> {product.category}</div>
          <div><b>Stock:</b> {product.stock}</div>
          <div><b>Sold:</b> {product.soldCount}</div>
          <div><b>Status:</b> {product.status}</div>
          <div><b>Featured:</b> {product.isFeatured ? "Yes" : "No"}</div>
          <div><b>Created By:</b> {product.createdByRole}</div>
          <div><b>Created At:</b> {new Date(product.createdAt).toLocaleString()}</div>
          <div><b>Updated At:</b> {new Date(product.updatedAt).toLocaleString()}</div>

        </div>

        {/* Tags */}
        {product.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag: string, i: number) => (
              <span
                key={i}
                className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;
