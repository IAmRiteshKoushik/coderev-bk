import express from "express";
import { authenticate } from "../helpers/token.middleware";
import {
    handleLogin, handleRegister, handleEditProfile
} from "../controllers/user.controller"

const userRouter = express.Router();

// POST : @api/user/login
userRouter.post("/login", handleLogin);

// POST : @api/user/register
userRouter.post("/register", handleRegister);

// PATCH : @api/user/editProfile
userRouter.patch("/edit-profile/", authenticate, handleEditProfile);

// PATCH : @api/user/editProfile
userRouter.delete("/delete-profile/:userId", authenticate, handleEditProfile);

export default userRouter;
