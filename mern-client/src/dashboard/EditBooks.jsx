import React, { useState, useEffect } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';
import { Label, TextInput } from 'flowbite-react';
import { bookCoverUrl, uploadBookCover, apiUrl } from '../api/config';

const EditBooks = () => {
  const { id } = useParams();

  const {
    title: initialTitle,
    author: initialAuthor,
    imgURL: initialImgURL,
    bookpdf: initialBookpdf,
    rating: initialRating,
    genre: initialGenre,
    publishedYear: initialPublishedYear
  } = useLoaderData();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [imgURL, setImgURL] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [bookpdf, setBookpdf] = useState('');
  const [rating, setRating] = useState('');
  const [publishedYear, setPublishedYear] = useState('');
  const [bookcategory, setBookCategory] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitle(initialTitle);
    setAuthor(initialAuthor);
    setImgURL(initialImgURL);
    setCoverFile(null);
    setCoverPreview(bookCoverUrl(initialImgURL));
    setBookpdf(initialBookpdf);
    setRating(initialRating);
    setPublishedYear(initialPublishedYear);
    setBookCategory(initialGenre || '');
  }, [initialTitle, initialAuthor, initialImgURL, initialBookpdf, initialRating, initialGenre, initialPublishedYear]);

  const handleCoverChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setCoverFile(null);
      setCoverPreview(bookCoverUrl(imgURL));
      return;
    }
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const nextImgURL = coverFile ? await uploadBookCover(coverFile) : imgURL;
      const res = await fetch(apiUrl(`/update-book/${id}`), {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          title,
          author,
          imgURL: nextImgURL,
          bookpdf,
          rating,
          publishedYear,
          genre: bookcategory.trim(),
        }),
      });
      if (!res.ok) throw new Error('Could not update book');
      setImgURL(nextImgURL);
      setCoverFile(null);
      setCoverPreview(bookCoverUrl(nextImgURL));
      alert('Book updated successfully');
    } catch (error) {
      console.error('Error updating book:', error);
      alert(error.message || 'Error updating book.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-700">
          Catalog
        </p>
        <h2 className="text-3xl font-bold text-slate-900 mt-1">Edit book</h2>
        <p className="text-slate-500 mt-1">Update this title in the inventory.</p>
      </div>
      <form
        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 max-w-4xl flex flex-col gap-6"
        onSubmit={handleSubmit}
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
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
          <div>
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

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <div className="mb-1 block">
              <Label htmlFor="cover" value="Book cover image" />
            </div>
            {coverPreview ? (
              <img
                src={coverPreview}
                alt="Cover preview"
                className="mb-3 h-40 w-28 object-cover rounded-md border border-slate-200"
              />
            ) : null}
            <input
              id="cover"
              name="cover"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleCoverChange}
              className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-700 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-slate-900"
            />
            <p className="mt-2 text-sm text-slate-500">
              Leave empty to keep the current cover, or choose a new photo from your computer.
            </p>
          </div>
          <div>
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

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <div className="mb-1 block">
              <Label htmlFor="rating" value="Rating" />
            </div>
            <TextInput
              id="rating"
              name="rating"
              type="number"
              step="0.1"
              min="0"
              max="5"
              placeholder="e.g. 4.3"
              required
              className="py-2 px-4"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            />
          </div>
          <div>
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

        <div>
          <Label htmlFor="categoryName" value="Book Category" />
          <input
            id="categoryName"
            name="categoryName"
            value={bookcategory}
            onChange={(event) => setBookCategory(event.target.value)}
            placeholder="e.g. Fiction"
            required
            className="mt-2 w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:border-blue-600"
          />
        </div>

        <button
          className="mt-2 bg-blue-700 py-3 text-white font-semibold rounded-lg hover:bg-slate-900 disabled:opacity-60"
          type="submit"
          disabled={saving}
        >
          {saving ? "Updating..." : "Update Book"}
        </button>
      </form>
    </div>
  );
};

export default EditBooks;
