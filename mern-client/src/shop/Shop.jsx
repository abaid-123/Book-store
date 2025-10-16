import React, { useEffect, useState } from "react";
import { Card } from "flowbite-react";
const Shop = () => {
  const [books, setbooks] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/all-books")
      .then((res) => res.json())
      .then((data) => setbooks(data));
  }, []);
  return (
    <div className="mt-28 px-4 lg:px-24">
      <h2 className="text-5xl font-bold text-center">All books are Here</h2>
      <div className="grid gap-8 my-12 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
        {books.map((book) => (
          <Card className="max-w-sm">
            <img src={book.imgURL} alt="" className="h-96" />
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              <p>{book.title}</p>
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Author{book.author}
            </p>
            <h5 className="text-1xl">Rating {book.rating}</h5>

            <button className="bg-blue-700 font-semibold py-2 text-white rounded m-3">Buy Now</button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Shop;
