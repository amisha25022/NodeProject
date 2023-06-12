import pkg from 'mongoose';
//const { connect } = pkg;
//const mongoose = require("mongoose");
import mongoose from "mongoose";


const MONGO_URI = process.env.MONGO_URI;
console.log("ps21",process.env.MONGO_URI); 

export const connect = () => {
    // Connecting to the database
    mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
      })
      .then(() => {
        console.log("Successfully connected to database");
      })
      .catch((error) => {
        console.log("database connection failed. exiting now...");
        console.error(error);
        process.exit(1);
      });
  };