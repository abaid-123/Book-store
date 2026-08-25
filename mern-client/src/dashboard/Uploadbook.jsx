import React, { useEffect, useMemo, useState } from "react";
import { Label, TextInput } from "flowbite-react";
import { uploadBookCover, apiUrl } from "../api/config";

const DEFAULT_CATEGORIES = [
  "Fiction",
  "Mystery",
  "Romance",
  "Fantasy",
  "Science Fiction",
  "Thriller",
  "Non-Fiction",
  "Biography",
  "History",
  "Children",
  "Young Adult",
  "Horror",
];

const Uploadbook = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [bookpdf, setBookpdf] = useState("");
  const [rating, setRating] = useState("");
  const [publishedYear, setPublishedYear] = useState("");
  const [bookcategory, setBookCategory] = useState("");
  const [existingCategories, setExistingCategories] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(apiUrl("/all-books"))
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const names = [
          ...new Set(
            (Array.isArray(data) ? data : [])
              .map((book) => book.genre)
              .filter(Boolean)
          ),
        ];
        setExistingCategories(names);
      })
      .catch(() => setExistingCategories([]));
  }, []);

  const categories = useMemo(() => {
    const merged = [...DEFAULT_CATEGORIES, ...existingCategories];
    return [...new Set(merged)];
  }, [existingCategories]);

  const handleCoverChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setCoverFile(null);
      setCoverPreview("");
      return;
    }
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!coverFile) {
      alert("Please choose a book cover image from your computer.");
      return;
    }

    setSaving(true);
    try {
      const imgURL = await uploadBookCover(coverFile);
      const res = await fetch(apiUrl("/add-book"), {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          title,
          author,
          imgURL,
          bookpdf,
          rating,
          publishedYear,
          genre: bookcategory.trim(),
        }),
      });
      if (!res.ok) throw new Error("Could not save book");
      alert("Book uploaded successfully");
      setTitle("");
      setAuthor("");
      setCoverFile(null);
      setCoverPreview("");
      setBookpdf("");
      setRating("");
      setPublishedYear("");
      setBookCategory("");
      event.target.reset();
    } catch (error) {
      console.error("Error uploading book:", error);
      alert(error.message || "Error uploading book.");
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
        <h2 className="text-3xl font-bold text-slate-900 mt-1">Upload a book</h2>
        <p className="text-slate-500 mt-1">Add a title to the shop inventory.</p>
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

        <div>
          <Label htmlFor="categoryName" value="Book Category" />
          <div className="mt-3 flex flex-wrap gap-2">
            {categories.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setBookCategory(name)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                  bookcategory === name
                    ? "bg-blue-700 text-white border-blue-700"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-700 hover:text-blue-700"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
          <input
            id="categoryName"
            name="categoryName"
            value={bookcategory}
            onChange={(event) => setBookCategory(event.target.value)}
            placeholder="Select a category above, or type a new one"
            required
            className="mt-3 w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:border-blue-600"
          />
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
              required
              onChange={handleCoverChange}
              className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-700 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-slate-900"
            />
            <p className="mt-2 text-sm text-slate-500">
              Choose a photo from your computer (JPG, PNG, WEBP, or GIF).
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

        <button
          className="mt-2 bg-blue-700 py-3 text-white font-semibold rounded-lg hover:bg-slate-900 disabled:opacity-60"
          type="submit"
          disabled={saving}
        >
          {saving ? "Uploading..." : "Upload Book"}
        </button>
      </form>
    </div>
  );
};

export default Uploadbook;
