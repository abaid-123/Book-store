import React from "react";
import favrtBookimg from "../assets/favoritebook.jpg";
import { Link } from "react-router-dom";

const FavBook = () => {
  return (
    <div className="px-4 lg:px-24 my-20 flex flex-col md:flex-row justify-between gap-12 items-center">
      <div className="md:w-1/2">
        <img
          src={favrtBookimg}
          alt="Favorite Book"
          className="rounded md:w-10/12"
        />
      </div>
      <div className=" md:w-1/2">
        <h2 className="text-4xl font-bold my-4 md:w-3/4 leading-snug">
          Find Your Favourite <span className="text-blue-700">Book Here!</span>
        </h2>
        <p className="mb-10 text-lg md:w-5/6">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium
          delectus et repellendus est? Mollitia consequuntur, omnis adipisci
          corporis dignissimos eum. Nam, reprehenderit inventore? Minima,
          voluptas delectus nobis error velit corporis!
        </p>
        <div className="flex flex-col sm:flex-row justify-between gap-6 md:w-3/4 my-5">
          <div>
            <h3 className="text-3xl font-bold">800+</h3>
            <p className="text-base">Books Listing</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold">550+</h3>
            <p className="text-base">Register Users</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold">1200+</h3>
            <p className="text-base">PDFs Downloads</p>
          </div>
        </div>
        <Link to="/shop" className="block mt-10">
          <button className="bg-blue-700 text-white font-semibold rounded px-5 py-2 hover:bg-black transition-all duration-300">
            Explore More
          </button>
        </Link>
      </div>
    </div>
  );
};

export default FavBook;
