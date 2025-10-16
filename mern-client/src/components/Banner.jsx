import React from "react";
import BannerCard from "../home/BannerCard";

const Banner = () => {
  return (
    <div className="px-4 lg:px-24 bg-teal-100 flex items-center">
      <div className="flex w-full flex-col md:flex-row items-center gap-12 py-40 justify-between">
        <div className="space-y-8 w-1/2 h-full">
          <h2 className="text-4xl font-bold text-black leading-snug">
            Buy and Sell your books
            <span className="text-blue-700"> for the best prices</span>
          </h2>
          <p className="md:w-4/5 ">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quod,
            recusandae itaque, exercitationem ullam unde rerum facere numquam
            reiciendis autem eaque nulla assumenda earum suscipit quo omnis
            culpa placeat similique commodi?
          </p>
          <div>
            <input
              type="search"
              id="search"
              name="search"
              placeholder="Search a book "
              className="p-2 rounded-s-sm outline-none"
            />
            <button
              className="bg-blue-700 px-6 py-2 font-medium
             text-white hover:bg-black transition-all ease-in duration-200"
            >
              Search
            </button>
          </div>
        </div>

        <div>
          <BannerCard/>
        </div>
      </div>
    </div>
  );
};

export default Banner;
