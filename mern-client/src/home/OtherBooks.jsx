import React, { useEffect, useState } from 'react'
import BooksCards from '../components/BooksCards';
import { apiUrl } from '../api/config';

const OtherBooks = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch(apiUrl('/all-books'))
      .then(res => res.json())
      .then(data => setBooks(data.slice(0,8))) // Setting the fetched data in state
      .catch(err => console.error('Error fetching books:', err));
  }, []); // Adding dependency array to run the effect only once

  return (
    <div>
      {/* Pass the books array and headline as props */}
      <BooksCards books={books} headline="Other Books" />
    </div>
  );
}

export default OtherBooks