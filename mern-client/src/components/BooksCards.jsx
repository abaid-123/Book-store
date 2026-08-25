import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import { FaCartShopping } from "react-icons/fa6";

// Import required modules
import { Pagination } from "swiper/modules";
import { bookCoverUrl } from "../api/config";

const BooksCards = ({ headline, books }) => {
  return (
    <div className="my-16 px-4 lg:px-24">
      <h2 className="text-5xl text-center font-bold text-black my-5">
        {headline}
      </h2>
      {/* Reduced the margin on top to minimize the gap */}
      <div className="mt-6">
        <Swiper
          slidesPerView={1}
          spaceBetween={10}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 50,
            },
          }}
          modules={[Pagination]}
          className="mySwiper w-full h-full"
        >
          {books.map((book) => (
            <SwiperSlide key={book._id}>
              <Link to={`/book/${book._id}`}>
                <div className="relative">
                  {/* Added fixed height and object-cover to ensure uniform image size */}
                  <img
                    src={bookCoverUrl(book.imgURL)}
                    alt={book.title}
                    className="h-64 w-full object-cover"
                  />
                  <div
                    className="bg-blue-600 hover:bg-black 
                p-2 rounded absolute top-3 right-3"
                  >
                    <FaCartShopping className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-bold truncate">{book.title}</h3>
                  <p className="text-sm text-gray-500">{book.author}</p>
                </div>
                <div className="mt-2">
                  <p className="text-yellow-500">{book.rating}</p>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default BooksCards;
