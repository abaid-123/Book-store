import React, { useContext, useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { FaStar } from "react-icons/fa6";
import { AuthContext } from "../contects/AuthProvider";
import { isBookSaved, toggleSavedBook } from "../utils/savedBooks";
import { bookCoverUrl } from "../api/config";

const getSiteLabel = (url) => {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (host.includes("goodreads.com")) return "Open on Goodreads";
    if (url.toLowerCase().includes(".pdf")) return "Open PDF";
    return `Open on ${host}`;
  } catch {
    return "Open original website";
  }
};

const amazonBuyUrl = (title, author) => {
  const query = [title, author, "book"].filter(Boolean).join(" ");
  return `https://www.amazon.com/s?k=${encodeURIComponent(query)}`;
};

const SingleBook = () => {
  const book = useLoaderData();
  const { user } = useContext(AuthContext);
  const {
    _id,
    title,
    author,
    imgURL,
    bookpdf,
    rating,
    publishedYear,
    genre,
  } = book || {};
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isBookSaved(user?.email, _id));
  }, [user?.email, _id]);

  const handleSave = () => {
    if (!user?.email) return;
    const nowSaved = toggleSavedBook(user.email, book);
    setSaved(nowSaved);
  };

  return (
    <div className="mt-28 px-4 lg:px-24 mb-16">
      <Link to="/shop" className="text-blue-700 hover:underline">
        Back to Shop
      </Link>

      <div className="mt-8 grid gap-12 md:grid-cols-2 items-start">
        <div className="w-full max-w-sm mx-auto md:mx-0 bg-slate-50 rounded-xl border border-gray-200 p-4 flex items-center justify-center">
          <img
            src={bookCoverUrl(imgURL)}
            alt={title}
            className="max-h-[36rem] w-auto max-w-full object-contain rounded shadow-md"
          />
        </div>

        <div>
          {genre && (
            <p className="uppercase tracking-wide text-blue-700 font-semibold mb-2">
              {genre}
            </p>
          )}
          <h1 className="text-4xl font-bold text-black">{title}</h1>
          <p className="mt-3 text-xl text-gray-600">by {author || "Unknown"}</p>

          <div className="mt-6 flex flex-wrap gap-6 text-gray-700">
            {rating != null && rating !== "" && (
              <p className="flex items-center gap-2">
                <FaStar className="text-yellow-500" />
                <span className="font-semibold">{rating}</span>
                <span>rating</span>
              </p>
            )}
            {publishedYear && <p>Published {publishedYear}</p>}
          </div>

          <p className="mt-8 text-lg leading-relaxed text-gray-700">
            {title} {author ? `by ${author}` : ""} is listed in our store
            {genre ? ` under ${genre}` : ""}.
            {publishedYear ? ` First published in ${publishedYear}.` : ""}
            Buy Now opens Amazon so you can purchase this book. Open on
            Goodreads shows the original listing.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href={amazonBuyUrl(title, author)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-700 px-8 py-3 font-semibold text-white rounded hover:bg-black transition-all duration-200"
            >
              Buy on Amazon
            </a>
            {bookpdf && (
              <a
                href={bookpdf}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 font-semibold rounded bg-teal-600 text-white hover:bg-black"
              >
                {getSiteLabel(bookpdf)}
              </a>
            )}
            {user ? (
              <button
                type="button"
                onClick={handleSave}
                className="px-8 py-3 font-semibold rounded border border-blue-700 text-blue-700 hover:bg-blue-50"
              >
                {saved ? "Saved — remove" : "Save book"}
              </button>
            ) : (
              <Link
                to="/login"
                className="px-8 py-3 font-semibold rounded border border-blue-700 text-blue-700 hover:bg-blue-50"
              >
                Sign in to save
              </Link>
            )}
            <Link
              to="/shop"
              className="px-8 py-3 font-semibold rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Browse more books
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBook;
