import mongoose from "mongoose";
const userSchema =new mongoose.Schema({
    userid:{
        type:String,
        required:true,
        unique:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String
    },
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }],
    articles:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Article"
    }],
    pfp:{
        type:String
    },
    onboarded:{
        type:Boolean,
        default:false
    },
    bio:{
        type:String
    },
    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    following:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    bookmarks:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }]
})

const User = mongoose.models.User || mongoose.model("User",userSchema)
export default User;