import express from "express";
import { addFilesHandler, 
    replaceFileHandler, 
    deleteFilesHandler } from "../controllers/file.controller";
import { authenticate } from "../helpers/token.middleware";

const FileRouter = express.Router();

// POST : @api/file/addFiles
FileRouter.post("/file/addFiles", authenticate, addFilesHandler);

// POST : @api/file/replaceFiles
FileRouter.post("/file/replaceFile", authenticate, replaceFileHandler);

// DELETE : @api/file/replaceFiles
FileRouter.delete("/file/deleteFiles", authenticate, deleteFilesHandler);

export default FileRouter;
