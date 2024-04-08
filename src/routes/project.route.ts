import express from "express";
import { authenticate } from "../helpers/token.middleware";
import { createProjectHandler, 
    getAllProjectsHandler, getFileContent,
    getProjectHandler,
   verifyUpload, shiftFiles } from "../controllers/project.controller";
import { handleUpload } from "../helpers/upload.helper";
import { createProjectReview, getFileReview } from "../controllers/review.controller";

const projectRouter = express.Router();

projectRouter.post("/create-project", authenticate, createProjectHandler);
projectRouter.post("/get-all-projects", authenticate, getAllProjectsHandler);
projectRouter.post("/get-project", authenticate, getProjectHandler)
projectRouter.post("/get-file-content", authenticate, getFileContent);

projectRouter.post("/review/project-review", authenticate, createProjectReview);
projectRouter.post("/review/check-project-review", authenticate, getFileReview);
projectRouter.post("/upload-files", authenticate, verifyUpload, handleUpload, shiftFiles);

export default projectRouter;
