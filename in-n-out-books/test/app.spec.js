// Name: Noah Hamblen
// Date: 6/26/25
// File name: app.spec.js
// Description: Jest testing

// app.spec.js
const request = require("supertest");
const app = require("../src/app.js");

// Group related tests
describe("In-N-Out-Books Server", () => {
  // Test: Verify GET / returns the landing page HTML
  test("GET / should return landing page HTML", async () => {
    const res = await request(app).get("/"); // Make GET request to root URL "/"
    expect(res.statusCode).toBe(200); // Expect HTTP status code 200 (OK)
    expect(res.text).toContain("Welcome to In-N-Out-Books"); // Expect the response text to include the welcome message in the landing page
  });

  // Test: Verify that a nonexistent route returns 404 error
  test("GET /nonexistent should return 404", async () => {
    const res = await request(app).get("/nonexistent"); // Make GET request to a URL that doesn't exist
    expect(res.statusCode).toBe(404); // Expect HTTP status code 404 (Not Found)
    expect(res.text).toContain("404"); // Expect the response text to contain "404" (indicating a 404 page)
  });

  // Test: Verify GET /error triggers a 500 Internal Server Error response
  test("GET /error should return 500 JSON", async () => {
    // Add a route to the app to intentionally throw an error for testing
    app.get("/error", () => {
      throw new Error("Test error");
    });

    const res = await request(app).get("/error"); // Make GET request to /error route
    expect(res.statusCode).toBe(500); // Expect HTTP status code 500 (Internal Server Error)
    expect(res.body.message).toBe("Internal Server Error"); // Expect the JSON response to have the message "Internal Server Error"
  });
});

describe("Chapter 3 API Tests", () => {
  // Test: Should return an array of all books
  test("Should return an array of books", async () => {
    const res = await request(app).get("/api/books");
    expect(res.statusCode).toBe(200); // Expect a 200 OK response
    expect(res.body).toBeInstanceOf(Array); // Expect the response body to be an array
    expect(res.body[0]).toHaveProperty("id"); // Expect the first item in the array to have an 'id' property
  });

  // Test: Should return a single book by ID
  test("Should return a single book", async () => {
    const res = await request(app).get("/api/books/1"); // GET book with ID = 1
    expect(res.statusCode).toBe(200); // Expect a 200 OK response
    expect(res.body).toHaveProperty("title"); // Expect the returned object to have a 'title' property
    expect(res.body.id).toBe(1); // Expect the ID of the returned book to be 1
  });

  // Test: Should return a 400 Bad Request if ID is not a number
  test("Should return a 400 error if the id is not a number", async () => {
    const res = await request(app).get("/api/books/abc"); // GET with invalid ID
    expect(res.statusCode).toBe(400); // Expect a 400 Bad Request status code
    expect(res.body).toEqual({ error: "Invalid book ID" }); // Expect a descriptive error message
  });
});

describe("Chapter 4 API Tests", () => {
  // Test: Add a new book
  test("Should return a 201-status code when adding a new book", async () => {
    // Send a POST request to /api/books with a valid book object
    const response = await request(app)
      .post("/api/books")
      .send({ id: "1", title: "Test Book", author: "Tester" });

    // Expect a 201 Created response
    expect(response.statusCode).toBe(201);

    // Expect the response body to contain the correct title
    expect(response.body).toHaveProperty("title", "Test Book");
  });

  // Test: Add a new book with missing title
  test("Should return a 400-status code when adding a new book with missing title", async () => {
    // Send a POST request without a title field
    const response = await request(app)
      .post("/api/books")
      .send({ id: "2", author: "NoTitle" });

    // Expect a 400 Bad Request response
    expect(response.statusCode).toBe(400);

    // Expect the error message to indicate that the title is required
    expect(response.body).toHaveProperty("message", "Title is required.");
  });

  // Test: Delete a book
  test("Should return a 204-status code when deleting a book", async () => {
    // First add a book
    await request(app)
      .post("/api/books")
      .send({ id: "3", title: "Delete", author: "Author" });

    // Send a DELETE request to remove the book
    const response = await request(app).delete("/api/books/3");

    // Expect a 204 No Content response, indicating successful deletion
    expect(response.statusCode).toBe(204);
  });
});

describe("Chapter 5: API Tests", () => {
  // Test: Update a book
  test("Should update a book and return a 204-status code", async () => {
    const response = await request(app)
      .put("/api/books/1") // PUT request to update book with ID 1
      .send({ title: "Updated Title", author: "Updated Author" }); // Sending updated data

    // Expect a successful update with 204 status and no response body
    expect(response.statusCode).toEqual(204);
  });

  // Test: Update a book without an ID (error)
  test("Should return a 400-status code when using a non-numeric id", async () => {
    const response = await request(app)
      .put("/api/books/hi") // Non-numeric ID in the request
      .send({ title: "Invalid ID", author: "Author" });

    // Expect a 400 Bad Request with a specific error message
    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toEqual("Input must be a number");
  });

  // Test: Update a book without a title (error)
  test("Should return a 400-status code when updating a book with a missing title", async () => {
    const response = await request(app)
      .put("/api/books/1") // Valid book ID
      .send({ author: "Author Only" }); // Missing title

    // Expect a 400 Bad Request with a specific error message
    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toEqual("Input must include a title");
  });
});

describe("Chapter 6: API Tests", () => {
  // Test: Log user in
  test("Should log a user in and return 200 with ‘Authentication successful’", async () => {
    const response = await request(app)
      .post("/api/login") // POST request to /api/login
      .send({ email: "test@example.com", password: "password123" }); // Valid credentials

    // Status code and response message
    expect(response.statusCode).toEqual(200);
    expect(response.body.message).toEqual("Authentication successful");
  });

  // Test: Log user in with invalid credentials (error)
  test("Should return 401 with ‘Unauthorized’ when credentials are incorrect", async () => {
    const response = await request(app)
      .post("/api/login") // Same endpoint
      .send({ email: "test@example.com", password: "wrongpassword" }); // Incorrect password

    // 401 Unauthorized response
    expect(response.statusCode).toEqual(401);
    expect(response.body.message).toEqual("Unauthorized");
  });

  // Test: Log user in with missing password (error)
  test("Should return 400 with ‘Bad Request’ when email or password is missing", async () => {
    const response = await request(app)
      .post("/api/login")
      .send({ email: "test@example.com" }); // No password

    // 400 Bad Request response
    expect(response.statusCode).toEqual(400);
    expect(response.body.message).toEqual(
      "Bad Request: Missing email or password"
    );
  });
});

describe("Chapter 7: API Tests", () => {
  const validAnswers = [{ answer: "Blue" }, { answer: "Omaha" }];

  const invalidAnswers = [{ wrongKey: "Wrong" }];

  test("Should return 200 with success message when security questions are correct", async () => {
    const res = await request(app)
      .post("/api/users/testuser@example.com/verify-security-question")
      .send(validAnswers);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Security questions successfully answered");
  });

  test("Should return 400 with Bad Request message when body fails validation", async () => {
    const res = await request(app)
      .post("/api/users/testuser@example.com/verify-security-question")
      .send(invalidAnswers);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Bad Request");
  });

  test("Should return 401 with Unauthorized message when answers are incorrect", async () => {
    const res = await request(app)
      .post("/api/users/testuser@example.com/verify-security-question")
      .send([{ answer: "Wrong" }, { answer: "Answers" }]);
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Unauthorized");
  });
});
