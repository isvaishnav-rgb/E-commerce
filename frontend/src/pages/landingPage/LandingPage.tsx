import { useAppSelector } from "../../app/hooks";
import ProductSection from "../../modules/ProductSection";

const LandingPage = () => {
  const { products, loading } = useAppSelector(
    (state) => state.products
  );

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
