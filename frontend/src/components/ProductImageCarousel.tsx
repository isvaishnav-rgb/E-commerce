import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { useRef } from "react";

import "swiper/swiper-bundle.css";

interface Props {
  images: string[];
}

const ProductImageCarousel = ({ images }: Props) => {
  const swiperRef = useRef<any>(null);

  return (
    <div
      className="relative"
      onMouseEnter={() => swiperRef.current?.autoplay.start()}
      onMouseLeave={() => swiperRef.current?.autoplay.stop()}
    >
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        loop
        autoplay={{
          delay: 1000,
          disableOnInteraction: false,
        }} // ✅ autoplay initialized
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          swiper.autoplay.stop(); // ✅ stop immediately
        }}
        className="w-full rounded-lg"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="w-full h-60 bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden">
              <img
                src={img}
                alt={`product-${index}`}
                className="w-full h-full object-contain"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductImageCarousel;
