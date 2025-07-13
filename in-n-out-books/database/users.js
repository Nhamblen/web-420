// database/users.js
const bcrypt = require("bcryptjs");

const users = [
  {
    email: "test@example.com",
    password: bcrypt.hashSync("password123", 10), // hashed password
  },
];

module.exports = users;
