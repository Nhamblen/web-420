// Name: Noah Hamblen
// Date: 6/12/25
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
