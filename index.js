import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

const app = express();
dotenv.config();

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log('Connected to mongoDB_2.');
        
      } catch (error) {
        throw error;
    }
};


app.listen(8080, () =>{
    connect();
    console.log('Connected to backend!');
    
})