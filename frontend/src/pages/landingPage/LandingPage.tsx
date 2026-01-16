import {
  recommendedProducts,
  favouriteProducts,
  popularProducts,
  mostPurchasedProducts,
} from "../../dummyData/productsData";
import ProductSection from "../../modules/ProductSection";

const LandingPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      <ProductSection 
        title="Recommended Products"
        products={recommendedProducts}
      />

      <ProductSection 
        title="Favourite Products"
        products={favouriteProducts}
      />

      <ProductSection 
        title="Popular Products"
        products={popularProducts}
      />

      <ProductSection 
        title="Most Purchased Products"
        products={mostPurchasedProducts}
      />

    </div>
  );
};

export default LandingPage ;
