import { Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import { newToken } from "../helpers/token.generate";
import { ErrorMessage } from "../helpers/errors.helper";
import { createUser, checkUserExist, removeUser, updateUserName } from "../mongodb/users";
import { getAllProjects, removeAllProjects } from "../mongodb/projects";
import { removeAllFiles } from "../mongodb/files";
import { removeProjectFromStorage } from "../helpers/storage.helper";

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
            res.status(401).json({
                message: "Invalid username or password."
            });
            return;
        }

        // Compare password
        const passwordCheck = await bcrypt.compare(password, user.password);
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
            projectCount: user.projectCount,
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
            projectCount: 0,
        });
        if (newUserConfirm === null){
            res.status(500).json({
                message: ErrorMessage.InternalServerError,
            });
            return;
        }

        res.status(200).json({
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

        // 1. Remove user from DB
        const confirmDeleteUser = await removeUser(email);
        if(!confirmDeleteUser){
            res.status(500).json({
                message: ErrorMessage.InternalServerError,
            });
            return;
        }
        // 2. Remove all projects from DB after getting the data
        const confirmGetProjects = await getAllProjects(email);
        if(confirmGetProjects === false){
            res.status(500).json({
                message: ErrorMessage.InternalServerError,
            });
            return;
        }
            // An account which does not have any projects
        if(confirmGetProjects.length === 0){
            res.status(200).json({
                message: "Account has been successfully deleted",
            });
            return;
        }
            // An account with projects
        const confirmDeleteProjects = await removeAllProjects(email);
        if(!confirmDeleteProjects){
            res.status(500).json({
                message: ErrorMessage.InternalServerError,
            })
        }

        // 3. Remove all files from DB and project from storage
        for(let i: number = 0; i < confirmGetProjects.length; i++){
            const projectId = confirmGetProjects[i].id;
            await removeAllFiles(projectId);
            await removeProjectFromStorage(projectId);
        }

        // If all operations are successful
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

        const editConfirm = await updateUserName(email, firstName, lastName);

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

