// Name: Noah Hamblen
// Date: 6/12/25
// File name: app.js
// Description: Includes API, landing page, error handling, and exports

// Module imports
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const books = require("../database/books.js");

// Express app
const app = express();
app.use(express.json());
app.use(bodyParser.json());

// Landing page with CSS included (GET route for root "/")
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>In-N-Out-Books</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
        }
        header {
          background:rgb(168, 186, 207);
          color: white;
          padding: 1em;
          text-align: center;
        }
    </style>
    </head>
    <body>
      <header>
        <h1>Welcome to In-N-Out-Books</h1>
        <p>Your library management system</p>
      </header>

      <main>
        <p> In-N-Out-Books is your personal gateway to organizing, tracking, and celebrating your love of reading. Whether you're an avid reader, or part of a book club, this platform gives you the tools to keep your books in order. </p>

        <section>
          <h2>Top Selling Books</h2>
          <ul>
            <li><strong>The Pragmatic Programmer</strong> by Andrew Hunt & David Thomas</li>
            <li><strong>Clean Code</strong> by Robert C. Martin</li>
            <li><strong>You Don’t Know JS</strong> by Kyle Simpson</li>
          </ul>
        </section>

        <section>
          <h2>Hours of Operation</h2>
          <p>Monday - Friday: 10 AM - 6 PM</p>
          <p>Saturday: 10 AM - 4 PM</p>
          <p>Sunday: Closed</p>
        </section>

        <section>
          <h2>Contact Information</h2>
          <p>Email: contact@in-n-out-books.com</p>
          <p>Phone: (123) 123-4567</p>
        </section>
      </main>

      <footer>
        <p>&copy; 2025 In-N-Out-Books. All rights reserved.</p>
      </footer>
    </body>
    </html>
  `);
});

///////////////////////////////////////////////////////////////////////////////////////////
// Week 4 assignment below this line
// GET all books
app.get("/api/books", async (req, res) => {
  try {
    // Attempt to retrieve all books from the collection using the async find() method
    const allBooks = await books.find(); // Await the Promise
    // If successful, respond with a 200 OK and send the array of books as JSON
    res.status(200).json(allBooks);
  } catch (err) {
    // Catch any unexpected server errors and respond with a 500 status
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET book by ID
app.get("/api/books/:id", async (req, res) => {
  try {
    // Convert the URL parameter to a number
    const id = Number(req.params.id);
    if (isNaN(id)) {
      // If id is not a valid number, return a 400 Bad Request
      return res.status(400).json({ error: "Invalid book ID" });
    }

    // Attempt to find a single book matching the given ID
    const book = await books.findOne({ id }); // Await the Promise
    // If found, respond with the book data and 200 OK
    res.status(200).json(book);
  } catch (err) {
    // If the error was due to no match found, return a 404 Not Found
    if (err.message === "No matching item found") {
      return res.status(404).json({ error: "Book not found" });
    }

    // Otherwise, return a 500 Internal Server Error
    res.status(500).json({ error: "Internal Server Error" });
  }
});
////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
// Week 5 assignment below this line
app.post("/api/books", (req, res) => {
  try {
    const { id, title, author } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required." });
    }
    const book = { id, title, author };
    books.insertOne(book); // using the Collection instance method
    res.status(201).json(book);
  } catch (error) {
    console.error("POST /api/books error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.delete("/api/books/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    books.deleteOne({ id }); // match object with { id }
    res.sendStatus(204);
  } catch (error) {
    console.error("DELETE /api/books error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
////////////////////////////////////////////////////////////////////////////////////////////

// Route to trigger a manual error for testing 500 error handling
app.get("/error", (req, res, next) => {
  next(new Error("Test error"));
});

// 404 Error Middleware
app.use((req, res, next) => {
  res.status(404).send("404 - Page Not Found");
});

// 500 Error Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    ...(req.app.get("env") === "development" && { stack: err.stack }),
  });
});

// Export the app
module.exports = app;
