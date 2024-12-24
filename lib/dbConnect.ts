import mongoose from "mongoose";
type dbObject = {
    isConnected?:number
}

const ConnectionObject:dbObject ={}

async function dbConnect() {
    if(ConnectionObject.isConnected){
        console.log("Already connected to db");
        return;
    }
    try{
        const Connetion = await mongoose.connect(process.env.MONGODB_URI||"")
        ConnectionObject.isConnected = Connetion.connections[0].readyState
    }catch(err){
        console.error("Failed to connect db - ",err);
        process.exit(1)
    }

}
export default dbConnect;