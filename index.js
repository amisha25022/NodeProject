import { createServer } from "http";
import app from "./app.js";
const server = createServer(app);

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

// server listening 
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});





































// Import necessary modules and dependencies
// import express from 'express';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

// // Create Express app
// const app = express();
// app.use(express.json());

// // Sample user data (for demo purposes)
// let users = [];

// // User registration endpoint
// app.post('/register', (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     // Check if the username or email is already taken
//     const existingUser = users.find(
//       (user) => user.username === username || user.email === email
//     );
//     if (existingUser) {
//       return res.status(400).json({ message: 'Username or email already exists' });
//     }

//     // Hash and salt the password
//     const salt = bcrypt.genSaltSync(10);
//     const hashedPassword = bcrypt.hashSync(password, salt);

//     // Create a new user
//     const user = { id: users.length + 1, username, email, password: hashedPassword };
//     users.push(user);

//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// // User login endpoint
// app.post('/login', (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // Find the user based on the username
//     const user = users.find((user) => user.username === username);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Compare the provided password with the stored hashed password
//     const passwordMatch = bcrypt.compareSync(password, user.password);
//     if (!passwordMatch) {
//       return res.status(401).json({ message: 'Invalid password' });
//     }

//     // Generate a JWT token
//     const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });

//     res.status(200).json({ token });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// // Start the server
// app.listen(3000, () => {
//   console.log('Server started on port 3000');
// });
