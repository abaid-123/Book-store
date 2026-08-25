import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "../contects/AuthProvider";
import { getSavedBooks, toggleSavedBook } from "../utils/savedBooks";
import { bookCoverUrl } from "../api/config";

const Account = () => {
  const { user, loading } = useContext(AuthContext);
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    if (user?.email) {
      setSaved(getSavedBooks(user.email));
    }
  }, [user]);

  if (loading) {
    return <p className="mt-28 px-4 lg:px-24">Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const displayName = user.displayName || user.email.split("@")[0];

  const removeBook = (book) => {
    toggleSavedBook(user.email, book);
    setSaved(getSavedBooks(user.email));
  };

  return (
    <div className="mt-28 px-4 lg:px-24 pb-16">
      <p className="uppercase tracking-widest text-blue-700 font-semibold mb-2">
        Account
      </p>
      <h1 className="text-4xl font-bold">{displayName}</h1>
      <p className="mt-2 text-gray-600">{user.email}</p>
      <p className="mt-4 text-gray-700 max-w-2xl">
        Signed-in members can save books and post reviews. Your list is stored
        on this device for this account.
      </p>

      <h2 className="text-2xl font-bold mt-12 mb-6">Saved books</h2>
      {saved.length === 0 ? (
        <p className="text-gray-600">
          No saved books yet. Open a title in the shop and choose Save.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {saved.map((book) => (
            <article
              key={book._id}
              className="border border-gray-200 rounded-lg overflow-hidden bg-white"
            >
              <Link to={`/book/${book._id}`}>
                <img
                  src={bookCoverUrl(book.imgURL)}
                  alt={book.title}
                  className="h-56 w-full object-cover"
                />
              </Link>
              <div className="p-4">
                <h3 className="font-bold line-clamp-2">{book.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{book.author}</p>
                <div className="mt-4 flex gap-3">
                  <Link
                    to={`/book/${book._id}`}
                    className="text-blue-700 font-semibold hover:underline"
                  >
                    View
                  </Link>
                  <button
                    type="button"
                    onClick={() => removeBook(book)}
                    className="text-gray-600 hover:text-black"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Account;
