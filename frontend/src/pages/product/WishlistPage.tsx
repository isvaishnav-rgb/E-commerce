import { useAppSelector } from "../../app/hooks";
import ProductCard from "../../components/ProductCard";

const WishlistPage = () => {
    const user = useAppSelector((state: any) => state.auth.user);

    // ✅ fallback to empty array to avoid crash
    const { products } = useAppSelector(
        (state) => state.products
    ) || [];

    // ✅ safe wishlist fallback
    const wishlist = user?.wishlist || [];

    const wishlistProducts = products.filter((p: any) =>
        wishlist.includes(p._id)
    );

    if (!wishlistProducts.length) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <h2 className="text-xl font-semibold text-gray-500">
                    No items in wishlist ❤️
                </h2>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">
                Your Wishlist
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {wishlistProducts.map((product: any) => (
                    <ProductCard
                        key={product._id}
                        product={product}
                        wishlistIconDisable={true}
                    />
                ))}
            </div>
        </div>
    );
};

export default WishlistPage;
