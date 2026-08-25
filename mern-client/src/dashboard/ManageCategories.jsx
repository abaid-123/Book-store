import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { bookCoverUrl, apiUrl } from "../api/config";

const ManageCategories = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState("");

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
        setError("Could not load categories. Start FastAPI and refresh.");
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const groups = {};
    books.forEach((book) => {
      const name = (book.genre || "Uncategorized").trim() || "Uncategorized";
      if (!groups[name]) groups[name] = [];
      groups[name].push(book);
    });
    return Object.entries(groups)
      .map(([name, items]) => ({ name, books: items, count: items.length }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [books]);

  const active =
    categories.find((item) => item.name === selected) || categories[0] || null;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-700">
          Catalog
        </p>
        <h2 className="text-3xl font-bold text-slate-900 mt-1">Categories</h2>
        <p className="text-slate-500 mt-1">
          See every book category in the shop and the titles inside it.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Categories</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">
            {loading ? "—" : categories.length}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Books</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">
            {loading ? "—" : books.length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        {loading && <p className="text-slate-500">Loading categories...</p>}
        {error && (
          <p className="text-red-700 bg-red-50 border border-red-100 rounded-lg p-4">
            {error}
          </p>
        )}
        {!loading && !error && categories.length === 0 && (
          <p className="text-slate-500">No categories yet. Upload a book first.</p>
        )}
        {!loading && !error && categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => setSelected(item.name)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                  active?.name === item.name
                    ? "bg-blue-700 text-white border-blue-700"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-700 hover:text-blue-700"
                }`}
              >
                {item.name} ({item.count})
              </button>
            ))}
          </div>
        )}
      </div>

      {active && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-xl font-bold text-slate-900">{active.name}</h3>
            <p className="text-slate-500 mt-1">
              {active.count} book{active.count === 1 ? "" : "s"} in this category
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-slate-400 bg-slate-50">
                  <th className="py-3 px-5">Book</th>
                  <th className="py-3 px-5">Author</th>
                  <th className="py-3 px-5">Rating</th>
                  <th className="py-3 px-5"></th>
                </tr>
              </thead>
              <tbody>
                {active.books.map((book) => (
                  <tr key={book._id} className="border-t border-slate-100">
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        {book.imgURL ? (
                          <img
                            src={bookCoverUrl(book.imgURL)}
                            alt=""
                            className="w-9 h-12 object-cover rounded border border-slate-200"
                          />
                        ) : null}
                        <span className="font-semibold text-slate-900">
                          {book.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-5 text-slate-600">{book.author}</td>
                    <td className="py-3 px-5 text-slate-600">
                      {book.rating || "—"}
                    </td>
                    <td className="py-3 px-5 text-right">
                      <Link
                        to={`/admin/dashboard/edit-books/${book._id}`}
                        className="text-sm font-semibold text-blue-700 hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;
