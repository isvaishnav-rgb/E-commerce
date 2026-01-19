import { useAppSelector } from "../../app/hooks";
import ProductSection from "../../modules/ProductSection";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { fetchActiveProducts } from "../../features/product/productSlice";
import { useSearchParams } from "react-router-dom";


const LandingPage = () => {
  const { products, pagination, loading } = useAppSelector(
    (state) => state.products
  );
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1");
    setCurrentPage(page);
    
    const fetchProducts = async () => {
      const params = {
        search: searchParams.get("search"),
        category: searchParams.get("category"),
        minPrice: searchParams.get("minPrice"),
        maxPrice: searchParams.get("maxPrice"),
        page: page,
        limit: 12
      };

      dispatch(fetchActiveProducts(params))
    };

    fetchProducts();
  }, [searchParams, dispatch]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page.toString());
    setSearchParams(newParams);
  };

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <ProductSection
        title="Recommended Products"
        products={products}
      />
      
      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!pagination.hasPrevPage}
            className="px-3 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-2 border rounded ${
                page === currentPage ? 'bg-blue-500 text-white' : 'bg-white'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination.hasNextPage}
            className="px-3 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
      
      <div className="text-center mt-4 text-gray-600">
        Showing {products.length} of {pagination.totalProducts} products
      </div>
    </div>
  );
};

export default LandingPage;
