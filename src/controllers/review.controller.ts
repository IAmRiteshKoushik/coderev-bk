import { Request, Response } from "express";
import { ErrorMessage } from "../helpers/errors.helper";
import { getFile } from "../mongodb/files";
import { uploadToS3 } from "../services/s3.service";


export const createProjectReview = async(req: Request, res: Response) => {
    try {
        const { projectId } = req.body;
        const fileList = await getFileWithNoReview(projectId);
        if(fileList === false){
            res.status(500).json({
                message: ErrorMessage.InternalServerError,
            });
            return;
        }
        if(fileList.length === 0){
            res.status(400).json({
                message: "All files have reviews",
            });
            return;
        }
        // Update the review status of all files which are under review
        // Send files to s3
        const uploadConfirm = uploadToS3();
        //
        const reviewConfirm = 

        res.status(200).json({
            message: "Review is being generated.",
            projectData: projectData,
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
    try {
        const { fileId, reviewStatus } = req.body;
        const confirmGetFile = await getFile(fileId);
        if(confirmGetFile === false){
            res.status(500).json({
                message: ErrorMessage.InternalServerError,
            });
            return;
        }
        // If fileData is fetched successfully - get the content from storage
        const projectId = confirmGetFile.projectId;
        const fileName = confirmGetFile.fileName;
        const confirmGetFileContent = await getFileContent(projectId, fileName); 

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
            fileContent:        confirmGetFileContent.content,
            fileReviewContent:  confirmGetFile.recommendations,
            reviewStatus:       confirmGetFile.reviewStatus,
        });
        return;

    } catch (error) {
        res.status(500).json({
            message: ErrorMessage.InternalServerError,
        });
        return;
    }
}
