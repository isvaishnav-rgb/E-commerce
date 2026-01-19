import { useAppSelector } from "../../app/hooks";
import ProductSection from "../../modules/ProductSection";
import { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import { fetchActiveProducts } from "../../features/product/productSlice";
import { useSearchParams } from "react-router-dom";


const LandingPage = () => {
  const { products, loading } = useAppSelector(
    (state) => state.products
  );
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchProducts = async () => {
      const params = {
        search: searchParams.get("search"),
        category: searchParams.get("category"),
        minPrice: searchParams.get("minPrice"),
        maxPrice: searchParams.get("maxPrice"),
      };

      dispatch(fetchActiveProducts(params))
    };

    fetchProducts();
  }, [searchParams]);

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <ProductSection
        title="Recommended Products"
        products={products}
      />
    </div>
  );
};

export default LandingPage;
