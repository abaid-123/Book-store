import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ManageBook = () => {
  const [allbook, setallbook] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/all-books")
      .then((res) => res.json())
      .then((data) => setallbook(data));
  });
  const handledelete=(id)=>{
    console.log(id);
    fetch(`http://localhost:5000/delete-book/${id}`,{
      method:"DELETE",

    }).then(res=>res.json()).then(data=> alert("Book Deleted successfuly"))
  }

  return (
    <div className="px-4 my-12 overflow-auto h-screen">
      <h2 className="font-bold text-3xl mb-8">Manage Your Books</h2>
      <table className="min-w-full lg:w-[920px] bg-white border border-gray-300 
        hover:bg-g">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b border-gray-300">No.</th>
            <th className="py-2 px-4 border-b border-gray-300">Book Name</th>
            <th className="py-2 px-4 border-b border-gray-300">Author</th>
            <th className="py-2 px-4 border-b border-gray-300">Category</th>
            <th className="py-2 px-4 border-b border-gray-300">Rating</th>

            <th className="py-2 px-4 border-b border-gray-300">
              <span>Edit</span>
            </th>
          </tr>
        </thead>
        {allbook.map((book, index) => (
          <tbody key={book._id}>
            <tr className="border-b border-gray-300">
              <td className="py-2 px-4">{index + 1}</td>
              <td className="py-2 px-4">{book.title}</td>
              <td className="py-2 px-4">{book.author}</td>
              <td className="py-2 px-4">{book.genre}</td>
              <td className="py-2 px-4">{book.rating}</td>
              <td className="py-2 px-4">
                <Link
                  to={`/admin/dashboard/edit-books/${book._id}`}
                  className="text-cyan-600 hover:underline dark:text-cyan-500 mr-5"
                >
                  Edit
                </Link>
                <button onClick={()=> handledelete(book._id) }
                  className="bg-sky-600 px-4 py-1 font-semibold text-white 
                  rounded-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  );
};

export default ManageBook;
