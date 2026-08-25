import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BannerCard from "../home/BannerCard";

const Banner = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();
    const value = query.trim();
    navigate(value ? `/shop?q=${encodeURIComponent(value)}` : "/shop");
  };

  return (
    <div className="px-4 lg:px-24 bg-teal-100 flex items-center">
      <div className="flex w-full flex-col md:flex-row items-center gap-12 py-40 justify-between">
        <div className="space-y-8 md:w-1/2 h-full">
          <h2 className="text-4xl font-bold text-black leading-snug">
            Buy and Sell your books
            <span className="text-blue-700"> for the best prices</span>
          </h2>
          <p className="md:w-4/5">
            Search our shelves by title or author, open full book details, then
            buy on Amazon or read more on Goodreads. Selling a copy takes a
            minute once you sign in.
          </p>
          <form onSubmit={handleSearch} className="flex max-w-xl">
            <input
              type="search"
              id="search"
              name="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search a book"
              className="flex-1 p-2 rounded-s-sm outline-none"
            />
            <button
              type="submit"
              className="bg-blue-700 px-6 py-2 font-medium text-white hover:bg-black transition-all ease-in duration-200"
            >
              Search
            </button>
          </form>
        </div>

        <div>
          <BannerCard />
        </div>
      </div>
    </div>
  );
};

export default Banner;
