import React, { useEffect, useState } from "react";
import { deleteReview } from "../api/auth";
import { apiUrl } from "../api/config";

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReviews = () => {
    fetch(apiUrl("/all-reviews"))
      .then((res) => {
        if (!res.ok) throw new Error("Could not load reviews");
        return res.json();
      })
      .then((data) => {
        setReviews(Array.isArray(data) ? data : []);
        setError("");
      })
      .catch(() => {
        setError("Could not load reviews. Start FastAPI and refresh.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review? It will disappear from the home page.")) {
      return;
    }
    try {
      await deleteReview(id);
      setReviews((current) => current.filter((review) => review._id !== id));
    } catch (err) {
      alert(err.message || "Could not delete review.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-700">
          Moderation
        </p>
        <h2 className="text-3xl font-bold text-slate-900 mt-1">Manage reviews</h2>
        <p className="text-slate-500 mt-1">
          Remove spam or inappropriate comments from the storefront.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        {loading && <p className="text-slate-500">Loading reviews...</p>}
        {error && (
          <p className="text-red-700 bg-red-50 border border-red-100 rounded-lg p-4">
            {error}
          </p>
        )}
        {!loading && !error && reviews.length === 0 && (
          <p className="text-slate-500">No reviews left.</p>
        )}
        {!loading && !error && reviews.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {reviews.map((review) => (
              <article
                key={review._id}
                className="rounded-xl border border-slate-100 bg-slate-50 p-4 flex flex-col"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{review.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {review.role} · {review.rating}/5
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(review._id)}
                    className="text-sm font-semibold text-red-600 hover:text-red-800 shrink-0"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-slate-700 mt-3 flex-1">{review.comment}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageReviews;
