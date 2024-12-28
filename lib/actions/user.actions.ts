import mongoose from "mongoose";
import dbConnect from "../dbConnect";
import User from "../model/user.model";
import { revalidatePath } from "next/cache";

interface Params {
    username: string,
    name: string,
    bio: string,
    pfp: string,
    path: string,
    userid: string
}

interface updateUserResponse{
    data:any;
    error?:string;
}

export async function updateUser(
    { username,
        name,
        bio,
        pfp,
        userid,
        path }: Params
): Promise<updateUserResponse> {
    console.log('Received update parameters:', { username, name, bio, pfp, userid, path });

    try {
        await dbConnect();
        console.log('Db connected in update user');
        
        await User.findOneAndUpdate(
            { userid: userid },
            {
                username: username.toLowerCase(),
                name,
                bio,
                pfp
            },
            { upsert: true }
        );
        

        console.log("user updated successfully");
        return{data: updateUser};
        
    } catch (error:any) {
        console.log("error in updateUser", error);
        return {data:null, error:error.message||"failed to update user"}
    }
}

export async function fetchUser(userid: string) {
    try {
        await dbConnect();
        const user = await User.findOne({ userid: userid })
        return user
    } catch (error) {
        console.log("Error fetching user", error);
        throw new Error("Failed to fetch user")
    }

}