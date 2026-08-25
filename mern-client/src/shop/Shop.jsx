import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaStar } from "react-icons/fa6";
import { bookCoverUrl, apiUrl } from "../api/config";

const PAGE_SIZE = 10;

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [genre, setGenre] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setSearch(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    fetch(apiUrl("/all-books"))
      .then((res) => {
        if (!res.ok) throw new Error("Could not load books");
        return res.json();
      })
      .then((data) => {
        setBooks(Array.isArray(data) ? data : []);
        setError("");
      })
      .catch(() => {
        setError("Books could not be loaded. Start the FastAPI server and refresh.");
      })
      .finally(() => setLoading(false));
  }, []);

  const genres = useMemo(() => {
    const unique = [
      ...new Set(books.map((book) => book.genre).filter(Boolean)),
    ];
    return ["All", ...unique];
  }, [books]);

  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return books.filter((book) => {
      const matchesGenre = genre === "All" || book.genre === genre;
      const matchesSearch =
        !query ||
        [book.title, book.author, book.genre]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));
      return matchesGenre && matchesSearch;
    });
  }, [books, genre, search]);

  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedBooks = filteredBooks.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const start = filteredBooks.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const end = Math.min(currentPage * PAGE_SIZE, filteredBooks.length);

  useEffect(() => {
    setPage(1);
  }, [search, genre]);

  return (
    <div className="pb-16">
      <section className="mt-16 bg-teal-100 px-4 lg:px-24 py-16">
        <p className="uppercase tracking-widest text-blue-700 font-semibold mb-3">
          Shop
        </p>
        <h1 className="text-4xl md:text-5xl font-bold leading-snug text-black">
          Find a book worth opening
        </h1>
        <p className="mt-4 text-lg text-gray-700 max-w-2xl">
          Search by title or author, filter by category, then open a book for
          full details, Amazon, and Goodreads.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row max-w-xl">
          <input
            type="search"
            value={search}
            onChange={(event) => {
              const value = event.target.value;
              setSearch(value);
              if (value.trim()) {
                setSearchParams({ q: value.trim() });
              } else {
                setSearchParams({});
              }
            }}
            placeholder="Search title, author, or genre"
            className="flex-1 p-3 outline-none rounded-t sm:rounded-l sm:rounded-tr-none"
          />
          <button
            type="button"
            className="bg-blue-700 px-6 py-3 font-medium text-white hover:bg-black transition-all rounded-b sm:rounded-r sm:rounded-bl-none"
          >
            Search
          </button>
        </div>
      </section>

      <section className="px-4 lg:px-24 mt-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <p className="text-gray-600">
            {loading
              ? "Loading books..."
              : `${filteredBooks.length} book${filteredBooks.length === 1 ? "" : "s"}${
                  filteredBooks.length > PAGE_SIZE
                    ? ` · showing ${start}–${end}`
                    : ""
                }`}
          </p>
          <div className="flex flex-wrap gap-2">
            {genres.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setGenre(name)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                  genre === name
                    ? "bg-blue-700 text-white border-blue-700"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-700 hover:text-blue-700"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-center text-red-600 bg-red-50 border border-red-100 rounded-lg py-8">
            {error}
          </p>
        )}

        {!loading && !error && filteredBooks.length === 0 && (
          <p className="text-center text-gray-600 bg-gray-50 border border-gray-200 rounded-lg py-12">
            No books match this search. Try another title or category.
          </p>
        )}

        <div className="grid gap-8 my-8 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
          {pagedBooks.map((book) => (
            <article
              key={book._id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col"
            >
              <Link to={`/book/${book._id}`} className="block bg-slate-50">
                <div className="aspect-[2/3] flex items-center justify-center p-3">
                  <img
                    src={bookCoverUrl(book.imgURL)}
                    alt={book.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </Link>
              <div className="p-5 flex flex-col flex-1">
                {book.genre && (
                  <p className="text-xs uppercase tracking-wide text-blue-700 font-semibold mb-2">
                    {book.genre}
                  </p>
                )}
                <Link to={`/book/${book._id}`}>
                  <h2 className="text-xl font-bold text-black line-clamp-2">
                    {book.title}
                  </h2>
                </Link>
                <p className="mt-1 text-gray-600">{book.author}</p>
                {book.rating != null && book.rating !== "" && (
                  <p className="mt-3 flex items-center gap-2 text-gray-700">
                    <FaStar className="text-yellow-500" />
                    <span className="font-semibold">{book.rating}</span>
                  </p>
                )}
                <Link
                  to={`/book/${book._id}`}
                  className="mt-auto pt-5 bg-blue-700 text-white font-semibold py-2 rounded text-center hover:bg-black transition-all"
                >
                  View details
                </Link>
              </div>
            </article>
          ))}
        </div>

        {!loading && !error && filteredBooks.length > PAGE_SIZE && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              className="px-4 py-2 rounded-lg border border-gray-300 font-semibold text-gray-700 hover:border-blue-700 hover:text-blue-700 disabled:opacity-40 disabled:hover:border-gray-300 disabled:hover:text-gray-700"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (number) => (
                <button
                  key={number}
                  type="button"
                  onClick={() => setPage(number)}
                  className={`min-w-10 px-3 py-2 rounded-lg font-semibold border transition-all ${
                    currentPage === number
                      ? "bg-blue-700 text-white border-blue-700"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-700 hover:text-blue-700"
                  }`}
                >
                  {number}
                </button>
              )
            )}
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              className="px-4 py-2 rounded-lg border border-gray-300 font-semibold text-gray-700 hover:border-blue-700 hover:text-blue-700 disabled:opacity-40 disabled:hover:border-gray-300 disabled:hover:text-gray-700"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Shop;
