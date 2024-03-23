import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required: true,
    },
    middleName : {
        type: String,
        required: false, // optional
    },
    lastName : {
        type: String,
        required: true,
    },
    username : {
        type: String,
        required: true
    },
    email : {
        type: String,
    },
    authentication : {
        password : {
            type: String,
            required: true,
        },
        salt : {
            type: String,
            select: false
        },
        sessionToken : {
            type: String,
            select: false
        },
    },
    createdAt : {
        type: Date,
        required: true
    },
    lastUpdatedAt : {
        type: Date,
        required: true,
    },
    deletedAt : {
        type: Date,
        required: false,
    },
    accountStatus : {
        type: Number,
        required: true,
        enum: [0, 1, 2] // Available only for Mongoose v.5^
                        // Allows only the values 0, 1 and 2 for the field
    }
});

// Actions
export const UserModel = mongoose.model("users", userSchema);
