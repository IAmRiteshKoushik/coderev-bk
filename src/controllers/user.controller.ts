import { Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import { checkUserExist, createUser, 
    deleteUser, updateUserName } from "../db/user.actions";
import { getAllProjects } from "../db/project.actions";
import { newToken } from "../helpers/token.generate";
import { ErrorMessage } from "../helpers/errors.helper";


export const handleLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Validator
    const validEmail = z.string().email().safeParse(email);
    if(!validEmail.success || !password){
        res.status(400).json({
            message: ErrorMessage.MissingDetails,
        });
        return;
    }

    try {
        // Check for user existance and account status
        // 0 : Existing User, 1 : Banned User
        const user = await checkUserExist(email);
        if (!user){
            res.send(401).json({
                message: "Invalid username or password."
            });
            return;
        }

        // Compare password
        const hashedPassword = await bcrypt.hash(password, 10);
        const passwordCheck = await bcrypt.compare(hashedPassword, user.password);
        if (!passwordCheck){
            res.status(401).json({
                message: "Invalid username or password."
            });
            return;
        }

        // Get details from database regarding projects and generate JwtPayload
        const projects = await getAllProjects(email);
        const claims = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        }

        // Send back details + projects + TOKEN
        res.status(200).json({
            message: "Successful Login.",
            SECRET_TOKEN: newToken(claims, 2),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            projectCount: user.projects,
            projectData: projects,
        });
        return;
    } catch (error){
        res.status(500).json({
            message: ErrorMessage.InternalServerError,
        });
        return;
    }
}

export const handleRegister = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        
        // Validators
        const validFName = z.string().min(1).max(50).safeParse(firstName.trim());
        const validLName = z.string().min(1).max(50).safeParse(lastName.trim());
        const validEmail = z.string().email().safeParse(email.trim());
        if (!validFName.success || !validLName.success || !validEmail.success){
            res.status(403).json({
                message: ErrorMessage.InputValidationError,
            });
            return;
        }

        // IMP : Check if user exists beforing registering
        // Alt : Using the uniqueness of email, had to rely on database 
        // error handling to check if user exists or not
        // Taking simpler approach for now!
        const checkUser = await checkUserExist(email);
        if(checkUser){
            res.status(403).json({
                message: "User already exists."
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUserConfirm = await createUser({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            projects: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        if (newUserConfirm === null){
            res.send(500).json({
                message: ErrorMessage.InternalServerError,
            });
            return;
        }
        res.send(200).json({
            message: "Account Created Successfully!"
        });
        return;
    } catch (error) {
        res.status(500).json({
            message: ErrorMessage.InternalServerError,
        });
        return;
    }
}

export const handleDeleteAccount = async (req: Request, res: Response) => {
    console.log("This route does not work yet!");
    try {
        const { email } = req.body;

        // Validator
        const validEmail = z.string().email().safeParse(email.trim());
        if(!validEmail.success){
            res.send(403).json({
                message: ErrorMessage.InputValidationError,
            });
            return;
        }

        const confirmDelete = await deleteUser(email);
        if(!confirmDelete){
            res.send(500).json({
                message: ErrorMessage.InternalServerError,
            });
            return;
        }
        res.send(200).json({
            message: "Account closed!",
        });
        return;

    } catch (error){
        res.status(500).json({
            message: ErrorMessage.InternalServerError,
        });
        return;
    }
}

export const handleEditProfile = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email } = req.body;

        // Validator
        const validFName = z.string().min(1).max(50).safeParse(firstName.trim());
        const validLName = z.string().min(1).max(50).safeParse(lastName.trim());
        const validEmail = z.string().email().safeParse(email.trim());
        if(!validFName.success || !validLName.success || !validEmail.success){
            res.send(403).json({
                message: ErrorMessage.InputValidationError,
            });
            return;
        }

        const editConfirm = await updateUserName(email, {
            firstName: firstName, 
            lastName: lastName, 
            updatedAt: new Date()
        });

        if(!editConfirm){
            res.status(500).json({
                message: ErrorMessage.InternalServerError,
            });
            return;
        }
        res.status(200).json({
            message: "Profile updated successfully!",
            firstName: editConfirm.firstName,
            lastName: editConfirm.lastName,
        });
        return;

    } catch (error){
        res.status(500).json({
            message: ErrorMessage.InternalServerError,
        });
        return;
    }
}

