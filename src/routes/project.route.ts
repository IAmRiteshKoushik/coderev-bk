import express from "express";
import { authenticate } from "../helpers/token.middleware";
import { createProjectHandler, deleteProjectHandler, 
    // editProjectHandler, 
    getAllProjectsHandler, 
    deleteFileHandler, 
    getProjectHandler,
   verifyUpload } from "../controllers/project.controller";
import { handleUpload } from "../helpers/upload.helper";
import { createProjectReview } from "../controllers/review.controller";

const projectRouter = express.Router();

projectRouter.post("/create-project", authenticate, createProjectHandler);
projectRouter.get("/get-all-projects", authenticate, getAllProjectsHandler);
projectRouter.get("/get-project/:project-id", authenticate, getProjectHandler)
projectRouter.get("/review/project-review", authenticate, createProjectReview);
projectRouter.post("/upload-files", authenticate, verifyUpload, handleUpload);
projectRouter.delete("/delete-project", authenticate, deleteProjectHandler);
projectRouter.delete("/delete-file", authenticate, deleteFileHandler);

export default projectRouter;
