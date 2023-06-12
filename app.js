import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
dotenv.config();
import { connect} from './config/database.js';
connect();
import express, { json } from "express";
// importing user context
import User from "./model/user.js";
import {verifyToken} from "./middleware/auth.js";
// import verifyToken from "./middleware/auth.js";


const app = express();
app.use(json());


// Register
app.post("/register", async (req, res) => {
    try {
        // Get user input
        const { first_name, last_name, email, password } = req.body;
    
        // Validate user input
        if (!(email && password && first_name && last_name)) {
          res.status(400).send("All input is required");
        }
    
        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({ email });
    
        if (oldUser) {
          return res.status(409).send("User Already Exist. Please Login");
        }
    
        //Encrypt user password
       const encryptedPassword = await bcrypt.hash(password, 10);
    
        // Create user in our database
        const user = await User.create({
            first_name,
        last_name,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedPassword,
        });

        // Create token
        const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
            expiresIn: "2h",
        }
        );
        // save user token
        user.token = token;

        // return new user
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
    }
});

// Login
app.post("/login", async (req, res) => {
    try {
        // Get user input
        const { email, password } = req.body;
    
        // Validate user input
        if (!(email && password)) {
          res.status(400).send("All input is required");
        }
        // Validate if user exist in our database
        const user = await User.findOne({ email });
    
        if (user && bcrypt.compare(password, user.password)) {
          // Create token
          const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
              expiresIn: "2h",
            }
          );
    
          // save user token
          user.token = token;
    
          // user
          res.status(200).json(user);
        }
        res.status(400).send("Invalid Credentials");
      } catch (err) {
        console.log(err);
      }
});
app.post("/welcome", verifyToken, (req, res) => {
    res.status(200).send("Welcome 🙌 ");
  });

// Logic goes here

export default app;