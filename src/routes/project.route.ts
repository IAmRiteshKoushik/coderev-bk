import express from "express";
import { authenticate } from "../helpers/token.middleware";
import { createProjectHandler, 
    deleteProjectHandler, 
    editProjectHandler, 
    getAllProjectsHandler, 
    getProjectHandler } from "../controllers/project.controller";
import { createProjectReview,
    createSnippetReview,
    createFileReview,
    getReview } from "../controllers/review.controller";

const projectRouter = express.Router();

// POST : @api/project/createProject
// TASK : Creating a new project
projectRouter.post("/create-project", authenticate, createProjectHandler);

// GET : @api/user/getAllProjects
// TASK : Fetching all projects after login
projectRouter.get("/get-all-projects", authenticate, getAllProjectsHandler);

// GET : @api/project/getProject/:projectId
// TASK :  Opening a particular project, then listing out files and reviews
projectRouter.get("/get-project/:projectId", authenticate, getProjectHandler)

// POST : @api/project/review/create
// TASK : Creating a project review
projectRouter.post("/review/project-review", authenticate, createProjectReview);

// POST : @api/project/review/customReview
// TASK : Create new review for file[s] under a project
projectRouter.post("/review/file-review", authenticate, createFileReview);

// POST : @api/project/review/snippetReview
// TASK : Create review for a particular snippet
projectRouter.post("/review/snippet-review", authenticate, createSnippetReview)

// GET : @api/project/review/:reviewId
// TASK : Opening a particular review
projectRouter.get("/review/:review-id", authenticate, getReview)


// PATCH : @api/project/editProject/:projectId
// TASK : Editing the name of project ONLY
projectRouter.patch("/edit-project/:projectId", authenticate, editProjectHandler);

// DELETE : @api/project/:projectId
// Delete entire project with confirmation status page 
projectRouter.delete("/delete-project/:projectId", authenticate, deleteProjectHandler);

export default projectRouter;
