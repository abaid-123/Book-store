import React from "react";
import { Link } from "react-router-dom";
import {
  FaBookOpen,
  FaHandshake,
  FaStore,
  FaUsers,
} from "react-icons/fa6";

const values = [
  {
    icon: FaBookOpen,
    title: "Curated collection",
    text: "Fiction, programming, history, and more — listed with author, rating, and year so you know what you are opening.",
  },
  {
    icon: FaStore,
    title: "Buy and sell",
    text: "Browse the shop, open a book’s real listing, or sell your own titles from the dashboard after you sign in.",
  },
  {
    icon: FaHandshake,
    title: "Fair prices",
    text: "We connect readers with books they can actually purchase, instead of locking everything inside a fake checkout.",
  },
];

const About = () => {
  return (
    <div className="pb-16">
      <section className="mt-16 bg-teal-100 px-4 lg:px-24 py-20">
        <div className="max-w-3xl">
          <p className="uppercase tracking-widest text-blue-700 font-semibold mb-3">
            Our story
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-snug text-black">
            A bookstore built for people who still love to read
          </h1>
          <p className="mt-6 text-lg text-gray-700 md:w-4/5">
            Book Store is a place to discover titles, see real details, and buy
            or sell books without the clutter. Founded in 2023, we grew from a
            small listing page into a full shop for readers across the country.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/shop"
              className="bg-blue-700 text-white font-semibold rounded px-6 py-3 hover:bg-black transition-all duration-300"
            >
              Browse the shop
            </Link>
            <Link
              to="/contact"
              className="bg-white text-blue-700 font-semibold rounded px-6 py-3 border border-blue-700 hover:bg-blue-50 transition-all duration-300"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 lg:px-24 py-16 grid gap-8 sm:grid-cols-3">
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <h3 className="text-3xl font-bold text-blue-700">800+</h3>
          <p className="mt-2 text-gray-600">Books listed</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <h3 className="text-3xl font-bold text-blue-700">550+</h3>
          <p className="mt-2 text-gray-600">Registered readers</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <h3 className="text-3xl font-bold text-blue-700">2023</h3>
          <p className="mt-2 text-gray-600">Year we started</p>
        </div>
      </section>

      <section className="px-4 lg:px-24 pb-8 grid gap-12 md:grid-cols-2 items-center">
        <img
          src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80"
          alt="Shelves of books in a bookstore"
          className="w-full h-80 object-cover rounded-lg border border-gray-200"
        />
        <div>
          <h2 className="text-3xl font-bold mb-4">
            Why this store exists
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Too many book sites show a cover and a title, then leave you stuck.
            We built this shop so every book page has the details you need —
            author, genre, rating, published year — and a clear path to buy it
            or read more on its original site.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Sellers can upload inventory from the dashboard. Readers can browse,
            compare, and go straight to a real purchase. Our mission is simple:
            keep reading easy, honest, and within reach.
          </p>
        </div>
      </section>

      <section className="px-4 lg:px-24 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">What we stand for</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {values.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="bg-teal-50 border border-teal-100 rounded-lg p-8"
            >
              <Icon className="text-blue-700 w-8 h-8 mb-4" />
              <h3 className="text-xl font-bold mb-3">{title}</h3>
              <p className="text-gray-700 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-4 lg:mx-24 bg-blue-700 rounded-lg px-8 py-12 text-center text-white">
        <FaUsers className="w-10 h-10 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-3">Join the shelf</h2>
        <p className="max-w-2xl mx-auto text-lg text-blue-100 mb-8">
          Looking for your next book, or ready to list one of your own? Start in
          the shop or send us a message — we read every note.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/shop"
            className="bg-white text-blue-700 font-semibold rounded px-6 py-3 hover:bg-black hover:text-white transition-all duration-300"
          >
            Explore books
          </Link>
          <Link
            to="/sign-up"
            className="border border-white font-semibold rounded px-6 py-3 hover:bg-white hover:text-blue-700 transition-all duration-300"
          >
            Create an account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
