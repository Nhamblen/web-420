/**
 * Author: Noah Hamblen
 * Date: 7/12/2025
 * File Name: users.js
 * Description: Users collection file
 */

const bcrypt = require("bcryptjs"); // Import bcryptjs to hash passwords

// Static array simulating a user collection with one predefined user
const users = [
  {
    email: "test@example.com",
    password: bcrypt.hashSync("password123", 10), // hashed password
    securityQuestions: [
      { question: "What is your favorite color?", answer: "Blue" },
      { question: "What city were you born in?", answer: "Omaha" },
    ],
  },
];

// Export the users array so it can be imported in other modules
module.exports = users;
