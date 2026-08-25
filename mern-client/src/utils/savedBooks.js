const storageKey = (email) => `bookstore-saved:${String(email || "").toLowerCase()}`;

export const getSavedBooks = (email) => {
  if (!email) return [];
  try {
    const raw = localStorage.getItem(storageKey(email));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const isBookSaved = (email, bookId) =>
  getSavedBooks(email).some((book) => book._id === bookId);

export const toggleSavedBook = (email, book) => {
  if (!email || !book?._id) return false;
  const current = getSavedBooks(email);
  const exists = current.some((item) => item._id === book._id);
  const next = exists
    ? current.filter((item) => item._id !== book._id)
    : [
        ...current,
        {
          _id: book._id,
          title: book.title,
          author: book.author,
          imgURL: book.imgURL,
        },
      ];
  localStorage.setItem(storageKey(email), JSON.stringify(next));
  return !exists;
};
