import mongoose from "mongoose";

interface User {
    firstName:      string,
    lastName:       string,
    email:          string,
    password:       string,
    projectCount:   number
}

interface UserWithId {
    id:             string,
    firstName:      string,
    lastName:       string,
    email:          string,
    projectCount:   number
}

interface UserWithPasswd {

    email:      string,
    password:   string,
}

export const userSchema = new mongoose.Schema<User>({
    firstName: {
        type: String,
        requried: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
       type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    projectCount: {
        type: Number,
        required: true,
    }
});

export const UserModel = mongoose.model("users", userSchema);

export const checkUserExist = async (email: string): Promise<User | false | null> => {
    try {
        const checkUser = await UserModel.findOne({ email });
        if (!checkUser){
            return false;
        }
        const data: User = {
            firstName: checkUser.firstName,
            lastName: checkUser.lastName,
            email: checkUser.email,
            password: checkUser.password,
            projectCount: checkUser.projectCount,
        }
        return data;
    } catch (error){
        return null;
    }
}

export const createUser = async (userData: User) : Promise<UserWithId | null> => {
    try {
        const newUser = new UserModel(userData);
        await newUser.save();
        const data: UserWithId = {
            id: newUser._id.toString(),
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            projectCount: newUser.projectCount, 
            email: newUser.email,
        }
        return data;
    } catch (error) {
        return null;
    }
}

export const updateUserName = async (email: string, firstName: string, lastName: string)
: Promise<UserWithId| null | false> => {
    try {
        const updateUser = await UserModel.findOneAndUpdate(
            { email }, 
            { $set: {
                firstName: firstName,
                lastName: lastName,
            }   },
            { new: true },
        );
        if(updateUser === null){
            return false;
        }
        const data = {
            id: updateUser._id.toString(),
            firstName: updateUser.firstName,
            lastName: updateUser.lastName,
            email: updateUser.email,
            projectCount: updateUser.projectCount,
        }
        return data;
    } catch (error) {
        return false;
    }
}

export const updateProjectCount = async(email: string, increase: boolean)
: Promise<User | null | false> => {
    const count = increase ? 1 : -1;
    try {
        const projectCount = UserModel.findOneAndUpdate(
            { email }, 
            { $inc: { projectCount: count } }, 
            { new: true }
        );
        return projectCount;
    } catch (error) {
        return false;
    }
}

export const removeUser = async (email: string): Promise<boolean> => {
    try {
        const deleteConfirm = await UserModel.findOneAndDelete({ email });
        if (deleteConfirm === null){
            return false;
        }
        return true;
    } catch (err){
        return false;
    }
}
