import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { FaStar } from "react-icons/fa6";
import { AuthContext } from "../contects/AuthProvider";
import { authFetch } from "../api/auth";
import { apiUrl } from "../api/config";

const accountName = (user) =>
  user?.displayName || user?.email?.split("@")[0] || "Reader";

const StarRow = ({ value, onSelect }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => {
      const icon = (
        <FaStar
          className={star <= value ? "text-amber-500" : "text-gray-300"}
        />
      );
      if (!onSelect) {
        return <span key={star}>{icon}</span>;
      }
      return (
        <button
          key={star}
          type="button"
          onClick={() => onSelect(star)}
          aria-label={`${star} star`}
        >
          {icon}
        </button>
      );
    })}
  </div>
);

const ReviewCard = ({ review }) => {
  const initial = (review.name || "R").trim().charAt(0).toUpperCase();
  return (
    <div className="flex flex-col w-full h-full min-h-[22rem] bg-white py-8 px-6 rounded-lg border border-gray-200">
      <StarRow value={Number(review.rating) || 5} />
      <p className="mt-6 mb-6 text-gray-700 leading-relaxed line-clamp-5 flex-1">
        {review.comment}
      </p>
      <div className="flex items-center gap-3 mt-auto">
        <div className="w-12 h-12 rounded-full bg-teal-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
          {initial}
        </div>
        <div className="min-w-0">
          <h5 className="text-lg font-medium truncate">{review.name}</h5>
          <p className="text-sm text-gray-600 truncate">{review.role || "Reader"}</p>
        </div>
      </div>
    </div>
  );
};

const Review = () => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [role, setRole] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const reviewerName = accountName(user);

  const loadReviews = () => {
    fetch(apiUrl("/all-reviews"))
      .then((res) => {
        if (!res.ok) throw new Error("Could not load reviews");
        return res.json();
      })
      .then((data) => {
        setReviews(Array.isArray(data) ? data : []);
        setLoadError("");
      })
      .catch(() => {
        setReviews([]);
        setLoadError(
          "Reviews could not load. Start FastAPI with python main.py, then refresh."
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!user) {
      setStatus("Please sign in to post a review.");
      return;
    }
    setStatus("");
    authFetch("/add-review", {
      method: "POST",
      body: JSON.stringify({
        name: reviewerName,
        role: role || "Reader",
        comment,
        rating,
      }),
    })
      .then(() => {
        setComment("");
        setRole("");
        setRating(5);
        setStatus("Thanks — your review is live.");
        loadReviews();
      })
      .catch((error) => {
        setStatus(error.message || "Could not save review. Is FastAPI running?");
      });
  };

  return (
    <div className="my-16 px-4 md:px-24">
      <h2 className="text-4xl md:text-5xl mb-4 font-bold text-center leading-snug">
        What readers say
      </h2>
      <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
        Honest feedback from readers and sellers who shop with us.
      </p>

      {loading && (
        <p className="text-center text-gray-500 mb-10">Loading reviews...</p>
      )}

      {!loading && loadError && (
        <p className="text-center text-red-700 bg-red-50 border border-red-100 rounded-lg py-10 mb-10">
          {loadError}
        </p>
      )}

      {!loading && !loadError && reviews.length === 0 && (
        <p className="text-center text-gray-600 bg-teal-50 border border-teal-100 rounded-lg py-10 mb-10">
          No reviews yet. Be the first reader to leave one.
        </p>
      )}

      {reviews.length > 0 && (
        <Swiper
          slidesPerView={1}
          spaceBetween={24}
          pagination={{ clickable: true }}
          breakpoints={{
            768: { slidesPerView: 2, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 28 },
          }}
          modules={[Pagination]}
          className="mb-12 pb-10 [&_.swiper-wrapper]:items-stretch [&_.swiper-slide]:h-auto [&_.swiper-slide]:flex"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review._id} className="!h-auto">
              <ReviewCard review={review} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {!user ? (
        <div className="max-w-2xl mx-auto bg-teal-50 border border-teal-100 rounded-lg p-6 md:p-8 text-center">
          <h3 className="text-2xl font-bold mb-3">Sign in to write a review</h3>
          <p className="text-gray-700 mb-6">
            Members can post reviews and save books. Guests can still browse the
            shop.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/login"
              className="bg-blue-700 text-white font-semibold px-6 py-3 rounded hover:bg-black"
            >
              Sign in
            </Link>
            <Link
              to="/sign-up"
              className="border border-blue-700 text-blue-700 font-semibold px-6 py-3 rounded hover:bg-white"
            >
              Create account
            </Link>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg p-6 md:p-8"
        >
          <h3 className="text-2xl font-bold mb-2">Write a review</h3>
          <p className="text-gray-600 mb-6">
            Posting as <span className="font-semibold text-black">{reviewerName}</span>
          </p>
          <div>
            <label htmlFor="review-role" className="block font-medium mb-1">
              Role or city
            </label>
            <input
              id="review-role"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="w-full p-3 border border-gray-300 rounded outline-none focus:border-blue-700"
              placeholder="Reader, Karachi"
            />
          </div>
          <div className="mt-4">
            <p className="font-medium mb-2">Rating</p>
            <StarRow value={rating} onSelect={setRating} />
          </div>
          <div className="mt-4">
            <label htmlFor="review-comment" className="block font-medium mb-1">
              Review
            </label>
            <textarea
              id="review-comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              required
              minLength={8}
              className="w-full p-3 border border-gray-300 rounded h-28 outline-none focus:border-blue-700"
              placeholder="What did you think of the shop or a book you found here?"
            />
          </div>
          <button
            type="submit"
            className="mt-6 bg-blue-700 text-white font-semibold px-6 py-3 rounded hover:bg-black transition-all"
          >
            Post review
          </button>
          {status && <p className="mt-4 text-gray-700">{status}</p>}
        </form>
      )}
    </div>
  );
};

export default Review;
