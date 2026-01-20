import { useRef, useEffect } from "react";

interface FilterProps {
  category: string;
  minPrice: string;
  maxPrice: string;
  categoryOptions: string[];
  onChange: (key: string, value: string) => void;
  onApply: () => void;
  onClear: () => void;
  onClose: () => void;
}

const ProductFilter = ({
  category,
  minPrice,
  maxPrice,
  categoryOptions,
  onChange,
  onApply,
  onClear,
  onClose,
}: FilterProps) => {
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);

  return (
    <div
      ref={filterRef}
      className="absolute top-16 left-1/2 -translate-x-1/2 z-50 w-[90%] md:w-[600px] bg-white border rounded-2xl shadow-xl p-5"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Category */}
        <div>
          <label className="text-sm font-medium text-gray-600">Category</label>
          <select
            value={category}
            onChange={(e) => onChange("category", e.target.value)}
            className="w-full mt-1 border rounded-lg px-3 py-2"
          >
            <option value="">All</option>
            {categoryOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Min Price */}
        <div>
          <label className="text-sm font-medium text-gray-600">Min Price</label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => onChange("minPrice", e.target.value)}
            className="w-full mt-1 border rounded-lg px-3 py-2"
          />
        </div>

        {/* Max Price */}
        <div>
          <label className="text-sm font-medium text-gray-600">Max Price</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => onChange("maxPrice", e.target.value)}
            className="w-full mt-1 border rounded-lg px-3 py-2"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-5">
        <button
          onClick={onClear}
          className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100"
        >
          Clear
        </button>

        <button
          onClick={onApply}
          className="px-5 py-2 text-sm bg-indigo-600 text-white rounded-lg"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default ProductFilter;
