import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cards";
import { EffectCards } from "swiper/modules";
import "./BannerCard.css";
import { apiUrl, bookCoverUrl } from "../api/config";
import book1 from "../assets/banner-books/book1.png";
import book2 from "../assets/banner-books/book2.png";
import book3 from "../assets/banner-books/book3.png";
import book4 from "../assets/banner-books/book4.png";
import book5 from "../assets/banner-books/book5.png";

const FALLBACK_COVERS = [book1, book2, book3, book4, book5, book1, book2, book3, book4];

const BannerCard = () => {
  const [covers, setCovers] = useState(FALLBACK_COVERS);

  useEffect(() => {
    fetch(apiUrl("/all-books"))
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        const urls = data
          .map((book) => bookCoverUrl(book.imgURL))
          .filter(Boolean)
          .slice(0, 9);
        if (urls.length) setCovers(urls);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="banner">
      <Swiper
        effect="cards"
        grabCursor
        modules={[EffectCards]}
        className="mySwiper"
      >
        {covers.map((src, index) => (
          <SwiperSlide key={`${src}-${index}`}>
            <img
              src={src}
              alt="Book cover"
              className="h-full w-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerCard;
