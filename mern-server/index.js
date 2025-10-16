const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose"); // Import mongoose
const { ObjectId } = require("mongodb"); // Import ObjectId
const db = require("./config/connection"); // Import the db connection

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

db(); // Call the database connection function

// Home route
app.get("/", (req, res) => {
  res.send("Hello world!");
});

// Add a new book
app.post("/add-book", async (req, res) => {
  try {
    const newBook = req.body;
    const result = await mongoose.connection.db
      .collection("books")
      .insertOne(newBook);

    // Send a proper response
    res.status(201).json({
      message: "Book added successfully",
      bookId: result.insertedId,
    });
  } catch (error) {
    // Handle any errors
    res.status(500).json({
      message: "An error occurred while adding the book",
      error: error.message,
    });
  }
});

// Get all books
app.get("/all-books", async (req, res) => {
  try {
    const books = await mongoose.connection.db
      .collection("books")
      .find()
      .toArray();

    // Send the retrieved books as the response
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while fetching the books",
      error: error.message,
    });
  }
});

// Update book details
app.put("/update-book/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    const updatedFields = req.body;

    const result = await mongoose.connection.db.collection("books").updateOne(
      { _id: new ObjectId(bookId) }, // Correct use of ObjectId
      { $set: updatedFields }
    );

    res.status(200).json({
      message: "Book updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while updating the book",
      error: error.message,
    });
  }
});

// Delete a book
app.delete("/delete-book/:id", async (req, res) => {
  try {
    const bookId = req.params.id;

    const result = await mongoose.connection.db
      .collection("books")
      .deleteOne({
        _id: new ObjectId(bookId), // Ensure correct ObjectId usage
      });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while deleting the book",
      error: error.message,
    });
  }
});

// Get a specific book by ID
app.get("/book/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Validate if the ID is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const result = await mongoose.connection.db
      .collection("books")
      .findOne({ _id: new ObjectId(id) });

    if (!result) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while fetching the book",
      error: error.message,
    });
  }
});

// Listen to the port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});