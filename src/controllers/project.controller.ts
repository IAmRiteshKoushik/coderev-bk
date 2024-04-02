import { Request, Response } from "express";
import { ErrorMessage } from "../helpers/errors.helper";
import { z } from "zod";
import { createProject, getAllProjects } from "../db/project.actions";
import { deleteSnippetById } from "../db/snippet.actions";

export const createProjectHandler = async (req: Request, res: Response) => {
    try {
        const { projectName, projectDesc, email } = req.body;
        
        // Validators
        const validName = z.string().min(3).max(32).safeParse(projectName.trim());
        const validDesc = z.string().max(320).safeParse(projectDesc.trim())
        const validEmail = z.string().email().safeParse(email.trim());
        if(!validName.success || !validDesc.success || !validEmail.success){
            res.status(403).json({
                message: ErrorMessage.InputValidationError,
            });
            return;
        }

        const confirmCreation = await createProject({
            projectName: projectName,
            description: projectDesc,
            email: email,
            fileCount: 0,
            tags: [""],
            createdAt: new Date(),
            updatedAt: new Date()
        });
        // Project creation failed
        if(confirmCreation === null){
            res.status(500).json({
                message: ErrorMessage.InternalServerError,
            });
            return;
        }
        // Redirect to project-view section if successfully
        res.status(200).json({
            projectId: confirmCreation._id,
            projectName: confirmCreation.projectName,
            projectDesc: confirmCreation.description,
            fileCount: confirmCreation.fileCount,
            tags: confirmCreation.tags,
        });

    } catch (error) {
        res.status(500).json({
            message: ErrorMessage.InternalServerError,
        });
    }
}

export const getAllProjectsHandler = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const projectData = await getAllProjects(email);
        if(projectData === null){
            res.status(200).json({
                message: "OK",
                projects: [], // Sending back empty array
                count: 0,
            });
            return;
        }
        if(projectData === false){
            res.status(500).json({
                message: ErrorMessage.InternalServerError,
            });
            return;
        }
        res.status(200).json({
            message: "OK",
            projects: projectData,
            count: projectData.length,
        });
        return;
    } catch (error) {
        res.status(500).json({
            message: ErrorMessage.InternalServerError,
        });
        return;
    }
}

export const getProjectHandler = async (req: Request, res: Response) => {
    try {
        const { email, projectId } = req.body;

        // Validators
        
    } catch (error) {
        res.status(500).json({
            message: ErrorMessage.InternalServerError,
        });
    }

}

export const editProjectHandler = async (req: Request, res: Response) => {
    try {
        // 1. 
    } catch (error) {
        res.status(500).json({
            message: ErrorMessage.InternalServerError,
        });
    }
}

export const deleteProjectHandler = async (req: Request, res: Response) => {
    try {
        // 1. Delete from database
        
        // 2. Delete from storage 
        
    } catch (error) {
        res.status(500).json({
            message: ErrorMessage.InternalServerError,
        });
    }
}

export const deleteFileHandler = async(req: Request, res: Reponse)  => {
    try {
        // 1. Delete from database 
        // 2. Delete from storage 

    } catch (error){
        res.status(500).json({
            message: ErrorMessage.InternalServerError,
        });
        return;
    }
}

export const deleteSnipHandler = async (req: Request, res: Response) => {
    try {
        const { email, snippetId } = req.body;
        const confirmDelete = await deleteSnippetById(email, snippetId);
        if(!confirmDelete){
            res.status(500).json({
                message: ErrorMessage.InternalServerError,
            });
        }
        res.send(200).json({
            message: "Snipped has been deleted."
        });
    } catch (error) {
        res.status(500).json({
            message: ErrorMessage.InternalServerError,
        });
    }
}
