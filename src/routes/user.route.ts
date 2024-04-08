import express from "express";
import {
    handleLogin, handleRegister, handleEditProfile
} from "../controllers/user.controller"

const userRouter = express.Router();

userRouter.post("/login", handleLogin);
userRouter.post("/register", handleRegister);

// userRouter.patch("/edit-profile/", authenticate, handleEditProfile);

export default userRouter;
