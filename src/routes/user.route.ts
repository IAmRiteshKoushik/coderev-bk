import express from "express";
import { authenticate } from "../helpers/token.middleware";
import {
    handleLogin, handleRegister, handleDeleteAccount, handleEditProfile
} from "../controllers/user.controller"

const userRouter = express.Router();

// POST : @api/user/login
userRouter.post("/login", handleLogin);

// POST : @api/user/register
userRouter.post("/register", handleRegister);

// PATCH : @api/user/editProfile
userRouter.patch("/editProfile/:username", authenticate, handleDeleteAccount);

// DELETE : @api/user/deleteProfile
userRouter.delete("/deleteProfile/:userId", authenticate, handleEditProfile);


export default userRouter;
