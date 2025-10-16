import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Avatar } from "flowbite-react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { FaStar } from "react-icons/fa6";
import propic from "../assets/abaid2.png";

const Review = () => {
  return (
    <div className="my-12 px-4 md:px-24">
      <h2 className="text-5xl mb-10 font-bold text-center leading-snug">
        Our Customer
      </h2>

      <div>
        <Swiper
          slidesPerView={3}
          spaceBetween={30}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 50,
            },
          }}
          modules={[Pagination]}
          className="mySwiper"
        >
          {/* Adjusting margin-top with `mt-6` */}
          <SwiperSlide className="shadow-xl bg-white py-8 px-4 md:m-5 rounded-lg border mt-6">
            <div className="space-y-6">
              <div className="text-amber-500 flex gap-2">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              <div className="mt-7">
                <p className="mb-4">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Voluptas necessitatibus earum, ad asperiores quae aliquam
                  veniam itaque quod incidunt nostrum voluptates iusto nulla
                  voluptate est eveniet, quasi dolores doloremque obcaecati.
                </p>
                <Avatar
                  img={propic}
                  alt="avatar of Jese"
                  rounded={true}
                  className="w-14 h-14 mb-4" // Adjusted width/height for larger avatar
                />
                <h5 className="text-lg font-medium">Mark Ping</h5>
                <p className="text-base text-gray-600">CEO, ABC Company</p>
              </div>
            </div>
          </SwiperSlide>

          {/* Other slides remain the same but with updated margins */}
          <SwiperSlide className="shadow-xl bg-white py-8 px-4 md:m-5 rounded-lg border mt-6">
            <div className="space-y-6">
              <div className="text-amber-500 flex gap-2">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              <div className="mt-7">
                <p className="mb-4">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Voluptas necessitatibus earum, ad asperiores quae aliquam
                  veniam itaque quod incidunt nostrum voluptates iusto nulla
                  voluptate est eveniet, quasi dolores doloremque obcaecati.
                </p>
                <Avatar
                  img={propic}
                  alt="avatar of Jese"
                  rounded={true}
                  className="w-14 h-14 mb-4"
                />
                <h5 className="text-lg font-medium">Mark Ping</h5>
                <p className="text-base text-gray-600">CEO, ABC Company</p>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide className="shadow-xl bg-white py-8 px-4 md:m-5 rounded-lg border mt-6">
            <div className="space-y-6">
              <div className="text-amber-500 flex gap-2">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              <div className="mt-7">
                <p className="mb-4">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Voluptas necessitatibus earum, ad asperiores quae aliquam
                  veniam itaque quod incidunt nostrum voluptates iusto nulla
                  voluptate est eveniet, quasi dolores doloremque obcaecati.
                </p>
                <Avatar
                  img={propic}
                  alt="avatar of Jese"
                  rounded={true}
                  className="w-14 h-14 mb-4"
                />
                <h5 className="text-lg font-medium">Mark Ping</h5>
                <p className="text-base text-gray-600">CEO, ABC Company</p>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide className="shadow-xl bg-white py-8 px-4 md:m-5 rounded-lg border mt-6">
            <div className="space-y-6">
              <div className="text-amber-500 flex gap-2">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              <div className="mt-7">
                <p className="mb-4">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Voluptas necessitatibus earum, ad asperiores quae aliquam
                  veniam itaque quod incidunt nostrum voluptates iusto nulla
                  voluptate est eveniet, quasi dolores doloremque obcaecati.
                </p>
                <Avatar
                  img={propic}
                  alt="avatar of Jese"
                  rounded={true}
                  className="w-14 h-14 mb-4"
                />
                <h5 className="text-lg font-medium">Mark Ping</h5>
                <p className="text-base text-gray-600">CEO, ABC Company</p>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide className="shadow-xl bg-white py-8 px-4 md:m-5 rounded-lg border mt-6">
            <div className="space-y-6">
              <div className="text-amber-500 flex gap-2">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
              <div className="mt-7">
                <p className="mb-4">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Voluptas necessitatibus earum, ad asperiores quae aliquam
                  veniam itaque quod incidunt nostrum voluptates iusto nulla
                  voluptate est eveniet, quasi dolores doloremque obcaecati.
                </p>
                <Avatar
                  img={propic}
                  alt="avatar of Jese"
                  rounded={true}
                  className="w-14 h-14 mb-4"
                />
                <h5 className="text-lg font-medium">Mark Ping</h5>
                <p className="text-base text-gray-600">CEO, ABC Company</p>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default Review;
