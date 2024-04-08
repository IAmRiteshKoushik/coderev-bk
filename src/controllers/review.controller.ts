import { Request, Response } from "express";
import { ErrorMessage } from "../helpers/errors.helper";
import { getFile, getFileWithNoReview, updateReviewStatus } from "../mongodb/files";
import { uploadToS3 } from "../services/s3.service";
import { deleteZip, readFileContent, specialZip } from "../helpers/storage.helper";
import { checkCodeReviewStatus, getRecommendations, initiateCodeReview } from "../services/codeGuru.service";
import { getProject } from "../mongodb/projects";


export const createProjectReview = async(req: Request, res: Response) => {
    try {
        const { projectId } = req.body;
        await deleteZip(projectId); // Delete any zip if it exists
        await specialZip(projectId);
        const uploadConfirm = await uploadToS3(projectId);
        if(!uploadConfirm){
            console.log("Upload to s3 failed");
            res.status(500).json({
                message: ErrorMessage.InternalServerError,
            });
            return;
        }
        const reviewConfirm = await initiateCodeReview(projectId);
        if(!reviewConfirm){
            return;
        }
        const updateDB = await updateReviewStatus(projectId, "pending");
        if(!updateDB){
            console.log("DB Updation failed")
            res.status(500).json({
                message: ErrorMessage.InternalServerError,
            });
            return;
        }
        res.status(200).json({
            message: "Review is being generated.",
        });
        return;
    } catch (error) {
        res.status(500).json({
            message: ErrorMessage.InternalServerError,
        });
        return;
    }
}

export const getFileReview = async(req: Request, res: Response) => {
    console.log("We are here");
    try {
        const { fileId, email, projectId, reviewStatus } = req.body;

        if(reviewStatus === "pending"){
            const fetchingProjectData = await getProject(email, projectId);
            if(!fetchingProjectData){
                return;
            }
            const arn = fetchingProjectData.codeReviewARN;
            const response = await checkCodeReviewStatus(arn);
            if(response === "pending"){
                res.status(200).json({
                    message: "Review is still pending",
                });
                return;
            }
            // Populate all the records with recommendations
            if(response === "completed"){
                const list = await getRecommendations(projectId, arn);
                // Get data for the current file
                const confirmGetFile = await getFile(fileId);
                console.log(confirmGetFile);
                if(confirmGetFile === false){
                    res.status(500).json({
                        message: ErrorMessage.InternalServerError,
                    });
                    return;
                }
                // If fileData is fetched successfully - get the content from storage
                const fileName = confirmGetFile.fileName;
                const confirmGetFileContent = await readFileContent(projectId, fileName); 

                if(!confirmGetFileContent) {
                    res.status(500).json({
                        message: ErrorMessage.InternalServerError,
                    });
                    return;
                }

                res.status(200).json({
                    message:            "OK",
                    fileId:             confirmGetFile.id,
                    projectId:          projectId,
                    fileName:           fileName,
                    fileContent:        confirmGetFileContent,
                    fileReviewContent:  confirmGetFile.recommendations,
                    reviewStatus:       confirmGetFile.reviewStatus,
                });
            }
        }
        return;

    } catch (error) {
        res.status(500).json({
            message: ErrorMessage.InternalServerError,
        });
        return;
    }
}
