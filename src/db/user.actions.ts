import mongoose from "mongoose";
import { User, NameUpdateModel } from "../models/user.model";

const userSchema = new mongoose.Schema<User>({
    firstName : {
        type: String,
        required: true,
    },
    lastName : {
        type: String,
        required: true,
    },
    email : {
        type: String,
    },
    projects : {
        type: Number,
        required: true,
        default: 0 
    },
    password : {
        type: String,
        required: true,
    },
    createdAt : {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedAt : {
        type: Date,
        required: true,
        default: Date.now
    },
});

export const UserModel = mongoose.model("users", userSchema);

export const checkUserExist = async (email: string): Promise<User | null> => {
    try {
        const data = await UserModel.findOne({ email });
        return data;
    } catch (error){
        return null;
    }
}

export const createUser = async (userData: User) : Promise<User | null> => {
    try {
        const newUser = new UserModel(userData);
        await newUser.save();
        return newUser;
    } catch (error) {
        return null;
    }
}

export const updateUserName = async (email: string, updateData: NameUpdateModel)
: Promise<User | null> => {
    try {
        const updateUser = await UserModel.findOneAndUpdate(
            { 
                email 
            }, 
            updateData, 
            { 
                new: true 
            }
        );
        return updateUser;
    } catch (error) {
        return null;
    }
}

export const updateProjectCount = async(email: string, increase: boolean)
: Promise<User | null> => {
    const count = increase ? 1 : -1;
    try {
        const projectCount = UserModel.findOneAndUpdate(
            { 
                email 
            }, 
            { 
                $inc: { 
                    projects: count
                },
            }, 
            { 
                new: true 
            }
        );
        return projectCount;
    } catch (error) {
        return null;
    }
}

export const deleteUser = async (email: string): Promise<User | null> => {
    try {
        const deleteConfirm = await UserModel.findOneAndDelete({ email });
        return deleteConfirm;
    } catch (err){
        return null;
    }
}

