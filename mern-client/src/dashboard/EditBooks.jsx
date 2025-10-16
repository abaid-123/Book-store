import React, { useState, useEffect } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';
import { Label, TextInput } from 'flowbite-react';

const EditBooks = () => {
  const { id } = useParams();

  // Loader data
  const {
    title: initialTitle,
    author: initialAuthor,
    imgURL: initialImgURL,
    bookpdf: initialBookpdf,
    rating: initialRating,
    genre: initialGenre,
    publishedYear: initialPublishedYear // Added the publishedYear field here
  } = useLoaderData();

  // Book categories
  const bookcategories = [
    "Fiction",
    "Non Fiction",
    "Mystery",
    "Programming",
    "Science Fiction",
    "Fantasy",
    "Horror",
    "Biography",
    "Autobiography",
    "History",
    "Self Help",
    "Business",
    "Children's Book",
    "Travel",
    "Religion",
    "Art and Design",
  ];

  // State for the form fields
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [imgURL, setImgURL] = useState('');
  const [bookpdf, setBookpdf] = useState('');
  const [rating, setRating] = useState('');
  const [publishedYear, setPublishedYear] = useState(''); // Published Year state
  const [bookcategory, setBookCategory] = useState(bookcategories[0]); // Default category

  // Set the state with initial values from useLoaderData when the component mounts
  useEffect(() => {
    setTitle(initialTitle);
    setAuthor(initialAuthor);
    setImgURL(initialImgURL);
    setBookpdf(initialBookpdf);
    setRating(initialRating);
    setPublishedYear(initialPublishedYear); // Set initial published year
    setBookCategory(initialGenre || bookcategories[0]); // Set initial genre or default category
  }, [initialTitle, initialAuthor, initialImgURL, initialBookpdf, initialRating, initialGenre, initialPublishedYear]);

  const handlechangeselectvalue = (event) => {
    setBookCategory(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent page reload
    console.log("Submit button clicked!");

    // Create book object
    const bookobj = {
      title,
      author,
      imgURL,
      bookpdf,
      rating,
      publishedYear,
      genre: bookcategory, // Include category in the book object
    };

    // Log the book object to the console
    console.log(bookobj);

    // Send book object to the backend
    fetch(`http://localhost:5000/update-book/${id}`, {
      method: 'PUT', // Use PUT for updating
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(bookobj),
    })
      .then((res) => res.json())
      .then((data) => {
        alert('Book updated successfully');
        // Optionally, clear the form here by resetting state
      })
      .catch((error) => {
        console.error('Error updating book:', error);
        alert('Error updating book.');
      });
  };

  return (
    <div className="px-4 my-12">
      <h2 className="font-bold text-3xl mb-8">Edit Book</h2>
      <form
        className="flex lg:w-[912px] flex-col flex-wrap gap-6"
        onSubmit={handleSubmit}
      >
        <div className="gap-8 flex">
          <div className="lg:w-1/2">
            <div className="mb-1 block">
              <Label htmlFor="title" value="Book Title" />
            </div>
            <TextInput
              id="title"
              name="title"
              type="text"
              placeholder="Enter Book Title"
              required
              className="py-2 px-4"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          {/* author */}
          <div className="lg:w-1/2">
            <div className="mb-1 block">
              <Label htmlFor="author" value="Author Name" />
            </div>
            <TextInput
              id="author"
              name="author"
              type="text"
              placeholder="Author Name"
              required
              className="py-2 px-4"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
        </div>

        {/* imgURL */}
        <div className="gap-8 flex">
          <div className="lg:w-1/2">
            <div className="mb-1 block">
              <Label htmlFor="imgURL" value="Image URL" />
            </div>
            <TextInput
              id="imgURL"
              name="imgURL"
              type="text"
              placeholder="Image URL"
              required
              className="py-2 px-4"
              value={imgURL}
              onChange={(e) => setImgURL(e.target.value)}
            />
          </div>
          <div className="lg:w-1/2">
            <div className="mb-1 block">
              <Label htmlFor="bookpdf" value="Book PDF URL" />
            </div>
            <TextInput
              id="bookpdf"
              name="bookpdf"
              type="text"
              placeholder="Book PDF URL"
              className="py-2 px-4"
              required
              value={bookpdf}
              onChange={(e) => setBookpdf(e.target.value)}
            />
          </div>
        </div>

        {/* Rating */}
        <div className="gap-8 flex">
          <div className="lg:w-1/2">
            <div className="mb-1 block">
              <Label htmlFor="rating" value="Rating" />
            </div>
            <TextInput
              id="rating"
              name="rating"
              type="number"
              placeholder="Rate it"
              required
              className="py-2 px-4"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            />
          </div>

          {/* Published Year */}
          <div className="lg:w-1/2">
            <div className="mb-1 block">
              <Label htmlFor="publishedYear" value="Published Year" />
            </div>
            <TextInput
              id="publishedYear"
              name="publishedYear"
              type="text"
              placeholder="Published Year"
              required
              className="py-2 px-4"
              value={publishedYear}
              onChange={(e) => setPublishedYear(e.target.value)}
            />
          </div>
        </div>

        {/* Category */}
        <div className="block">
          <Label htmlFor="categoryName" value="Book Category" />
        </div>
        <select
          name="categoryName"
          id="inputstate"
          className="w-full rounded"
          value={bookcategory}
          onChange={handlechangeselectvalue}
        >
          {bookcategories.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <button
          className="mt-5 bg-teal-500 py-1 text-white rounded"
          type="submit"
        >
          Update Book
        </button>
      </form>
    </div>
  );
};

export default EditBooks;
