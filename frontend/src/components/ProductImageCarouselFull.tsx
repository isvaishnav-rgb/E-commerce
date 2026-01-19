import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductImageCarouselFull = ({ images }: { images: string[] }) => {
  const [index, setIndex] = useState(0);

  if (!images?.length) return null;

  const prev = () =>
    setIndex(index === 0 ? images.length - 1 : index - 1);

  const next = () =>
    setIndex(index === images.length - 1 ? 0 : index + 1);

  return (
    <div className="relative w-full h-[50vh] bg-gray-100 overflow-hidden">
      <img
        src={images[index]}
        alt="product"
        className="w-full h-full object-contain"
      />

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
          >
            <ChevronLeft />
          </button>

          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow"
          >
            <ChevronRight />
          </button>
        </>
      )}

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <span
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2.5 h-2.5 rounded-full cursor-pointer ${
              i === index ? "bg-indigo-600" : "bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductImageCarouselFull;
