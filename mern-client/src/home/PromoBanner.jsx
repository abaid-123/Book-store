import React from "react";
import { Link } from "react-router-dom";
import bookpic from "../assets/awardbooks.png"
const PromoBanner = () => {
  return (
    <div className="mt-16 py-12 bg-teal-100 px-4 md:px-24">
      <div className="flex flex-col md:flex-row justify-between gap-12 items-center">
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold mb-6 leading-snug">
            2024 National Book Awards For Fiction Shortlist
          </h2>
          <Link to="/shop" className="block ">
            <button className="bg-blue-700 text-white font-semibold rounded px-5 py-2 hover:bg-black transition-all duration-300">
              Explore More
            </button>
          </Link>
        </div>
        <div>
          <img src={bookpic} alt="" className="w-96" />
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
