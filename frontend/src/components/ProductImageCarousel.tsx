import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/swiper-bundle.css";

interface Props {
  images: string[];
}

const ProductImageCarousel = ({ images }: Props) => {
  return (
    <Swiper
      modules={[Pagination]}
      pagination={{ clickable: true }}
      className="h-40 w-full rounded-lg"
    >
      {images.map((img, index) => (
        <SwiperSlide key={index}>
          <img
            src={img}
            alt="product"
            className="h-40 w-full rounded-lg object-cover"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ProductImageCarousel;
