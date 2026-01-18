import ProductCard from "../components/ProductCard";

const ProductSection = ({ title, products }: any) => (
  <section className="mb-12">
    <h2 className="text-2xl font-bold mb-6">{title}</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product: any, key: number) => (
        <ProductCard key={key} product={product} />
      ))}
    </div>
  </section>
);

export default ProductSection;