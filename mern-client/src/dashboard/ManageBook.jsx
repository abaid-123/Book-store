import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { bookCoverUrl, apiUrl } from "../api/config";

const ManageBook = () => {
  const [allbook, setallbook] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadBooks = () => {
    fetch(apiUrl("/all-books"))
      .then((res) => res.json())
      .then((data) => setallbook(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return allbook;
    return allbook.filter((book) =>
      [book.title, book.author, book.genre]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }, [allbook, search]);

  const handledelete = (id) => {
    if (!window.confirm("Delete this book from inventory?")) return;
    fetch(apiUrl(`/delete-book/${id}`), { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("delete failed");
        setallbook((current) => current.filter((book) => book._id !== id));
      })
      .catch(() => {
        alert("Could not delete book.");
      });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-700">
            Inventory
          </p>
          <h2 className="text-3xl font-bold text-slate-900 mt-1">Manage books</h2>
          <p className="text-slate-500 mt-1">{allbook.length} titles in the catalog</p>
        </div>
        <Link
          to="/admin/dashboard/upload"
          className="bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-lg hover:bg-slate-900 text-center"
        >
          Upload a book
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search title, author, or genre"
            className="w-full max-w-md rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-600"
          />
        </div>

        {loading ? (
          <p className="p-8 text-slate-500">Loading books...</p>
        ) : filtered.length === 0 ? (
          <p className="p-8 text-slate-500">No books match this search.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-slate-400 bg-slate-50">
                  <th className="py-3 px-4">No.</th>
                  <th className="py-3 px-4">Book</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((book, index) => (
                  <tr key={book._id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 text-slate-500">{index + 1}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {book.imgURL ? (
                          <img
                            src={bookCoverUrl(book.imgURL)}
                            alt=""
                            className="w-9 h-12 object-cover rounded border border-slate-200"
                          />
                        ) : null}
                        <span className="font-semibold text-slate-900">{book.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{book.author}</td>
                    <td className="py-3 px-4 text-slate-600">{book.genre || "—"}</td>
                    <td className="py-3 px-4">{book.rating || "—"}</td>
                    <td className="py-3 px-4">
                      <Link
                        to={`/admin/dashboard/edit-books/${book._id}`}
                        className="text-blue-700 font-semibold hover:underline mr-4"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handledelete(book._id)}
                        className="text-red-600 font-semibold hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBook;
