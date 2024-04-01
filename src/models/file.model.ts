import mongoose from "mongoose";

export interface File {
    _id:            mongoose.Schema.Types.ObjectId,
    projectId:      mongoose.Schema.Types.ObjectId,
    fileName:       string,
    filePath:       string,
    fileType:       "Python" | "Java" | "JavaScript" | "TypeScript",
    fileSize:       number,
    reviewExist:    boolean,
    createdAt:      Date,
    updatedAt:      Date
}

export type AddReviewFileModel = {
    _id:            mongoose.Schema.Types.ObjectId,
    updatedAt:      Date,
    reviewExist:    boolean,
}

export type ReplaceFileModel = {
    _id:            mongoose.Schema.Types.ObjectId,
    fileSize:       number,
    fileType:       "Python" | "Java" | "JavaScript" | "TypeScript",
    updatedAt:      Date,
}

export type DeleteFileModel = {
    _id:            mongoose.Schema.Types.ObjectId,
}
