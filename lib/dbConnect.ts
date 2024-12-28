"use server"
import mongoose from "mongoose";

let isConnected = false;

const dbConnect = async () => {
    if (isConnected) return;
    console.log(process.env.MONGODB_URI);
    

    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined in environment variables.");
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
        });
        isConnected = true;
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
};

export default dbConnect;
