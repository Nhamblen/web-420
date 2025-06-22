// Name: Noah Hamblen
// Date: 6/12/25
// File name: app.js
// Description: Includes API, landing page, error handling, and exports

// Module imports
const express = require("express");
const path = require("path");

// Express app
const app = express();

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

// Week 4 assignment below this line

// Export the app
module.exports = app;
