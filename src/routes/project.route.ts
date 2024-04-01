import express from "express";
import { authenticate } from "../helpers/token.middleware";
import { createProjectHandler, 
    deleteProjectHandler, 
    editProjectHandler, 
    getAllProjectsHandler, 
    deleteFileHandler, 
    deleteSnipHandler,
    getProjectHandler } from "../controllers/project.controller";
import { createProjectReview,
    createSnipReview,
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
projectRouter.get("/get-project/:project-id", authenticate, getProjectHandler)

// GET : @api/project/review/create
// TASK : Creating a project review
projectRouter.get("/review/project-review", authenticate, createProjectReview);

// GET : @api/project/review/customReview
// TASK : Create new review for file[s] under a project
projectRouter.get("/review/file-review", authenticate, createFileReview);

// GET : @api/project/review/snippetReview
// TASK : Create review for a particular snippet
projectRouter.get("/review/snip-review", authenticate, createSnipReview)

// GET : @api/project/review/:reviewId
// TASK : Opening a particular review
projectRouter.get("/review/:review-id", authenticate, getReview)


// PATCH : @api/project/editProject/:projectId
// TASK : Editing the name of project ONLY
projectRouter.patch("/edit-project/:project-id", authenticate, editProjectHandler);

// DELETE : @api/project/:projectId
// TASK : Delete entire project with confirmation status page 
projectRouter.delete("/delete-project/:project-id", authenticate, deleteProjectHandler);

// DELETE : @api/project/delete-file/:file-id
// TASK : Deletes the file and it's associated snippet reviews
projectRouter.delete("/delete-file/:file-id", authenticate, deleteFileHandler);

// DELETE : @api/project/delete-snippet/:snip-id
// TASK : Deletes the snippet review only
projectRouter.delete("/delete-snip/:snip-id", authenticate, deleteSnipHandler);

export default projectRouter;
