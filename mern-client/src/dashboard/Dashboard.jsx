import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaBookOpen, FaComments, FaLayerGroup, FaStar, FaUsers } from "react-icons/fa6";
import { AuthContext } from "../contects/AuthProvider";
import { deleteReview, fetchUsers } from "../api/auth";
import { bookCoverUrl, apiUrl } from "../api/config";

const toFiveStar = (raw) => {
  const rating = Number(raw);
  if (!Number.isFinite(rating) || rating <= 0) return null;
  if (rating <= 5) return rating;
  if (rating <= 10) return rating / 2;
  if (rating <= 100) return rating / 20;
  return null;
};

const formatRating = (raw) => {
  const value = toFiveStar(raw);
  return value == null ? "—" : value.toFixed(1);
};

const StatCard = ({ icon: Icon, label, value, iconClass, boxClass }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-start gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${boxClass}`}>
      <Icon className={`w-5 h-5 ${iconClass}`} />
    </div>
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(apiUrl("/all-books")).then((res) => {
        if (!res.ok) throw new Error("books");
        return res.json();
      }),
      fetch(apiUrl("/all-reviews")).then((res) => {
        if (!res.ok) throw new Error("reviews");
        return res.json();
      }),
      fetchUsers(),
    ])
      .then(([bookData, reviewData, userData]) => {
        setBooks(Array.isArray(bookData) ? bookData : []);
        setReviews(Array.isArray(reviewData) ? reviewData : []);
        setUsers(Array.isArray(userData) ? userData : []);
        setError("");
      })
      .catch(() => {
        setError("Could not load dashboard data. Start FastAPI and refresh.");
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const genres = {};
    let ratingTotal = 0;
    let ratingCount = 0;
    books.forEach((book) => {
      const genre = book.genre || "Uncategorized";
      genres[genre] = (genres[genre] || 0) + 1;
      const rating = toFiveStar(book.rating);
      if (rating != null) {
        ratingTotal += rating;
        ratingCount += 1;
      }
    });
    const maxGenre = Math.max(1, ...Object.values(genres), 1);
    return {
      bookCount: books.length,
      genreCount: Object.keys(genres).length,
      reviewCount: reviews.length,
      avgRating: ratingCount ? (ratingTotal / ratingCount).toFixed(1) : "—",
      genres,
      maxGenre,
      userCount: users.filter((row) => row.role !== "admin").length,
      loggedInCount: users.filter((row) => row.role !== "admin" && row.lastLogin)
        .length,
    };
  }, [books, reviews, users]);

  const recentBooks = [...books].slice(-6).reverse();
  const recentReviews = reviews.slice(0, 4);
  const displayName = (user?.displayName || user?.email || "Admin").split("@")[0];

  const handleDeleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await deleteReview(id);
      setReviews((current) => current.filter((review) => review._id !== id));
    } catch (err) {
      alert(err.message || "Could not delete review.");
    }
  };

  return (
    <div className="space-y-6">
      <section className="bg-gradient-to-r from-blue-700 to-slate-900 rounded-2xl text-white p-6 sm:p-8 shadow-sm">
        <p className="text-blue-200 text-xs font-semibold tracking-[0.2em] uppercase">
          Admin overview
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold mt-2">
          Welcome back, {displayName}
        </h1>
        <p className="mt-2 text-blue-100 max-w-2xl">
          Catalog, reviews, and inventory for Book Store — all in one place.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/admin/dashboard/upload"
            className="bg-white text-blue-800 font-semibold px-4 py-2.5 rounded-lg hover:bg-blue-50"
          >
            Upload a book
          </Link>
          <Link
            to="/admin/dashboard/manage"
            className="bg-blue-500/30 text-white font-semibold px-4 py-2.5 rounded-lg border border-white/20 hover:bg-blue-500/40"
          >
            Manage inventory
          </Link>
          <Link
            to="/admin/dashboard/users"
            className="bg-blue-500/30 text-white font-semibold px-4 py-2.5 rounded-lg border border-white/20 hover:bg-blue-500/40"
          >
            View users
          </Link>
        </div>
      </section>

      {loading && (
        <p className="text-slate-500 bg-white rounded-2xl border border-slate-200 p-6">
          Loading dashboard...
        </p>
      )}
      {error && (
        <p className="text-red-700 bg-red-50 border border-red-100 rounded-2xl p-4">
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard
              icon={FaBookOpen}
              label="Books listed"
              value={stats.bookCount}
              boxClass="bg-blue-50"
              iconClass="text-blue-700"
            />
            <StatCard
              icon={FaUsers}
              label="Registered users"
              value={stats.userCount}
              boxClass="bg-violet-50"
              iconClass="text-violet-700"
            />
            <StatCard
              icon={FaUsers}
              label="Have logged in"
              value={stats.loggedInCount}
              boxClass="bg-sky-50"
              iconClass="text-sky-700"
            />
            <StatCard
              icon={FaLayerGroup}
              label="Genres"
              value={stats.genreCount}
              boxClass="bg-teal-50"
              iconClass="text-teal-700"
            />
            <StatCard
              icon={FaComments}
              label="Reader reviews"
              value={stats.reviewCount}
              boxClass="bg-indigo-50"
              iconClass="text-indigo-700"
            />
            <StatCard
              icon={FaStar}
              label="Average rating / 5"
              value={stats.avgRating}
              boxClass="bg-amber-50"
              iconClass="text-amber-500"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <section className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">Recent books</h2>
                <Link
                  to="/admin/dashboard/manage"
                  className="text-sm font-semibold text-blue-700 hover:underline"
                >
                  See all
                </Link>
              </div>
              {recentBooks.length === 0 ? (
                <p className="px-6 py-10 text-slate-500">
                  No books yet. Upload the first title.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead>
                      <tr className="text-xs uppercase tracking-wide text-slate-400">
                        <th className="px-6 py-3">Title</th>
                        <th className="px-3 py-3">Author</th>
                        <th className="px-3 py-3">Genre</th>
                        <th className="px-6 py-3">Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBooks.map((book) => (
                        <tr
                          key={book._id}
                          className="border-t border-slate-100 hover:bg-slate-50"
                        >
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-3">
                              {book.imgURL ? (
                                <img
                                  src={bookCoverUrl(book.imgURL)}
                                  alt=""
                                  className="w-10 h-14 object-cover rounded-md border border-slate-200 shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-14 rounded-md bg-slate-100 shrink-0" />
                              )}
                              <Link
                                to={`/admin/dashboard/edit-books/${book._id}`}
                                className="font-semibold text-slate-900 hover:text-blue-700"
                              >
                                {book.title}
                              </Link>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-slate-600">{book.author}</td>
                          <td className="px-3 py-3">
                            <span className="text-xs font-medium bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                              {book.genre || "—"}
                            </span>
                          </td>
                          <td className="px-6 py-3 font-medium text-slate-800">
                            {formatRating(book.rating)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">By genre</h2>
              {Object.keys(stats.genres).length === 0 ? (
                <p className="text-slate-500">No genres yet.</p>
              ) : (
                <ul className="space-y-4">
                  {Object.entries(stats.genres)
                    .sort((a, b) => b[1] - a[1])
                    .map(([genre, count]) => (
                      <li key={genre}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-700">{genre}</span>
                          <span className="font-semibold text-slate-900">{count}</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-blue-600"
                            style={{
                              width: `${Math.max(12, (count / stats.maxGenre) * 100)}%`,
                            }}
                          />
                        </div>
                      </li>
                    ))}
                </ul>
              )}
            </section>
          </div>

          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-lg font-bold text-slate-900">Latest reviews</h2>
              <Link
                to="/admin/dashboard/reviews"
                className="text-sm font-semibold text-blue-700 hover:underline"
              >
                Manage all
              </Link>
            </div>
            {recentReviews.length === 0 ? (
              <p className="text-slate-500">No reviews yet.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {recentReviews.map((review) => (
                  <article
                    key={review._id}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-slate-900">{review.name}</p>
                      <p className="text-sm font-medium text-amber-600">
                        {review.rating}/5
                      </p>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{review.role}</p>
                    <p className="text-slate-700 mt-3 line-clamp-3">{review.comment}</p>
                    <button
                      type="button"
                      onClick={() => handleDeleteReview(review._id)}
                      className="mt-3 text-sm font-semibold text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default Dashboard;
