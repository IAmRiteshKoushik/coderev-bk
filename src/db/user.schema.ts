import mongoose from "mongoose";
import { User, NameUpdateModel, DeleteUserModel } from "../models/user.model";

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
    deletedAt : {
        type: Date,
        required: false,
    },
    accountStatus : {
        type: Number,
        required: true,
        enum: [0, 1, 2] // Available only for Mongoose v.5^
        // 0 - Deleted, 1 - Existing, 2 - Banned
    }
});

const UserModel = mongoose.model("users", userSchema);

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

export const deleteUser = async (email: string, deleteData: DeleteUserModel)
: Promise<User | null> => {
    try {
        const deleteUser = UserModel.findOneAndUpdate(
            {
                email
            },
            deleteData,
            {
                new: true
            }
        );
        return deleteUser;
    } catch (error) {
        return null;
    }
}
