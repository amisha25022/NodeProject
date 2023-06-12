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
import mongoose from "mongoose";



const app = express();
app.use(json());

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  }
  
});

const Product = mongoose.model('Product', productSchema);
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


// Product Listing and Search
app.post("/sell-product", verifyToken, (req, res) => {
 
  const { title, price } = req.body;
  const product = new Product({ title, price});

  product.save()
    .then(() => {
      res.status(201).json({ message: 'Product listed successfully' });
    })
    .catch((error) => {
        console.log(error);
      res.status(400).json({ error: 'Failed to list product' });
    });
});

app.get("/buy-product",verifyToken, (req, res) => {
  const { title } = req.query;
  const regex = new RegExp(title, 'i');
  console.log(req.query);
  
  Product.find({ title: regex })
    .then((products) => {
      // Fetch products matching the title
      // Send the products in the response
      res.json(products);

      // Delete the matching products from the database
      Product.deleteOne({ title: regex })
        .then(() => {
          console.log("Products deleted successfully");
        })
        .catch((error) => {
          console.log("Failed to delete products:", error);
        });
    })
    .catch((error) => {
      res.status(400).json({ error: 'Failed to fetch products' });
    });
});


export default app;