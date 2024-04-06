import express from "express";
import { authenticate } from "../helpers/token.middleware";
import {
    handleLogin, handleRegister, handleEditProfile
} from "../controllers/user.controller"

const userRouter = express.Router();

userRouter.post("/login", handleLogin);
userRouter.post("/register", handleRegister);
userRouter.patch("/edit-profile/", authenticate, handleEditProfile);
userRouter.delete("/delete-profile", authenticate, handleEditProfile);

export default userRouter;
