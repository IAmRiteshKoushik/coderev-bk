import { NextFunction, Request, Response } from "express";
import { ErrorMessage } from "../helpers/errors.helper";
import { z } from "zod";
import { createProject, checkProjectExist, getAllProjects, 
    checkProjectExistId } from "../mongodb/projects";
import { getAllFiles, getFile } from "../mongodb/files";
import { updateProjectCount } from "../mongodb/users";
import { addFilesToStorage, createProjectStorage, readFileContent } from "../helpers/storage.helper";

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
        // Check if project already exists or not
        const projectExist = await checkProjectExist(projectName, email);
        if(projectExist){
            res.status(403).json({
                message: "Project already exists",
            });
            return;
        }
        // Project Creation
        const confirmCreation = await createProject({
            projectName:    projectName,
            description:    projectDesc,
            email:          email,
            tags:           [""],
            codeReviewARN:  "",
        });
        // Project creation failed
        if(confirmCreation === null || confirmCreation === false){
            res.status(500).json({
                message: ErrorMessage.InternalServerError,
            });
            console.log("Project creation failed");
            return;
        }
        const updateProfile = await updateProjectCount(email, true);
        const projects = await getAllProjects(email);
        if(updateProfile === false || projects === false){
            res.status(500).json({
                message: "Something went horribly wrong! Please contact the admin",
            });
            return;
        }
        await createProjectStorage(confirmCreation.id);

        // Redirect to project-view section if successfully
        res.status(200).json({
            projectCount: updateProfile?.projectCount,
            projects: projects,
        });

    } catch (error) {
        res.status(500).json({
            message: ErrorMessage.InternalServerError,
        });
    }
}

// export const addFileHandler = async (req: Request, res: Response) => {
//     try {
//         
//     } catch (error) {
//         res.status(500).json({
//             message: ErrorMessage.InternalServerError,
//         });
//         return;
//     }
// }

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

export const getFileContent = async(req: Request, res: Response) => {
    try {
        const { fileId } = req.body;
        const fileData = await getFile(fileId);
        if(!fileData){
            res.status(500).json({
                message: ErrorMessage.InternalServerError,
            });
            return;
        }
        const readFile = await readFileContent(fileData.projectId, fileData.fileName);
        if(!readFile){
            res.status(500).json({
                message: ErrorMessage.InternalServerError,
            });
            return;
        }

        res.status(200).json({
            message: "OK",
            fileId: fileData.id,
            fileName: fileData.fileName,
            reviewStatus: fileData.reviewStatus,
            reviewData: fileData.recommendations,
            fileContent: readFile,
        });
        return;
    } catch (error){
        console.log("error");
        res.status(500).json({
            message: ErrorMessage.InternalServerError,
        });
        return;
    }
}

export const getProjectHandler = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.body;
            
        const confirmGetProject = await getAllFiles(projectId);
        if(confirmGetProject === false){
            res.status(500).json({
                message: ErrorMessage.InternalServerError,
            });
            return;
        }
        let namesAndId = [];
        for(let i = 0; i < confirmGetProject.length; i++){
            namesAndId.push({
                id: confirmGetProject[i].id,
                name: confirmGetProject[i].fileName,
            });
        }
        
        res.status(200).json({
            fileData: namesAndId,
        });
        return;
        
    } catch (error) {
        res.status(500).json({
            message: ErrorMessage.InternalServerError,
        });
    }

}

// export const deleteProjectHandler = async (req: Request, res: Response) => {
//     try {
//         // 1. Delete from database
//         const { email, projectId } = req.body;
//         const confirmProjectDelete = await removeProject(email, projectId);
//         if(!confirmProjectDelete){
//             res.status(500).json({
//                 message: ErrorMessage.InternalServerError,
//             });
//             return;
//         }
//         const confirmFileDelete = await removeAllFiles(projectId);
//         if(!confirmFileDelete){
//             res.status(500).json({
//                 messaage: ErrorMessage.InternalServerError,
//             });
//             return;
//         }
//
//         // 2. Delete from storage 
//         const confirmProjectStorageClear = await clearProjectStorage(projectId);
//         if(!confirmProjectStorageClear){
//             res.status(500).json({
//                 message: ErrorMessage.InternalServerError,
//             });
//             return;
//         }
//         
//         res.status(200).json({
//             message: "Project has been deleted",
//         });
//         
//     } catch (error) {
//         res.status(500).json({
//             message: ErrorMessage.InternalServerError,
//         });
//     }
// }

// export const deleteFileHandler = async(req: Request, res: Response)  => {
//     try {
//         const { fileName, projectId } = req.body;
//
//         // 1. Delete from database 
//         const confirmFileDelete = await removeFile(projectId, fileName);
//         if(!confirmFileDelete){
//             res.status(500).json({
//                 message: ErrorMessage.InternalServerError,
//             });
//         }
//         
//         // 2. Delete from storage 
//         const confirmFileStorageClear = await clearFileStorage(projectId, fileName);
//         if(!confirmFileStorageClear){
//             res.status(500).json({
//                 message: ErrorMessage.InternalServerError,
//             });
//         }
//         
//         res.status(200).json({
//             message: "File successfully deleted",
//         });
//
//     } catch (error){
//         res.status(500).json({
//             message: ErrorMessage.InternalServerError,
//         });
//         return;
//     }
// }

export const verifyUpload = async(req: Request, res: Response, next: NextFunction) => {
    const email = req.header("X-Additional-Info-Mail");
    const projectId = req.header("X-Additional-Info-ProjectId");

    if(!email || !projectId || email === null || projectId === null){
        res.status(403).json({
            message: ErrorMessage.MissingDetails,
        });
        return;
    }

    try {
        // Check if there is a project under the particular email
        const confirmProject = await checkProjectExistId(projectId, email);

        if(confirmProject === null){
            console.log("Server error");
            res.status(500).json({
                message: ErrorMessage.InternalServerError,
            });
            return;
        }
        if(confirmProject === false){
            res.status(404).json({
                message: ErrorMessage.InputValidationError,
            });
            return;
        }
        next();
        
    } catch (error){
        res.status(500).json({
            message: ErrorMessage.InternalServerError,
        });
        return;
    }
}

export const shiftFiles = async(req: Request, res: Response) => {
    const projectId = req.header("X-Additional-Info-ProjectId");
    try {
        const confirm = await addFilesToStorage(projectId);
        // Need better error handling
        if(!confirm){
            res.status(500).json({
                message: ErrorMessage.InternalServerError,
            });
            return;
        }
        res.status(200).json({
            message: "Files have been uploaded successfully",
        });
        return;
    } catch (error){
        console.log(error);
        res.status(500).json({
            message: ErrorMessage.InternalServerError,
        });
        return;
    }
}
