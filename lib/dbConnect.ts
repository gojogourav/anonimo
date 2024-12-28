import mongoose from "mongoose";

type dbObject = {
    isConnected?:number
}

const ConnectionObject:dbObject ={}

async function dbConnect() {
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined in environment variables.");
    }

    if (ConnectionObject.isConnected) {
        console.log("Already connected to db");
        return;
    }

    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        ConnectionObject.isConnected = connection.connections[0].readyState;
        console.log("Connected to database:", connection.connection.host);
    } catch (err) {
        console.error("Failed to connect db:", err);
        process.exit(1);
    }
}

export default dbConnect;