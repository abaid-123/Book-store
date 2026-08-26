import React, { useEffect, useState } from 'react';
import BooksCards from '../components/BooksCards';
import { apiUrl } from '../api/config';

const BestSellerBooks = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch(apiUrl("/all-books"))
      .then((res) => {
        if (!res.ok) throw new Error("Could not load books");
        return res.json();
      })
      .then((data) => setBooks(Array.isArray(data) ? data.slice(0, 8) : []))
      .catch((err) => console.error("Error fetching books:", err));
  }, []);

  return (
    <div>
      {/* Pass the books array and headline as props */}
      <BooksCards books={books} headline="Best Seller Books" />
    </div>
  );
};

export default BestSellerBooks;
